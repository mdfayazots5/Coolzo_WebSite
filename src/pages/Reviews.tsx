import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Filter, Search, Play, Quote, ShieldCheck } from "lucide-react";

const reviews = [
  { id: 1, name: "Julian V.", service: "Precision Repair", rating: 5, text: "Coolzo understands that climate control is about more than just numbers on a thermostat. It's about the atmosphere of my home.", date: "2 days ago" },
  { id: 2, name: "Elena R.", service: "Deep Jet Wash", rating: 5, text: "The only technician service that respects my home's integrity. Silent professionals, impeccably clean work, and absolute technical precision.", date: "1 week ago" },
  { id: 3, name: "Michael T.", service: "Total Care AMC", rating: 5, text: "Their AMC plan is seamless care. My AC works perfectly year-round without me ever having to place a single maintenance call.", date: "2 weeks ago" },
  { id: 4, name: "Smart Install", service: "Architectural Install", rating: 4, text: "The installation was flawless. They even matched the vent covers to my ceiling's custom paint. Truly professional service.", date: "1 month ago" },
  { id: 5, name: "David K.", service: "Gas Refilling", rating: 5, text: "Quick, professional, and transparent. The digital health report they provided after the service was very detailed.", date: "1 month ago" },
  { id: 6, name: "Isabella M.", service: "Precision Repair", rating: 5, text: "I called them for an emergency at 10 PM on a Sunday. They were here in 45 minutes. Exceptional response time.", date: "2 months ago" },
];

export default function Reviews() {
  const [activeFilter, setActiveFilter] = useState("all");

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header & Stats */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-24">
          <div>
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">The Registry</span>
            <h1 className="text-6xl font-serif text-brand-navy mb-8 leading-tight">Voices of <br />Trust.</h1>
            <p className="text-brand-navy/50 text-xl font-light leading-relaxed mb-12">
              Our reputation is built on the satisfaction of Hyderabad's modern property owners.
            </p>
          </div>
          <div className="bg-white p-12 rounded-sm border border-brand-navy/5 shadow-xl text-center">
            <div className="mb-8">
              <p className="text-7xl font-serif text-brand-navy mb-2">4.8</p>
              <div className="flex justify-center gap-1 text-brand-gold mb-4">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} className="fill-brand-gold" />)}
              </div>
              <p className="text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold">Based on 2,400+ Verified Reviews</p>
            </div>
            <div className="space-y-3 max-w-xs mx-auto">
              {[5, 4, 3, 2, 1].map(star => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 w-4">{star}</span>
                  <div className="flex-grow h-1.5 bg-brand-navy/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-brand-gold" 
                      style={{ width: `${star === 5 ? 85 : star === 4 ? 10 : 5}%` }} 
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 w-8">{star === 5 ? '85%' : star === 4 ? '10%' : '5%'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Video Testimonials Placeholder */}
        <div className="mb-32">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl font-serif text-brand-navy">Cinematic Stories</h3>
            <span className="text-brand-gold text-[10px] uppercase tracking-widest font-bold">Coming Soon</span>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="aspect-video bg-brand-navy relative rounded-sm overflow-hidden group cursor-pointer">
                <img 
                  src={`https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop`} 
                  alt="Video Thumbnail" 
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center text-white group-hover:bg-brand-gold group-hover:text-brand-navy group-hover:border-brand-gold transition-all duration-500">
                    <Play size={32} className="ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-8 left-8 text-white">
                  <p className="text-xl font-serif mb-1">Home Management at Scale</p>
                  <p className="text-[10px] uppercase tracking-widest opacity-60">Featuring Julian Vane</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-12 border-b border-brand-navy/5 pb-8">
          {['all', 'repair', 'cleaning', 'amc', 'installation'].map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${activeFilter === filter ? "bg-brand-navy text-white" : "bg-white text-brand-navy/40 hover:text-brand-navy border border-brand-navy/5"}`}
            >
              {filter === 'all' ? 'All Reviews' : filter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Review Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <AnimatePresence mode="popLayout">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-500 shadow-sm hover:shadow-xl"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1 text-brand-gold">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} className="fill-brand-gold" />)}
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/30">{review.date}</span>
                </div>
                <Quote className="text-brand-gold/10 mb-4" size={32} />
                <p className="text-brand-navy/70 text-lg italic font-serif leading-relaxed mb-8">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-navy/5 rounded-full flex items-center justify-center text-brand-navy font-serif italic">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-navy">{review.name}</p>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">{review.service}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Platform Trust */}
        <div className="text-center py-24 border-t border-brand-navy/5">
          <div className="max-w-2xl mx-auto">
            <ShieldCheck size={48} className="text-brand-gold mx-auto mb-8" />
            <h3 className="text-3xl font-serif text-brand-navy mb-6">Verified Quality.</h3>
            <p className="text-brand-navy/40 text-sm leading-relaxed mb-12">
              Every review on this platform is verified through our service delivery system. We only publish feedback from confirmed Coolzo service completions to ensure absolute integrity.
            </p>
            <button className="text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:text-brand-navy transition-colors">
              Read Our Review Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
