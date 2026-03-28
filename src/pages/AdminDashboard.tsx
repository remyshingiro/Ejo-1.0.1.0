import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout'; 
import { db, auth } from '../firebase/config'; 
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { verifyAdminTransaction, rejectAdminTransaction } from '../firebase/transactionService';
import { approveAdminLoan, rejectAdminLoan } from '../firebase/loanService';
import { 
  CheckCircle, XCircle, Loader2, 
  Wallet, HandCoins, Users, ArrowDownLeft, ShieldAlert, ArrowLeft 
} from 'lucide-react';

const AdminDashboard = () => {
  const currentUser = auth.currentUser; 
  const [activeTab, setActiveTab] = useState<'deposits' | 'loans' | 'members'>('deposits');
  
  // Real-time Data States
  const [deposits, setDeposits] = useState<any[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Listen for Pending Deposits
    const qDeposits = query(collection(db, 'transactions'), where('status', '==', 'pending'), orderBy('createdAt', 'asc'));
    const unsubDeposits = onSnapshot(qDeposits, (snap) => {
      setDeposits(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 2. Listen for Pending Loans
    const qLoans = query(collection(db, 'loans'), where('status', '==', 'pending'), orderBy('createdAt', 'asc'));
    const unsubLoans = onSnapshot(qLoans, (snap) => {
      setLoans(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Listen for All Members (Cooperative Health)
    const qMembers = query(collection(db, 'members'), orderBy('totalSavings', 'desc'));
    const unsubMembers = onSnapshot(qMembers, (snap) => {
      setMembers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubDeposits(); unsubLoans(); unsubMembers(); };
  }, []);

  // --- Secure Action Handlers ---
  const handleVerifyDeposit = async (id: string, memberId: string, amount: number) => {
    if (!window.confirm(`Verify this ${amount.toLocaleString()} RWF deposit?`)) return;
    setProcessingId(id);
    const res = await verifyAdminTransaction(id, memberId, amount);
    if (!res.success) alert("Failed: " + res.error);
    setProcessingId(null);
  };

  const handleApproveLoan = async (id: string, memberId: string, amount: number) => {
    if (!window.confirm(`Approve loan of ${amount.toLocaleString()} RWF?`)) return;
    setProcessingId(id);
    const res = await approveAdminLoan(id, memberId, amount);
    if (!res.success) alert("Failed: " + res.error);
    setProcessingId(null);
  };

  const handleReject = async (id: string, type: 'deposit' | 'loan') => {
    if (!window.confirm(`Are you sure you want to REJECT this ${type}? This cannot be undone.`)) return;
    setProcessingId(id);
    const res = type === 'deposit' ? await rejectAdminTransaction(id) : await rejectAdminLoan(id);
    if (!res.success) alert("Failed: " + res.error);
    setProcessingId(null);
  };

  // --- Live Cooperative Analytics ---
  const totalLiquidity = members.reduce((sum, m) => sum + (m.totalSavings || 0), 0);
  const totalOutstandingDebt = members.reduce((sum, m) => sum + (m.activeLoans || 0), 0);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
    </div>
  );

  return (
    <Layout title="Cooperative Command Center">
      <div className="space-y-8">
        
        {/* Header with Quick Access Button */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Overview</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Manage cooperative liquidity and verify requests.</p>
          </div>
          <Link 
            to="/dashboard" 
            className="inline-flex items-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Switch to Member Portal
          </Link>
        </div>

        {/* Top Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cooperative Liquidity</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2 tracking-tight">{totalLiquidity.toLocaleString()} <span className="text-sm font-bold text-slate-400">RWF</span></h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Debt</p>
            <h3 className="text-3xl font-black text-rose-600 mt-2 tracking-tight">{totalOutstandingDebt.toLocaleString()} <span className="text-sm font-bold text-rose-400">RWF</span></h3>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Members</p>
            <h3 className="text-3xl font-black text-indigo-600 mt-2 tracking-tight">{members.length}</h3>
          </div>
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-200 overflow-x-auto pb-px">
          <button 
            onClick={() => setActiveTab('deposits')} 
            className={`flex items-center px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'deposits' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Wallet className="w-4 h-4 mr-2" /> Pending Deposits
            {deposits.length > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black bg-amber-100 text-amber-700 rounded-full animate-pulse">{deposits.length}</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('loans')} 
            className={`flex items-center px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'loans' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <HandCoins className="w-4 h-4 mr-2" /> Loan Requests
            {loans.length > 0 && <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-[10px] font-black bg-rose-100 text-rose-700 rounded-full animate-pulse">{loans.length}</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('members')} 
            className={`flex items-center px-6 py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === 'members' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Users className="w-4 h-4 mr-2" /> Member Directory
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-100">
          
          {/* 1. DEPOSITS TAB */}
          {activeTab === 'deposits' && (
            deposits.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-emerald-300 mb-4" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Inbox Zero</p>
                <p className="text-xs text-slate-400 mt-2">No pending deposits requiring verification.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {deposits.map((txn) => {
                  // 🔥 Find the real member profile linked to this transaction
                  const member = members.find(m => m.id === txn.memberId);

                  return (
                    <li key={txn.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div>
                        {/* 🔥 Display System Identity */}
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-slate-900 text-sm">{member?.fullName || 'Unknown Member'}</p>
                          <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold uppercase">System Profile</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{member?.email || 'No email registered'}</p>
                        
                        {/* 🔥 Display MoMo Sender Name for Cross-Verification */}
                        <div className="mt-3 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200 inline-block">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">MoMo Account Used</span>
                          <span className="text-xs font-bold text-slate-800 uppercase">{txn.momoSenderName || 'NOT PROVIDED'}</span>
                        </div>

                        <div className="flex items-center mt-3">
                          <ArrowDownLeft className="w-4 h-4 text-emerald-500 mr-2" />
                          <span className="font-black text-emerald-600 text-xl tabular-nums">{txn.amount?.toLocaleString()} RWF</span>
                          <span className="text-[10px] font-medium text-slate-400 ml-3">{txn.createdAt?.toDate().toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Peer Review Check for Deposits */}
                      <div className="flex space-x-3 w-full sm:w-auto mt-4 sm:mt-0">
                        {txn.memberId === currentUser?.uid ? (
                          <div className="px-5 py-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <ShieldAlert className="w-4 h-4 mr-2" /> Requires Peer Review
                          </div>
                        ) : (
                          <>
                            <button onClick={() => handleReject(txn.id, 'deposit')} disabled={processingId === txn.id} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-all disabled:opacity-50" title="Reject Deposit">
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleVerifyDeposit(txn.id, txn.memberId, txn.amount)} disabled={processingId === txn.id} className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-indigo-200 disabled:opacity-50 flex items-center min-w-40 justify-center">
                              {processingId === txn.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Verify Deposit</>}
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          )}

          {/* 2. LOANS TAB */}
          {activeTab === 'loans' && (
            loans.length === 0 ? (
              <div className="p-20 text-center flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-emerald-300 mb-4" />
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Inbox Zero</p>
                <p className="text-xs text-slate-400 mt-2">No pending loan applications.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {loans.map((loan) => {
                  // 🔥 Find the real member profile linked to this loan request
                  const member = members.find(m => m.id === loan.memberId);

                  return (
                    <li key={loan.id} className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        {/* 🔥 Display System Identity instead of a raw ID */}
                        <p className="font-bold text-slate-900 text-sm">{member?.fullName || 'Unknown Member'}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{member?.email || 'No email registered'}</p>

                        <div className="mt-3 bg-slate-100 p-4 rounded-xl border border-slate-200 relative">
                          <span className="absolute -top-3 left-4 bg-slate-200 px-2 py-0.5 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">Stated Purpose</span>
                          <p className="text-sm font-medium text-slate-700 leading-relaxed">
                            "{loan.reason}"
                          </p>
                        </div>
                      </div>
                      <div className="text-left lg:text-right shrink-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Requested Principal</p>
                        <span className="font-black text-rose-600 text-2xl tabular-nums">{loan.amount?.toLocaleString()} RWF</span>
                      </div>

                      {/* Peer Review Check for Loans */}
                      <div className="flex space-x-3 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
                        {loan.memberId === currentUser?.uid ? (
                          <div className="px-5 py-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                            <ShieldAlert className="w-4 h-4 mr-2" /> Requires Peer Review
                          </div>
                        ) : (
                          <>
                            <button onClick={() => handleReject(loan.id, 'loan')} disabled={processingId === loan.id} className="p-3 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 transition-all disabled:opacity-50" title="Reject Loan">
                              <XCircle className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleApproveLoan(loan.id, loan.memberId, loan.amount)} disabled={processingId === loan.id} className="px-6 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-md shadow-emerald-200 disabled:opacity-50 flex items-center min-w-40 justify-center">
                              {processingId === loan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><CheckCircle className="w-4 h-4 mr-2" /> Approve Loan</>}
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ul>
            )
          )}

          {/* 3. MEMBERS TAB */}
          {activeTab === 'members' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-150">
                <thead className="bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Identity & Contact</th>
                    <th className="px-6 py-4 text-right">Verified Savings</th>
                    <th className="px-6 py-4 text-right">Active Debt</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{m.fullName || 'Ejo Hacu Member'}</p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{m.email}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 tabular-nums">
                        {(m.totalSavings || 0).toLocaleString()} RWF
                      </td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-rose-600 tabular-nums">
                        {(m.activeLoans || 0).toLocaleString()} RWF
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;