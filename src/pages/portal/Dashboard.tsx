import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Calendar,
  ArrowRight,
  Clock,
  ChevronRight,
  FileText,
  HelpCircle,
  Plus,
  Star,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { BookingService } from "../../services/bookingService";
import { AmcService } from "../../services/amcService";
import { EquipmentService } from "../../services/equipmentService";
import type { BookingListItemResponse } from "../../types/booking";
import type { CustomerAmcResponse } from "../../types/amc";
import type { CustomerEquipmentResponse } from "../../types/equipment";

function statusColor(status: string): string {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('progress') || s.includes('route') || s.includes('arrived')) return 'text-blue-600 bg-blue-50';
  if (s.includes('scheduled') || s.includes('assigned')) return 'text-brand-gold bg-brand-gold/10';
  if (s.includes('complete') || s.includes('paid') || s.includes('closed')) return 'text-green-600 bg-green-50';
  if (s.includes('cancel')) return 'text-red-600 bg-red-50';
  return 'text-brand-navy/40 bg-brand-navy/5';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingListItemResponse[]>([]);
  const [amc, setAmc] = useState<CustomerAmcResponse | null>(null);
  const [equipment, setEquipment] = useState<CustomerEquipmentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.fullName?.split(' ')[0] ?? 'User';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [bookingResult, amcResult, equipmentResult] = await Promise.allSettled([
          BookingService.getMyBookings(1, 10),
          AmcService.getMySubscriptions(),
          EquipmentService.getMyEquipment(),
        ]);

        if (cancelled) return;

        if (bookingResult.status === 'fulfilled') {
          setBookings(bookingResult.value.items ?? []);
        }
        if (amcResult.status === 'fulfilled') {
          setAmc(amcResult.value?.[0] ?? null);
        }
        if (equipmentResult.status === 'fulfilled') {
          setEquipment(equipmentResult.value ?? []);
        }
      } catch {
        // individual failures already handled via allSettled
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const activeJob = bookings.find((b) => {
    const s = b.currentStatus?.toLowerCase() ?? '';
    return s.includes('progress') || s.includes('scheduled') || s.includes('route') || s.includes('assigned');
  });

  const recentCompleted = bookings
    .filter((b) => b.currentStatus?.toLowerCase().includes('complete'))
    .slice(0, 3);

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
      <div className="mb-8 lg:mb-12">
        <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2">
          Good morning, {firstName}.
        </h1>
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
              className="bg-brand-navy p-6 sm:p-8 md:p-10 rounded-sm text-white relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 mb-8">
                  <div>
                    <span className="bg-brand-gold text-brand-navy px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold mb-3 inline-block">
                      Active Job
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif">{activeJob.serviceName}</h3>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mt-1">
                      {activeJob.bookingReference}
                    </p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-brand-gold text-xl sm:text-2xl font-serif mb-1 capitalize">
                      {activeJob.currentStatus}
                    </p>
                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Current Status</p>
                  </div>
                </div>

                {activeJob.technicianName && (
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-14 h-14 shrink-0 rounded-full border-2 border-brand-gold bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-lg">
                      {activeJob.technicianName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold mb-1">{activeJob.technicianName}</p>
                      {activeJob.technicianRating && (
                        <div className="flex items-center gap-2">
                          <div className="flex gap-0.5 text-brand-gold">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star
                                key={i}
                                size={10}
                                className={i <= Math.round(activeJob.technicianRating!) ? 'fill-brand-gold' : 'opacity-30'}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] uppercase tracking-widest font-bold text-white/40">
                            Certified Technician
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-3 text-brand-gold">
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-ping" />
                      <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
                        Live
                      </span>
                    </div>
                  </div>
                )}

                <Link
                  to={`/portal/bookings/${activeJob.bookingId}`}
                  className="inline-flex items-center gap-3 bg-brand-gold text-brand-navy px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl"
                >
                  Track Job <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          )}

          {/* Quick Action Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Book a Service', icon: <Plus size={20} />, path: '/book' },
              { name: 'Track My Job', icon: <Clock size={20} />, path: '/portal/bookings' },
              { name: 'My Invoices', icon: <FileText size={20} />, path: '/portal/invoices' },
              { name: 'Get Support', icon: <HelpCircle size={20} />, path: '/portal/support' },
            ].map((action) => (
              <Link
                key={action.name}
                to={action.path}
                className="bg-white p-6 rounded-sm border border-brand-navy/5 hover:border-brand-gold/50 transition-all group text-center shadow-sm"
              >
                <div className="text-brand-navy/30 group-hover:text-brand-gold transition-colors mb-4 flex justify-center">
                  {action.icon}
                </div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy">
                  {action.name}
                </p>
              </Link>
            ))}
          </div>

          {/* Recent Completed Bookings */}
          {recentCompleted.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-brand-navy/5 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-8">
                <h3 className="text-xl font-serif text-brand-navy">Recent Bookings</h3>
                <Link
                  to="/portal/bookings"
                  className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
                >
                  View All History
                </Link>
              </div>
              <div className="space-y-4">
                {recentCompleted.map((booking) => (
                  <div
                    key={booking.bookingId}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-sm hover:bg-brand-navy/5 transition-colors group gap-4 sm:gap-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy/40 shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{booking.serviceName}</p>
                        <p className="text-[9px] uppercase tracking-widest text-brand-navy/40 whitespace-nowrap">
                          {booking.bookingReference} •{' '}
                          {new Date(booking.scheduledDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${statusColor(booking.currentStatus)}`}>
                        {booking.currentStatus}
                      </span>
                      <ChevronRight
                        size={16}
                        className="text-brand-navy/20 group-hover:text-brand-gold transition-colors hidden sm:block"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">

          {/* Upcoming AMC Visit Card */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <ShieldCheck className="text-brand-gold mb-6" size={24} />
            {amc ? (
              <>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">
                  Upcoming AMC Visit
                </p>
                <h3 className="text-xl font-serif text-brand-navy mb-4">{amc.planName}</h3>
                <div className="flex items-center justify-between p-4 bg-brand-navy/5 rounded-sm mb-6">
                  <div>
                    <p className="text-lg font-serif text-brand-navy">
                      {amc.nextVisitDate
                        ? new Date(amc.nextVisitDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'TBD'}
                    </p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">
                      Next Visit
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-serif text-brand-gold">{amc.visitsRemaining}</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">
                      Visits Left
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">
                  No Active AMC
                </p>
                <p className="text-sm text-brand-navy/50 mb-4 leading-relaxed">
                  Protect your ACs with a comprehensive annual maintenance plan.
                </p>
              </>
            )}
            <Link
              to="/portal/amc"
              className="w-full inline-flex items-center justify-center gap-2 border border-brand-navy/10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy hover:text-white transition-all"
            >
              {amc ? 'View AMC Details' : 'Explore AMC Plans'}
            </Link>
          </div>

          {/* Promotional Banner */}
          <div className="bg-brand-gold p-8 rounded-sm relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="relative z-10">
              <span className="bg-brand-navy text-white px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold mb-4 inline-block">
                Exclusive Offer
              </span>
              <h3 className="text-2xl font-serif text-brand-navy mb-4 leading-tight">
                Upgrade to Total Care AMC &amp; Save 20%
              </h3>
              <p className="text-brand-navy/60 text-xs mb-8 leading-relaxed">
                Protect your entire home's cooling infrastructure with our most trusted plan.
              </p>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-brand-navy">
                Claim Offer{' '}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* My Equipment Quick View */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-serif text-brand-navy">My Equipment</h3>
              <Link
                to="/portal/equipment"
                className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
              >
                Manage
              </Link>
            </div>
            {equipment.length > 0 ? (
              <div className="space-y-4">
                {equipment.slice(0, 3).map((eq) => (
                  <div
                    key={eq.equipmentId}
                    className="flex items-center gap-4 p-3 rounded-sm border border-brand-navy/5"
                  >
                    <div className="w-10 h-10 bg-brand-navy/5 rounded-sm flex items-center justify-center text-[10px] font-bold text-brand-navy/40">
                      AC
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-navy">
                        {eq.brand} {eq.name}
                      </p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">
                        {eq.location ?? eq.type}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-brand-navy/40 text-center py-4">
                No equipment registered yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
