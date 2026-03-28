import { db } from "./config";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  runTransaction, 
  serverTimestamp 
} from "firebase/firestore";

// 1. MEMBER ACTION: Submit a new deposit for Admin review
export const depositSaving = async (memberId: string, amount: number, momoSenderName: string = "") => {
  try {
    await addDoc(collection(db, "transactions"), {
      memberId,
      amount,
      momoSenderName, // Saves the name they used on Mobile Money
      type: "deposit",
      status: "pending", // Always starts as pending for Admin review
      createdAt: serverTimestamp()
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 2. ADMIN ACTION: Atomically verify deposit and update member's balance
export const verifyAdminTransaction = async (transactionId: string, memberId: string, amount: number) => {
  try {
    const memberRef = doc(db, "members", memberId);
    const transactionRef = doc(db, "transactions", transactionId);

    // 🔥 Zero-Bug Atomic Transaction
    await runTransaction(db, async (transaction) => {
      const memberDoc = await transaction.get(memberRef);
      const txnDoc = await transaction.get(transactionRef);

      if (!memberDoc.exists()) throw new Error("Member profile not found.");
      if (!txnDoc.exists()) throw new Error("Transaction record not found.");
      
      // Prevent double verification
      if (txnDoc.data().status === 'verified') {
        throw new Error("This transaction has already been verified.");
      }

      const currentSavings = memberDoc.data().totalSavings || 0;

      // Add money to user's total savings
      transaction.update(memberRef, {
        totalSavings: currentSavings + amount
      });

      // Mark the transaction as verified
      transaction.update(transactionRef, {
        status: 'verified',
        verifiedAt: serverTimestamp()
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Verification failed atomically: ", error);
    return { success: false, error: error.message };
  }
};

// 3. ADMIN ACTION: Reject a fake or invalid deposit
export const rejectAdminTransaction = async (transactionId: string) => {
  try {
    const transactionRef = doc(db, "transactions", transactionId);
    
    // We just update the status to rejected. The user's balance remains untouched.
    await updateDoc(transactionRef, {
      status: 'rejected',
      rejectedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error: any) {
    console.error("Rejection failed: ", error);
    return { success: false, error: error.message };
  }
};