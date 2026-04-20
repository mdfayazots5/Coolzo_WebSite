import { useState } from "react";
import { motion } from "motion/react";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Lock
} from "lucide-react";

const categories = [
  { id: "booking", label: "Booking Confirmations", desc: "Instant confirmation of your service requests", mandatory: true },
  { id: "technician", label: "Technician Updates & ETA", desc: "Live tracking and technician arrival notices" },
  { id: "status", label: "Job Status Changes", desc: "Updates as your service progresses" },
  { id: "payment", label: "Invoice & Payment", desc: "Payment receipts and billing updates" },
  { id: "amc", label: "AMC Reminders", desc: "Proactive maintenance schedule notices" },
  { id: "promo", label: "Promotional Offers", desc: "Exclusive trusted member deals and events" },
  { id: "support", label: "Support Ticket Updates", desc: "Replies to your help requests" },
];

const channels = [
  { id: "whatsapp", label: "WhatsApp", icon: <MessageSquare size={16} /> },
  { id: "email", label: "Email", icon: <Mail size={16} /> },
  { id: "sms", label: "SMS", icon: <Smartphone size={16} /> },
  { id: "push", label: "Push", icon: <Bell size={16} /> },
];

export default function NotificationPreferences() {
  const [preferences, setPreferences] = useState<Record<string, Record<string, boolean>>>({
    booking: { whatsapp: true, email: true, sms: true, push: true },
    technician: { whatsapp: true, email: false, sms: true, push: true },
    status: { whatsapp: false, email: false, sms: false, push: true },
    payment: { whatsapp: true, email: true, sms: false, push: true },
    amc: { whatsapp: true, email: true, sms: true, push: true },
    promo: { whatsapp: false, email: true, sms: false, push: false },
    support: { whatsapp: true, email: true, sms: false, push: true },
  });

  const [showToast, setShowToast] = useState(false);

  const togglePreference = (catId: string, chanId: string) => {
    const category = categories.find(c => c.id === catId);
    if (category?.mandatory) return;

    setPreferences(prev => ({
      ...prev,
      [catId]: {
        ...prev[catId],
        [chanId]: !prev[catId][chanId]
      }
    }));
  };

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-navy mb-2">Notification Preferences</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Control how we communicate with you</p>
      </div>

      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-12 right-12 z-50 bg-brand-navy text-white px-8 py-4 rounded-sm shadow-2xl flex items-center gap-4"
        >
          <CheckCircle2 size={20} className="text-brand-gold" />
          <span className="text-[10px] uppercase tracking-widest font-bold">Preferences Saved Successfully</span>
        </motion.div>
      )}

      <div className="bg-white rounded-sm border border-brand-navy/5 shadow-sm overflow-hidden">
        <div className="p-8 bg-brand-navy/5 border-b border-brand-navy/5 grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Communication Category</p>
          </div>
          <div className="col-span-6 grid grid-cols-4 gap-4 text-center">
            {channels.map(chan => (
              <div key={chan.id} className="flex flex-col items-center gap-2">
                <div className="text-brand-navy/40">{chan.icon}</div>
                <p className="text-[8px] uppercase tracking-widest font-bold text-brand-navy/40">{chan.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="divide-y divide-brand-navy/5">
          {categories.map((cat) => (
            <div key={cat.id} className="p-8 grid grid-cols-12 gap-4 items-center hover:bg-brand-navy/[0.01] transition-colors">
              <div className="col-span-6">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-sm font-bold text-brand-navy">{cat.label}</h3>
                  {cat.mandatory && (
                    <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest font-bold text-brand-gold">
                      <Lock size={10} /> Required
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-navy/40">{cat.desc}</p>
              </div>
              <div className="col-span-6 grid grid-cols-4 gap-4">
                {channels.map(chan => (
                  <div key={chan.id} className="flex justify-center">
                    <button 
                      onClick={() => togglePreference(cat.id, chan.id)}
                      disabled={cat.mandatory}
                      className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                        preferences[cat.id][chan.id] ? 'bg-brand-gold' : 'bg-brand-navy/10'
                      } ${cat.mandatory ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <motion.div 
                        animate={{ x: preferences[cat.id][chan.id] ? 24 : 0 }}
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-8 bg-brand-navy/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4 text-brand-navy/40">
            <ShieldCheck size={20} className="text-brand-gold" />
            <p className="text-[10px] uppercase tracking-widest font-bold">We only send relevant updates — no spam, ever.</p>
          </div>
          <button 
            onClick={handleSave}
            className="w-full md:w-auto bg-brand-navy text-white px-12 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl"
          >
            Save Preferences
          </button>
        </div>
      </div>

      <div className="mt-12 p-8 bg-white rounded-sm border border-brand-navy/5 shadow-sm flex gap-6">
        <Info size={24} className="text-brand-gold shrink-0" />
        <p className="text-xs text-brand-navy/60 leading-relaxed">
          Note: Certain critical communications such as security OTPs, account recovery links, and legal notices are mandatory and will be sent via Email and SMS regardless of these settings.
        </p>
      </div>
    </div>
  );
}
