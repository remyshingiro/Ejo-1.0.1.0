import React from 'react';
import { useTransactions } from '../hooks/useTransactions';

const TransactionList = ({ memberId }: { memberId: string }) => {
  const { transactions, loading } = useTransactions(memberId);

  if (loading) return <p className="p-8 text-center text-gray-400">Loading records...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase">
          <tr>
            <th className="px-6 py-3 border-b">Date</th>
            <th className="px-6 py-3 border-b">Type</th>
            <th className="px-6 py-3 border-b">Status</th>
            <th className="px-6 py-3 border-b text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-700 divide-y divide-gray-100">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4">{tx.createdAt?.toDate().toLocaleDateString()}</td>
              <td className="px-6 py-4 capitalize font-medium">{tx.type}</td>
              <td className="px-6 py-4">
                <span className="px-2 py-1 text-[10px] font-bold bg-green-50 text-green-700 rounded border border-green-100 uppercase">
                  Confirmed
                </span>
              </td>
              <td className="px-6 py-4 text-right font-mono font-semibold">
                {tx.amount.toLocaleString()} RWF
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                No financial records found in your ledger.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;