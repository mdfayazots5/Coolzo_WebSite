import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronRight, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

type TicketStatus = "All" | "Open" | "In Progress" | "Resolved" | "Closed";

const mockTickets = [
  { id: "TKT-99281", subject: "Water leakage after service", date: "Apr 09, 2026", status: "Open", lastReply: "2 hours ago", unread: true, color: "text-amber-600 bg-amber-50" },
  { id: "TKT-99250", subject: "Invoice query - duplicate charge", date: "Apr 05, 2026", status: "In Progress", lastReply: "1 day ago", unread: false, color: "text-blue-600 bg-blue-50" },
  { id: "TKT-99102", subject: "AMC renewal discount not applied", date: "Mar 20, 2026", status: "Resolved", lastReply: "Mar 22, 2026", unread: false, color: "text-green-600 bg-green-50" },
  { id: "TKT-98850", subject: "Technician was late", date: "Feb 15, 2026", status: "Closed", lastReply: "Feb 16, 2026", unread: false, color: "text-brand-navy/40 bg-brand-navy/5" },
];

export default function TicketsList() {
  const [activeTab, setActiveTab] = useState<TicketStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTickets = mockTickets.filter(t => {
    const matchesTab = activeTab === "All" || t.status === activeTab;
    const matchesSearch = t.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-navy mb-2">Support Tickets</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">We're here to help you</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex bg-white p-1 rounded-sm border border-brand-navy/5 shadow-sm">
            {["All", "Open", "Resolved"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as TicketStatus)}
                className={`px-6 py-3 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${
                  activeTab === tab 
                    ? "bg-brand-navy text-white shadow-lg" 
                    : "text-brand-navy/40 hover:text-brand-navy"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <Link to="/portal/support/new" className="flex items-center justify-center gap-3 bg-brand-navy text-white px-8 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl">
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

      {/* Tickets List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 md:p-8 rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-md transition-all group relative"
              >
                {ticket.unread && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-brand-gold" />
                )}
                
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Ticket Info */}
                  <div className="flex items-center gap-6 lg:w-1/3">
                    <div className="w-12 h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">{ticket.id}</p>
                        {ticket.unread && <span className="w-2 h-2 bg-brand-gold rounded-full" />}
                      </div>
                      <h3 className="text-lg font-serif text-brand-navy group-hover:text-brand-gold transition-colors">{ticket.subject}</h3>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-4 lg:w-1/5">
                    <Clock size={18} className="text-brand-navy/20" />
                    <div>
                      <p className="text-sm font-bold text-brand-navy">{ticket.date}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Created Date</p>
                    </div>
                  </div>

                  {/* Last Reply */}
                  <div className="flex items-center gap-4 lg:w-1/5">
                    <div className="text-right lg:text-left">
                      <p className="text-sm font-bold text-brand-navy">{ticket.lastReply}</p>
                      <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Last Activity</p>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/4 ml-auto">
                    <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${ticket.color}`}>
                      {ticket.status}
                    </span>
                    
                    <Link to={`/portal/support/${ticket.id}`} className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy hover:border-brand-navy transition-all rounded-sm">
                      <ChevronRight size={16} />
                    </Link>
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
              <p className="text-brand-navy/40 text-sm mb-10 max-w-xs mx-auto">We hope everything is going smoothly! If you need help, we're just a ticket away.</p>
              <Link to="/portal/support/new" className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
                Raise New Ticket <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
