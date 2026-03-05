import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import TransactionList from '../components/TransactionList';

const Savings = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Real-time sync with member's financial profile
    const unsub = onSnapshot(doc(db, "members", user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f8f9fa]">
      <p className="text-gray-400 font-mono text-sm animate-pulse">Syncing Ledger...</p>
    </div>
  );

  return (
    <Layout title="Savings Ledger">
      <div className="space-y-6">
        
        {/* Savings Overview - Ordinary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Verified Savings</p>
            <h3 className="text-3xl font-black text-gray-900 mt-2">
              {profile?.totalSavings?.toLocaleString() || 0} <span className="text-sm font-normal text-gray-400">RWF</span>
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-green-600 uppercase">
              <span className="mr-1">●</span> Active Contributor
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Next Mandatory Deadline</p>
            <h3 className="text-xl font-bold text-gray-800 mt-2">
              March 15, 2026
            </h3>
            <p className="text-[10px] text-gray-500 mt-2 italic">
              Ensure MoMo transfers are initiated 24h before the deadline.
            </p>
          </div>
        </div>

        {/* The Detailed Ledger Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Contribution History</h3>
            <span className="text-[10px] bg-gray-200 px-2 py-1 rounded font-bold text-gray-600">
              {user?.email}
            </span>
          </div>
          
          {/* Reusing our Table-based TransactionList */}
          <TransactionList memberId={user?.uid || ''} />
          
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-500 font-medium">
              * Note: Transactions marked as "Pending" are awaiting Admin verification of the MoMo reference.
            </p>
          </div>
        </div>

        {/* Policy & Compliance Card */}
        <div className="bg-[#f1f3f5] border border-gray-200 p-6 rounded-lg">
          <h4 className="text-xs font-bold text-gray-700 uppercase mb-3">Savings Compliance Rules</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-gray-600">
            <ul className="space-y-2 list-disc ml-4">
              <li>Bi-monthly savings are mandatory for all Ejo Hacu members.</li>
              <li>Savings are locked and act as collateral for loan requests.</li>
            </ul>
            <ul className="space-y-2 list-disc ml-4">
              <li>Withdrawals require a 30-day notice period.</li>
              <li>Penalty of 500 RWF applies for missed deadlines.</li>
            </ul>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Savings;