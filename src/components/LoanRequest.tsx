import React, { useState } from 'react';
import { createLoanRequest } from '../firebase/loanService';

const LoanRequest = ({ memberId, savings }: { memberId: string, savings: number }) => {
  const [amount, setAmount] = useState(0);
  const [reason, setReason] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount > savings * 3) {
      return alert(`Limit exceeded! You can only borrow up to ${savings * 3} RWF.`);
    }
    
    const res = await createLoanRequest(memberId, amount, reason);
    if (res.success) alert("Request sent! Wait for Admin approval.");
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-ejo-dark mb-4">Request a Loan</h3>
      <form onSubmit={handleRequest} className="space-y-4">
        <input 
          type="number" 
          placeholder="Amount (RWF)"
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-ejo-green"
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700">
          <p>Monthly Interest (10%): <b>{(amount * 0.1).toLocaleString()} RWF</b></p>
          <p>Total Repayment: <b>{(amount * 1.1).toLocaleString()} RWF</b></p>
        </div>
        <textarea 
          placeholder="Reason for loan..."
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl h-20 outline-none"
          onChange={(e) => setReason(e.target.value)}
        />
        <button className="w-full py-3 bg-ejo-dark text-white rounded-xl font-bold hover:opacity-90">
          Submit Loan Request
        </button>
      </form>
    </div>
  );
};

export default LoanRequest;