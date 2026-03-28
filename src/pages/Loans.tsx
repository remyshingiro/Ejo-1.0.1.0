import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import LoanRequestForm from '../components/LoanRequestForm';
import { CheckCircle, Clock, XCircle, Info } from 'lucide-react';

const Loans = () => {
  const [profile, setProfile] = useState<any>(null);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const unsubProfile = onSnapshot(doc(db, "members", user.uid), (doc) => {
      if (doc.exists()) setProfile(doc.data());
    });

    // Added OrderBy so newest loans are at the top
    const q = query(
      collection(db, "loans"), 
      where("memberId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    
    const unsubLoans = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setActiveLoans(docs);
    });

    return () => { unsubProfile(); unsubLoans(); };
  }, [user]);

  const principal = profile?.activeLoans || 0;
  const monthlyInterest = principal * 0.10;

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 rounded-md border border-emerald-100 uppercase tracking-wider"><CheckCircle className="w-3 h-3 mr-1" /> Approved</span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-rose-50 text-rose-700 rounded-md border border-rose-100 uppercase tracking-wider"><XCircle className="w-3 h-3 mr-1" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md border border-amber-100 uppercase tracking-wider"><Clock className="w-3 h-3 mr-1" /> Pending Review</span>;
    }
  };

  return (
    <Layout 
      title="Loan Management"
      userName={profile?.fullName || "Authenticated Member"} 
      userImage={profile?.photoURL}
    >
      <div className="space-y-8">
        
        {/* Loan Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Principal</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2 tabular-nums tracking-tight">
              {principal.toLocaleString()} <span className="text-sm font-bold text-slate-400">RWF</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-3 bg-slate-50 p-2 rounded-lg inline-block">The original borrowed amount.</p>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wider">Monthly Interest Due (10%)</p>
            <h3 className="text-3xl font-black text-rose-800 mt-2 tabular-nums tracking-tight">
              {monthlyInterest.toLocaleString()} <span className="text-sm font-bold">RWF</span>
            </h3>
            <p className="text-[11px] text-rose-700 mt-3 font-medium leading-tight">
              Must be serviced monthly to avoid compounding penalties.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Borrowing Limit (3x)</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2 tabular-nums tracking-tight">
              {((profile?.totalSavings || 0) * 3).toLocaleString()} <span className="text-sm font-bold text-slate-400">RWF</span>
            </h3>
            <p className="text-[11px] font-medium text-slate-400 mt-3 bg-slate-50 p-2 rounded-lg inline-block">Based on current verified savings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Borrowing Request Form */}
          <div className="xl:col-span-1 order-2 xl:order-1">
            <div className="lg:sticky lg:top-24">
              <LoanRequestForm memberId={user?.uid || ''} savings={profile?.totalSavings || 0} />
            </div>
          </div>

          {/* Loan History Table */}
          <div className="xl:col-span-2 order-1 xl:order-2">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-white">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Disbursement Ledger</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Principal</th>
                      <th className="px-6 py-3">Interest (10%)</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {activeLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                          {loan.createdAt?.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) || 'Processing...'}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-800 tabular-nums">
                          {loan.amount?.toLocaleString() || 0} RWF
                        </td>
                        <td className="px-6 py-4 font-mono text-rose-600 font-bold tabular-nums">
                          +{(loan.amount * 0.1).toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(loan.status)}
                        </td>
                      </tr>
                    ))}
                    {activeLoans.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-slate-400 font-medium">
                          No active loans or request history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-start">
                 <Info className="w-4 h-4 text-slate-400 mr-2 mt-0.5" />
                <p className="text-[11px] text-slate-500 font-medium">
                  Policy: Members must service the 10% interest monthly to keep the loan in good standing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Loans;