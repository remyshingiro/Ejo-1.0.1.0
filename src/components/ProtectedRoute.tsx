import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase/config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Loader2 } from 'lucide-react';

// 🔥 Fix: Changed children type to React.ReactNode for better compatibility
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Checking Authorization...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;