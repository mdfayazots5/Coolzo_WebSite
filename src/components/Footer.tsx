import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, ShieldCheck, Clock, Gem } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tighter mb-8 block">Coolzo</Link>
            <p className="text-white/40 text-sm leading-relaxed mb-8 max-w-xs font-light">
              The trusted destination for professional air conditioning services and modern climate solutions. Reliable service for modern homes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 border border-white/10 rounded-sm hover:border-brand-gold transition-colors"><Instagram size={18} /></a>
              <a href="#" className="p-2 border border-white/10 rounded-sm hover:border-brand-gold transition-colors"><Twitter size={18} /></a>
              <a href="#" className="p-2 border border-white/10 rounded-sm hover:border-brand-gold transition-colors"><Facebook size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Expertise</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li><Link to="/services?cat=repair" className="hover:text-white transition-colors">System Installation</Link></li>
              <li><Link to="/services?cat=maintenance" className="hover:text-white transition-colors">Precision Repair</Link></li>
              <li><Link to="/services?cat=gas" className="hover:text-white transition-colors">Gas Refilling</Link></li>
              <li><Link to="/services?cat=cleaning" className="hover:text-white transition-colors">Deep Jet Wash</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Company</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li><Link to="/about" className="hover:text-white transition-colors">About Our Brand</Link></li>
              <li><Link to="/amc" className="hover:text-white transition-colors">Total Care AMC Plans</Link></li>
              <li><Link to="/why-coolzo" className="hover:text-white transition-colors">Technician Certification</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-8">Service Standards</h4>
            <ul className="space-y-4 text-sm text-white/60 font-light">
              <li className="flex items-center gap-3"><Clock size={14} className="text-brand-gold" /> 90-Minute Window</li>
              <li className="flex items-center gap-3"><ShieldCheck size={14} className="text-brand-gold" /> Clean Work Guarantee</li>
              <li className="flex items-center gap-3"><Gem size={14} className="text-brand-gold" /> SLA Guarantee</li>
              <li className="flex items-center gap-3"><ShieldCheck size={14} className="text-brand-gold" /> Privacy Protocol</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-medium">
            © 2026 Coolzo Professional AC Services. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
            <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em] font-bold">Authorized Professional Service Network</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
