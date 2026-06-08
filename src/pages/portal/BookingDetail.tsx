import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronLeft,
  ShieldCheck,
  Smartphone,
  MapPin,
  Calendar,
  Phone,
  Star,
  Download,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Info,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { BookingService } from "../../services/bookingService";
import type { BookingDetailResponse } from "../../types/booking";

const STATUS_STEPS = [
  'Booked', 'Assigned', 'En Route', 'Arrived', 'In Progress', 'Completed',
];

function deriveStepStatus(step: string, currentStatus: string): 'completed' | 'current' | 'upcoming' {
  const s = currentStatus?.toLowerCase() ?? '';
  const stepIdx = STATUS_STEPS.findIndex((st) => st.toLowerCase() === step.toLowerCase());
  const currentIdx = (() => {
    if (s.includes('complete') || s.includes('closed') || s.includes('paid')) return 5;
    if (s.includes('progress')) return 4;
    if (s.includes('arrived')) return 3;
    if (s.includes('route')) return 2;
    if (s.includes('assigned')) return 1;
    return 0;
  })();
  if (stepIdx < currentIdx) return 'completed';
  if (stepIdx === currentIdx) return 'current';
  return 'upcoming';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function BookingDetail() {
  const { id } = useParams<{ id: string }>();
  const bookingId = Number(id);

  const [booking, setBooking] = useState<BookingDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [estimateStatus, setEstimateStatus] = useState<'pending' | 'approved' | 'declined'>('pending');

  const loadBooking = useCallback(async () => {
    try {
      const data = await BookingService.getBookingById(bookingId);
      setBooking(data);
    } catch {
      setBooking(null);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => { loadBooking(); }, [loadBooking]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-5xl mx-auto text-center py-24">
        <AlertCircle size={40} className="text-brand-navy/20 mx-auto mb-4" />
        <p className="text-brand-navy/40 text-sm">Booking not found.</p>
        <Link
          to="/portal/bookings"
          className="mt-6 inline-block text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const steps = STATUS_STEPS.map((label, i) => ({
    label,
    status: deriveStepStatus(label, booking.currentStatus),
    time: booking.statusHistory?.[i]?.statusDateUtc
      ? new Date(booking.statusHistory[i].statusDateUtc).toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit',
        })
      : '',
  }));

  const isActive = !booking.isCancelled &&
    !booking.currentStatus?.toLowerCase().includes('complete') &&
    !booking.currentStatus?.toLowerCase().includes('closed');

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link
          to="/portal/bookings"
          className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors"
        >
          <ChevronLeft size={14} /> Back to Bookings
        </Link>
        <div className="flex gap-4">
          {isActive && (
            <button className="px-6 py-2 border border-brand-navy/10 rounded-sm text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
              Reschedule
            </button>
          )}
          {isActive && (
            <button className="px-6 py-2 border border-red-100 rounded-sm text-[9px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-500 hover:text-white transition-all">
              Cancel Job
            </button>
          )}
        </div>
      </div>

      {/* SR Summary */}
      <div className="bg-white p-6 sm:p-8 md:p-12 rounded-sm border border-brand-navy/5 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold">
                Service Request
              </span>
              {booking.currentStatus && (
                <span className="bg-brand-navy text-white px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold">
                  {booking.currentStatus}
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2">
              {booking.bookingReference}
            </h1>
            <p className="text-lg sm:text-xl font-serif text-brand-navy/60 italic">
              {booking.serviceName}
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">
              Created On
            </p>
            <p className="text-sm font-bold text-brand-navy">{formatDateTime(booking.dateCreated)}</p>
          </div>
        </div>
      </div>

      {/* Live Tracker */}
      <div className="bg-brand-navy p-6 sm:p-10 rounded-sm text-white mb-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
        <div className="relative z-10">
          <h3 className="text-xl font-serif mb-10 flex items-center gap-3">
            {isActive && <div className="w-2 h-2 bg-brand-gold rounded-full animate-ping" />}
            {isActive ? 'Live Status Tracker' : 'Status Summary'}
          </h3>

          <div className="relative overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
            <div className="absolute top-5 left-0 min-w-full h-px bg-white/10" />
            <div className="flex justify-between relative z-10 min-w-[600px] sm:min-w-0">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 border-2 transition-all duration-500 scale-90 sm:scale-100 ${
                    step.status === 'completed'
                      ? 'bg-brand-gold border-brand-gold text-brand-navy'
                      : step.status === 'current'
                        ? 'bg-brand-navy border-brand-gold text-brand-gold sm:scale-125 shadow-[0_0_20px_rgba(212,175,55,0.4)]'
                        : 'bg-brand-navy border-white/10 text-white/20'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <div className="text-[10px] font-bold">{i + 1}</div>
                    )}
                  </div>
                  <p className={`text-[9px] uppercase tracking-widest font-bold mb-1 ${
                    step.status === 'upcoming' ? 'text-white/20' : 'text-white'
                  }`}>
                    {step.label}
                  </p>
                  <p className="text-[8px] uppercase tracking-widest font-bold text-white/40 h-3">
                    {step.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {booking.technicianName && (
            <div className="mt-12 p-6 bg-white/5 rounded-sm border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-full border-2 border-brand-gold bg-brand-gold/20 flex items-center justify-center text-brand-gold font-bold text-2xl">
                  {booking.technicianName.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-1">
                    Assigned Technician
                  </p>
                  <p className="text-lg font-serif">{booking.technicianName}</p>
                  {booking.technicianRating && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-0.5 text-brand-gold">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i <= Math.round(booking.technicianRating!) ? 'fill-brand-gold' : 'opacity-30'}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] uppercase tracking-widest font-bold text-white/40">
                        {booking.technicianRating.toFixed(1)} Rating
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {booking.technicianPhone && (
                <div className="flex gap-3">
                  <button className="p-4 bg-white/10 hover:bg-white/20 rounded-sm transition-all">
                    <Phone size={20} />
                  </button>
                  <button className="px-8 py-4 bg-brand-gold text-brand-navy rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-white transition-all">
                    Contact Technician
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Details Column */}
        <div className="lg:col-span-2 space-y-8">

          {/* Cancellation notice */}
          {booking.isCancelled && (
            <div className="bg-red-50 p-6 rounded-sm border border-red-100 flex gap-4">
              <AlertCircle size={20} className="text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">This booking was cancelled.</p>
                {booking.cancellationReason && (
                  <p className="text-xs text-red-600">{booking.cancellationReason}</p>
                )}
              </div>
            </div>
          )}

          {/* Estimate Block — shown only when status suggests pending estimate */}
          {booking.currentStatus?.toLowerCase().includes('estimate') && (
            <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif text-brand-navy">Service Estimate</h3>
                <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${
                  estimateStatus === 'pending' ? 'bg-brand-gold/10 text-brand-gold' :
                  estimateStatus === 'approved' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {estimateStatus === 'pending' ? 'Awaiting Approval' :
                   estimateStatus === 'approved' ? 'Approved' : 'Declined'}
                </span>
              </div>
              <div className="pt-4 border-t border-brand-navy/5 flex justify-between items-end mb-8">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                  Total Estimate
                </span>
                <span className="text-2xl font-serif text-brand-navy">
                  ₹{(booking.totalAmount ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              {estimateStatus === 'pending' && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setEstimateStatus('approved')}
                    className="flex-grow bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all"
                  >
                    Approve & Start Work
                  </button>
                  <button
                    onClick={() => setEstimateStatus('declined')}
                    className="px-8 border border-brand-navy/10 text-brand-navy/40 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Equipment & Address */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
              <Smartphone className="text-brand-gold mb-4" size={20} />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">
                Equipment Info
              </p>
              <p className="text-lg font-serif text-brand-navy">
                {[booking.brandName, booking.acTypeName].filter(Boolean).join(' ') || 'AC Unit'}
              </p>
              {booking.tonnageName && (
                <p className="text-xs text-brand-navy/60 mt-1">{booking.tonnageName}</p>
              )}
            </div>
            <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
              <MapPin className="text-brand-gold mb-4" size={20} />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">
                Service Address
              </p>
              <p className="text-sm font-serif text-brand-navy leading-relaxed">
                {booking.addressLine1}
                {booking.addressLine2 ? `, ${booking.addressLine2}` : ''}<br />
                {booking.cityName} — {booking.pincode}
              </p>
            </div>
          </div>

          {/* Scheduled Date */}
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm flex items-center gap-6">
            <Calendar className="text-brand-gold shrink-0" size={24} />
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">
                Scheduled
              </p>
              <p className="text-lg font-serif text-brand-navy">
                {formatDate(booking.scheduledDate)}
                {booking.scheduledTime ? ` · ${booking.scheduledTime}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
            <h3 className="text-lg font-serif text-brand-navy mb-6">Support & Files</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 bg-brand-navy/5 rounded-sm group hover:bg-brand-navy hover:text-white transition-all">
                <div className="flex items-center gap-3">
                  <Download size={18} className="text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Service Report</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="w-full flex items-center justify-between p-4 bg-brand-navy/5 rounded-sm group hover:bg-brand-navy hover:text-white transition-all">
                <div className="flex items-center gap-3">
                  <Info size={18} className="text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Warranty Details</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <Link
                to="/portal/support/new"
                className="w-full flex items-center justify-between p-4 bg-brand-navy/5 rounded-sm group hover:bg-brand-navy hover:text-white transition-all"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="text-brand-gold" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Raise a Concern</span>
                </div>
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </div>
          </div>

          <div className="bg-brand-gold/10 p-8 rounded-sm border border-brand-gold/20">
            <ShieldCheck className="text-brand-gold mb-4" size={24} />
            <h4 className="text-sm font-bold text-brand-navy mb-2">Coolzo Protection</h4>
            <p className="text-xs text-brand-navy/60 leading-relaxed mb-6">
              This service is covered by our 30-day workmanship guarantee. If the issue persists, we'll
              fix it for free.
            </p>
            <Link
              to="/why-coolzo"
              className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors flex items-center gap-2"
            >
              Learn More <ArrowRight size={12} />
            </Link>
          </div>

          {booking.totalAmount != null && (
            <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">
                Total Amount
              </p>
              <p className="text-3xl font-serif text-brand-navy">
                ₹{booking.totalAmount.toLocaleString('en-IN')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
