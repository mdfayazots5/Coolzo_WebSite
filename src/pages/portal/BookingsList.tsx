import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  MoreVertical,
  Download,
  RefreshCw,
  X,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

type BookingStatus = "Open" | "Completed" | "Cancelled" | "All";

const mockBookings = [
  { id: "SR-88291", service: "Precision Repair", date: "Apr 10, 2026", time: "10:00 AM", technician: "Vikram Singh", status: "In Progress", color: "text-blue-600 bg-blue-50" },
  { id: "SR-88285", service: "Deep Jet Wash", date: "Apr 15, 2026", time: "02:00 PM", technician: "Pending Assignment", status: "Scheduled", color: "text-brand-gold bg-brand-gold/10" },
  { id: "SR-88210", service: "Deep Jet Wash", date: "Mar 12, 2026", time: "11:30 AM", technician: "Rahul K.", status: "Completed", color: "text-green-600 bg-green-50" },
  { id: "SR-88195", service: "Gas Refilling", date: "Feb 28, 2026", time: "04:00 PM", technician: "Amit S.", status: "Completed", color: "text-green-600 bg-green-50" },
  { id: "SR-88150", service: "Precision Repair", date: "Jan 15, 2026", time: "09:00 AM", technician: "Vikram Singh", status: "Completed", color: "text-green-600 bg-green-50" },
  { id: "SR-88102", service: "Installation", date: "Dec 20, 2025", time: "10:00 AM", technician: "Suresh M.", status: "Cancelled", color: "text-red-600 bg-red-50" },
];

export default function BookingsList() {
  const [activeTab, setActiveTab] = useState<BookingStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = mockBookings.filter(b => {
    const matchesTab = activeTab === "All" || 
      (activeTab === "Open" && (b.status === "In Progress" || b.status === "Scheduled")) ||
      (activeTab === "Completed" && b.status === "Completed") ||
      (activeTab === "Cancelled" && b.status === "Cancelled");
    
    const matchesSearch = b.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.service.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2">My Bookings</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Manage your service history</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-sm border border-brand-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          {["All", "Open", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as BookingStatus)}
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

      {/* Bookings List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 md:p-8 rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                  {/* SR & Service */}
                  <div className="flex items-center gap-4 sm:gap-6 lg:w-1/4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                      {booking.service.includes("Repair") ? <AlertCircle size={20} /> : booking.service.includes("Wash") ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">{booking.id}</p>
                      <h3 className="text-base sm:text-lg font-serif text-brand-navy">{booking.service}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-6 lg:gap-8 lg:flex-grow">
                    {/* Date & Time */}
                    <div className="flex items-center gap-4 lg:w-1/3">
                      <Calendar size={18} className="text-brand-navy/20" />
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{booking.date}</p>
                        <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">{booking.time}</p>
                      </div>
                    </div>

                    {/* Technician */}
                    <div className="flex items-center gap-4 lg:w-1/3">
                      <div className="w-8 h-8 rounded-full bg-brand-navy/5 flex items-center justify-center">
                        <MoreVertical size={16} className="text-brand-navy/20" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{booking.technician}</p>
                        <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Technician</p>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/3 col-span-2 lg:col-auto">
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${booking.color}`}>
                        {booking.status}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {booking.status === "In Progress" && (
                          <Link to={`/portal/bookings/${booking.id}`} className="p-3 bg-brand-gold text-brand-navy rounded-sm hover:bg-brand-navy hover:text-white transition-all shadow-sm">
                            <RefreshCw size={16} className="animate-spin-slow" />
                          </Link>
                        )}
                        {booking.status === "Completed" && (
                          <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy hover:border-brand-navy transition-all rounded-sm">
                            <Download size={16} />
                          </button>
                        )}
                        {booking.status === "Scheduled" && (
                          <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-red-500 hover:border-red-200 transition-all rounded-sm">
                            <X size={16} />
                          </button>
                        )}
                        <Link to={`/portal/bookings/${booking.id}`} className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-gold hover:border-brand-gold transition-all rounded-sm">
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
              <p className="text-brand-navy/40 text-sm mb-10 max-w-xs mx-auto">We couldn't find any bookings matching your current filters.</p>
              <Link to="/book" className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
                Book Your First Service <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Placeholder */}
      <div className="mt-12 flex justify-center gap-2">
        <button className="w-10 h-10 rounded-sm border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all">1</button>
        <button className="w-10 h-10 rounded-sm border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all">2</button>
        <button className="w-10 h-10 rounded-sm border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all">3</button>
      </div>
    </div>
  );
}
