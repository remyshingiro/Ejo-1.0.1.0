import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth'; // 🔥 Added reliable auth listener
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { ShieldAlert, Loader2, Key } from 'lucide-react';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Vault State
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [upgrading, setUpgrading] = useState(false);

  const MASTER_KEY = import.meta.env.VITE_ADMIN_MASTER_KEY;

  useEffect(() => {
    // 🔥 1. Use onAuthStateChanged to reliably catch the session, even on page reload
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setFirebaseUser(null);
        setLoading(false);
        return;
      }

      setFirebaseUser(user);

      // 🔥 2. Check the database for their specific role
      const unsubDoc = onSnapshot(doc(db, 'members', user.uid), (docSnap) => {
        if (docSnap.exists()) {
          setRole(docSnap.data().role || 'member');
        } else {
          // 🚨 GHOST USER DETECTED!
          // They exist in local browser cache, but their database profile was wiped.
          // We must force sign them out to clear the broken local cache.
          auth.signOut();
        }
        setLoading(false);
      });

      return () => unsubDoc();
    });

    return () => unsubscribeAuth();
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setUpgrading(true);

    if (passcode === MASTER_KEY && firebaseUser) {
      try {
        await updateDoc(doc(db, 'members', firebaseUser.uid), {
          role: 'admin'
        });
      } catch (err: any) {
        setError("Database error: " + err.message);
        setUpgrading(false);
      }
    } else {
      setError("Invalid Administrative Key. Access Denied.");
      setPasscode('');
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // If they aren't logged in, kick them to login
  if (!firebaseUser) return <Navigate to="/login" replace />;

  // If they are an official admin, let them through to the Dashboard!
  if (role === 'admin') {
    return <>{children}</>;
  }

  // If they are just a member, show the Vault Lock Screen
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 p-8 sm:p-10 text-center">
        
        <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
          <ShieldAlert className="w-10 h-10 text-rose-500" />
        </div>
        
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">Restricted Access</h2>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          This area is strictly for Ejo Hacu Cooperative administrators. Please enter the Master Key to authorize this device and upgrade your account.
        </p>

        {error && (
          <div className="mb-6 text-xs font-bold text-rose-400 bg-rose-950/50 px-4 py-3 rounded-xl border border-rose-900/50">
            {error}
          </div>
        )}

        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-slate-500" />
            </div>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={upgrading}
              placeholder="Enter Master Key" 
              className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-slate-700 rounded-xl text-sm font-bold text-white placeholder:text-slate-500 focus:bg-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-center tracking-[0.2em] disabled:opacity-50"
            />
          </div>
          
          <button 
            type="submit"
            disabled={upgrading || !passcode}
            className="w-full flex justify-center items-center py-4 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {upgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Account"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700">
          <button onClick={() => window.history.back()} className="text-xs font-bold text-slate-500 hover:text-white uppercase tracking-wider transition-colors">
            &larr; Return to Safety
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRoute;