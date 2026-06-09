import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ChevronLeft,
  Send,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Star,
  X,
  Loader2,
} from "lucide-react";
import { TicketService } from "../../services/ticketService";
import type { SupportTicketDetailResponse } from "../../types/ticket";

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function TicketDetail() {
  const { id } = useParams<{ id: string }>();
  const ticketId = Number(id);

  const [ticket, setTicket] = useState<SupportTicketDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadTicket = useCallback(async () => {
    try {
      const data = await TicketService.getTicketById(ticketId);
      setTicket(data);
    } catch {
      setTicket(null);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => { loadTicket(); }, [loadTicket]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket?.replies]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !ticket) return;
    setSending(true);
    try {
      await TicketService.addReply(ticketId, message);
      setMessage("");
      await loadTicket();
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  const handleClose = async () => {
    if (!ticket) return;
    try {
      await TicketService.closeTicket(ticketId);
      setShowRating(true);
      await loadTicket();
    } catch {
      /* silent */
    }
  };

  const isResolved =
    ticket?.currentStatus?.toLowerCase() === 'resolved' ||
    ticket?.currentStatus?.toLowerCase() === 'closed';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="max-w-5xl mx-auto text-center py-24">
        <AlertCircle size={40} className="text-brand-navy/20 mx-auto mb-4" />
        <p className="text-brand-navy/40 text-sm">Ticket not found.</p>
        <Link
          to="/portal/support"
          className="mt-6 inline-block text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
        >
          Back to Support
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] flex flex-col px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 shrink-0">
        <Link
          to="/portal/support"
          className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors"
        >
          <ChevronLeft size={14} /> Back to Support
        </Link>
        <div className="flex gap-2 sm:gap-4">
          {ticket.canClose && !isResolved && (
            <button
              onClick={handleClose}
              className="px-4 sm:px-6 py-2 border border-green-100 rounded-lg text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-green-600 hover:bg-green-600 hover:text-white transition-all whitespace-nowrap"
            >
              Mark Resolved
            </button>
          )}
          {ticket.canReopen && isResolved && (
            <button
              onClick={async () => { await TicketService.reopenTicket(ticketId); await loadTicket(); }}
              className="px-4 sm:px-6 py-2 border border-amber-100 rounded-lg text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-amber-600 hover:bg-amber-600 hover:text-white transition-all whitespace-nowrap"
            >
              Reopen
            </button>
          )}
          <button className="p-2 text-brand-navy/40 hover:text-brand-navy transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Ticket Info Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-brand-navy/5 shadow-sm mb-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">
              {ticket.ticketNumber}
            </p>
            <h1 className="text-lg sm:text-xl font-serif text-brand-navy leading-tight">
              {ticket.subject}
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
            <span className={`text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-center ${
              isResolved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {ticket.currentStatus}
            </span>
            {ticket.priorityName && (
              <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold text-center">
                {ticket.priorityName}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 border-t md:border-t-0 border-brand-navy/5 pt-4 md:pt-0">
          <div className="sm:text-right">
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Created</p>
            <p className="text-sm font-bold text-brand-navy">{formatDate(ticket.dateCreated)}</p>
          </div>
          {ticket.assignedTo && (
            <div className="sm:text-right">
              <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Assigned To</p>
              <p className="text-sm font-bold text-brand-navy">{ticket.assignedTo}</p>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow bg-white border border-brand-navy/5 rounded-xl shadow-sm flex flex-col overflow-hidden relative mb-6">
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-brand-navy/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-white p-8 sm:p-12 rounded-xl max-w-sm w-full text-center shadow-2xl relative">
              <button
                onClick={() => setShowRating(false)}
                className="absolute top-4 right-4 text-brand-navy/20 hover:text-brand-navy transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h3 className="text-2xl font-serif text-brand-navy mb-2">Issue Resolved</h3>
              <p className="text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold mb-8">
                How was our support?
              </p>
              <div className="flex justify-center gap-2 mb-10">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} onClick={() => setRating(i)} className="group p-1">
                    <Star
                      size={32}
                      className={`transition-all ${
                        i <= rating
                          ? 'text-brand-gold fill-brand-gold'
                          : 'text-brand-navy/10 group-hover:text-brand-gold group-hover:fill-brand-gold'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowRating(false)}
                className="w-full bg-brand-navy text-white py-4 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl"
              >
                Submit Feedback
              </button>
            </div>
          </motion.div>
        )}

        {/* Messages Scroll */}
        <div
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-8 bg-brand-navy/[0.02] no-scrollbar scroll-smooth"
        >
          {/* Original description as first message */}
          <div className="flex flex-col items-end">
            <div className="max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] p-5 sm:p-8 rounded-xl shadow-sm bg-brand-navy text-white">
              <p className="text-sm leading-relaxed">{ticket.description}</p>
            </div>
            <p className="mt-2 text-[8px] uppercase tracking-widest font-bold text-brand-navy/20 font-mono">
              {formatTime(ticket.dateCreated)}
            </p>
          </div>

          {(ticket.replies ?? []).map((reply) => (
            <div
              key={reply.replyId}
              className={`flex flex-col ${reply.isStaff ? 'items-start' : 'items-end'}`}
            >
              <div className={`max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] p-5 sm:p-8 rounded-xl shadow-sm ${
                reply.isStaff
                  ? 'bg-white border border-brand-navy/5 text-brand-navy shadow-lg shadow-brand-navy/5'
                  : 'bg-brand-navy text-white'
              }`}>
                {reply.isStaff && (
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold mb-2">
                    {reply.senderName} • Support Agent
                  </p>
                )}
                <p className="text-sm leading-relaxed">{reply.message}</p>
              </div>
              <p className="mt-2 text-[8px] uppercase tracking-widest font-bold text-brand-navy/20 font-mono">
                {formatTime(reply.dateCreated)}
              </p>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-brand-navy/5 bg-white">
          <form onSubmit={handleSendMessage} className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={isResolved ? "This ticket is resolved" : "Type your reply..."}
              disabled={isResolved || sending}
              className="w-full bg-brand-navy/5 border border-transparent rounded-lg px-4 sm:px-6 py-4 pr-24 sm:pr-32 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors resize-none h-20 sm:h-24 disabled:opacity-50"
            />
            <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 flex items-center">
              <button
                type="button"
                aria-label="Attach file"
                className="p-2 sm:p-3 text-brand-navy/30 hover:text-brand-gold transition-colors hidden sm:block"
              >
                <Paperclip size={18} aria-hidden="true" />
              </button>
              <button
                type="submit"
                aria-label="Send message"
                disabled={isResolved || !message.trim() || sending}
                className="bg-brand-navy text-white p-3 rounded-lg hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg ml-2 disabled:opacity-50"
              >
                {sending ? <Loader2 size={18} className="animate-spin" aria-hidden="true" /> : <Send size={18} aria-hidden="true" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Escalation Note */}
      {ticket.assignedTo && (
        <div className="p-4 sm:p-6 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-4 shrink-0">
          <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-[10px] uppercase tracking-widest font-bold text-blue-700/60 leading-relaxed md:leading-normal">
            Assigned to {ticket.assignedTo} • {ticket.categoryName ?? 'Support Team'}
          </p>
        </div>
      )}
    </div>
  );
}
