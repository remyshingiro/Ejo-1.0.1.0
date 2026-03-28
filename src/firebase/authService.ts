import { auth, db } from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const registerMember = async (email: string, pass: string, fullName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await setDoc(doc(db, "members", user.uid), {
      fullName,
      email,
      role: "member",
      totalSavings: 0,
      activeLoans: 0, // Added so the Loans page doesn't throw undefined errors
      createdAt: serverTimestamp(), // Standardized to createdAt
    });
    
    // 🔥 Now it returns the exact format the Signup page is looking for
    return { success: true, user };
  } catch (error: any) {
    // 🔥 Safely catches Firebase errors (like "email already in use")
    return { success: false, error: error.message };
  }
};

export const loginMember = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};