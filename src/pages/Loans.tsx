import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import LoanRequestForm from '../components/LoanRequestForm';

const Loans = () => {
  const [profile, setProfile] = useState<any>(null);
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    // 1. Sync User Profile (for Savings/Limit check)
    const unsubProfile = onSnapshot(doc(db, "members", user.uid), (doc) => {
      if (doc.exists()) setProfile(doc.data());
    });

    // 2. Sync Loan History
    const q = query(collection(db, "loans"), where("memberId", "==", user.uid));
    const unsubLoans = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setActiveLoans(docs);
    });

    return () => { unsubProfile(); unsubLoans(); };
  }, [user]);

  // Financial Calculations for Accuracy
  const principal = profile?.activeLoans || 0;
  const monthlyInterest = principal * 0.10;
  const totalDueThisMonth = monthlyInterest; // Amount needed to "service" the loan

  return (
    <Layout title="Loan Management">
      <div className="space-y-8">
        
        {/* Loan Statistics - Ordinary Cards with Interest Service Logic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Outstanding Principal</p>
            <h3 className="text-2xl font-black text-gray-900 mt-2">
              {principal.toLocaleString()} <span className="text-xs font-normal text-gray-500">RWF</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-2 italic">The original borrowed amount.</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-sm">
            <p className="text-xs font-bold text-blue-500 uppercase">Monthly Interest Due (10%)</p>
            <h3 className="text-2xl font-black text-blue-800 mt-2">
              {monthlyInterest.toLocaleString()} <span className="text-xs font-normal">RWF</span>
            </h3>
            <p className="text-[10px] text-blue-600 mt-2 font-medium">
              Pay this to keep the loan active if principal cannot be paid.
            </p>
          </div>

          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase">Borrowing Limit (3x Savings)</p>
            <h3 className="text-2xl font-black text-gray-900 mt-2">
              {((profile?.totalSavings || 0) * 3).toLocaleString()} <span className="text-xs font-normal text-gray-500">RWF</span>
            </h3>
            <p className="text-[10px] text-gray-400 mt-2 font-medium">Based on your current savings.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Borrowing Request Form */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 lg:sticky lg:top-24">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 border-b pb-2">New Loan Request</h3>
              <LoanRequestForm memberId={user?.uid || ''} savings={profile?.totalSavings || 0} />
            </div>
          </div>

          {/* Loan History Table - Structured UI */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Disbursement Ledger</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                    <tr>
                      <th className="px-6 py-3 border-b">Date</th>
                      <th className="px-6 py-3 border-b">Principal</th>
                      <th className="px-6 py-3 border-b">Monthly Interest</th>
                      <th className="px-6 py-3 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {activeLoans.map((loan) => (
                      <tr key={loan.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-gray-500">
                          {loan.requestedAt?.toDate().toLocaleDateString() || 'Pending...'}
                        </td>
                        <td className="px-6 py-4 font-mono font-bold text-gray-800 uppercase">
                          {loan.principalAmount?.toLocaleString() || 0} RWF
                        </td>
                        <td className="px-6 py-4 font-mono text-blue-700 font-bold">
                          {(loan.principalAmount * 0.1).toLocaleString()} RWF
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded border uppercase ${
                            loan.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                            loan.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}>
                            {loan.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {activeLoans.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium italic">
                          No active loans or request history found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">
                  Policy: Members must service the 10% interest monthly to avoid penalties.
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