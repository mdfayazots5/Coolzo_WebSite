import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Lock, Phone, ArrowRight, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { apiConfig } from "../config/apiConfig";

export default function Login() {
  const [mode, setMode] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { loginWithGoogle, loginEmail } = useAuth();

  const handleSendOtp = () => {
    setOtpSent(true);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await loginEmail(email, password);
      navigate('/portal');
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/portal');
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    }
  };

  const handleDirectLogin = () => {
    // For testing purpose: Bypass formal auth or use demo credentials
    // Here we'll navigate to portal directly as requested for testing
    navigate('/portal');
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
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">Modern AC Service Solutions</p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-10 md:p-12 rounded-sm border border-brand-gold/20 shadow-2xl">
          <h2 className="text-3xl font-serif text-brand-navy mb-8 text-center">Welcome Back.</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-sm mb-6 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Test/Direct Login Box */}
          <div className="bg-brand-navy/5 border border-brand-navy/10 p-6 rounded-sm mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShieldCheck size={16} className="text-brand-gold" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy">Testing Mode</p>
              </div>
            </div>
            <button 
              onClick={handleDirectLogin}
              className="w-full py-4 bg-brand-gold text-brand-navy text-[10px] uppercase tracking-widest font-bold rounded-sm hover:bg-brand-navy hover:text-white transition-all shadow-md flex items-center justify-center gap-2"
            >
              Direct Login <ArrowRight size={14} />
            </button>
            <p className="text-[9px] text-brand-navy/40 mt-3 text-center text-balance italic">Quick access to the portal for development & testing.</p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex bg-brand-navy/5 p-1 rounded-sm mb-10">
            <button 
              onClick={() => setMode("email")}
              className={`flex-grow py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${mode === 'email' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-navy/40 hover:text-brand-navy'}`}
            >
              Email & Password
            </button>
            <button 
              onClick={() => setMode("phone")}
              className={`flex-grow py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${mode === 'phone' ? 'bg-white text-brand-navy shadow-sm' : 'text-brand-navy/40 hover:text-brand-navy'}`}
            >
              Phone & OTP
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === 'email' ? (
              <motion.form 
                key="email"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-6"
                onSubmit={handleEmailLogin}
              >
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
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Password</label>
                    <Link to="/forgot-password" title="Forgot Password" className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors">Forgot?</Link>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                    <input 
                      required 
                      type={showPassword ? "text" : "password"} 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••" 
                      className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-14 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="remember" className="accent-brand-gold" />
                  <label htmlFor="remember" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 cursor-pointer">Stay logged in</label>
                </div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? "Authenticating..." : "Sign In"} <ArrowRight size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="phone"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
                onSubmit={(e) => { e.preventDefault(); navigate('/portal'); }}
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                      <input required type="tel" placeholder="+91 98765 43210" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>
                    <button 
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpSent && timer > 0}
                      className="px-6 bg-brand-gold text-brand-navy rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
                    >
                      {otpSent ? (timer > 0 ? `Resend in ${timer}s` : 'Resend') : 'Send OTP'}
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {otpSent && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-2"
                    >
                      <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Enter 6-Digit OTP</label>
                      <input required type="text" maxLength={6} placeholder="000000" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy text-center text-2xl font-serif tracking-[0.5em] focus:outline-none focus:border-brand-gold transition-colors" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={!otpSent} className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                  Verify & Sign In <ArrowRight size={16} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-navy/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-brand-navy/20">Or continue with</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin}
            type="button"
            className="w-full border border-brand-navy/10 py-4 rounded-sm flex items-center justify-center gap-3 hover:bg-brand-navy/5 transition-all mb-10"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy">Sign in with Google</span>
          </button>

          <p className="text-center text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
            New to Coolzo? <Link to="/register" className="text-brand-gold hover:text-brand-navy transition-colors">Create an account</Link>
          </p>
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
