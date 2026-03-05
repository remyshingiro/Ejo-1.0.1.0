import React from 'react';
import { getDaysUntilNextDeadline } from '../utils/dateLogic';

interface SummaryProps {
  savings: number;
  loans: number;
  trustScore: number;
}

const SummaryCards = ({ savings, loans, trustScore }: SummaryProps) => {
  const deadline = getDaysUntilNextDeadline();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Savings Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-400 text-sm font-medium">Total Saved</p>
        <h3 className="text-2xl font-black text-ejo-dark mt-1">
          {savings.toLocaleString()} <span className="text-xs font-normal">RWF</span>
        </h3>
        <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold">
          <span className="bg-emerald-100 p-1 rounded-full mr-2">↑</span>
          +10% vs last month
        </div>
      </div>

      {/* Active Loans Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-400 text-sm font-medium">Active Loans</p>
        <h3 className="text-2xl font-black text-red-600 mt-1">
          {loans.toLocaleString()} <span className="text-xs font-normal">RWF</span>
        </h3>
        <p className="text-[10px] text-gray-400 mt-4 italic">Incl. 10% monthly interest</p>
      </div>

      {/* Countdown Card - The Innovation */}
      <div className="bg-ejo-dark p-6 rounded-3xl shadow-xl text-white">
        <p className="text-gray-400 text-sm font-medium">Next Deadline</p>
        <div className="flex items-baseline mt-1">
          <h3 className="text-3xl font-black">{deadline.days}</h3>
          <span className="ml-2 text-sm text-gray-400">Days left</span>
        </div>
        <p className="text-xs text-ejo-green mt-4 font-bold uppercase tracking-wider">
          Target: {deadline.label}
        </p>
      </div>
    </div>
  );
};

export default SummaryCards;