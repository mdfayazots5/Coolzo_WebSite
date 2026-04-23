import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ChevronLeft, 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  User,
  ArrowRight,
  MoreVertical,
  Star,
  X
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

export default function TicketDetail() {
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const [isResolved, setIsResolved] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ticket = {
    id: id || "TKT-99281",
    subject: "Water leakage after service",
    status: isResolved ? "Resolved" : "Open",
    priority: "High",
    date: "Apr 09, 2026",
    sr: "SR-88291",
    messages: [
      { id: 1, sender: "customer", text: "Hi, I just had a service done yesterday (SR-88291) and I've noticed water leaking from the indoor unit today. Can you please check?", time: "09:00 AM", attachments: [] },
      { id: 2, sender: "agent", text: "Hello! We're sorry to hear that. I've looked into your service record. It could be a clogged drain pipe or improper leveling. I'm escalating this to our technical team immediately.", time: "09:45 AM", agentName: "Sarah M.", attachments: [] },
      { id: 3, sender: "agent", text: "I've assigned Vikram Singh to visit your location today between 2 PM and 4 PM to fix this. There will be no additional charge.", time: "10:15 AM", agentName: "Sarah M.", attachments: [] },
    ]
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [ticket.messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // In a real app, we'd add the message to the state/DB
    setMessage("");
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] flex flex-col px-4 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 shrink-0">
        <Link to="/portal/support" className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors">
          <ChevronLeft size={14} /> Back to Support
        </Link>
        <div className="flex gap-2 sm:gap-4">
          {!isResolved && (
            <button 
              onClick={() => { setIsResolved(true); setShowRating(true); }}
              className="px-4 sm:px-6 py-2 border border-green-100 rounded-sm text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-green-600 hover:bg-green-600 hover:text-white transition-all whitespace-nowrap"
            >
              Mark Resolved
            </button>
          )}
          <button className="p-2 text-brand-navy/40 hover:text-brand-navy transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Ticket Info Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-sm border border-brand-navy/5 shadow-sm mb-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">{ticket.id}</p>
            <h1 className="text-lg sm:text-xl font-serif text-brand-navy leading-tight">{ticket.subject}</h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 shrink-0">
            <span className={`text-[8px] uppercase tracking-widest font-bold px-3 py-1 rounded-full text-center ${
              isResolved ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {ticket.status}
            </span>
            <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[8px] uppercase tracking-widest font-bold text-center">
              {ticket.priority}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-6 sm:gap-8 border-t md:border-t-0 border-brand-navy/5 pt-4 md:pt-0">
          <div className="sm:text-right">
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Related Job</p>
            <Link to={`/portal/bookings/${ticket.sr}`} className="text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors">{ticket.sr}</Link>
          </div>
          <div className="sm:text-right">
            <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Created</p>
            <p className="text-sm font-bold text-brand-navy">{ticket.date}</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-grow bg-white border border-brand-navy/5 rounded-sm shadow-sm flex flex-col overflow-hidden relative mb-6">
        {showRating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 bg-brand-navy/90 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <div className="bg-white p-8 sm:p-12 rounded-sm max-w-sm w-full text-center shadow-2xl relative">
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
              <p className="text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold mb-8">How was our support?</p>
              
              <div className="flex justify-center gap-2 mb-10">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} className="group p-1">
                    <Star size={32} className="text-brand-navy/10 group-hover:text-brand-gold group-hover:fill-brand-gold transition-all" />
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setShowRating(false)}
                className="w-full bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl"
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
          {ticket.messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[95%] sm:max-w-[85%] lg:max-w-[70%] p-5 sm:p-8 rounded-sm shadow-sm ${
                msg.sender === 'customer' 
                  ? 'bg-brand-navy text-white' 
                  : 'bg-white border border-brand-navy/5 text-brand-navy shadow-lg shadow-brand-navy/5'
              }`}>
                {msg.sender === 'agent' && (
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold mb-2">{msg.agentName} • Support Agent</p>
                )}
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <p className="mt-2 text-[8px] uppercase tracking-widest font-bold text-brand-navy/20 font-mono">{msg.time}</p>
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
              disabled={isResolved}
              className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-4 sm:px-6 py-4 pr-24 sm:pr-32 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors resize-none h-20 sm:h-24 disabled:opacity-50"
            />
            <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 flex items-center">
              <button type="button" className="p-2 sm:p-3 text-brand-navy/30 hover:text-brand-gold transition-colors hidden sm:block">
                <Paperclip size={18} />
              </button>
              <button 
                type="submit"
                disabled={isResolved || !message.trim()}
                className="bg-brand-navy text-white p-3 rounded-sm hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg ml-2 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Escalation Note */}
      <div className="p-4 sm:p-6 bg-blue-50/50 border border-blue-100 rounded-sm flex items-start gap-4 shrink-0">
        <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[10px] uppercase tracking-widest font-bold text-blue-700/60 leading-relaxed md:leading-normal">
          Escalated to Technical Team on Apr 09, 2026 • Currently Assigned to Senior Technical Lead for Investigation
        </p>
      </div>
    </div>
  );
}
