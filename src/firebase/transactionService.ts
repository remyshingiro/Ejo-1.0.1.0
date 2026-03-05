import { db } from "./config";
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  increment 
} from "firebase/firestore";

export const depositSaving = async (memberId: string, amount: number) => {
  const today = new Date().getDate();
  let penalty = 0;

  // Innovation: Auto-calculate penalty if it's after the 15th or 30th
  // Adjust these ranges based on your group's specific grace period
  if (today > 15 && today < 25) {
    penalty = 500; // Example: 500 RWF late fee
  }

  try {
    // 1. Record the Saving
    await addDoc(collection(db, "transactions"), {
      memberId,
      amount,
      type: "saving",
      createdAt: serverTimestamp(),
      isLate: penalty > 0
    });

    // 2. Record the Penalty (if applicable)
    if (penalty > 0) {
      await addDoc(collection(db, "transactions"), {
        memberId,
        amount: penalty,
        type: "penalty",
        createdAt: serverTimestamp(),
      });
    }

    // 3. Update the Member's Balance (Subtracting penalty if any)
    const memberRef = doc(db, "members", memberId);
    await updateDoc(memberRef, {
      totalSavings: increment(amount - penalty)
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};