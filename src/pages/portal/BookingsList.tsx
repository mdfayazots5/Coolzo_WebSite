import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Clock,
  MoreVertical,
  Download,
  RefreshCw,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { BookingService } from "../../services/bookingService";
import type { BookingListItemResponse } from "../../types/booking";

type BookingStatus = "All" | "Open" | "Completed" | "Cancelled";

function statusColor(status: string): string {
  const s = status?.toLowerCase() ?? '';
  if (s.includes('progress') || s.includes('route') || s.includes('arrived')) return 'text-blue-600 bg-blue-50';
  if (s.includes('scheduled') || s.includes('assigned')) return 'text-brand-gold bg-brand-gold/10';
  if (s.includes('complete') || s.includes('closed')) return 'text-green-600 bg-green-50';
  if (s.includes('cancel')) return 'text-red-600 bg-red-50';
  return 'text-brand-navy/40 bg-brand-navy/5';
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function isOpen(status: string): boolean {
  const s = status?.toLowerCase() ?? '';
  return s.includes('progress') || s.includes('scheduled') || s.includes('assigned') || s.includes('route') || s.includes('arrived');
}

function isCompleted(status: string): boolean {
  const s = status?.toLowerCase() ?? '';
  return s.includes('complete') || s.includes('closed') || s.includes('paid');
}

function isCancelled(status: string): boolean {
  return status?.toLowerCase().includes('cancel') ?? false;
}

export default function BookingsList() {
  const [activeTab, setActiveTab] = useState<BookingStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [bookings, setBookings] = useState<BookingListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchBookings = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await BookingService.getMyBookings(pageNum, 10);
      setBookings(result.items ?? []);
      setHasNext(result.hasNext ?? false);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(page); }, [page]);

  const filtered = bookings.filter((b) => {
    const matchTab =
      activeTab === 'All' ||
      (activeTab === 'Open' && isOpen(b.currentStatus)) ||
      (activeTab === 'Completed' && isCompleted(b.currentStatus)) ||
      (activeTab === 'Cancelled' && isCancelled(b.currentStatus));
    const matchSearch =
      b.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2">My Bookings</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Manage your service history</p>
        </div>

        <div className="flex bg-white p-1 rounded-sm border border-brand-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          {(["All", "Open", "Completed", "Cancelled"] as BookingStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-brand-navy text-white shadow-lg"
                  : "text-brand-navy/40 hover:text-brand-navy"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-6 rounded-sm border border-brand-navy/5 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
          <input
            type="text"
            placeholder="Search by SR# or Service Type..."
            className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button className="flex-1 md:flex-initial px-6 sm:px-8 py-4 border border-brand-navy/10 rounded-sm flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy/5 transition-all">
            <Filter size={16} /> Filters
          </button>
          <button className="flex-1 md:flex-initial px-6 sm:px-8 py-4 border border-brand-navy/10 rounded-sm flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy/5 transition-all">
            <Calendar size={16} /> Dates
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-24">
          <Loader2 className="animate-spin text-brand-gold" size={40} />
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-100 rounded-sm p-6 text-center">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchBookings(page)}
            className="text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Bookings List */}
      {!loading && !error && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((booking) => (
                <motion.div
                  key={booking.bookingId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 md:p-8 rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                    {/* SR & Service */}
                    <div className="flex items-center gap-4 sm:gap-6 lg:w-1/4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                        <Clock size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">
                          {booking.bookingReference}
                        </p>
                        <h3 className="text-base sm:text-lg font-serif text-brand-navy">
                          {booking.serviceName}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-6 lg:gap-8 lg:flex-grow">
                      {/* Date & Time */}
                      <div className="flex items-center gap-4 lg:w-1/3">
                        <Calendar size={18} className="text-brand-navy/20" />
                        <div>
                          <p className="text-sm font-bold text-brand-navy">
                            {formatDate(booking.scheduledDate)}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">
                            {booking.scheduledTime ?? '—'}
                          </p>
                        </div>
                      </div>

                      {/* Technician */}
                      <div className="flex items-center gap-4 lg:w-1/3">
                        <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center">
                          <MoreVertical size={16} className="text-brand-navy/20" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-brand-navy">
                            {booking.technicianName ?? 'Pending Assignment'}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Technician</p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/3 col-span-2 lg:col-auto">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${statusColor(booking.currentStatus)}`}>
                          {booking.currentStatus}
                        </span>

                        <div className="flex items-center gap-2">
                          {isOpen(booking.currentStatus) && (
                            <Link
                              to={`/portal/bookings/${booking.bookingId}`}
                              className="p-3 bg-brand-gold text-brand-navy rounded-sm hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                            >
                              <RefreshCw size={16} />
                            </Link>
                          )}
                          {isCompleted(booking.currentStatus) && (
                            <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy hover:border-brand-navy transition-all rounded-sm">
                              <Download size={16} />
                            </button>
                          )}
                          {booking.currentStatus?.toLowerCase().includes('scheduled') && (
                            <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-red-500 hover:border-red-200 transition-all rounded-sm">
                              <X size={16} />
                            </button>
                          )}
                          <Link
                            to={`/portal/bookings/${booking.bookingId}`}
                            className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-gold hover:border-brand-gold transition-all rounded-sm"
                          >
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-24 bg-white rounded-sm border border-brand-navy/5 border-dashed"
              >
                <div className="w-24 h-24 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search size={40} className="text-brand-navy/20" />
                </div>
                <h3 className="text-2xl font-serif text-brand-navy mb-4">No bookings found.</h3>
                <p className="text-brand-navy/40 text-sm mb-10 max-w-xs mx-auto">
                  We couldn't find any bookings matching your current filters.
                </p>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all"
                >
                  Book Your First Service <ArrowRight size={14} />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && (filtered.length > 0 || page > 1) && (
        <div className="mt-12 flex justify-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-6 h-10 rounded-sm border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="px-4 h-10 flex items-center text-sm text-brand-navy/40">
            Page {page}
          </span>
          <button
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 h-10 rounded-sm border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
