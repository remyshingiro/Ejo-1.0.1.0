import React from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle, XCircle } from 'lucide-react';

const TransactionList = ({ memberId }: { memberId: string }) => {
  const { transactions, loading } = useTransactions(memberId);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'verified':
      case 'confirmed':
        return <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 uppercase tracking-wider"><CheckCircle className="w-3 h-3 mr-1" /> Verified</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-rose-50 text-rose-700 rounded-md border border-rose-100 uppercase tracking-wider"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md border border-amber-100 uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-slate-100 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-100 rounded"></div>
                <div className="h-3 w-16 bg-slate-50 rounded"></div>
              </div>
            </div>
            <div className="h-5 w-20 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-y border-slate-200">
          <tr>
            <th className="px-6 py-3">Transaction Date</th>
            <th className="px-6 py-3">Type</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
          {transactions.map((tx) => (
            <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-slate-900">
                  {tx.createdAt?.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-mono">
                  ID: {tx.momoSenderName || 'N/A'}
                </div>
              </td>
              <td className="px-6 py-4 capitalize font-medium">
                <div className="flex items-center">
                  {tx.type === 'deposit' ? (
                    <ArrowDownLeft className="w-4 h-4 text-emerald-500 mr-2 bg-emerald-50 rounded p-0.5" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-rose-500 mr-2 bg-rose-50 rounded p-0.5" />
                  )}
                  {tx.type}
                </div>
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(tx.status)}
              </td>
              <td className="px-6 py-4 text-right tabular-nums font-bold text-slate-900">
                {tx.amount.toLocaleString()} RWF
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-16 text-center">
                <p className="text-sm font-medium text-slate-400">No financial records found in your ledger.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;