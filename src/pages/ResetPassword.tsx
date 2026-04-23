import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, navigate]);

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
                <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-4">New Password.</h2>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-10">
                  Please choose a strong, unique password to secure your Coolzo account.
                </p>
                
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">New Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                      <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-14 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy transition-colors">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Confirm Password</label>
                    <div className="relative">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                      <input required type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>
                  </div>
                  <button type="submit" disabled={!password || password !== confirmPassword} className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                    Reset Password <ArrowRight size={16} />
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
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 size={40} className="text-green-600" />
                </div>
                <h3 className="text-3xl font-serif text-brand-navy mb-4">Success.</h3>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-10">
                  Your password has been successfully reset. Redirecting you to login in 3 seconds...
                </p>
                <Link to="/login" className="text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:text-brand-navy transition-colors">
                  Go to Login Now
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
