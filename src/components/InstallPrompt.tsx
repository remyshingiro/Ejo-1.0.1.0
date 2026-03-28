import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

// 1. 🔥 Define the specific TypeScript interface for the PWA event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const InstallPrompt = () => {
  // Use the specific interface instead of 'any'
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      // Cast the generic event to our specific PWA event
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    
    // Trigger the native browser prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the native prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    // 2. 🔥 CRITICAL FIX: The prompt can only be used once. 
    // We must clear the state and hide the banner whether they accepted or dismissed it.
    console.log(`User ${outcome} the PWA installation`);
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-8 md:w-96 z-100 animate-in fade-in slide-in-from-bottom-10 duration-500">
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 p-5 flex items-center justify-between group">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
            <Smartphone className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-tight">Ejo Hacu Mobile</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Install for faster access</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss installation prompt" // 3. 🔥 Accessibility Fix
            className="p-2 text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <button 
            onClick={handleInstall}
            aria-label="Install Ejo Hacu App" // 3. 🔥 Accessibility Fix
            className="flex items-center px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95 shadow-lg"
          >
            <Download className="w-3.5 h-3.5 mr-2" /> Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;