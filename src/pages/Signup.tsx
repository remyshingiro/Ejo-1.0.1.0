import React, { useState } from 'react';
import { registerMember } from '../firebase/authService';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await registerMember(email, password, name);
    if (result.success) {
      alert("Welcome to Ejo Hacu!");
    } else {
      alert("Error: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-6">
      <div className="sm:mx-auto sm:w-full sm:max-max-w-md text-center">
        <h2 className="text-3xl font-extrabold text-ejo-dark">Join Ejo Hacu</h2>
        <p className="mt-2 text-gray-600">Start your digital saving journey today.</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSignup}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input 
                type="text" required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ejo-green focus:border-ejo-green"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input 
                type="email" required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ejo-green focus:border-ejo-green"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input 
                type="password" required 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ejo-green focus:border-ejo-green"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-ejo-green hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ejo-green">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;