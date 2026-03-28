import React, { useMemo } from 'react';
import { Wallet, CreditCard, ShieldCheck, AlertCircle } from 'lucide-react';

/**
 * SENIOR NOTE: 
 * We move the formatter outside the component to prevent re-creating 
 * the Intl object on every render, or wrap the logic in useMemo.
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(amount || 0);
};

interface SummaryCardsProps {
  savings: number | undefined;
  loans: number | undefined;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ savings = 0, loans = 0 }) => {
  // Memoize values to prevent flicker during parent re-renders
  const formattedSavings = useMemo(() => formatCurrency(savings), [savings]);
  const formattedLoans = useMemo(() => formatCurrency(loans), [loans]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* 1. Savings Card - Positive (Emerald) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
        {/* Subtle background decoration for a premium feel */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Verified Savings
            </h3>
            <div className="p-3 bg-emerald-50 rounded-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-emerald-100">
              <Wallet className="w-5 h-5 text-emerald-600 group-hover:text-white" />
            </div>
          </div>
          
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
            {formattedSavings}
          </div>
        </div>
        
        <div className="flex items-center mt-8 text-[10px] font-black text-emerald-700 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 w-fit px-3 py-2 rounded-xl uppercase tracking-widest shadow-sm">
          <span className="relative flex h-2 w-2 mr-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Live Balance
        </div>
      </div>

      {/* 2. Loan Card - Debt (Rose/Amber) */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-500/5 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-rose-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Outstanding Debt
            </h3>
            <div className="p-3 bg-rose-50 rounded-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-300 shadow-sm shadow-rose-100">
              <CreditCard className="w-5 h-5 text-rose-600 group-hover:text-white" />
            </div>
          </div>
          
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tighter">
            {formattedLoans}
          </div>
        </div>
        
        <div className={`flex items-center mt-8 text-[10px] font-black w-fit px-3 py-2 rounded-xl uppercase tracking-widest shadow-sm border transition-colors ${
          loans > 0 
            ? 'text-rose-700 bg-rose-50/80 border-rose-100' 
            : 'text-slate-400 bg-slate-50 border-slate-100'
        }`}>
          <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
          {loans > 0 ? "Pending Repayment" : "No Active Loans"}
        </div>
      </div>
      
    </div>
  );
};

export default SummaryCards;