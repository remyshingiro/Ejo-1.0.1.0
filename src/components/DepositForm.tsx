import React, { useState } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Loader2, ShieldCheck } from 'lucide-react';

interface Props {
  memberId: string;
}

const DepositForm = ({ memberId }: Props) => {
  const [amount, setAmount] = useState<number | string>('');
  const [senderName, setSenderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Strict Validation
    if (!amount || Number(amount) < 1000) {
      return setError("Minimum deposit is 1,000 RWF.");
    }
    if (!senderName || senderName.trim().length < 3) {
      return setError("Please enter the full name of the MoMo sender.");
    }

    setLoading(true);
    // Standardize name formatting (uppercase for easier admin searching)
    const cleanSenderName = senderName.trim().toUpperCase();

    try {
      // 2. Record the transaction directly (We removed the writeBatch/Lock)
      await addDoc(collection(db, 'transactions'), {
        memberId,
        amount: Number(amount),
        momoSenderName: cleanSenderName,
        type: 'deposit',
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      setSuccess("Deposit logged. Awaiting Admin verification.");
      setAmount('');
      setSenderName('');
    } catch (err: any) {
      setError(err.message || "Failed to process transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
          Deposit Funds
        </h2>

        <form onSubmit={handleDeposit} className="space-y-5">
          
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Amount (RWF)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 font-bold text-xs border-r border-slate-200 pr-3">RF</span>
              </div>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="block w-full pl-14 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all disabled:opacity-50 disabled:bg-slate-50 placeholder:text-slate-300 placeholder:font-normal"
                placeholder="e.g. 5000"
              />
            </div>
          </div>

          {/* Sender Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              MoMo Sender Name
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                disabled={loading}
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all disabled:opacity-50 disabled:bg-slate-50 placeholder:text-slate-300 placeholder:font-normal uppercase"
                placeholder="e.g. JEAN PAUL MUGISHA"
              />
            </div>
          </div>

          {/* Inline Feedback Messages */}
          {error && (
            <div className="text-xs font-bold text-rose-600 bg-rose-50 px-4 py-3 rounded-lg border border-rose-100">
              {error}
            </div>
          )}
          {success && (
            <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-3 rounded-lg border border-emerald-100">
              {success}
            </div>
          )}

          {/* Call to Action */}
          <button
            type="submit"
            disabled={loading || !amount || !senderName}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Processing...
              </>
            ) : (
              'Submit Contribution'
            )}
          </button>
        </form>
      </div>

      {/* Trust Footer */}
      <div className="bg-slate-50 p-4 border-t border-slate-200">
        <div className="flex items-start">
          <ShieldCheck className="w-5 h-5 text-indigo-600 mt-0.5 mr-3 shrink-0" />
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            All deposits must be verified by a group administrator. Please provide the exact name registered on the Mobile Money account used for this transfer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;