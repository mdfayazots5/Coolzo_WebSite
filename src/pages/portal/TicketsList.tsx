import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Filter,
  Plus,
  ChevronRight,
  HelpCircle,
  Clock,
  MessageSquare,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TicketService } from "../../services/ticketService";
import type { SupportTicketListItemResponse } from "../../types/ticket";

type TicketStatus = "All" | "Open" | "Resolved";

function statusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'open': return 'text-amber-600 bg-amber-50';
    case 'inprogress':
    case 'in progress': return 'text-blue-600 bg-blue-50';
    case 'resolved': return 'text-green-600 bg-green-50';
    case 'closed': return 'text-brand-navy/40 bg-brand-navy/5';
    default: return 'text-brand-navy/40 bg-brand-navy/5';
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatActivity(dateStr?: string): string {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  return formatDate(dateStr);
}

export default function TicketsList() {
  const [activeTab, setActiveTab] = useState<TicketStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [tickets, setTickets] = useState<SupportTicketListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchTickets = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await TicketService.getMyTickets(pageNum, 10);
      setTickets(result.items ?? []);
      setHasNext(result.hasNext ?? false);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTickets(page); }, [page]);

  const filtered = tickets.filter((t) => {
    const s = t.currentStatus?.toLowerCase() ?? '';
    const matchTab =
      activeTab === 'All' ||
      (activeTab === 'Open' && (s === 'open' || s === 'inprogress' || s === 'in progress')) ||
      (activeTab === 'Resolved' && (s === 'resolved' || s === 'closed'));
    const matchSearch =
      t.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2 grayscale-0">Support Tickets</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Professional Help & Technical Support</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="flex bg-white p-1 rounded-sm border border-brand-navy/5 shadow-sm overflow-x-auto no-scrollbar scroll-smooth flex-grow sm:flex-grow-0">
            {["All", "Open", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TicketStatus)}
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
          <Link
            to="/portal/support/new"
            className="flex items-center justify-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl whitespace-nowrap"
          >
            <Plus size={16} /> Raise New Ticket
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-sm border border-brand-navy/5 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
          <input
            type="text"
            placeholder="Search by Ticket # or Subject..."
            className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 border border-brand-navy/10 rounded-sm flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy/5 transition-all">
          <Filter size={16} /> Category
        </button>
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
            onClick={() => fetchTickets(page)}
            className="text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tickets List */}
      {!loading && !error && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((ticket) => (
                <motion.div
                  key={ticket.supportTicketId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 md:p-8 rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-md transition-all group relative"
                >
                  {ticket.hasUnreadReplies && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                    {/* Ticket Info */}
                    <div className="flex items-center gap-4 sm:gap-6 lg:w-1/3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                            {ticket.ticketNumber}
                          </p>
                          {ticket.hasUnreadReplies && (
                            <span className="w-2 h-2 bg-brand-gold rounded-full" />
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-serif text-brand-navy group-hover:text-brand-gold transition-colors">
                          {ticket.subject}
                        </h3>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-6 lg:gap-8 lg:flex-grow">
                      {/* Date */}
                      <div className="flex items-center gap-4 lg:w-1/3">
                        <Clock size={16} className="text-brand-navy/20" />
                        <div>
                          <p className="text-sm font-bold text-brand-navy">
                            {formatDate(ticket.dateCreated)}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Created Date</p>
                        </div>
                      </div>

                      {/* Last Activity */}
                      <div className="flex items-center gap-4 lg:w-1/3">
                        <div className="text-left">
                          <p className="text-sm font-bold text-brand-navy">
                            {formatActivity(ticket.lastReplyAt)}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Last Activity</p>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/3 col-span-2 lg:col-auto">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${statusColor(ticket.currentStatus)}`}>
                          {ticket.currentStatus}
                        </span>

                        <Link
                          to={`/portal/support/${ticket.supportTicketId}`}
                          className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy hover:border-brand-navy transition-all rounded-sm"
                        >
                          <ChevronRight size={16} />
                        </Link>
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
                  <HelpCircle size={40} className="text-brand-navy/20" />
                </div>
                <h3 className="text-2xl font-serif text-brand-navy mb-4">No support tickets.</h3>
                <p className="text-brand-navy/40 text-sm mb-10 max-w-xs mx-auto">
                  We hope everything is going smoothly! If you need help, we're just a ticket away.
                </p>
                <Link
                  to="/portal/support/new"
                  className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all"
                >
                  Raise New Ticket <ArrowRight size={14} />
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
