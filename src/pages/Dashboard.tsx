import { useState, useEffect } from 'react';
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Securing Connection...
        </p>
      </div>
    );
  }

  return (
    <Layout 
      title="System Dashboard" 
      userName={userProfile?.fullName || "Authenticated Member"} 
      userImage={userProfile?.photoURL}
    >
      <div className="space-y-8">
        
        {/* Section 1: Financial Cards */}
        <SummaryCards 
          savings={userProfile?.totalSavings || 0}
          loans={userProfile?.activeLoans || 0}
        />

        {/* Section 2: Ledger & Deposit Action */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Column: Ledger (Takes 2/3 space on large screens) */}
          <div className="xl:col-span-2 order-2 xl:order-1">
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Recent Ledger Entries
                </h3>
              </div>
              <TransactionList memberId={user?.uid || ''} />
            </div>
          </div>

          {/* Side Column: Deposit Form (Takes 1/3 space) */}
          <div className="xl:col-span-1 order-1 xl:order-2 space-y-6">
            {/* The DepositForm component already handles its own white card UI */}
            <DepositForm memberId={user?.uid || ''} />
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;