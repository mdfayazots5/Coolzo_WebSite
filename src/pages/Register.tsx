import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Phone, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

type Step = "form" | "otp";

export default function Register() {
  const navigate = useNavigate();
  const { createAccount, loginOtp } = useAuth();

  // ── Step ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("form");

  // ── Form Step ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // ── OTP Step ──────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // ── Shared ────────────────────────────────────────────────────────────────
  const [error, setError] = useState<string | null>(null);

  // ── Step 1: Create account → backend creates user + sends OTP ────────────
  const handleCreateAccount = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsCreating(true);
    // Strip all non-digit characters so "+91 98765 43210" → "919876543210".
    // The backend validator requires ^[0-9]{10,32}$.
    const sanitizedMobile = formData.mobile.replace(/\D/g, "");
    try {
      await createAccount(formData.fullName, sanitizedMobile);
      // Store sanitized number — the OTP verify step uses formData.mobile
      setFormData((prev) => ({ ...prev, mobile: sanitizedMobile }));
      // Account created. OTP has been sent to the mobile.
      setStep("otp");
    } catch (err: any) {
      const msg: string = err?.message ?? "Failed to create account.";
      if (msg.toLowerCase().includes("duplicate") || msg.toLowerCase().includes("already")) {
        setError("An account with this mobile or email already exists. Try signing in instead.");
      } else {
        setError(msg);
      }
    } finally {
      setIsCreating(false);
    }
  };

  // ── Step 2: Verify OTP → auto-login ──────────────────────────────────────
  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setError(null);
    setIsVerifying(true);
    try {
      await loginOtp(formData.mobile.trim(), otp.trim());
      navigate("/portal");
    } catch (err: any) {
      setError(err?.message ?? "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-gold/5 -skew-x-12 -translate-x-1/4" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-serif font-bold tracking-tighter text-white mb-4 block">
            Coolzo
          </Link>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
            The Gold Standard of Climate
          </p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-xl border border-brand-gold/20 shadow-2xl">

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              step === "form" ? "bg-brand-navy text-white" : "bg-green-500 text-white"
            }`}>
              {step === "otp" ? "✓" : "1"}
            </div>
            <div className={`flex-grow h-px transition-all ${step === "otp" ? "bg-brand-gold" : "bg-brand-navy/10"}`} />
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
              step === "otp" ? "bg-brand-navy text-white" : "bg-brand-navy/10 text-brand-navy/30"
            }`}>
              2
            </div>
          </div>

          <AnimatePresence mode="wait">

            {/* ── STEP 1: Account Details ─────────────────────────────────── */}
            {step === "form" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
              >
                <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-2">
                  Create Account.
                </h1>
                <p className="text-brand-navy/40 text-xs mb-10">
                  Fill in your details — we'll send a verification code to your mobile.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleCreateAccount}>
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="reg-name" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                      Full Name
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" aria-hidden="true" />
                      <input
                        id="reg-name"
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-lg pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-2">
                    <label htmlFor="reg-mobile" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" aria-hidden="true" />
                      <input
                        id="reg-mobile"
                        required
                        type="tel"
                        value={formData.mobile}
                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-lg pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
                      />
                    </div>
                    <p className="text-[9px] text-brand-navy/30 uppercase tracking-widest font-bold pl-1">
                      A one-time code will be sent to this number.
                    </p>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      required
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-1 accent-brand-gold"
                    />
                    <span className="text-[9px] text-brand-navy/40 uppercase tracking-widest leading-relaxed group-hover:text-brand-navy transition-colors">
                      I accept the{" "}
                      <Link to="/terms" className="text-brand-gold underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-brand-gold underline">
                        Privacy Protocol
                      </Link>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isCreating || !termsAccepted}
                    className="w-full bg-brand-navy text-white py-5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40"
                  >
                    {isCreating ? "Creating Account..." : "Continue — Send OTP"}
                    <ArrowRight size={16} />
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── STEP 2: OTP Verification ────────────────────────────────── */}
            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 size={24} className="text-green-500 shrink-0" />
                  <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy">
                    Verify Number.
                  </h2>
                </div>
                <p className="text-brand-navy/40 text-xs mb-10">
                  A 6-digit code was sent to{" "}
                  <span className="font-bold text-brand-navy">{formData.mobile}</span>.
                  {" "}Enter it below to complete sign-up.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
                    <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  <div className="space-y-2">
                    <label htmlFor="reg-otp" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                      Enter 6-Digit OTP
                    </label>
                    <input
                      id="reg-otp"
                      autoFocus
                      required
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        setError(null);
                      }}
                      placeholder="000000"
                      className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-lg px-6 py-5 text-brand-navy text-center text-3xl font-serif tracking-[0.6em] focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={otp.length < 6 || isVerifying}
                    className="w-full bg-brand-navy text-white py-5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Sign In"}
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep("form"); setOtp(""); setError(null); }}
                    className="w-full py-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy/30 hover:text-brand-navy transition-colors"
                  >
                    ← Change details
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer link */}
          {step === "form" && (
            <p className="text-center text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mt-10">
              Already have an account?{" "}
              <Link to="/login" className="text-brand-gold hover:text-brand-navy transition-colors">
                Sign in
              </Link>
            </p>
          )}
        </div>

        {/* Trust Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-white/30 text-[9px] uppercase tracking-widest font-bold">
            <ShieldCheck size={14} />
            Secure Authentication Protocol Active
          </div>
        </div>
      </motion.div>
    </div>
  );
}
