import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

import { auth, db } from '../firebase/config';
import { doc, setDoc, onSnapshot } from 'firebase/firestore'; // 🔥 Changed updateDoc to setDoc
import { Camera, Loader2, User, Phone, Mail, ShieldCheck, CheckCircle } from 'lucide-react';

// 🔐 Securely pull config from Vite Environment Variables
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Settings = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState<any>(null);
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  // 1. Handle Ordinary Form Updates (Name, Phone)
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userRef = doc(db, "members", user.uid);
      // 🔥 Changed to setDoc with merge: true to create the doc if it doesn't exist
      await setDoc(userRef, {
        fullName: fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        email: user.email // Save the email during first creation
      }, { merge: true });
      
      setSuccess("Identity profile updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Cloudinary Image Upload (Auto-saves to DB)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Strict Validation
    if (!file.type.startsWith('image/')) {
      return setError('Please upload a valid image file (JPG, PNG).');
    }
    if (file.size > 5 * 1024 * 1024) {
      return setError('Image size must be less than 5MB.');
    }

    setUploadingImage(true);
    setError('');
    setSuccess('');

    try {
      // Prepare Cloudinary Payload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      // Execute Upload
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Cloudinary upload failed.');

      const data = await res.json();
      const newSecureUrl = data.secure_url;

      // 🔥 Changed to setDoc with merge: true
      await setDoc(doc(db, "members", user.uid), {
        photoURL: newSecureUrl,
        email: user.email
      }, { merge: true });
      
      setPhotoURL(newSecureUrl); // Update local state
      setSuccess('Profile picture updated successfully.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const initials = profile?.fullName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';

  return (
    <Layout 
      title="System Settings" 
      userName={profile?.fullName} 
      userImage={profile?.photoURL}
    >
      <div className="max-w-4xl space-y-8 mx-auto">
        
        {/* Card 1: Identity & Avatar Update */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Member Identity Profile
            </h3>
            <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 uppercase tracking-wider">
              <ShieldCheck className="w-3 h-3 mr-1" /> Active Identity
            </span>
          </div>
          
          <div className="p-8">
            
            {/* Avatar Section */}
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-100">
              <div className="relative group shrink-0">
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-indigo-50 flex items-center justify-center relative transition-all ${uploadingImage ? 'opacity-50' : ''}`}>
                  {photoURL ? (
                    <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-black text-indigo-300">{initials}</span>
                  )}
                  
                  {/* Upload Overlay (Triggers hidden input) */}
                  <label 
                    htmlFor="avatar-upload" 
                    className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-white mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                  </label>
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/jpeg, image/png, image/webp"
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />

                {uploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-white/90 p-2 rounded-full shadow-lg">
                      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{fullName || 'Ejo Hacu Member'}</h2>
                <p className="text-sm font-medium text-slate-500 mt-1 flex items-center justify-center md:justify-start">
                  Click the image to update your profile photo. Max size 5MB.
                </p>
              </div>
            </div>

            {/* Inline Feedback */}
            {(error || success) && (
              <div className="mb-6">
                {error && <div className="text-xs font-bold text-rose-600 bg-rose-50 px-4 py-3 rounded-xl border border-rose-100">{error}</div>}
                {success && <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 flex items-center"><CheckCircle className="w-4 h-4 mr-2" />{success}</div>}
              </div>
            )}

            {/* Profile Update Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Legal Full Name
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                      placeholder="e.g. Jean Paul Mugisha"
                    />
                  </div>
                </div>
                
                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Phone Number (MoMo)
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all outline-none"
                      placeholder="e.g. 078..."
                    />
                  </div>
                </div>

                {/* Email (Disabled) */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Registered Email (Read Only)
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      disabled
                      value={user?.email || ''}
                      className="block w-full pl-11 pr-4 py-3 border border-slate-100 bg-slate-50 rounded-xl text-sm font-bold text-slate-400 cursor-not-allowed transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center shadow-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? "Syncing..." : "Save Identity Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Card 2: Security & Access */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
          <div className="px-8 py-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Access & Security
            </h3>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-xl">
                To protect your financial data, password modifications must be securely routed through your verified email provider.
              </p>
              <button className="shrink-0 border-2 border-slate-300 text-slate-700 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-400 transition-all">
                Request Password Reset
              </button>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default Settings;