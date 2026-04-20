import { motion } from "motion/react";
import { Settings, Clock, Mail, MessageSquare } from "lucide-react";

export default function Maintenance() {
  return (
    <div className="min-h-screen bg-brand-navy flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-white/5 -skew-x-12 -translate-x-1/4" />
      
      <div className="max-w-3xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-12 relative">
            <Settings size={48} className="text-brand-gold animate-spin-slow" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-0 bg-brand-gold/20 rounded-full blur-xl"
            />
          </div>

          <h1 className="text-6xl md:text-8xl font-serif text-white mb-8">Enhancing Experience.</h1>
          <h2 className="text-2xl font-serif text-brand-gold mb-12 italic">Our digital platform is undergoing scheduled maintenance.</h2>
          
          <p className="text-white/40 text-lg mb-16 leading-relaxed max-w-xl mx-auto font-light">
            We are currently enhancing our platform to serve you better. We expect to be back online shortly. Thank you for your patience.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-lg mx-auto mb-24">
            <div className="p-8 bg-white/5 border border-white/10 rounded-sm">
              <Clock size={24} className="text-brand-gold mx-auto mb-4" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Expected Back By</p>
              <p className="text-lg font-serif text-white">06:00 AM IST</p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-sm">
              <Mail size={24} className="text-brand-gold mx-auto mb-4" />
              <p className="text-[10px] uppercase tracking-widest font-bold text-white/40 mb-1">Urgent Inquiries</p>
              <p className="text-lg font-serif text-white">support@coolzo.com</p>
            </div>
          </div>

          <div className="flex justify-center gap-12">
            <div className="flex items-center gap-3 text-white/20">
              <MessageSquare size={16} />
              <span className="text-[9px] uppercase tracking-widest font-bold">24/7 Priority Support Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
