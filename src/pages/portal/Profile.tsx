import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  LogOut,
  MapPin,
  HelpCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { ProfileService } from "../../services/profileService";
import type { CustomerProfileResponse } from "../../types/auth";

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile]             = useState<CustomerProfileResponse | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isEditing, setIsEditing]         = useState(false);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [toast, setToast]                 = useState<string | null>(null);

  const [formData, setFormData] = useState({
    displayName: "",
    email:       "",
    mobile:      "",
  });

  // ── Load profile ─────────────────────────────────────────────────────────────
  useEffect(() => {
    ProfileService.getMyProfile()
      .then((p) => {
        setProfile(p);
        setFormData({
          displayName: p.customerName  ?? "",
          email:       p.emailAddress  ?? "",
          mobile:      p.mobileNumber  ?? "",
        });
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ── Save profile ──────────────────────────────────────────────────────────────
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await ProfileService.updateMyProfile({
        customerName: formData.displayName,
        emailAddress: formData.email,
        mobileNumber: formData.mobile,
      });
      setIsEditing(false);
      showToast("Profile updated successfully");
    } catch {
      /* silent — user can retry */
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Sign out ──────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch { /* silent */ }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-brand-gold" size={32} />
      </div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    formData.displayName || "U",
  )}&background=1B2A4A&color=C9A84C`;

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Page title ───────────────────────────────────────────────────────── */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-brand-navy">My Profile</h1>
        <p className="text-sm text-brand-navy/40 mt-1">
          Manage your account details
        </p>
      </div>

      {/* ── Toast ────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed bottom-28 left-4 right-4 sm:left-auto sm:right-6 sm:w-72 z-50 bg-brand-navy text-white px-5 py-3.5 rounded-xl shadow-xl flex items-center gap-3"
          >
            <CheckCircle2 size={16} className="text-brand-gold shrink-0" />
            <span className="text-sm font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Unified profile card ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">

        {/* ── Avatar header ───────────────────────────────────────────────────── */}
        <div className="bg-brand-navy px-6 py-8 flex flex-col items-center text-center">
          <div className="w-[72px] h-[72px] rounded-full overflow-hidden ring-2 ring-brand-gold/40 ring-offset-2 ring-offset-brand-navy mb-4 shrink-0">
            <img
              src={profile?.photoUrl || avatarUrl}
              alt="Profile photo"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h3 className="font-bold text-white text-sm leading-snug">
            {formData.displayName || "—"}
          </h3>
          <p className="text-[11px] text-white/40 mt-1 truncate max-w-full px-2">
            {formData.email}
          </p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-brand-gold" />
              <span className="text-[10px] font-semibold text-brand-gold tracking-wide">
                Verified Account
              </span>
            </div>
            <span className="text-white/20 text-xs">·</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <span className="text-[10px] font-semibold text-green-400 tracking-wide">Active</span>
            </div>
          </div>
        </div>

        {/* ── Personal Information header row ─────────────────────────────────── */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-brand-navy">Personal Information</h2>
            <p className="text-xs text-brand-navy/40 mt-0.5">
              Your name and contact details used for bookings and service coordination
            </p>
          </div>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-brand-navy/50 hover:text-brand-navy transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-50 shrink-0"
            >
              Edit
            </button>
          )}
        </div>

        {/* ── Contact fields ──────────────────────────────────────────────────── */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">

            {/* Full Name — only editable field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-brand-navy/50 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy/25 pointer-events-none"
                />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Your full name"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-brand-navy placeholder:text-brand-navy/25 focus:outline-none focus:border-brand-gold focus:bg-white transition-all disabled:text-brand-navy/60 disabled:cursor-default"
                />
              </div>
            </div>

            {/* Email — editable */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-brand-navy/50 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy/25 pointer-events-none"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Your email address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-brand-navy placeholder:text-brand-navy/25 focus:outline-none focus:border-brand-gold focus:bg-white transition-all disabled:text-brand-navy/60 disabled:cursor-default"
                />
              </div>
            </div>

            {/* Mobile — read-only (OTP login anchor + technician coordination) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-brand-navy/50 uppercase tracking-wide">
                Mobile Number
              </label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-navy/25 pointer-events-none"
                />
                <input
                  type="tel"
                  value={formData.mobile}
                  disabled
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2.5 text-sm text-brand-navy/50 cursor-default"
                />
              </div>
              <p className="text-[10px] text-brand-navy/30 pl-0.5">
                To update, raise a{" "}
                <Link to="/portal/support" className="text-brand-gold hover:underline">
                  support ticket
                </Link>
              </p>
            </div>

          </div>

          {/* Save / Cancel — only when editing */}
          {isEditing && (
            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-brand-navy/50 hover:text-brand-navy transition-colors rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.displayName.trim() || !formData.email.trim()}
                className="px-5 py-2 bg-brand-navy text-white text-sm font-semibold rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting && <Loader2 size={13} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          )}
        </form>

      </div>

      {/* ── Account Settings ──────────────────────────────────────────────────── */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-[11px] font-semibold text-brand-navy/40 uppercase tracking-widest mb-4">
          Account Settings
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">

          <Link
            to="/portal/addresses"
            className="group bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-gold/25 transition-all duration-200 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-navy/30 group-hover:text-brand-gold transition-all shrink-0">
              <MapPin size={17} strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-brand-navy text-sm leading-tight">My Addresses</p>
              <p className="text-[11px] text-brand-navy/40 mt-0.5">Manage your service locations</p>
            </div>
            <ChevronRight
              size={14}
              className="text-brand-navy/20 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </Link>

          <Link
            to="/portal/support"
            className="group bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-brand-gold/25 transition-all duration-200 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-navy/30 group-hover:text-brand-gold transition-all shrink-0">
              <HelpCircle size={17} strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-brand-navy text-sm leading-tight">Support Tickets</p>
              <p className="text-[11px] text-brand-navy/40 mt-0.5">View issues and raise new requests</p>
            </div>
            <ChevronRight
              size={14}
              className="text-brand-navy/20 group-hover:text-brand-gold group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </Link>

        </div>
      </div>

      {/* ── Sign Out ──────────────────────────────────────────────────────────── */}
      <div className="mt-6 sm:mt-8">
        <h2 className="text-[11px] font-semibold text-brand-navy/40 uppercase tracking-widest mb-4">
          Session
        </h2>
        <button
          type="button"
          onClick={handleLogout}
          className="group w-full bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-red-100 transition-all duration-200 flex items-center gap-4 text-left"
        >
          <div className="w-10 h-10 bg-slate-50 group-hover:bg-red-50 rounded-lg flex items-center justify-center text-brand-navy/30 group-hover:text-red-400 transition-all shrink-0">
            <LogOut size={17} strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-brand-navy text-sm leading-tight group-hover:text-red-600 transition-colors">
              Sign Out
            </p>
            <p className="text-[11px] text-brand-navy/40 mt-0.5">
              End your current session securely
            </p>
          </div>
          <ChevronRight
            size={14}
            className="text-brand-navy/20 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </button>
      </div>

    </div>
  );
}
