import { db } from "./config";
import { 
  collection, 
  doc, 
  writeBatch, // 🔥 Essential for financial safety
  serverTimestamp, 
  increment 
} from "firebase/firestore";

/**
 * Records a new saving and updates the member's total balance atomically.
 * This prevents data mismatch if one operation fails.
 */
export const addSaving = async (memberId: string, amount: number) => {
  if (amount <= 0) throw new Error("Amount must be greater than zero.");

  // 1. Initialize a batch
  const batch = writeBatch(db);

  try {
    // 2. Prepare the Transaction Record
    const txnRef = doc(collection(db, "transactions"));
    batch.set(txnRef, {
      memberId,
      amount,
      type: "saving",
      status: "verified", // If adding directly, otherwise "pending"
      createdAt: serverTimestamp(),
    });

    // 3. Prepare the Balance Update
    const memberRef = doc(db, "members", memberId);
    batch.update(memberRef, {
      totalSavings: increment(amount), // Standardizing name to totalSavings
      lastActivity: serverTimestamp()
    });

    // 4. Commit both at the exact same millisecond
    await batch.commit();

    return { success: true };
  } catch (error: any) {
    console.error("Atomic saving failed:", error);
    return { success: false, error: error.message };
  }
};