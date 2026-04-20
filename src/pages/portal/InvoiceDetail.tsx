import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  Download, 
  Printer, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Info,
  Smartphone,
  Calendar,
  User,
  AlertCircle
} from "lucide-react";
import { useState } from "react";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const invoice = {
    id: id || "INV-2026-001",
    issueDate: "Apr 10, 2026",
    dueDate: "Apr 17, 2026",
    status: paymentSuccess ? "Paid" : "Unpaid",
    sr: "SR-88291",
    serviceDate: "Apr 09, 2026",
    serviceType: "Precision Repair",
    technician: "Vikram Singh",
    items: [
      { desc: "System Diagnostic Fee", qty: 1, price: 499 },
      { desc: "Capacitor Replacement (2.5mfd)", qty: 1, price: 850 },
      { desc: "Labor Charges", qty: 1, price: 350 },
    ],
    taxRate: 18,
    discount: 0,
  };

  const subtotal = invoice.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = (subtotal * invoice.taxRate) / 100;
  const total = subtotal + tax - invoice.discount;

  const handlePayment = () => {
    setIsPaying(true);
    // Simulate payment gateway
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <AnimatePresence>
        {paymentSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-navy/60 backdrop-blur-sm"
          >
            <div className="bg-white p-12 rounded-sm max-w-md w-full text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-serif text-brand-navy mb-4">Payment Successful.</h2>
              <p className="text-brand-navy/50 text-sm mb-10 leading-relaxed">
                Thank you for your payment. Receipt #RCP-99281 has been generated and sent to your email.
              </p>
              <div className="space-y-4">
                <button className="w-full bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3">
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

      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <Link to="/portal/invoices" className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors">
          <ChevronLeft size={14} /> Back to Invoices
        </Link>
        <div className="flex gap-4">
          <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy transition-all rounded-sm">
            <Printer size={18} />
          </button>
          <button className="p-3 border border-brand-navy/10 text-brand-navy/40 hover:text-brand-navy transition-all rounded-sm">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Invoice Body */}
        <div className="lg:col-span-2 bg-white p-10 md:p-16 rounded-sm border border-brand-navy/5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-navy/5 -rotate-45 translate-x-24 -translate-y-24" />
          
          <div className="flex justify-between items-start mb-16 relative z-10">
            <div>
              <h1 className="text-4xl font-serif text-brand-navy mb-4">Invoice</h1>
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-gold mb-1">Number</p>
              <p className="text-lg font-serif text-brand-navy">{invoice.id}</p>
            </div>
            <div className="text-right">
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Status</p>
                <span className={`text-[9px] uppercase tracking-widest font-bold px-4 py-1.5 rounded-full ${
                  invoice.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-1">Issue Date</p>
                <p className="text-sm font-bold text-brand-navy">{invoice.issueDate}</p>
              </div>
            </div>
          </div>

          {/* Service Reference */}
          <div className="grid md:grid-cols-3 gap-8 p-8 bg-brand-navy/5 rounded-sm mb-16">
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Service Request</p>
              <Link to={`/portal/bookings/${invoice.sr}`} className="text-sm font-bold text-brand-navy hover:text-brand-gold transition-colors">{invoice.sr}</Link>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Service Date</p>
              <p className="text-sm font-bold text-brand-navy">{invoice.serviceDate}</p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Technician</p>
              <p className="text-sm font-bold text-brand-navy">{invoice.technician}</p>
            </div>
          </div>

          {/* Billing Table */}
          <div className="mb-16">
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
                {invoice.items.map((item, i) => (
                  <tr key={i}>
                    <td className="py-6 text-sm text-brand-navy font-serif">{item.desc}</td>
                    <td className="py-6 text-center text-sm text-brand-navy/60">{item.qty}</td>
                    <td className="py-6 text-right text-sm text-brand-navy/60">₹{item.price.toLocaleString()}</td>
                    <td className="py-6 text-right text-sm font-bold text-brand-navy">₹{(item.price * item.qty).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-brand-navy/40">Subtotal</span>
                <span className="text-brand-navy font-bold">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-navy/40">GST ({invoice.taxRate}%)</span>
                <span className="text-brand-navy font-bold">₹{tax.toLocaleString()}</span>
              </div>
              <div className="pt-4 border-t border-brand-navy/5 flex justify-between items-end">
                <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Net Payable</span>
                <span className="text-4xl font-serif text-brand-navy">₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Sidebar */}
        <div className="space-y-8">
          {invoice.status === "Unpaid" && (
            <div className="bg-brand-navy p-10 rounded-sm text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
              <div className="relative z-10">
                <h3 className="text-xl font-serif mb-8">Secure Payment</h3>
                <p className="text-white/40 text-xs leading-relaxed mb-10">
                  Select your preferred payment method to settle this invoice securely.
                </p>
                
                <div className="space-y-4 mb-10">
                  {["Credit / Debit Card", "UPI / QR Code", "Net Banking"].map((method, i) => (
                    <label key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-sm cursor-pointer hover:bg-white/10 transition-all group">
                      <input type="radio" name="payment" className="accent-brand-gold" defaultChecked={i === 0} />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/60 group-hover:text-white transition-colors">{method}</span>
                    </label>
                  ))}
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="w-full bg-brand-gold text-brand-navy py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  {isPaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-brand-navy border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Pay ₹{total.toLocaleString()} <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-sm border border-brand-navy/5 shadow-sm">
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

          <div className="bg-brand-gold/10 p-8 rounded-sm border border-brand-gold/20">
            <Info size={24} className="text-brand-gold mb-4" />
            <h4 className="text-sm font-bold text-brand-navy mb-2">Need Help?</h4>
            <p className="text-xs text-brand-navy/60 leading-relaxed mb-6">
              If you have any questions regarding this invoice, please raise a support ticket.
            </p>
            <Link to="/portal/support" className="text-[9px] uppercase tracking-widest font-bold text-brand-gold hover:text-brand-navy transition-colors flex items-center gap-2">
              Raise Ticket <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
