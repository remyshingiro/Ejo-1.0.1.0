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

    // Real-time listener: Ordinary approach for immediate data accuracy
    const unsub = onSnapshot(doc(db, "members", user.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.data());
      }
      setLoading(false);
    }, (error) => {
      console.error("Dashboard Sync Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f4f7f6]">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
        Establishing Secure Connection...
      </p>
    </div>
  );

  return (
    <Layout 
      title="System Dashboard" 
      userName={userProfile?.fullName || "Authenticated Member"} 
      userImage={userProfile?.photoURL}
    >
      <div className="space-y-6">
        
        {/* Section 1: Financial Cards (Stack on Mobile, Grid on Desktop) */}
        <SummaryCards 
          savings={userProfile?.totalSavings || 0}
          loans={userProfile?.activeLoans || 0}
          trustScore={userProfile?.trustScore || 100}
        />

        {/* Section 2: Desktop Layout vs Mobile Layout Handling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Recent Ledger Entries: Taking more space for readability (Ordinary Table UI) */}
          <div className="lg:col-span-8 order-1">
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
                  Financial Ledger (Recent)
                </h3>
              </div>
              {/* Force horizontal scroll on small mobile screens to prevent data squishing */}
              <div className="overflow-x-auto">
                <TransactionList memberId={user?.uid || ''} />
              </div>
            </div>
          </div>

          {/* New Contribution: Secondary focus, easy access on mobile */}
          <div className="lg:col-span-4 order-2">
            <div className="bg-white border border-gray-200 p-6 shadow-sm">
              <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest mb-6 border-b border-gray-100 pb-2">
                Deposit Funds
              </h3>
              <DepositForm memberId={user?.uid || ''} />
            </div>
            
            {/* Ordinary Info Card for System Policy */}
            <div className="mt-6 bg-[#1a1d21] p-5 text-white">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Contribution Rule</p>
              <p className="text-xs leading-relaxed text-gray-300">
                All deposits must be verified by a group administrator. Please provide your MoMo transaction ID.
              </p>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;