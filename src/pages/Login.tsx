import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Mail, Lock, Loader2, ShieldCheck, TrendingUp, Users } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'An error occurred during sign in.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT COLUMN: The Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32">
        <div className="max-w-md w-full mx-auto">
          
          {/* Branding */}
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 text-white mb-6 shadow-lg shadow-indigo-200">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Welcome back to <span className="text-indigo-600">Ejo Hacu</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 mt-2">Secure Cooperative Management</p>
          </div>

          {error && (
            <div className="mb-6 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                  placeholder="name@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  disabled={loading}
                  className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading || !email || !password}
              className="w-full flex justify-center items-center py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                Apply to Join
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: The Inspirational Community Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        {/* Adjusted the overlay to make sure the white text pops over the bright image */}
        <div className="absolute inset-0 bg-slate-900/50 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
        
        {/* Community Motivation Image */}
        <img 
          src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Community and Togetherness" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <Users className="w-12 h-12 mb-6 text-indigo-400" />
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Grow your wealth.<br/>Empower your community.
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-md">
            Log in to manage your cooperative savings, request secure loans, and track your financial journey alongside your peers.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;