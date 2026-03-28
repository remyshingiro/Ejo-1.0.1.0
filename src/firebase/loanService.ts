import { db } from "./config";
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  runTransaction, 
  serverTimestamp 
} from "firebase/firestore";

// 1. MEMBER ACTION: Request a new loan
export const createLoanRequest = async (memberId: string, amount: number, reason: string) => {
  const interest = amount * 0.10;
  const totalToRepay = amount + interest;

  try {
    await addDoc(collection(db, "loans"), {
      memberId,
      amount, // Standardized to 'amount' to match the UI tables
      interest,
      totalToRepay,
      reason,
      status: "pending", // "pending", "approved", "rejected"
      createdAt: serverTimestamp(),
      dueDate: "" // Can be set via a cloud function or admin input later
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// 2. ADMIN ACTION: Atomically approve a loan and update member's debt balance
export const approveAdminLoan = async (loanId: string, memberId: string, amount: number) => {
  try {
    const memberRef = doc(db, "members", memberId);
    const loanRef = doc(db, "loans", loanId);

    // 🔥 Zero-Bug Atomic Transaction
    await runTransaction(db, async (transaction) => {
      // Read operations MUST come first
      const memberDoc = await transaction.get(memberRef);
      const loanDoc = await transaction.get(loanRef);

      if (!memberDoc.exists()) throw new Error("Member profile not found.");
      if (!loanDoc.exists()) throw new Error("Loan record not found.");
      if (loanDoc.data().status !== 'pending') throw new Error("Loan has already been processed.");

      const currentActiveLoans = memberDoc.data().activeLoans || 0;

      // Write Operations:
      // A. Add the loan amount to the user's active debt
      transaction.update(memberRef, {
        activeLoans: currentActiveLoans + amount
      });

      // B. Mark the loan document as officially approved
      transaction.update(loanRef, {
        status: 'approved',
        processedAt: serverTimestamp()
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Loan approval failed: ", error);
    return { success: false, error: error.message };
  }
};

// 3. ADMIN ACTION: Reject a loan (does not affect member balance)
export const rejectAdminLoan = async (loanId: string) => {
  try {
    const loanRef = doc(db, "loans", loanId);
    
    await updateDoc(loanRef, {
      status: 'rejected',
      processedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Loan rejection failed: ", error);
    return { success: false, error: error.message };
  }
};