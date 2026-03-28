import { db } from "./config";
import { 
  doc, 
  serverTimestamp, 
  runTransaction 
} from "firebase/firestore";

// Note: In our current flow, users use DepositForm to create a 'pending' transaction. 
// This function is what the ADMIN will call to VERIFY that transaction.
// It atomically updates the transaction status AND the user's total balance.

export const verifyAdminTransaction = async (transactionId: string, memberId: string, amount: number) => {
  try {
    const memberRef = doc(db, "members", memberId);
    const transactionRef = doc(db, "transactions", transactionId);
    const logRef = doc(db, "audit_logs", transactionId); // Create an audit log with same ID

    await runTransaction(db, async (transaction) => {
      // 1. Read operations MUST come first
      const memberDoc = await transaction.get(memberRef);
      const txnDoc = await transaction.get(transactionRef);

      if (!memberDoc.exists()) throw new Error("Member profile not found.");
      if (!txnDoc.exists()) throw new Error("Transaction record not found.");
      
      // Prevent double verification
      if (txnDoc.data().status === 'verified') {
        throw new Error("This transaction has already been verified.");
      }

      // 2. Write operations
      const currentSavings = memberDoc.data().totalSavings || 0;

      // Update User Balance
      transaction.update(memberRef, {
        totalSavings: currentSavings + amount
      });

      // Update Transaction Status
      transaction.update(transactionRef, {
        status: 'verified',
        verifiedAt: serverTimestamp()
      });

      // Create Immutable Audit Log
      transaction.set(logRef, {
        action: 'VERIFY_DEPOSIT',
        transactionId: transactionId,
        memberId: memberId,
        amountAdded: amount,
        timestamp: serverTimestamp()
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error("Verification failed atomically: ", error);
    return { success: false, error: error.message };
  }
};