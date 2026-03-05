import React, { useState } from 'react';
import { createLoanRequest } from '../firebase/loanService';

interface Props {
  memberId: string;
  savings: number;
}

const LoanRequestForm = ({ memberId, savings }: Props) => {
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Please enter a valid amount.");
    if (amount > savings * 3) return alert("Loan limit exceeded (3x savings max).");

    setLoading(true);
    const res = await createLoanRequest(memberId, amount, reason);
    if (res.success) {
      alert("Loan request submitted for Admin approval.");
      setAmount(0);
      setReason('');
    } else {
      alert("Error: " + res.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">Amount (RWF)</label>
        <input 
          type="number" 
          required
          value={amount || ''}
          className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none font-mono"
          placeholder="0"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </div>

      {/* Accuracy Helper: Ordinary Card inside Form */}
      <div className="bg-gray-50 border border-gray-200 p-3 rounded text-[11px] text-gray-600">
        <div className="flex justify-between mb-1">
          <span>Monthly Interest (10%):</span>
          <span className="font-bold">{(amount * 0.1).toLocaleString()} RWF</span>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-1 mt-1 font-bold text-gray-800">
          <span>Total Repayment:</span>
          <span>{(amount * 1.1).toLocaleString()} RWF</span>
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-tight">Reason for Loan</label>
        <textarea 
          required
          value={reason}
          className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-500 outline-none h-20 resize-none"
          placeholder="e.g. Business expansion, school fees..."
          onChange={(e) => setReason(e.target.value)}
        />
      </div>

      <button 
        disabled={loading}
        className="w-full bg-[#1a1d21] text-white py-2 rounded text-sm font-bold hover:bg-black transition disabled:opacity-50"
      >
        {loading ? "Processing..." : "Submit Application"}
      </button>
    </form>
  );
};

export default LoanRequestForm;