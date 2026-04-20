import { motion } from "motion/react";
import { Clock, LogIn, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function SessionExpired() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-sm shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-brand-gold" />
          
          <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-8">
            <Clock size={40} className="text-brand-gold" />
          </div>
          
          <h1 className="text-3xl font-serif text-brand-navy mb-4">Session Expired.</h1>
          <p className="text-brand-navy/50 text-sm mb-10 leading-relaxed">
            For your security, your session has timed out due to inactivity. Please log in again to continue accessing your professional portal.
          </p>

          <Link to="/login" className="w-full bg-brand-navy text-white py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl flex items-center justify-center gap-3">
            <LogIn size={16} /> Log In Again <ArrowRight size={16} />
          </Link>

          <div className="mt-8 pt-8 border-t border-brand-navy/5">
            <Link to="/" className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40 hover:text-brand-navy transition-colors">
              Return to Public Website
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
