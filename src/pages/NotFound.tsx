import { motion } from "motion/react";
import { Search, ArrowRight, Home, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-12"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-8 sm:mb-12 relative">
            <Search size={40} className="text-brand-navy/20 sm:size-48" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-2 border-dashed border-brand-gold/30 rounded-full"
            />
          </div>
          <h1 className="text-6xl sm:text-8xl font-serif text-brand-navy mb-4 sm:mb-6">404</h1>
          <h2 className="text-2xl sm:text-3xl font-serif text-brand-navy mb-4 sm:mb-6 italic">Lost in the Breeze.</h2>
          <p className="text-brand-navy/40 text-base sm:text-lg mb-8 sm:mb-12 leading-relaxed max-w-md mx-auto">
            The page you are looking for has drifted away. Let's get you back to the professional care you deserve.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <Link to="/" className="flex items-center justify-center gap-3 bg-brand-navy text-white px-8 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl">
            <Home size={16} /> Return Home
          </Link>
          <Link to="/contact" className="flex items-center justify-center gap-3 border border-brand-navy/10 text-brand-navy px-8 py-5 rounded-sm text-[10px] uppercase tracking-widest font-bold hover:bg-brand-navy/5 transition-all">
            <HelpCircle size={16} /> Get Support
          </Link>
        </div>

        <div className="mt-24 pt-12 border-t border-brand-navy/5">
          <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/20 mb-6">Popular Destinations</p>
          <div className="flex flex-wrap justify-center gap-8">
            {["Services", "AMC Plans", "About Us", "Blog"].map((link) => (
              <Link key={link} to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-sm font-serif text-brand-navy/40 hover:text-brand-gold transition-colors">
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
