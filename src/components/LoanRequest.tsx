import React, { useState, useMemo } from 'react';
import { createLoanRequest } from '../firebase/loanService';
import { Loader2, Info, Banknote } from 'lucide-react';

interface LoanRequestProps {
  memberId: string;
  savings: number;
}

const LoanRequest: React.FC<LoanRequestProps> = ({ memberId, savings }) => {
  // Use string for amount state to handle empty inputs gracefully
  const [amount, setAmount] = useState<string>('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Memoize calculations for performance and precision
  const numericAmount = Number(amount) || 0;
  const loanLimit = savings * 3;
  const interest = useMemo(() => Math.round(numericAmount * 0.1), [numericAmount]);
  const totalRepayment = numericAmount + interest;

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validation Guard Rails
    if (numericAmount <= 0) return;
    if (numericAmount > loanLimit) {
      alert(`Limit exceeded! Your maximum based on savings is ${loanLimit.toLocaleString()} RWF.`);
      return;
    }
    if (reason.trim().length < 10) {
      alert("Please provide a more detailed reason (at least 10 characters).");
      return;
    }

    // 2. Prevent Double Submissions
    setIsSubmitting(true);
    
    try {
      const res = await createLoanRequest(memberId, numericAmount, reason.trim());
      if (res.success) {
        alert("Success! Your request has been sent for Admin review.");
        setAmount('');
        setReason('');
      } else {
        throw new Error(res.error);
      }
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-4xl shadow-sm border border-slate-100 relative overflow-hidden">
      {/* Visual Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2.5 bg-indigo-50 rounded-xl">
          <Banknote className="w-5 h-5 text-indigo-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Apply for a Loan</h3>
      </div>

      <form onSubmit={handleRequest} className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">
            Desired Principal (RWF)
          </label>
          <div className="relative">
            <input 
              type="number" 
              required
              value={amount}
              disabled={isSubmitting}
              placeholder="e.g. 50,000"
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all font-bold text-lg"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="mt-2 text-[11px] font-bold text-slate-400 px-1">
            Your borrowing limit: <span className="text-indigo-600">{loanLimit.toLocaleString()} RWF</span>
          </p>
        </div>

        {/* Calculation Breakdown */}
        {numericAmount > 0 && (
          <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between text-xs font-bold text-emerald-700">
              <span>Interest (10%)</span>
              <span>+{interest.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between text-sm font-black text-emerald-900 pt-2 border-t border-emerald-100">
              <span>Total Repayment</span>
              <span>{totalRepayment.toLocaleString()} RWF</span>
            </div>
          </div>
        )}

        {/* Reason Field */}
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 px-1">
            Loan Purpose
          </label>
          <textarea 
            required
            value={reason}
            disabled={isSubmitting}
            placeholder="Describe how this loan will help you..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl h-28 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm resize-none font-medium"
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {/* Submit Action */}
        <button 
          type="submit"
          disabled={isSubmitting || numericAmount <= 0}
          className="group w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-slate-200 flex items-center justify-center"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            "Submit Application"
          )}
        </button>
      </form>

      {/* Trust Footer */}
      <div className="mt-6 flex items-start space-x-2 px-1">
        <Info className="w-3.5 h-3.5 text-slate-300 mt-0.5" />
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
          Loans are subject to admin verification of your savings history. Approval typically takes 24-48 hours.
        </p>
      </div>
    </div>
  );
};

export default LoanRequest;