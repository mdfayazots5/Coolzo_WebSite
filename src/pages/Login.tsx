import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardRoute } from "../utils/roleRoutes";

export default function Login() {
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginOtp, sendOtp } = useAuth();

  const startResendTimer = () => {
    setTimer(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }
    setError(null);
    setIsSendingOtp(true);
    try {
      await sendOtp(mobile.trim());
      setOtpSent(true);
      setOtp("");
      startResendTimer();
    } catch (err: any) {
      const status = (err as any)?.status;
      if (status === 404) {
        setError("No account found with this number. Please register first.");
      } else {
        setError(err?.message ?? "Failed to send OTP. Please try again.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const currentUser = await loginOtp(mobile.trim(), otp.trim());
      // Honour ?returnUrl if present (set by ProtectedRoute when an
      // unauthenticated user tried to deep-link into the portal).
      // Fall back to the role-based dashboard if no returnUrl exists.
      const returnUrl = searchParams.get("returnUrl");
      const destination = returnUrl
        ? decodeURIComponent(returnUrl)
        : getDashboardRoute(currentUser);
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err?.message ?? "Invalid OTP. Please try again.");
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
          <Link to="/" className="text-4xl font-serif font-bold tracking-tighter text-white mb-4 block">
            Coolzo
          </Link>
          <p className="text-white/40 text-[10px] uppercase tracking-[0.4em] font-bold">
            Modern AC Service Solutions
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-xl border border-brand-gold/20 shadow-2xl">
          <h1 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-2 text-center">
            Welcome Back.
          </h1>
          <p className="text-center text-brand-navy/40 text-xs mb-10">
            Enter your mobile number to receive a one-time code.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleVerifyAndLogin}>
            {/* Mobile Number */}
            <div className="space-y-2">
              <label htmlFor="login-mobile" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                Mobile Number
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" aria-hidden="true" />
                  <input
                    id="login-mobile"
                    required
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setMobile(digits);
                      setError(null);
                      if (otpSent) {
                        setOtpSent(false);
                        setOtp("");
                      }
                    }}
                    placeholder="10-digit mobile number"
                    className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-lg pl-14 pr-6 py-4 text-brand-navy text-sm focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={(otpSent && timer > 0) || isSendingOtp || mobile.length !== 10}
                  className="px-5 bg-brand-gold text-brand-navy rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all disabled:opacity-40 whitespace-nowrap"
                >
                  {isSendingOtp
                    ? "Sending..."
                    : otpSent
                    ? timer > 0
                      ? `${timer}s`
                      : "Resend"
                    : "Send OTP"}
                </button>
              </div>
            </div>

            {/* OTP Entry — slides in after send */}
            <AnimatePresence>
              {otpSent && (
                <motion.div
                  key="otp"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="login-otp" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                        Enter 6-Digit OTP
                      </label>
                      <span className="text-[9px] text-brand-navy/30 uppercase tracking-widest font-bold">
                        Sent to {mobile}
                      </span>
                    </div>
                    <input
                      id="login-otp"
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
                      className="w-full bg-brand-navy/5 border border-brand-navy/5 rounded-lg px-6 py-4 text-brand-navy text-center text-2xl font-serif tracking-[0.5em] focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={!otpSent || otp.length < 6 || isSubmitting}
              className="w-full bg-brand-navy text-white py-5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-40"
            >
              {isSubmitting ? "Verifying..." : "Verify & Sign In"}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-brand-navy/5" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="bg-white px-4 text-brand-navy/20">Secure Portal Access</span>
            </div>
          </div>

          <p className="text-center text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
            New to Coolzo?{" "}
            <Link to="/register" className="text-brand-gold hover:text-brand-navy transition-colors">
              Create an account
            </Link>
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
