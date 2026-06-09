import { motion } from "motion/react";
import {
  Check,
  Copy,
  Calendar,
  MapPin,
  Clock,
  User,
  Phone,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Flame,
} from "lucide-react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import type { BookingSummaryResponse } from "../types/booking";
import { useAuth } from "../contexts/AuthContext";

interface ConfirmationState {
  booking: BookingSummaryResponse;
}

function formatSlotDate(dateStr: string): string {
  // dateStr is "YYYY-MM-DD" — parse at noon to avoid UTC-offset day shift
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DetailRow({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/30 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-brand-navy leading-snug">{value}</p>
        {sub && <p className="text-xs text-brand-navy/40 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function BookingConfirmation() {
  const location = useLocation();
  const state = location.state as ConfirmationState | null;
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  if (!state?.booking) return <Navigate to="/" />;

  const { booking } = state;

  const copyRef = () => {
    navigator.clipboard.writeText(booking.bookingReference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const basePrice      = booking.estimatedPrice - booking.emergencySurchargeAmount;
  const hasEmergency   = booking.isEmergency && booking.emergencySurchargeAmount > 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-xl">

        {/* ── Success animation ───────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 10, stiffness: 180 }}
            className="w-20 h-20 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-gold/30"
          >
            <Check size={38} className="text-brand-navy" strokeWidth={3} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-brand-navy mb-2"
          >
            Booking Confirmed!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="text-sm text-brand-navy/50"
          >
            We've received your request and will assign a technician shortly.
          </motion.p>
        </div>

        {/* ── Reference card ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-brand-navy rounded-2xl p-6 mb-6 shadow-xl relative overflow-hidden"
        >
          {/* subtle diagonal highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-36 h-36 bg-brand-gold/10 rounded-full pointer-events-none" />

          <div className="relative flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-brand-gold mb-1.5">
                Booking Reference
              </p>
              <p className="text-xl sm:text-2xl font-bold text-white tracking-widest font-mono">
                {booking.bookingReference}
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                  {booking.status}
                </span>
              </div>
            </div>
            <button
              onClick={copyRef}
              className="shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/10"
            >
              {copied
                ? <Check size={16} className="text-brand-gold" strokeWidth={3} />
                : <Copy size={16} className="text-white/60" />
              }
              <span className="text-[9px] uppercase tracking-wider font-bold text-white/50">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>
        </motion.div>

        {/* ── Booking details card ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 overflow-hidden"
        >
          <div className="px-6 pt-5 pb-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/30">
              Booking Summary
            </p>
          </div>
          <div className="px-6">
            <DetailRow
              icon={<Wrench size={15} />}
              label="Service"
              value={booking.serviceName}
            />
            <DetailRow
              icon={<Calendar size={15} />}
              label="Date"
              value={formatSlotDate(booking.slotDate)}
            />
            <DetailRow
              icon={<Clock size={15} />}
              label="Time Window"
              value={booking.slotLabel}
              sub={booking.isEmergency ? "Emergency — dispatched within 4 hours" : undefined}
            />
            <DetailRow
              icon={<MapPin size={15} />}
              label="Service Address"
              value={booking.addressSummary}
            />
            <DetailRow
              icon={<User size={15} />}
              label="Customer"
              value={booking.customerName}
            />
            <DetailRow
              icon={<Phone size={15} />}
              label="Mobile"
              value={`+91 ${booking.mobileNumber}`}
            />
          </div>

          {/* Price row */}
          <div className="mx-6 mt-1 mb-5 rounded-xl bg-slate-50 border border-slate-100 px-5 py-4">
            {hasEmergency && (
              <>
                <div className="flex justify-between items-center text-sm text-brand-navy/60 mb-1.5">
                  <span>Base service</span>
                  <span className="font-semibold">₹{basePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-amber-600 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Flame size={12} /> Emergency surcharge
                  </span>
                  <span className="font-semibold">
                    + ₹{booking.emergencySurchargeAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="h-px bg-slate-200 mb-2" />
              </>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/30">
                  Estimated Total
                </p>
                <p className="text-xl font-bold text-brand-navy mt-0.5">
                  ₹{booking.estimatedPrice.toLocaleString("en-IN")}
                </p>
              </div>
              <span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-amber-50 text-amber-600 rounded-full border border-amber-100">
                Pay on service
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── What happens next ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm mb-6 p-6"
        >
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/30 mb-5">
            What Happens Next
          </p>
          <div className="space-y-5">
            {[
              {
                icon: <ShieldCheck size={15} />,
                title: "Technician assigned within 2 hours",
                desc: "A verified, background-checked technician will be assigned to your booking.",
              },
              {
                icon: <Smartphone size={15} />,
                title: "WhatsApp confirmation sent",
                desc: `You'll receive the technician's profile and ETA on +91 ${booking.mobileNumber}.`,
              },
              {
                icon: <Clock size={15} />,
                title: "30-minute arrival call",
                desc: "Our technician will call ahead before arriving at your location.",
              },
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 relative">
                {i < 2 && (
                  <div className="absolute left-[17px] top-9 w-px h-5 bg-slate-200" />
                )}
                <div className="w-9 h-9 rounded-xl bg-brand-gold/10 flex items-center justify-center text-brand-gold shrink-0">
                  {step.icon}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-brand-navy leading-snug">
                    {step.title}
                  </p>
                  <p className="text-xs text-brand-navy/40 mt-0.5 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA — portal for logged-in users, register for guests ──────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.44 }}
          className="bg-brand-navy/5 border border-brand-navy/10 rounded-2xl p-6 mb-8 text-center"
        >
          <ShieldCheck size={28} className="text-brand-gold mx-auto mb-3" />
          {isLoggedIn ? (
            <>
              <p className="text-sm font-bold text-brand-navy mb-1">
                Track your booking live
              </p>
              <p className="text-xs text-brand-navy/50 mb-5 leading-relaxed">
                View your technician's status, service history, and manage all your bookings from your portal.
              </p>
              <Link
                to="/portal/bookings"
                className="inline-flex items-center gap-2 bg-brand-navy text-white text-[10px] uppercase tracking-widest font-bold px-8 py-3.5 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all shadow-sm"
              >
                View My Bookings <ArrowRight size={13} />
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-bold text-brand-navy mb-1">
                Track your booking in real-time
              </p>
              <p className="text-xs text-brand-navy/50 mb-5 leading-relaxed">
                Create a free account to follow your technician live, view service history, and get faster bookings next time.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-brand-navy text-white text-[10px] uppercase tracking-widest font-bold px-8 py-3.5 rounded-xl hover:bg-brand-gold hover:text-brand-navy transition-all shadow-sm"
              >
                Create Free Account <ArrowRight size={13} />
              </Link>
            </>
          )}
        </motion.div>

        {/* ── Footer link ─────────────────────────────────────────────────── */}
        <div className="text-center">
          <Link
            to={isLoggedIn ? "/portal" : "/"}
            className="text-[10px] uppercase tracking-[0.25em] font-bold text-brand-navy/30 hover:text-brand-navy transition-colors"
          >
            {isLoggedIn ? "← Return to Portal" : "← Return to Homepage"}
          </Link>
        </div>

      </div>
    </div>
  );
}
