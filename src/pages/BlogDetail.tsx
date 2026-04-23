import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, User, Clock, Share2, Facebook, Twitter, Instagram, ArrowRight } from "lucide-react";

export default function BlogDetail() {
  const { id } = useParams();

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link to="/blog" className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold mb-12 transition-colors group">
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Registry
        </Link>

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-12 lg:mb-16">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Maintenance Tips</span>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif text-brand-navy mb-10 leading-tight">The Art of Seamless Maintenance.</h1>
          <div className="flex flex-wrap items-center justify-between gap-8 border-y border-brand-navy/5 py-4 lg:py-8">
            <div className="flex flex-wrap items-center gap-6 lg:gap-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-brand-navy rounded-full flex items-center justify-center text-white font-serif italic">S</div>
                <div>
                  <p className="text-xs font-bold text-brand-navy">Sarah Chen</p>
                  <p className="text-[9px] uppercase tracking-widest text-brand-navy/40">Technical Director</p>
                </div>
              </div>
              <div className="flex items-center gap-8 text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">
                <div className="flex items-center gap-2"><Clock size={14} /> 5 min read</div>
                <div>Oct 12, 2025</div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-2 border border-brand-navy/10 rounded-sm hover:border-brand-gold transition-colors text-brand-navy/40 hover:text-brand-gold"><Facebook size={18} /></button>
              <button className="p-2 border border-brand-navy/10 rounded-sm hover:border-brand-gold transition-colors text-brand-navy/40 hover:text-brand-gold"><Twitter size={18} /></button>
              <button className="p-2 border border-brand-navy/10 rounded-sm hover:border-brand-gold transition-colors text-brand-navy/40 hover:text-brand-gold"><Share2 size={18} /></button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto mb-24">
          <img 
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" 
            alt="Blog Detail" 
            className="w-full aspect-video object-cover rounded-sm mb-16 grayscale hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="prose prose-brand max-w-none">
            <p className="text-xl font-serif italic text-brand-navy/70 leading-relaxed mb-12 border-l-4 border-brand-gold pl-8">
              "True comfort is when the systems that support your life are so perfectly curated that they become seamless. In the world of high-spec HVAC, this seamlessness is the ultimate goal of maintenance."
            </p>
            <div className="space-y-8 text-brand-navy/60 text-lg leading-relaxed font-light">
              <p>
                In coastal environments, the challenges facing high-end air conditioning systems are unique. Salt-laden air, high humidity, and extreme temperature fluctuations create a corrosive cocktail that can degrade even the most robust industrial-grade components within months if left unmanaged.
              </p>
              <h2 className="text-3xl font-serif text-brand-navy pt-8">The Corrosion Challenge</h2>
              <p>
                Standard maintenance protocols often overlook the microscopic accumulation of salt crystals on condenser coils. At Coolzo, our professional protocol includes a specialized chemical neutralization wash that doesn't just clean the surface but treats the metal at a molecular level to prevent oxidation.
              </p>
              <p>
                This proactive approach extends the lifecycle of a typical VRV system by up to 40%, ensuring that the architectural integrity of your home remains uncompromised by premature system failure.
              </p>
              <h2 className="text-3xl font-serif text-brand-navy pt-8">Precision Calibration</h2>
              <p>
                Beyond physical cleaning, the 'seamless' part of maintenance lies in the software. Modern smart systems are essentially computers that move air. We perform deep-level sensor calibration to ensure that the cooling curve of your home matches the architectural design intent—silent, steady, and perfectly distributed.
              </p>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="border-t border-brand-navy/5 pt-24">
          <h3 className="text-3xl font-serif text-brand-navy mb-12">Continue Reading</h3>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { title: "Preparing Your Home for Peak Summer", category: "Seasonal Guides", img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" },
              { title: "Energy Efficiency in Modern Architecture", category: "Energy Efficiency", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" }
            ].map((post, i) => (
              <Link key={i} to="/blog" className="group">
                <div className="aspect-[16/9] overflow-hidden rounded-sm mb-6 grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <span className="text-brand-gold text-[9px] uppercase tracking-widest font-bold mb-3 block">{post.category}</span>
                <h4 className="text-2xl font-serif text-brand-navy group-hover:text-brand-gold transition-colors leading-tight">{post.title}</h4>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
