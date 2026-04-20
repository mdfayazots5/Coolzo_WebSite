import { motion } from "motion/react";
import { AlertCircle, RefreshCw, HelpCircle, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-12">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <h1 className="text-5xl font-serif text-brand-navy mb-6">Something went wrong.</h1>
          <p className="text-brand-navy/40 text-lg mb-12 leading-relaxed max-w-md mx-auto">
            We've encountered a technical disturbance. Our technicians are already looking into it.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-lg mx-auto">
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-3 bg-brand-navy text-white px-10 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl"
          >
            <RefreshCw size={16} /> Retry Connection
          </button>
          <Link to="/contact" className="flex items-center justify-center gap-3 border border-brand-navy/10 text-brand-navy px-10 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy/5 transition-all">
            <HelpCircle size={16} /> Contact Support
          </Link>
        </div>

        <div className="mt-24">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold transition-colors">
            <ChevronLeft size={14} /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
