import React from 'react';

interface Props {
  savings: number;
  loans: number;
}

const SummaryCards = ({ savings, loans }: Props) => {
  const cardData = [
    {
      label: 'Current Savings',
      value: `${savings.toLocaleString()} RWF`,
      sub: 'Verified Balance',
      color: 'text-gray-900',
    },
    {
      label: 'Active Loan Principal',
      value: `${loans.toLocaleString()} RWF`,
      sub: 'Pending Repayment',
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cardData.map((card, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-200 p-6 rounded-none shadow-sm flex flex-col justify-between"
        >
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {card.label}
            </p>
            {/* Standardized font weight for a clean, non-aggressive look */}
            <h3 className={`text-3xl font-bold mt-2 tracking-tight ${card.color}`}>
              {card.value}
            </h3>
          </div>
          <p className="text-[10px] text-gray-400 mt-4 font-medium uppercase border-t border-gray-50 pt-2">
            Status: {card.sub}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;