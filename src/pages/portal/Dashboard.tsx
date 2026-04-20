import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  Calendar, 
  Smartphone, 
  ArrowRight, 
  Clock, 
  User, 
  ChevronRight,
  FileText,
  HelpCircle,
  Plus,
  Star,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { BookingService, Booking } from "../../services/bookingService";

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const firstName = user?.displayName?.split(' ')[0] || 'User';
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      try {
        const data = await BookingService.getBookings(user.uid);
        setBookings(data);
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const activeJob = bookings.find(b => b.status === 'in-progress' || b.status === 'scheduled');
  const recentBookings = bookings.filter(b => b.status === 'completed').slice(0, 3);

  const upcomingAMC = {
    plan: "Total Care Comprehensive",
    nextVisit: "Apr 24, 2026",
    daysLeft: 14
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Personalized Greeting */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif text-brand-navy mb-2">Good morning, {firstName}.</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">{today}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Active Job Status Card */}
          {activeJob && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-brand-navy p-8 md:p-10 rounded-sm text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="bg-brand-gold text-brand-navy px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold mb-3 inline-block">Active Job</span>
                    <h3 className="text-2xl font-serif">{activeJob.serviceName}</h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">{activeJob.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand-gold text-2xl font-serif mb-1">14 mins</p>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Estimated Arrival</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 rounded-full border-2 border-brand-gold p-1">
                    <img src={activeJob.technician?.image || `https://picsum.photos/seed/${activeJob.id}/100/100`} alt={activeJob.technician?.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-1">{activeJob.technician?.name || 'Assigned Technician'}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5 text-brand-gold">
                        {[1, 2, 3, 4, 5].map(i => <Star key={i} size={10} className="fill-brand-gold" />)}
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/40">Professional Technician</span>
                    </div>
                  </div>
                  <div className="ml-auto hidden sm:block">
                    <div className="flex items-center gap-3 text-brand-gold">
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-ping" />
                      <span className="text-[10px] uppercase tracking-widest font-bold">{activeJob.status}</span>
                    </div>
                  </div>
                </div>

                <Link to={`/portal/bookings/${activeJob.id}`} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl">
                  Track Job <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Quick Action Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Book a Service", icon: <Plus size={20} />, path: "/book", color: "bg-white" },
              { name: "Track My Job", icon: <Clock size={20} />, path: "/portal/bookings", color: "bg-white" },
              { name: "My Invoices", icon: <FileText size={20} />, path: "/portal/invoices", color: "bg-white" },
              { name: "Get Support", icon: <HelpCircle size={20} />, path: "/portal/support", color: "bg-white" },
            ].map((action, i) => (
              <Link 
                key={i} 
                to={action.path}
                className={`${action.color} p-6 rounded-sm border border-brand-navy/5 hover:border-brand-gold/50 transition-all group text-center shadow-sm`}
              >
                <div className="text-brand-navy/30 group-hover:text-brand-gold transition-colors mb-4 flex justify-center">{action.icon}</div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy">{action.name}</p>
              </Link>
            ))}
          </div>

          {/* Recent Bookings Preview */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-serif text-brand-navy">Recent Bookings</h3>
              <Link to="/portal/bookings" className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors">View All History</Link>
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 rounded-sm hover:bg-brand-navy/5 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy/40">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{booking.serviceName}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">{booking.id} • {booking.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {booking.status === 'completed' && (
                      <Link 
                        to={`/portal/feedback/${booking.id}`}
                        className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors px-3 py-1 border border-brand-gold/30 rounded-sm"
                      >
                        Review
                      </Link>
                    )}
                    <span className="text-[9px] uppercase tracking-widest font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{booking.status}</span>
                    <ChevronRight size={16} className="text-brand-navy/20 group-hover:text-brand-gold transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Upcoming AMC Visit Card */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <ShieldCheck className="text-brand-gold mb-6" size={24} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Upcoming AMC Visit</p>
            <h3 className="text-xl font-serif text-brand-navy mb-4">{upcomingAMC.plan}</h3>
            
            <div className="flex items-center justify-between p-4 bg-brand-navy/5 rounded-sm mb-6">
              <div>
                <p className="text-lg font-serif text-brand-navy">{upcomingAMC.nextVisit}</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">Scheduled Date</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-serif text-brand-gold">{upcomingAMC.daysLeft}</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">Days Left</p>
              </div>
            </div>

            <Link to="/portal/amc" className="w-full inline-flex items-center justify-center gap-2 border border-brand-navy/10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all">
              View AMC Details
            </Link>
          </div>

          {/* Promotional Banner */}
          <div className="bg-brand-gold p-8 rounded-sm relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10">
              <span className="bg-brand-navy text-white px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold mb-4 inline-block">Exclusive Offer</span>
              <h3 className="text-2xl font-serif text-brand-navy mb-4 leading-tight">Upgrade to Total Care AMC & Save 20%</h3>
              <p className="text-brand-navy/60 text-xs mb-8 leading-relaxed">Protect your entire home's cooling infrastructure with our most trusted plan.</p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-navy">
                Claim Offer <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* My Equipment Quick View */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif text-brand-navy">My Equipment</h3>
              <Link to="/portal/equipment" className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors">Manage</Link>
            </div>
            <div className="space-y-4">
              {[
                { brand: "Samsung", type: "Split", loc: "Living Room" },
                { brand: "Daikin", type: "Split", loc: "Master Bedroom" },
              ].map((eq, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-sm border border-brand-navy/5">
                  <div className="w-10 h-10 bg-brand-navy/5 rounded-sm flex items-center justify-center text-[10px] font-bold text-brand-navy/40">AC</div>
                  <div>
                    <p className="text-xs font-bold text-brand-navy">{eq.brand} {eq.type}</p>
                    <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">{eq.loc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
