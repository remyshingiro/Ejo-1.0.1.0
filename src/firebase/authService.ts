import { auth, db } from "./config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export const registerMember = async (email: string, pass: string, fullName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  const user = userCredential.user;

  await setDoc(doc(db, "members", user.uid), {
    fullName,
    email,
    role: "member",
    totalSavings: 0,
    joinedAt: serverTimestamp(),
  });
  return user;
};

export const loginMember = async (email: string, pass: string) => {
  return await signInWithEmailAndPassword(auth, email, pass);
};