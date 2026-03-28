import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'loan' | 'repayment' | 'penalty'; // Fixed to match 'deposit' instead of 'saving'
  createdAt: any;
  status: string;
  momoSenderName?: string;
}

export const useTransactions = (memberId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!memberId) return;

    const q = query(
      collection(db, "transactions"),
      where("memberId", "==", memberId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Transaction[];
        
        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching transactions:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memberId]);

  return { transactions, loading };
};