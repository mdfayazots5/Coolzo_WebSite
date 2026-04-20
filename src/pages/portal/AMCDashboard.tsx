import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Download,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function AMCDashboard() {
  const hasAMC = true; // Toggle for empty state testing
  
  const activeContract = {
    plan: "Total Care Comprehensive",
    tier: "Comprehensive",
    startDate: "Jan 01, 2026",
    endDate: "Dec 31, 2026",
    visitsIncluded: 4,
    visitsUsed: 1,
    nextVisit: "Apr 24, 2026",
    daysToExpiry: 265
  };

  const visitHistory = [
    { date: "Jan 15, 2026", technician: "Vikram Singh", type: "Preventive Maintenance", report: "#" },
  ];

  if (!hasAMC) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-serif text-brand-navy mb-2">My AMC</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Protect your home's cooling</p>
        </div>

        <div className="bg-white p-12 md:p-20 rounded-sm border border-brand-navy/5 shadow-2xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <ShieldCheck size={64} className="text-brand-gold mx-auto mb-8" />
            <h2 className="text-4xl font-serif text-brand-navy mb-6">No Active Protection Plan.</h2>
            <p className="text-brand-navy/50 text-lg mb-12 leading-relaxed font-light">
              Your AC units are currently not covered by a Coolzo AMC. Join our circle of smart property owners for priority response, unlimited service calls, and proactive maintenance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { title: "Priority Response", icon: <Clock size={20} /> },
                { title: "Unlimited Calls", icon: <ShieldCheck size={20} /> },
                { title: "Free Spare Parts", icon: <ShieldCheck size={20} /> },
              ].map((benefit, i) => (
                <div key={i} className="p-6 bg-brand-navy/5 rounded-sm">
                  <div className="text-brand-gold mb-3 flex justify-center">{benefit.icon}</div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy">{benefit.title}</p>
                </div>
              ))}
            </div>

            <Link to="/amc" className="inline-flex items-center gap-3 bg-brand-navy text-white px-12 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl">
              Explore AMC Plans <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-navy mb-2">AMC Dashboard</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Professional protection active</p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 bg-brand-navy text-white rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-lg">Upgrade Plan</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Contract Card */}
          <div className="bg-brand-navy p-10 rounded-sm text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-12">
                <div>
                  <span className="bg-brand-gold text-brand-navy px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold mb-4 inline-block">{activeContract.tier} Plan</span>
                  <h2 className="text-4xl font-serif">{activeContract.plan}</h2>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Contract Period</p>
                  <p className="text-sm font-bold">{activeContract.startDate} — {activeContract.endDate}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Visit Utilization</p>
                    <p className="text-sm font-bold text-brand-gold">{activeContract.visitsUsed} / {activeContract.visitsIncluded} Used</p>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeContract.visitsUsed / activeContract.visitsIncluded) * 100}%` }}
                      className="h-full bg-brand-gold"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/5 rounded-sm border border-white/10">
                    <p className="text-2xl font-serif text-brand-gold">{activeContract.daysToExpiry}</p>
                    <p className="text-[8px] uppercase tracking-widest font-bold text-white/40">Days to Expiry</p>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">Your plan is healthy. No immediate action required.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visit History */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-xl font-serif text-brand-navy mb-8">Visit History</h3>
            <div className="space-y-4">
              {visitHistory.map((visit, i) => (
                <div key={i} className="flex items-center justify-between p-6 rounded-sm border border-brand-navy/5 hover:bg-brand-navy/5 transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy/40">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{visit.type}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">{visit.date} • {visit.technician}</p>
                    </div>
                  </div>
                  <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-gold hover:border-brand-gold transition-all rounded-sm">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Past Contracts */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <button className="w-full flex items-center justify-between text-brand-navy/40 hover:text-brand-navy transition-colors">
              <h3 className="text-lg font-serif">Past Contracts History</h3>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Next Scheduled Visit */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <Calendar className="text-brand-gold mb-6" size={24} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Next Scheduled Visit</p>
            <h3 className="text-xl font-serif text-brand-navy mb-6">{activeContract.nextVisit}</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-sm text-brand-navy/60">
                <Clock size={16} className="text-brand-gold" />
                <span>10:00 AM – 02:00 PM</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-brand-navy/60">
                <User size={16} className="text-brand-gold" />
                <span>Vikram Singh (Assigned)</span>
              </div>
            </div>

            <button className="w-full bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
              Reschedule Visit
            </button>
          </div>

          {/* Renewal Section (Conditional) */}
          {activeContract.daysToExpiry < 30 && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 p-8 rounded-sm border border-red-100"
            >
              <AlertCircle className="text-red-500 mb-4" size={24} />
              <h4 className="text-sm font-bold text-red-700 mb-2">Plan Expiring Soon</h4>
              <p className="text-xs text-red-600 leading-relaxed mb-6">
                Your protection expires in {activeContract.daysToExpiry} days. Renew now to avoid any lapse in coverage and maintain your priority status.
              </p>
              <button className="w-full bg-red-600 text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-red-700 transition-all">
                Renew Now
              </button>
            </motion.div>
          )}

          {/* AMC Benefits Quick List */}
          <div className="bg-brand-navy/5 p-8 rounded-sm">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-navy mb-6">Your Professional Benefits</h4>
            <div className="space-y-4">
              {[
                "Unlimited Service Calls",
                "24/7 Priority Support",
                "Free Spare Parts Replacement",
                "Annual Gas Refill Included",
                "Digital Health Reports"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-brand-navy/60">
                  <CheckCircle2 size={14} className="text-brand-gold" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
