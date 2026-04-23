import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronRight, 
  FileText, 
  Download, 
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";

type InvoiceStatus = "All" | "Unpaid" | "Paid" | "Overdue";

const mockInvoices = [
  { id: "INV-2026-001", sr: "SR-88291", date: "Apr 10, 2026", type: "Precision Repair", amount: 1699, tax: 305, status: "Unpaid", color: "text-amber-600 bg-amber-50" },
  { id: "INV-2026-002", sr: "SR-88210", date: "Mar 12, 2026", type: "Deep Jet Wash", amount: 1200, tax: 216, status: "Paid", color: "text-green-600 bg-green-50" },
  { id: "INV-2026-003", sr: "SR-88195", date: "Feb 28, 2026", type: "Gas Refilling", amount: 2500, tax: 450, status: "Paid", color: "text-green-600 bg-green-50" },
  { id: "INV-2025-098", sr: "SR-87550", date: "Nov 05, 2025", type: "Installation", amount: 4500, tax: 810, status: "Paid", color: "text-green-600 bg-green-50" },
  { id: "INV-2025-085", sr: "SR-87420", date: "Oct 15, 2025", type: "Repair", amount: 850, tax: 153, status: "Overdue", color: "text-red-600 bg-red-50" },
];

export default function InvoicesList() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = mockInvoices.filter(inv => {
    const matchesTab = activeTab === "All" || inv.status === activeTab;
    const matchesSearch = inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.sr.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalOutstanding = mockInvoices
    .filter(inv => inv.status === "Unpaid" || inv.status === "Overdue")
    .reduce((acc, inv) => acc + inv.amount + inv.tax, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2">My Invoices</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">Financial self-service portal</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-sm border border-brand-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          {["All", "Unpaid", "Paid", "Overdue"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as InvoiceStatus)}
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

      {totalOutstanding > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-100 p-6 sm:p-8 rounded-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-1">Outstanding Balance</p>
              <p className="text-2xl sm:text-3xl font-serif text-brand-navy">₹{totalOutstanding.toLocaleString()}</p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-brand-navy text-white px-10 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl">
            Pay All Outstanding
          </button>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-sm border border-brand-navy/5 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
          <input 
            type="text" 
            placeholder="Search by Invoice # or SR #..."
            className="w-full bg-brand-navy/5 border border-transparent rounded-sm pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 border border-brand-navy/10 rounded-sm flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy/5 transition-all">
          <Calendar size={16} /> Date Range
        </button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-6 md:p-8 rounded-sm border border-brand-navy/5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                  {/* Invoice & SR */}
                  <div className="flex items-center gap-4 sm:gap-6 lg:w-1/4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">{invoice.id}</p>
                      <h3 className="text-base sm:text-lg font-serif text-brand-navy">{invoice.type}</h3>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/20 mt-1 whitespace-nowrap">Ref: {invoice.sr}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-6 lg:gap-8 lg:flex-grow">
                    {/* Date */}
                    <div className="flex items-center gap-4 lg:w-1/3">
                      <Clock size={18} className="text-brand-navy/20" />
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{invoice.date}</p>
                        <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">Issue Date</p>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="flex flex-col justify-center lg:w-1/3">
                      <p className="text-lg font-serif text-brand-navy">₹{(invoice.amount + invoice.tax).toLocaleString()}</p>
                      <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">Net Payable</p>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/3 col-span-2 lg:col-auto">
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${invoice.color}`}>
                        {invoice.status}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <Link to={`/portal/invoices/${invoice.id}`} className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy hover:border-brand-navy transition-all rounded-sm">
                          <ChevronRight size={16} />
                        </Link>
                        {(invoice.status === "Unpaid" || invoice.status === "Overdue") && (
                          <Link to={`/portal/invoices/${invoice.id}`} className="p-3 bg-brand-gold text-brand-navy rounded-sm hover:bg-brand-navy hover:text-white transition-all shadow-sm">
                            <CreditCard size={16} />
                          </Link>
                        )}
                        <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-gold hover:border-brand-gold transition-all rounded-sm">
                          <Download size={16} />
                        </button>
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
                <FileText size={40} className="text-brand-navy/20" />
              </div>
              <h3 className="text-2xl font-serif text-brand-navy mb-4">No invoices yet.</h3>
              <p className="text-brand-navy/40 text-sm mb-10 max-w-xs mx-auto">Invoices appear after a service is completed or an AMC is initiated.</p>
              <Link to="/book" className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
                Book a Service <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
