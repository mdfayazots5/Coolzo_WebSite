import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowRight, ShieldCheck, CheckCircle2, ChevronLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function ForgotPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Reset error:", err);
      setError(err.message || "Failed to send reset email");
    } finally {
      setIsSubmitting(false);
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
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-serif font-bold tracking-tighter text-white mb-4 block">Coolzo</Link>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">The Gold Standard of Climate</p>
        </div>

        {/* Card */}
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-sm border border-brand-gold/20 shadow-2xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <Link to="/login" className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy mb-8 transition-colors">
                  <ChevronLeft size={14} /> Back to Login
                </Link>
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-4">Reset Password.</h2>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-6">
                  Enter your registered email address and we'll send you a secure link to reset your password.
                </p>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-sm mb-6 flex items-start gap-3">
                    <AlertCircle size={16} className="text-red-500 mt-0.5" />
                    <p className="text-xs text-red-600 font-medium">{error}</p>
                  </div>
                )}

                <form className="space-y-6" onSubmit={handleReset}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Email Address</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                      <input 
                        required 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com" 
                        className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" 
                      />
                    </div>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                    {isSubmitting ? "Sending..." : "Send Reset Link"} <ArrowRight size={16} />
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={40} className="text-brand-gold" />
                </div>
                <h3 className="text-3xl font-serif text-brand-navy mb-4">Link Sent.</h3>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-10">
                  We've sent a secure password reset link to your email. Please check your inbox and follow the instructions.
                </p>
                <Link to="/login" className="text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:text-brand-navy transition-colors">
                  Return to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
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
