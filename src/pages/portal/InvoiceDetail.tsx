import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Download,
  Printer,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { InvoiceService } from "../../services/invoiceService";
import { PaymentService } from "../../services/paymentService";
import type { InvoiceDetailResponse } from "../../types/invoice";

const PAYMENT_METHODS = [
  { label: "Credit / Debit Card", value: "card" },
  { label: "UPI / QR Code", value: "upi" },
  { label: "Net Banking", value: "netbanking" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const invoiceId = Number(id);
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState<InvoiceDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("upi");

  const loadInvoice = useCallback(async () => {
    try {
      const data = await InvoiceService.getInvoiceById(invoiceId);
      setInvoice(data);
    } catch {
      setInvoice(null);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => { loadInvoice(); }, [loadInvoice]);

  const handlePayment = async () => {
    if (!invoice) return;
    setIsPaying(true);
    try {
      const result = await PaymentService.collectPayment(invoiceId, selectedMethod);
      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else {
        setPaymentSuccess(true);
        await loadInvoice();
      }
    } catch {
      /* silent — button re-enables so user can retry */
    } finally {
      setIsPaying(false);
    }
  };

  const handleDownload = async () => {
    if (!invoice) return;
    try {
      const blob = await InvoiceService.downloadInvoicePdf(invoiceId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* silent */
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="max-w-5xl mx-auto text-center py-24">
        <AlertCircle size={40} className="text-brand-navy/20 mx-auto mb-4" />
        <p className="text-brand-navy/40 text-sm">Invoice not found.</p>
        <Link
          to="/portal/invoices"
          className="mt-6 inline-block text-[10px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors"
        >
          Back to Invoices
        </Link>
      </div>
    );
  }

  const isPaid = invoice.status.toLowerCase() === "paid";
  const effectiveTaxRate =
    invoice.subtotal > 0
      ? Math.round((invoice.taxAmount / invoice.subtotal) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-navy/60 backdrop-blur-sm"
          >
            <div className="bg-white p-12 rounded-xl max-w-md w-full text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-serif text-brand-navy mb-4">Payment Successful.</h2>
              <p className="text-brand-navy/50 text-sm mb-10 leading-relaxed">
                Thank you for your payment. Your receipt has been generated and sent to your email.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  className="w-full bg-brand-navy text-white py-4 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3"
                >
                  <Download size={16} /> Download Receipt
                </button>
                <button
                  onClick={() => navigate("/portal/invoices")}
                  className="w-full py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
                >
                  Return to My Invoices
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 gap-6 sm:gap-0">
        <Link
          to="/portal/invoices"
          className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors"
        >
          <ChevronLeft size={14} /> Back to Invoices
        </Link>
        <div className="flex gap-4 w-full sm:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 sm:flex-initial p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy transition-all rounded-lg flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            <span className="sm:hidden text-[9px] uppercase tracking-widest font-bold">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 sm:flex-initial p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy transition-all rounded-lg flex items-center justify-center gap-2"
          >
            <Download size={18} />
            <span className="sm:hidden text-[9px] uppercase tracking-widest font-bold">Download</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Invoice Body */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-10 md:p-16 rounded-xl border border-brand-navy/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-navy/5 -rotate-45 translate-x-24 -translate-y-24" />

          <div className="flex flex-col sm:flex-row justify-between items-start mb-12 sm:mb-16 relative z-10 gap-8 sm:gap-0">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif text-brand-navy mb-4">Invoice</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-1">Number</p>
              <p className="text-lg font-serif text-brand-navy">{invoice.invoiceNumber}</p>
            </div>
            <div className="sm:text-right flex sm:flex-col justify-between sm:justify-start w-full sm:w-auto">
              <div className="mb-0 sm:mb-6">
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Status</p>
                <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full inline-block ${
                  isPaid ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {invoice.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Issue Date</p>
                <p className="text-sm font-bold text-brand-navy">{formatDate(invoice.invoiceDate)}</p>
              </div>
            </div>
          </div>

          {/* Service Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 p-6 sm:p-8 bg-brand-navy/5 rounded-xl mb-12 sm:mb-16">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Booking Reference</p>
              {invoice.bookingReference ? (
                <Link
                  to={`/portal/bookings`}
                  className="text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors"
                >
                  {invoice.bookingReference}
                </Link>
              ) : (
                <p className="text-sm font-bold text-brand-navy">—</p>
              )}
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Invoice Date</p>
              <p className="text-sm font-bold text-brand-navy">{formatDate(invoice.invoiceDate)}</p>
            </div>
            <div>
              {isPaid && invoice.paidAt ? (
                <>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Paid On</p>
                  <p className="text-sm font-bold text-brand-navy">{formatDate(invoice.paidAt)}</p>
                </>
              ) : invoice.dueDate ? (
                <>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Due Date</p>
                  <p className="text-sm font-bold text-brand-navy">{formatDate(invoice.dueDate)}</p>
                </>
              ) : (
                <>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Customer</p>
                  <p className="text-sm font-bold text-brand-navy">{invoice.customerName}</p>
                </>
              )}
            </div>
          </div>

          {/* Billing Table - Desktop */}
          <div className="mb-12 sm:mb-16 hidden sm:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-navy/5">
                  <th className="text-left py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Description</th>
                  <th className="text-center py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Qty</th>
                  <th className="text-right py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Unit Price</th>
                  <th className="text-right py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5">
                {invoice.lines.map((line) => (
                  <tr key={line.lineId}>
                    <td className="py-6 text-sm text-brand-navy font-serif">{line.description}</td>
                    <td className="py-6 text-center text-sm text-brand-navy/60">{line.quantity}</td>
                    <td className="py-6 text-right text-sm text-brand-navy/60">₹{line.unitPrice.toLocaleString()}</td>
                    <td className="py-6 text-right text-sm font-bold text-brand-navy">₹{line.lineTotal.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Billing List - Mobile */}
          <div className="mb-12 space-y-6 sm:hidden">
            <h4 className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 border-b border-brand-navy/5 pb-4">Line Items</h4>
            {invoice.lines.map((line) => (
              <div key={line.lineId} className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm text-brand-navy font-serif mb-1">{line.description}</p>
                  <p className="text-[10px] text-brand-navy/40 uppercase tracking-widest font-bold">
                    Qty: {line.quantity} × ₹{line.unitPrice.toLocaleString()}
                  </p>
                </div>
                <p className="text-sm font-bold text-brand-navy shrink-0">₹{line.lineTotal.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full sm:max-w-xs space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-navy/40">Subtotal</span>
                <span className="text-brand-navy font-bold">₹{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-navy/40">
                  GST{effectiveTaxRate > 0 ? ` (${effectiveTaxRate}%)` : ""}
                </span>
                <span className="text-brand-navy font-bold">₹{invoice.taxAmount.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-brand-navy/5 flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Net Payable</span>
                <span className="text-3xl sm:text-4xl font-serif text-brand-navy">₹{invoice.totalAmount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment method badge when paid */}
          {isPaid && invoice.paymentMethod && (
            <div className="mt-10 pt-8 border-t border-brand-navy/5 flex items-center gap-3">
              <CheckCircle2 size={16} className="text-green-500" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                Paid via {invoice.paymentMethod}
                {invoice.paidAt ? ` on ${formatDate(invoice.paidAt)}` : ""}
              </p>
            </div>
          )}
        </div>

        {/* Payment Sidebar */}
        <div className="space-y-8">
          {!isPaid && (
            <div className="bg-brand-navy p-10 rounded-xl text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
              <div className="relative z-10">
                <h3 className="text-xl font-serif mb-8">Secure Payment</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-10">
                  Select your preferred payment method to settle this invoice securely.
                </p>

                <div className="space-y-4 mb-10">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all group"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.value}
                        checked={selectedMethod === method.value}
                        onChange={() => setSelectedMethod(method.value)}
                        className="accent-brand-gold"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 group-hover:text-white transition-colors">
                        {method.label}
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="w-full bg-brand-gold text-brand-navy py-5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isPaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{invoice.totalAmount.toLocaleString()} <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-xl border border-brand-navy/5 shadow-sm">
            <h3 className="text-lg font-serif text-brand-navy mb-6">Payment Info</h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <AlertCircle size={18} className="text-brand-gold shrink-0" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 leading-relaxed">
                  Invoices are due within 7 days of issue. Overdue payments may incur a late fee.
                </p>
              </div>
              <div className="flex gap-4">
                <ShieldCheck size={18} className="text-brand-gold shrink-0" />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 leading-relaxed">
                  All transactions are encrypted with 256-bit SSL security.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-brand-gold/10 p-8 rounded-xl border border-brand-gold/20">
            <Info size={24} className="text-brand-gold mb-4" />
            <h4 className="text-sm font-bold text-brand-navy mb-2">Need Help?</h4>
            <p className="text-xs text-brand-navy/60 leading-relaxed mb-6">
              If you have any questions regarding this invoice, please raise a support ticket.
            </p>
            <Link
              to="/portal/support"
              className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors flex items-center gap-2"
            >
              Raise Ticket <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
