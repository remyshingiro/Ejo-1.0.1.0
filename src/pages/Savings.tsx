import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import TransactionList from '../components/TransactionList';
import { ShieldCheck, CalendarClock, TrendingUp } from 'lucide-react';

const Savings = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsub = onSnapshot(doc(db, "members", user.uid), (doc) => {
      if (doc.exists()) {
        setProfile(doc.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Syncing Ledger...
        </p>
      </div>
    );
  }

  return (
    <Layout 
      title="Savings Ledger"
      userName={profile?.fullName || "Authenticated Member"} 
      userImage={profile?.photoURL}
    >
      <div className="space-y-8">
        
        {/* Savings Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Verified Savings</p>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <h3 className="text-4xl font-black text-slate-900 tabular-nums tracking-tight">
              {profile?.totalSavings?.toLocaleString() || 0} <span className="text-lg font-bold text-slate-400">RWF</span>
            </h3>
            <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 w-fit px-2.5 py-1.5 rounded-md uppercase tracking-wide">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Active Contributor
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Next Mandatory Deadline</p>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <CalendarClock className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              March 30, 2026
            </h3>
            <div className="mt-4 text-xs text-slate-500 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              Ensure MoMo transfers are initiated 24h before the deadline to allow for Admin verification.
            </div>
          </div>
        </div>

        {/* Detailed Ledger Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Contribution History</h3>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-bold text-slate-600">
              {user?.email}
            </span>
          </div>
          
          <TransactionList memberId={user?.uid || ''} />
          
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-start">
             <ShieldCheck className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
            <p className="text-[11px] text-slate-500 font-medium">
              Transactions marked as "Pending" are awaiting manual Admin verification of the MoMo Sender Name.
            </p>
          </div>
        </div>

        {/* Policy & Compliance Card */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-3">Savings Compliance Rules</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-300">
            <ul className="space-y-3">
              <li className="flex items-start"><span className="text-indigo-500 mr-2 font-bold">•</span> Bi-monthly savings are mandatory for all members.</li>
              <li className="flex items-start"><span className="text-indigo-500 mr-2 font-bold">•</span> Savings are locked and act as collateral for loan requests.</li>
            </ul>
            <ul className="space-y-3">
              <li className="flex items-start"><span className="text-indigo-500 mr-2 font-bold">•</span> Withdrawals require a 30-day notice period.</li>
              <li className="flex items-start"><span className="text-rose-500 mr-2 font-bold">•</span> Penalty of 500 RWF applies automatically for missed deadlines.</li>
            </ul>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Savings;