import React, { useState } from 'react';
import { createLoanRequest } from '../firebase/loanService';
import { Loader2, Banknote, HelpCircle } from 'lucide-react';

interface Props {
  memberId: string;
  savings: number;
}

const LoanRequestForm = ({ memberId, savings }: Props) => {
  const [amount, setAmount] = useState<number | string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const parsedAmount = Number(amount);
  const interest = parsedAmount * 0.1;
  const totalRepayment = parsedAmount + interest;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (parsedAmount <= 0) {
      return setError("Please enter a valid loan amount.");
    }
    if (parsedAmount > savings * 3) {
      return setError(`Loan limit exceeded. Your maximum limit is ${(savings * 3).toLocaleString()} RWF.`);
    }
    if (!reason || reason.trim().length < 5) {
      return setError("Please provide a detailed reason for the loan.");
    }

    setLoading(true);
    
    try {
      const res = await createLoanRequest(memberId, parsedAmount, reason);
      if (res.success) {
        setSuccess("Loan application submitted securely for Admin review.");
        setAmount('');
        setReason('');
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">
          Request a Loan
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Principal Amount (RWF)
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
                placeholder="0"
              />
            </div>
            <p className="mt-2 text-[11px] font-medium text-slate-400">
              Maximum eligible amount: <span className="font-bold text-indigo-600">{(savings * 3).toLocaleString()} RWF</span>
            </p>
          </div>

          {/* Live Interest Calculator Breakdown */}
          {parsedAmount > 0 && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Requested Principal:</span>
                <span className="font-mono">{parsedAmount.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Monthly Interest (10%):</span>
                <span className="font-mono text-amber-600">+{interest.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="text-xs font-bold text-slate-800">Total Repayment:</span>
                <span className="text-sm font-black tabular-nums text-slate-900">{totalRepayment.toLocaleString()} RWF</span>
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Purpose of Loan
            </label>
            <textarea
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className="block w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all disabled:opacity-50 disabled:bg-slate-50 placeholder:text-slate-300 h-24 resize-none"
              placeholder="e.g. Business expansion, school fees, medical emergency..."
            />
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
            disabled={loading || parsedAmount <= 0 || !reason}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Validating...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>
      </div>
      
      {/* Footer info */}
      <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-start">
        <HelpCircle className="w-5 h-5 text-slate-400 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
          Loan approvals depend on your savings consistency and current cooperative liquidity. Repayment terms will be outlined upon approval.
        </p>
      </div>
    </div>
  );
};

export default LoanRequestForm;