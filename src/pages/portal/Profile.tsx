import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Camera, 
  Shield, 
  Lock, 
  CheckCircle2, 
  ArrowRight,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../services/authService";

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    mobile: "+91 98765 43210",
    dob: "1995-05-15"
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        displayName: user.displayName || "",
        email: user.email || ""
      }));
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (user && formData.displayName !== user.displayName) {
        await AuthService.updateProfile(user, { displayName: formData.displayName });
      }
      setIsEditing(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Profile update failed:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-navy mb-2">My Profile</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Manage your personal identity</p>
      </div>

      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-12 right-12 z-50 bg-brand-navy text-white px-8 py-4 rounded-sm shadow-2xl flex items-center gap-4"
        >
          <CheckCircle2 size={20} className="text-brand-gold" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Profile Updated Successfully</span>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-10 mb-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-brand-gold p-1">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName)}&background=020C1B&color=CEA462`} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute inset-0 bg-brand-navy/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </button>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-serif text-brand-navy mb-1">{formData.displayName}</h2>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Trusted Member since 2025</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Full Name</label>
                  <div className="relative">
                    <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled={true} // Email is immutable for now
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Mobile Number</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input 
                      type="tel" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Date of Birth</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-brand-navy/5 flex justify-end gap-4">
                {!isEditing ? (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-10 py-4 border border-brand-navy/10 rounded-sm text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-10 py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-10 py-4 bg-brand-navy text-white rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white p-10 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-8 flex items-center gap-3">
              <Shield size={20} className="text-brand-gold" /> Security & Password
            </h3>
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Current Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input type="password" placeholder="••••••••" className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">New Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input type="password" placeholder="••••••••" className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-10 py-4 bg-brand-navy text-white rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl">
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <div className="bg-brand-navy p-8 rounded-sm text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
            <div className="relative z-10">
              <h4 className="text-lg font-serif mb-4">Account Tier</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy">
                  <Shield size={24} />
                </div>
                <div>
                  <p className="text-xl font-serif text-brand-gold">Trusted Circle</p>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-white/40">Priority Member</p>
                </div>
              </div>
              <p className="text-xs text-white/40 leading-relaxed mb-8">
                You are currently on our most professional tier. Enjoy unlimited emergency calls and priority scheduling.
              </p>
              <button className="w-full py-4 border border-white/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all">
                View Tier Benefits
              </button>
            </div>
          </div>

          <div className="bg-red-50 p-8 rounded-sm border border-red-100">
            <AlertTriangle className="text-red-500 mb-4" size={24} />
            <h4 className="text-sm font-bold text-red-700 mb-2">Danger Zone</h4>
            <p className="text-xs text-red-600 leading-relaxed mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button className="text-[9px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors flex items-center gap-2">
              Request Account Deletion <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
