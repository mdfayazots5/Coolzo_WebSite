import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Calendar,
  ChevronRight,
  FileText,
  Download,
  CreditCard,
  AlertCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { InvoiceService } from "../../services/invoiceService";
import type { InvoiceListItemResponse } from "../../types/invoice";

type InvoiceStatus = "All" | "Unpaid" | "Paid" | "Overdue";

function statusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'paid': return 'text-green-600 bg-green-50';
    case 'unpaid': return 'text-amber-600 bg-amber-50';
    case 'overdue': return 'text-red-600 bg-red-50';
    default: return 'text-brand-navy/40 bg-brand-navy/5';
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function InvoicesList() {
  const [activeTab, setActiveTab] = useState<InvoiceStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [invoices, setInvoices] = useState<InvoiceListItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);

  const fetchInvoices = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const result = await InvoiceService.getCustomerInvoices(pageNum, 20);
      setInvoices(result.items ?? []);
      setHasNext(result.hasNext ?? false);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load invoices.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchInvoices(page); }, [page]);

  const filtered = invoices.filter((inv) => {
    const matchTab = activeTab === 'All' || inv.status?.toLowerCase() === activeTab.toLowerCase();
    const matchSearch =
      inv.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.bookingReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalOutstanding = invoices
    .filter((inv) => inv.status === 'Unpaid' || inv.status === 'Overdue')
    .reduce((acc, inv) => acc + (inv.totalAmount ?? 0), 0);

  const handleDownload = async (invoiceId: number, invoiceNumber: string) => {
    try {
      const blob = await InvoiceService.downloadInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* silent — user can retry from invoice detail */
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-2">My Invoices</h1>
          <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">
            Financial self-service portal
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-brand-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          {(["All", "Unpaid", "Paid", "Overdue"] as InvoiceStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all whitespace-nowrap ${
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

      {/* Outstanding Banner */}
      {totalOutstanding > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-100 p-6 sm:p-8 rounded-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-amber-600 mb-1">
                Outstanding Balance
              </p>
              <p className="text-2xl sm:text-3xl font-serif text-brand-navy">
                ₹{totalOutstanding.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
          <button className="w-full md:w-auto bg-brand-navy text-white px-10 py-5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl">
            Pay All Outstanding
          </button>
        </motion.div>
      )}

      {/* Search */}
      <div className="bg-white p-6 rounded-xl border border-brand-navy/5 shadow-sm mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow relative">
          <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-navy/30" />
          <input
            type="text"
            placeholder="Search by Invoice # or Booking Ref..."
            className="w-full bg-brand-navy/5 border border-transparent rounded-lg pl-14 pr-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="px-8 py-4 border border-brand-navy/10 rounded-lg flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:bg-brand-navy/5 transition-all">
          <Calendar size={16} /> Date Range
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
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <button
            onClick={() => fetchInvoices(page)}
            className="text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Invoices List */}
      {!loading && !error && (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((invoice) => (
                <motion.div
                  key={invoice.invoiceId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white p-6 md:p-8 rounded-xl border border-brand-navy/5 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
                    <div className="flex items-center gap-4 sm:gap-6 lg:w-1/4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-gold shrink-0">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">
                          {invoice.invoiceNumber}
                        </p>
                        <h3 className="text-base sm:text-lg font-serif text-brand-navy">
                          {invoice.serviceName ?? 'Service Invoice'}
                        </h3>
                        {invoice.bookingReference && (
                          <p className="text-[9px] uppercase tracking-widest text-brand-navy/20 mt-1">
                            Ref: {invoice.bookingReference}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:flex-row lg:items-center gap-6 lg:gap-8 lg:flex-grow">
                      <div className="flex items-center gap-4 lg:w-1/3">
                        <Calendar size={18} className="text-brand-navy/20" />
                        <div>
                          <p className="text-sm font-bold text-brand-navy">
                            {formatDate(invoice.invoiceDate)}
                          </p>
                          <p className="text-[10px] uppercase tracking-widest text-brand-navy/40">
                            Issue Date
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-center lg:w-1/3">
                        <p className="text-lg font-serif text-brand-navy">
                          ₹{(invoice.totalAmount ?? 0).toLocaleString('en-IN')}
                        </p>
                        <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">
                          Net Payable
                        </p>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end gap-6 lg:w-1/3 col-span-2 lg:col-auto">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${statusColor(invoice.status)}`}>
                          {invoice.status}
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/portal/invoices/${invoice.invoiceId}`}
                            aria-label="View invoice details"
                            className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy hover:border-brand-navy transition-all rounded-lg"
                          >
                            <ChevronRight size={16} aria-hidden="true" />
                          </Link>
                          {(invoice.status === 'Unpaid' || invoice.status === 'Overdue') && (
                            <Link
                              to={`/portal/invoices/${invoice.invoiceId}`}
                              aria-label="Pay invoice"
                              className="p-3 bg-brand-gold text-brand-navy rounded-lg hover:bg-brand-navy hover:text-white transition-all shadow-sm"
                            >
                              <CreditCard size={16} aria-hidden="true" />
                            </Link>
                          )}
                          <button
                            onClick={() => handleDownload(invoice.invoiceId, invoice.invoiceNumber)}
                            aria-label="Download invoice PDF"
                            className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-gold hover:border-brand-gold transition-all rounded-lg"
                          >
                            <Download size={16} aria-hidden="true" />
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
                className="text-center py-24 bg-white rounded-xl border border-brand-navy/5 border-dashed"
              >
                <div className="w-24 h-24 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FileText size={40} className="text-brand-navy/20" />
                </div>
                <h3 className="text-2xl font-serif text-brand-navy mb-4">No invoices yet.</h3>
                <p className="text-brand-navy/40 text-sm mb-10 max-w-xs mx-auto">
                  Invoices appear after a service is completed.
                </p>
                <Link
                  to="/book"
                  className="inline-flex items-center gap-3 bg-brand-navy text-white px-10 py-4 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all"
                >
                  Book a Service <ArrowRight size={14} />
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
            className="px-6 h-10 rounded-lg border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="px-4 h-10 flex items-center text-sm text-brand-navy/40">
            Page {page}
          </span>
          <button
            disabled={!hasNext}
            onClick={() => setPage((p) => p + 1)}
            className="px-6 h-10 rounded-lg border border-brand-navy/5 flex items-center justify-center text-brand-navy/40 hover:bg-brand-navy hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
