import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Loader2,
  LogOut
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AuthService } from "../../services/authService";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingProtocol, setIsUpdatingProtocol] = useState(false);
  const [showProtocolToast, setShowProtocolToast] = useState(false);
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

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleUpdateProtocol = (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProtocol(true);
    setTimeout(() => {
      setIsUpdatingProtocol(false);
      setShowProtocolToast(true);
      setTimeout(() => setShowProtocolToast(false), 3000);
    }, 1500);
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
      <div className="mb-8 lg:mb-12 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2 italic uppercase tracking-tighter sm:normal-case sm:not-italic">Identity Parameters</h1>
        <p className="text-brand-navy/40 text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.3em] font-black sm:font-bold">Access Verified: Sector Alpha</p>
      </div>

      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-32 left-4 right-4 z-50 bg-brand-navy/95 backdrop-blur-xl text-white px-6 py-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center justify-center gap-4"
        >
          <CheckCircle2 size={18} className="text-brand-gold" />
          <span className="text-[9px] uppercase tracking-[0.2em] font-black">Identity Modified Successfully</span>
        </motion.div>
      )}

      {showProtocolToast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-32 left-4 right-4 z-50 bg-brand-navy/95 backdrop-blur-xl text-white px-6 py-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center justify-center gap-4"
        >
          <Shield size={18} className="text-brand-gold" />
          <span className="text-[9px] uppercase tracking-[0.2em] font-black">Security Protocol Re-Synchronized</span>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-4 sm:gap-12 no-scrollbar">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-8">
          <div className="bg-white p-5 sm:p-10 rounded-[2rem] sm:rounded-sm border border-brand-navy/5 shadow-xl sm:shadow-sm">
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 mb-8 sm:mb-12">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-32 sm:h-32 rounded-[2.5rem] sm:rounded-full border-2 border-brand-gold p-1.5 shrink-0 shadow-[0_0_30px_rgba(206,164,98,0.2)]">
                  <img 
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.displayName)}&background=020C1B&color=CEA462`} 
                    alt="Profile" 
                    className="w-full h-full rounded-[2rem] sm:rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <button className="absolute inset-0 bg-brand-navy/40 rounded-[2.5rem] sm:rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-[8px] uppercase tracking-[0.4em] font-black text-brand-gold mb-2">Authenticated System Member</p>
                <h2 className="text-3xl sm:text-3xl font-serif text-brand-navy mb-1 italic uppercase tracking-tighter sm:normal-case sm:not-italic">{formData.displayName}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/30">Biometric Sync Active</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-navy/30 ml-4 sm:ml-0">Full Designation</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20 group-focus-within:text-brand-gold transition-colors" />
                    <input 
                      type="text" 
                      value={formData.displayName}
                      onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-brand-navy/[0.03] sm:bg-brand-navy/5 border border-transparent rounded-2xl sm:rounded-sm pl-14 pr-6 py-5 sm:py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold focus:bg-white transition-all disabled:opacity-50 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-navy/30 ml-4 sm:ml-0">Encrypted Email Access</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled={true} 
                      className="w-full bg-brand-navy/[0.03] border border-transparent rounded-2xl sm:rounded-sm pl-14 pr-6 py-5 sm:py-4 text-sm text-brand-navy opacity-50 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-navy/30 ml-4 sm:ml-0">Comm-Link Number</label>
                  <div className="relative group">
                    <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20 group-focus-within:text-brand-gold transition-colors" />
                    <input 
                      type="tel" 
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-brand-navy/[0.03] sm:bg-brand-navy/5 border border-transparent rounded-2xl sm:rounded-sm pl-14 pr-6 py-5 sm:py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-all disabled:opacity-50 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-navy/30 ml-4 sm:ml-0">Chronological Origin</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20" />
                    <input 
                      type="date" 
                      value={formData.dob}
                      onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-brand-navy/[0.03] sm:bg-brand-navy/5 border border-transparent rounded-2xl sm:rounded-sm pl-14 pr-6 py-5 sm:py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-all disabled:opacity-50 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-brand-navy/5 flex flex-col sm:flex-row justify-end gap-4">
                {!isEditing ? (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-12 py-5 sm:py-4 bg-brand-navy text-brand-gold sm:text-white rounded-2xl sm:rounded-sm border border-brand-gold/20 sm:border-brand-navy/10 text-[10px] uppercase tracking-[0.3em] font-black hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl active:scale-95"
                  >
                    Modify Identity
                  </button>
                ) : (
                  <>
                    <button 
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full sm:w-auto px-12 py-5 sm:py-4 text-[10px] uppercase tracking-[0.3em] font-black text-brand-navy/40 hover:text-brand-navy transition-colors active:scale-95"
                    >
                      Revert Changes
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-12 py-5 sm:py-4 bg-brand-navy text-white rounded-2xl sm:rounded-sm text-[10px] uppercase tracking-[0.3em] font-black hover:bg-brand-gold hover:text-brand-navy transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Commit Modifications"}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Security Section */}
          <div className="bg-white p-5 sm:p-10 rounded-[2rem] sm:rounded-sm border border-brand-navy/5 shadow-xl sm:shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-6 sm:mb-10 flex items-center justify-center sm:justify-start gap-4">
              <Shield size={24} className="text-brand-gold" /> 
              <span className="italic uppercase tracking-tighter sm:normal-case sm:not-italic font-bold">Credential Protocol</span>
            </h3>
            <div className="space-y-6 sm:space-y-8">
              <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-navy/30 ml-4 sm:ml-0">Security Code Alpha</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20 group-focus-within:text-brand-gold transition-colors" />
                    <input type="password" placeholder="••••••••" className="w-full bg-brand-navy/[0.03] sm:bg-brand-navy/5 border border-transparent rounded-2xl sm:rounded-sm pl-14 pr-6 py-5 sm:py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.2em] font-black text-brand-navy/30 ml-4 sm:ml-0">Security Code Beta</label>
                  <div className="relative group">
                    <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/20 group-focus-within:text-brand-gold transition-colors" />
                    <input type="password" placeholder="••••••••" className="w-full bg-brand-navy/[0.03] sm:bg-brand-navy/5 border border-transparent rounded-2xl sm:rounded-sm pl-14 pr-6 py-5 sm:py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-all" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end">
                <button 
                  onClick={handleUpdateProtocol}
                  disabled={isUpdatingProtocol}
                  className="w-full sm:w-auto px-12 py-5 sm:py-4 bg-brand-navy text-white rounded-2xl sm:rounded-sm text-[10px] uppercase tracking-[0.3em] font-black hover:bg-brand-gold hover:text-brand-navy transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                >
                  {isUpdatingProtocol ? <Loader2 size={16} className="animate-spin" /> : "Update Protocol"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-4 sm:space-y-8">
          <div className="bg-brand-navy p-8 sm:p-10 rounded-[2.5rem] sm:rounded-sm text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-full h-full bg-brand-gold/5 -skew-x-12 translate-x-1/2 group-hover:translate-x-1/4 transition-transform duration-1000" />
            <div className="relative z-10">
              <p className="text-[8px] uppercase tracking-[0.5em] font-black text-brand-gold/60 mb-5">Security Clearance</p>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center text-brand-gold shadow-inner">
                  <Shield size={32} />
                </div>
                <div>
                  <p className="text-2xl font-serif text-brand-gold italic uppercase tracking-tighter">Gold Tier</p>
                  <p className="text-[9px] uppercase tracking-[0.1em] font-black text-white/20">Executive Authority</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                  <p className="text-[7px] uppercase tracking-widest text-white/30 mb-1">Status</p>
                  <p className="text-[10px] font-bold text-green-400">OPTIMAL</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                  <p className="text-[7px] uppercase tracking-widest text-white/30 mb-1">Integrity</p>
                  <p className="text-[10px] font-bold text-brand-gold">MASTERED</p>
                </div>
              </div>

              <p className="text-xs text-white/40 leading-relaxed mb-8 italic">
                Authorized for priority response and advanced environmental diagnostics.
              </p>

              <button 
                onClick={() => {
                  alert("Accessing Priority Benefits Database... Link established.");
                }}
                className="w-full py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-[9px] uppercase tracking-[0.3em] font-black text-white/60 hover:text-white hover:bg-white/10 transition-all active:scale-95"
              >
                Clearance Benefits
              </button>
            </div>
          </div>

          <div className="bg-red-500/10 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-sm border border-red-500/20 shadow-2xl shadow-red-500/5">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mb-5">
              <AlertTriangle size={24} />
            </div>
            <h4 className="text-lg font-serif text-red-700 italic uppercase tracking-tighter mb-2">Critical Action</h4>
            <p className="text-xs text-red-700/60 leading-relaxed mb-6">
              Initiating account termination is irreversible. Current directives and credits will be purged.
            </p>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-4 py-5 bg-red-600 text-white rounded-[1.5rem] text-[9px] uppercase tracking-[0.4em] font-black transition-all active:scale-95 shadow-xl shadow-red-600/20"
            >
              <LogOut size={18} className="stroke-[2.5]" /> Terminate Identity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
