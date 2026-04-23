import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, Lock, Phone, ArrowRight, ShieldCheck, Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithGoogle, register } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: location.state?.email || "",
    mobile: "",
    password: "",
  });

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

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

  const handleVerifyOtp = () => {
    // Simulate verification
    setOtpVerified(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await register(formData.email, password, formData.fullName);
      navigate('/portal');
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    try {
      await loginWithGoogle();
      navigate('/portal');
    } catch (err: any) {
      setError(err.message || "Failed to sign up with Google");
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
          <Link to="/" className="text-4xl font-serif font-bold tracking-tighter text-white mb-4 block">Coolzo</Link>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">The Gold Standard of Climate</p>
        </div>

        {/* Register Card */}
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-sm border border-brand-gold/20 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-8 text-center">Create Account.</h2>
          
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-sm mb-6 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500 mt-0.5" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <input required type="text" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} placeholder="John Doe" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="email@example.com" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Mobile Number</label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <input required type="tel" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} placeholder="+91 98765 43210" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                {!otpVerified && (
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpSent && timer > 0}
                    className="px-6 bg-brand-gold text-brand-navy rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all disabled:opacity-50 whitespace-nowrap"
                  >
                    {otpSent ? (timer > 0 ? `Resend in ${timer}s` : 'Resend') : 'Send OTP'}
                  </button>
                )}
                {otpVerified && (
                  <div className="px-6 bg-green-50 text-green-600 rounded-sm flex items-center gap-2 border border-green-100">
                    <Check size={16} />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Verified</span>
                  </div>
                )}
              </div>
            </div>

            <AnimatePresence>
              {otpSent && !otpVerified && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4 p-6 bg-brand-navy/5 rounded-sm"
                >
                  <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Enter 6-Digit OTP</label>
                  <div className="flex gap-4">
                    <input type="text" maxLength={6} placeholder="000000" className="flex-grow bg-white border border-brand-navy/5 rounded-sm px-6 py-4 text-brand-navy text-center text-xl font-serif tracking-[0.5em] focus:outline-none focus:border-brand-gold transition-colors" />
                    <button 
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-8 bg-brand-navy text-white rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all"
                    >
                      Verify
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <input required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-14 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy transition-colors">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Strength Indicator */}
                <div className="flex gap-1 h-1 mt-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`flex-grow rounded-full transition-all ${i <= getPasswordStrength() ? (getPasswordStrength() <= 2 ? 'bg-red-400' : getPasswordStrength() === 3 ? 'bg-yellow-400' : 'bg-green-400') : 'bg-brand-navy/5'}`} />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
                  <input required type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-sm pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" required className="mt-1 accent-brand-gold" />
                <span className="text-[9px] text-brand-navy/40 uppercase tracking-widest leading-relaxed group-hover:text-brand-navy transition-colors">
                  I accept the <Link to="/terms" className="text-brand-gold underline">Terms of Service</Link> and <Link to="/privacy" className="text-brand-gold underline">Privacy Protocol</Link>.
                </span>
              </label>
            </div>

            <button type="submit" disabled={isSubmitting || !otpVerified || password !== confirmPassword || getPasswordStrength() < 3} className="w-full bg-brand-navy text-white py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
              {isSubmitting ? "Creating Account..." : "Create Account"} <ArrowRight size={16} />
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-navy/5"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-white px-4 text-brand-navy/20">Or sign up with</span></div>
          </div>

          <button 
            type="button" 
            onClick={handleGoogleSignup}
            className="w-full border border-brand-navy/10 py-4 rounded-sm flex items-center justify-center gap-3 hover:bg-brand-navy/5 transition-all mb-10"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy">Sign up with Google</span>
          </button>

          <p className="text-center text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
            Already have an account? <Link to="/login" className="text-brand-gold hover:text-brand-navy transition-colors">Sign in</Link>
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
