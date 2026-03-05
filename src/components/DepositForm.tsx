import React, { useState } from 'react';
import { depositSaving } from '../firebase/transactionService';

const DepositForm = ({ memberId }: { memberId: string }) => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Please enter a valid amount");

    setLoading(true);
    const result = await depositSaving(memberId, amount);
    setLoading(false);

    if (result.success) {
      alert("Saving successful!");
      setAmount(0);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-ejo-green">
      <h3 className="text-xl font-bold text-ejo-dark mb-4">Make a Contribution</h3>
      <form onSubmit={handleDeposit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Amount (RWF)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-400 font-bold">RF</span>
            <input 
              type="number"
              value={amount || ''}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="e.g. 5000"
              className="pl-10 w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ejo-green outline-none font-bold text-lg"
            />
          </div>
        </div>
        
        <button 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-white transition-all ${
            loading ? 'bg-gray-300' : 'bg-ejo-green hover:shadow-emerald-200 hover:shadow-lg'
          }`}
        >
          {loading ? "Processing..." : "Deposit Now"}
        </button>
      </form>
    </div>
  );
};

export default DepositForm;