import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase/config';
import { 
  LayoutDashboard, 
  Wallet, 
  HandCoins, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  userName?: string;
  userImage?: string;
}

const Layout = ({ children, title, userName, userImage }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Savings', path: '/savings', icon: Wallet },
    { name: 'Loans', path: '/loans', icon: HandCoins },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const initials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-[#f4f7f6] font-sans">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDE PANEL (SIDEBAR) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-[#1a1d21] text-white z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center px-6 border-b border-gray-800 bg-[#141619]">
          <span className="font-black tracking-tighter text-xl text-white">EJO HACU</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button 
                key={item.name}
                onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-none text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon size={18} strokeWidth={2.5} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-950/30 rounded-none transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* REFINED HEADER */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-10 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] ml-3 lg:ml-0">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-4 border-l border-gray-100 pl-4 lg:pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-bold text-gray-900 leading-tight">
                {userName || "Authenticated Member"}
              </p>
              <p className="text-[10px] text-blue-600 font-black uppercase tracking-tighter">
                Verified Account
              </p>
            </div>
            
            {/* BUG-FREE USER IMAGE / INITIALS */}
            <div className="w-10 h-10 rounded-none bg-gray-100 border border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
              {userImage ? (
                <img 
                  src={userImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <span className="text-sm font-black text-gray-500">{initials}</span>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;