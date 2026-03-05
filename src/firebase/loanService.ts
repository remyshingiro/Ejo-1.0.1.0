import { db } from "./config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createLoanRequest = async (memberId: string, amount: number, reason: string) => {
  const totalToRepay = amount + (amount * 0.10);

  try {
    await addDoc(collection(db, "loans"), {
      memberId,
      amountRequested: amount,
      interest: amount * 0.10,
      totalToRepay,
      reason,
      status: "pending", // "pending", "approved", "rejected"
      createdAt: serverTimestamp(),
      dueDate: "" // We will set this upon approval
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};