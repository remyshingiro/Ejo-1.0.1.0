import { db } from "./config";
import { collection, addDoc, serverTimestamp, doc, updateDoc, increment } from "firebase/firestore";

/**
 * Records a new saving and updates the member's total balance
 */
export const addSaving = async (memberId: string, amount: number) => {
  try {
    // 1. Add to Transactions history
    await addDoc(collection(db, "transactions"), {
      memberId,
      amount,
      type: "saving",
      createdAt: serverTimestamp(),
    });

    // 2. Update the Member's total balance automatically
    const memberRef = doc(db, "members", memberId);
    await updateDoc(memberRef, {
      totalBalance: increment(amount)
    });

    console.log("Saving recorded successfully!");
  } catch (error) {
    console.error("Error adding saving: ", error);
  }
};