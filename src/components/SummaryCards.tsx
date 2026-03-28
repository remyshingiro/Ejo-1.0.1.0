import React from 'react';
import { Wallet, CreditCard } from 'lucide-react';

// Helper for crisp, standardized currency formatting
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: 'RWF',
    minimumFractionDigits: 0,
  }).format(amount);
};

interface Props {
  savings: number;
  loans: number;
}

const SummaryCards = ({ savings, loans }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      
      {/* 1. Savings Card - Positive (Emerald) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Current Savings
            </h3>
            <div className="p-2 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          {/* tabular-nums ensures the numbers align perfectly like a digital clock */}
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tight mb-2">
            {formatMoney(savings)}
          </div>
        </div>
        
        {/* Animated Verified Status */}
        <div className="flex items-center mt-4 text-[10px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-md uppercase tracking-wide">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Status: Verified Balance
        </div>
      </div>

      {/* 2. Loan Card - Warning/Debt (Rose/Amber) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between group">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Loan Principal
            </h3>
            <div className="p-2 bg-rose-50 rounded-lg group-hover:bg-rose-100 transition-colors">
              <CreditCard className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-900 tabular-nums tracking-tight mb-2">
            {formatMoney(loans)}
          </div>
        </div>
        
        {/* Static Warning Status */}
        <div className="flex items-center mt-4 text-[10px] font-bold text-amber-700 bg-amber-50 w-fit px-2.5 py-1.5 rounded-md uppercase tracking-wide">
          Status: Pending Repayment
        </div>
      </div>
      
    </div>
  );
};

export default SummaryCards;