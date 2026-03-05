import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/config';

const Layout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      {/* Sidebar - Standard Fintech Style */}
      <aside className="w-64 bg-[#1a1d21] text-white flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold tracking-tight">EJO HACU</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => navigate('/dashboard')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition">Dashboard</button>
          <button onClick={() => navigate('/savings')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition">My Savings</button>
          <button onClick={() => navigate('/loans')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition">Loan Manager</button>
          <button onClick={() => navigate('/settings')} className="w-full text-left px-4 py-2 rounded hover:bg-gray-800 transition">Settings</button>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={() => auth.signOut()} className="w-full text-left px-4 py-2 text-gray-400 hover:text-white transition">Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">{auth.currentUser?.email}</span>
            <div className="w-10 h-10 bg-gray-200 rounded-full border border-gray-300"></div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default Layout;