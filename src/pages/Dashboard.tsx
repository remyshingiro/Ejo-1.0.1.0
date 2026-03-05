import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import Layout from '../components/Layout';
import SummaryCards from '../components/SummaryCards';
import DepositForm from '../components/DepositForm';
import TransactionList from '../components/TransactionList';

const Dashboard = () => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // Real-time listener for the user's financial profile
    const unsub = onSnapshot(doc(db, "members", user.uid), (doc) => {
      if (doc.exists()) {
        setUserProfile(doc.data());
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f8f9fa]">
      <p className="text-gray-500 font-medium">Verifying Account Security...</p>
    </div>
  );

  return (
    <Layout title="Account Overview">
      <div className="space-y-8">
        
        {/* Section 1: Financial Status (Ordinary Cards) */}
        <SummaryCards 
          savings={userProfile?.totalSavings || 0}
          loans={userProfile?.activeLoans || 0}
          trustScore={userProfile?.trustScore || 100}
        />

        {/* Section 2: Management Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Actions (Standard Form) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                Make Contribution
              </h3>
              <DepositForm memberId={user?.uid || ''} />
            </div>
          </div>

          {/* Right Column: Ledger (Standard Table) */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Transaction Ledger
                </h3>
                <button className="text-xs text-blue-600 font-semibold hover:underline">
                  Download CSV
                </button>
              </div>
              {/* This component should now render a <table> inside */}
              <TransactionList memberId={user?.uid || ''} />
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;