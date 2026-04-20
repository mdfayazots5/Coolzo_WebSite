import { motion } from "motion/react";
import { ShieldCheck, Check, Copy, Smartphone, ArrowRight, Calendar, MapPin, Clock } from "lucide-react";
import { useLocation, Link, Navigate } from "react-router-dom";
import { useState } from "react";

export default function BookingConfirmation() {
  const location = useLocation();
  const bookingData = location.state?.bookingData;
  const refNumber = location.state?.ref;
  const [copied, setCopied] = useState(false);

  if (!bookingData) return <Navigate to="/" />;

  const copyRef = () => {
    navigator.clipboard.writeText(refNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Success Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="w-24 h-24 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
          >
            <Check size={48} className="text-brand-navy" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-serif text-brand-navy mb-4"
          >
            Booking Confirmed.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-brand-navy/50 text-lg font-light"
          >
            Your climate curation is scheduled. We've sent a confirmation to {bookingData.contact.email}.
          </motion.p>
        </div>

        {/* Reference Card */}
        <div className="bg-brand-navy p-10 rounded-sm text-white mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-2">Reference Number</p>
              <h2 className="text-4xl font-serif tracking-widest">{refNumber}</h2>
            </div>
            <button 
              onClick={copyRef}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all border border-white/10"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy Reference"}
            </button>
          </div>
        </div>

        {/* Summary Block */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <Calendar className="text-brand-gold mb-4" size={20} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Appointment</p>
            <p className="text-lg font-serif text-brand-navy">
              {new Date(bookingData.appointment.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <p className="text-sm text-brand-navy/60 mt-1">Window: {bookingData.appointment.slot === 'morning' ? '8 AM – 12 PM' : bookingData.appointment.slot === 'afternoon' ? '12 PM – 4 PM' : '4 PM – 7 PM'}</p>
          </div>
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <MapPin className="text-brand-gold mb-4" size={20} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Location</p>
            <p className="text-lg font-serif text-brand-navy line-clamp-1">{bookingData.address.line1}</p>
            <p className="text-sm text-brand-navy/60 mt-1">{bookingData.address.city} — {bookingData.address.pinCode}</p>
          </div>
        </div>

        {/* Next Steps Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl font-serif text-brand-navy mb-10 text-center">What happens next?</h3>
          <div className="space-y-8 max-w-md mx-auto">
            {[
              { title: "Technician Assignment", desc: "A certified technician will be assigned to your booking within 2 hours.", icon: <ShieldCheck size={20} /> },
              { title: "WhatsApp Confirmation", desc: "You'll receive a detailed health-check link and technician profile via WhatsApp.", icon: <Smartphone size={20} /> },
              { title: "Arrival Protocol", desc: "Our technician will call 30 minutes before arrival to confirm the window.", icon: <Clock size={20} /> }
            ].map((step, i) => (
              <div key={i} className="flex gap-6 relative">
                {i < 2 && <div className="absolute left-6 top-10 w-px h-12 bg-brand-navy/10" />}
                <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                  {step.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-brand-navy mb-1">{step.title}</h4>
                  <p className="text-xs text-brand-navy/50 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account CTA */}
        <div className="bg-brand-gold/10 p-12 rounded-sm border border-brand-gold/20 text-center mb-16">
          <ShieldCheck size={40} className="text-brand-gold mx-auto mb-6" />
          <h3 className="text-2xl font-serif text-brand-navy mb-4">Track your curation.</h3>
          <p className="text-brand-navy/60 text-sm leading-relaxed mb-8 max-w-md mx-auto">
            Save this booking and track your technician in real-time by creating a free Coolzo account.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              state={{ email: bookingData.contact.email }}
              className="bg-brand-navy text-white px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl"
            >
              Create Free Account
            </Link>
            <button className="border border-brand-navy/10 text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all">
              Share on WhatsApp
            </button>
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-[0.3em] font-bold transition-colors flex items-center justify-center gap-2">
            Return to Homepage <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
