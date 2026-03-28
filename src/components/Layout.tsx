import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, Wallet, HandCoins, Settings as SettingsIcon, 
  LogOut, Menu, ShieldCheck, Shield, Download, X, Smartphone 
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
  const [isAdmin, setIsAdmin] = useState(false);
  
  // 🔥 PWA Install Logic States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // 1. Admin Role Listener
    const user = auth.currentUser;
    if (!user) return;

    const unsub = onSnapshot(doc(db, "members", user.uid), (docSnap) => {
      if (docSnap.exists() && docSnap.data().role === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });

    // 2. 🔥 Listen for the 'beforeinstallprompt' event
    const handleInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    return () => {
      unsub();
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Savings', path: '/savings', icon: Wallet },
    { name: 'Loans', path: '/loans', icon: HandCoins },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const initials = userName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true" // 🔥 Accessibility fix: hides this decorative element from screen readers
        />
      )}

      {/* SIDE PANEL (SIDEBAR) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 text-slate-300 z-50 transition-transform duration-300 lg:translate-x-0 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900 shadow-sm">
          <span className="font-black tracking-tight text-xl text-white">
            EJO <span className="text-indigo-500">HACU</span>
          </span>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col overflow-y-auto">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button 
                  key={item.name}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* ADMIN QUICK ACCESS BUTTON */}
          {isAdmin && (
            <div className="mt-6 pt-6 border-t border-slate-800/50">
              <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
                Privileged Access
              </p>
              <button 
                onClick={() => { navigate('/admin'); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  location.pathname === '/admin'
                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md'
                    : 'text-amber-500/70 hover:text-amber-400 hover:bg-amber-500/10 border border-transparent'
                }`}
              >
                <Shield size={18} strokeWidth={2.5} />
                <span>Admin Command</span>
              </button>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => auth.signOut()}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* REFINED HEADER */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)} 
              aria-label="Open sidebar menu" // 🔥 Accessibility fix
              className="lg:hidden p-2 -ml-2 mr-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              {title}
            </h1>
          </div>

          <div className="flex items-center space-x-4 pl-4 lg:pl-6">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                {userName || "Authenticated Member"}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center justify-end">
                <ShieldCheck className="w-3 h-3 mr-1" /> {isAdmin ? "System Admin" : "Verified Member"}
              </p>
            </div>
            
            <div className="w-9 h-9 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 ring-1 ring-slate-200">
              {userImage ? (
                <img 
                  src={userImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              ) : (
                <span className="text-sm font-black text-indigo-700">{initials}</span>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 lg:p-8 max-w-7xl w-full mx-auto flex-1 relative">
          {children}

          {/* 🔥 INSTALL APP BANNER */}
          {showInstallBanner && (
            <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-100 animate-in fade-in slide-in-from-bottom-10 duration-500">
              <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-5 flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white tracking-tight">Ejo Hacu Mobile</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fast Access from Home</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setShowInstallBanner(false)}
                    aria-label="Close install prompt" // 🔥 Accessibility fix
                    className="p-2 text-slate-500 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleInstallClick}
                    className="flex items-center px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
                  >
                    <Download className="w-3.5 h-3.5 mr-2" /> Install
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Layout;