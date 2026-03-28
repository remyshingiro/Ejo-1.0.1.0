import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerMember } from '../firebase/authService';
import { User, Mail, Lock, Loader2, ArrowLeft, Leaf } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // 🔥 Added new state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Strict Validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }
    
    // 🔥 2. New Validation: Ensure passwords match exactly
    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const result = await registerMember(email, password, name);
      if (result.success) {
        navigate('/dashboard');
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      // 🔥 3. Duplicate Credential Handling: Firebase throws a specific error if the email exists
      if (err.message.includes('email-already-in-use') || err.message.includes('auth/email-already-in-use')) {
        setError('An account is already registered with this email address. Please sign in instead.');
      } else {
        setError(err.message || 'Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      
      {/* LEFT COLUMN: The Inspirational Image (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-emerald-900/30 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
        
        <img 
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Sustainable Growth" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        <div className="relative z-20 flex flex-col justify-end p-16 h-full text-white">
          <Leaf className="w-12 h-12 mb-6 text-emerald-400" />
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Plant the seeds for<br/>a secure tomorrow.
          </h1>
          <p className="text-lg text-slate-300 font-medium max-w-md">
            Join the Ejo Hacu cooperative. We are building a high-trust, digitally verified savings network for everyone.
          </p>
        </div>
      </div>

      {/* RIGHT COLUMN: The Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 bg-slate-50 lg:bg-white overflow-y-auto py-12">
        <div className="max-w-md w-full mx-auto">
          
          <div className="mb-8">
            <Link to="/login" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
            </Link>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Join Ejo Hacu</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">Start your secure digital saving journey today.</p>
          </div>
          
          {error && (
            <div className="mb-6 text-xs font-bold text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSignup}>
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Legal Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required 
                  disabled={loading}
                  className="block w-full pl-11 pr-4 py-3 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                  placeholder="e.g. Jean Paul Mugisha"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            {/* Email Address */}
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
                  className="block w-full pl-11 pr-4 py-3 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                  placeholder="name@email.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Secure Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  disabled={loading}
                  className="block w-full pl-11 pr-4 py-3 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                  placeholder="Minimum 6 characters"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* 🔥 Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required 
                  disabled={loading}
                  className="block w-full pl-11 pr-4 py-3 bg-white lg:bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none disabled:opacity-50"
                  placeholder="Re-enter password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading || !email || !password || !confirmPassword || !name}
                className="w-full flex justify-center items-center py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-widest transition-all shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
            
          </form>

          <p className="mt-8 text-center text-[11px] font-medium text-slate-400">
            By creating an account, you agree to the Ejo Hacu cooperative terms of service and secure data processing agreement.
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;