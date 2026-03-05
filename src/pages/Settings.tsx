import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { auth, db } from '../firebase/config';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const Settings = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync current data to show in inputs
  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "members", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProfile(data);
        setFullName(data.fullName || '');
        setPhoneNumber(data.phoneNumber || '');
        setPhotoURL(data.photoURL || '');
      }
    });
    return () => unsub();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const userRef = doc(db, "members", user.uid);
      await updateDoc(userRef, {
        fullName: fullName,
        phoneNumber: phoneNumber,
        photoURL: photoURL
      });
      alert("System Records Updated Successfully.");
    } catch (err: any) {
      alert("Update Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="System Settings" 
      userName={profile?.fullName} 
      userImage={profile?.photoURL}
    >
      <div className="max-w-4xl space-y-6">
        
        {/* Card 1: Ordinary Identity Card */}
        <div className="bg-white border border-gray-200 rounded-none shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
              Member Identity Profile
            </h3>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-tight">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  className="w-full p-2.5 border border-gray-300 rounded-none text-sm font-bold focus:border-gray-800 outline-none transition-all"
                  placeholder="Legal Name"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-tight">
                  Registered Email
                </label>
                <input 
                  type="email" 
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 border border-gray-100 bg-gray-50 rounded-none text-sm text-gray-400 cursor-not-allowed font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-tight">
                  Phone Number (MoMo)
                </label>
                <input 
                  type="text" 
                  value={phoneNumber}
                  className="w-full p-2.5 border border-gray-300 rounded-none text-sm font-bold focus:border-gray-800 outline-none"
                  placeholder="250..."
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1.5 tracking-tight">
                  Profile Image URL
                </label>
                <input 
                  type="text" 
                  value={photoURL}
                  className="w-full p-2.5 border border-gray-300 rounded-none text-sm font-bold focus:border-gray-800 outline-none"
                  placeholder="https://image-link.com"
                  onChange={(e) => setPhotoURL(e.target.value)}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
              <button 
                disabled={loading}
                className="bg-[#1a1d21] text-white px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-black transition disabled:opacity-50"
              >
                {loading ? "Syncing..." : "Save Identity Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Card 2: Security & Access */}
        <div className="bg-white border border-gray-200 rounded-none shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-[11px] font-black text-gray-800 uppercase tracking-widest">
              Access & Security
            </h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <p className="text-xs text-gray-600 font-medium">
                To update your security credentials, request a formal reset link via your verified email.
              </p>
              <button className="border-2 border-gray-800 text-gray-800 px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-800 hover:text-white transition">
                Reset Password
              </button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Settings;