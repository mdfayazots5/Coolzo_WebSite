import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  Send, 
  Paperclip, 
  CheckCircle2, 
  ArrowRight,
  Info,
  X,
  AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NewTicket() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  if (showSuccess) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-sm border border-brand-navy/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-serif text-brand-navy mb-4">Ticket Raised.</h2>
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-gold mb-6">Ticket #TKT-99282</p>
          <p className="text-brand-navy/50 text-sm mb-10 leading-relaxed">
            Your support request has been received. Our team typically responds within 4 working hours. You can track the progress in your tickets list.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/portal/support/TKT-99282")}
              className="w-full bg-brand-navy text-white py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all flex items-center justify-center gap-3"
            >
              View Ticket Details <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => navigate("/portal/support")}
              className="w-full py-4 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors"
            >
              Back to Support
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-12">
        <Link to="/portal/support" className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors mb-8">
          <ChevronLeft size={14} /> Back to Support
        </Link>
        <h1 className="text-4xl font-serif text-brand-navy mb-2">Raise New Ticket</h1>
        <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.3em] font-bold">How can we assist you today?</p>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-sm border border-brand-navy/5 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Subject</label>
            <input 
              required
              type="text" 
              placeholder="Briefly describe the issue"
              className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Category</label>
              <select className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                <option>Booking Issue</option>
                <option>Technician Concern</option>
                <option>Invoice Query</option>
                <option>AMC Query</option>
                <option>App Issue</option>
                <option>General Inquiry</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Related Booking (Optional)</label>
              <select className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors appearance-none" defaultValue="">
                <option value="">None</option>
                <option value="SR-88291">SR-88291 - Precision Repair</option>
                <option value="SR-88210">SR-88210 - Luxury Jet Wash</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Detailed Description</label>
            <textarea 
              required
              placeholder="Please provide as much detail as possible to help us resolve your issue faster."
              className="w-full bg-brand-navy/5 border border-transparent rounded-sm px-6 py-4 text-sm text-brand-navy focus:outline-none focus:border-brand-gold transition-colors h-48 resize-none"
            />
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Attachments (Max 3 files, 5MB each)</label>
            <div className="flex flex-wrap gap-4">
              <button type="button" className="w-24 h-24 border-2 border-dashed border-brand-navy/10 rounded-sm flex flex-col items-center justify-center text-brand-navy/20 hover:border-brand-gold hover:text-brand-gold transition-all">
                <Paperclip size={24} />
                <span className="text-[8px] uppercase tracking-widest font-bold mt-2">Add File</span>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-brand-navy/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4 text-brand-navy/40">
              <AlertCircle size={18} className="text-brand-gold" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Expected response time: 4 Hours</p>
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-brand-navy text-white px-12 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Submit Support Ticket <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-12 p-8 bg-brand-navy/5 rounded-sm flex gap-6">
        <Info size={24} className="text-brand-gold shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-brand-navy mb-2">Urgent Issue?</h4>
          <p className="text-xs text-brand-navy/60 leading-relaxed">
            If you are experiencing an emergency (e.g. electrical fire or major flooding), please call our 24/7 Priority Concierge at <span className="text-brand-navy font-bold">+91 1800-COOLZO</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
