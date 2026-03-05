import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface Props {
  memberId: string;
}

const DepositForm = ({ memberId }: Props) => {
  const [amount, setAmount] = useState<number | string>('');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !transactionId) return alert("Please fill all fields.");

    setLoading(true);
    try {
      await addDoc(collection(db, "transactions"), {
        memberId,
        amount: Number(amount),
        momoId: transactionId,
        type: 'deposit',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      alert("Deposit logged. Awaiting Admin verification.");
      setAmount('');
      setTransactionId('');
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleDeposit} className="space-y-4">
        {/* Ordinary Amount Input */}
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
            Amount (RWF)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs border-r border-gray-200 pr-2">
              RF
            </span>
            <input 
              type="number" 
              required
              value={amount}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-300 rounded-none text-sm font-bold focus:border-gray-800 focus:ring-1 focus:ring-gray-800 outline-none transition-all placeholder:text-gray-300"
              placeholder="e.g. 5000"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>

        {/* Ordinary Transaction ID Input */}
        <div>
          <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">
            MoMo Transaction ID
          </label>
          <input 
            type="text" 
            required
            value={transactionId}
            className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-none text-sm font-bold focus:border-gray-800 focus:ring-1 focus:ring-gray-800 outline-none transition-all placeholder:text-gray-300"
            placeholder="Enter ID from SMS"
            onChange={(e) => setTransactionId(e.target.value)}
          />
        </div>

        {/* Standard Action Button */}
        <button 
          disabled={loading}
          className="w-full bg-[#1a1d21] text-white py-3 text-xs font-black uppercase tracking-widest hover:bg-black active:scale-[0.98] transition-all disabled:opacity-50 border border-black"
        >
          {loading ? "Processing..." : "Submit Contribution"}
        </button>
      </form>
    </div>
  );
};

export default DepositForm;