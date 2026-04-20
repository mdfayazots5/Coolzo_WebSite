import { motion } from "motion/react";
import { Phone, Mail, MapPin, MessageCircle, Clock, ChevronRight, ShieldCheck } from "lucide-react";
import React, { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Professional Support</span>
          <h1 className="text-6xl font-serif text-brand-navy mb-8">At Your Service.</h1>
          <p className="text-brand-navy/50 text-xl font-light leading-relaxed">
            Whether you require an emergency repair or a consultation for a new home, our professional team is ready to assist.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Contact Info */}
          <div>
            <div className="grid sm:grid-cols-2 gap-8 mb-16">
              <a href="tel:+919876543210" className="bg-white p-8 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all group">
                <Phone className="text-brand-gold mb-6 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Call Support</p>
                <p className="text-lg font-serif text-brand-navy">+91 98765 43210</p>
              </a>
              <a href="https://wa.me/919876543210" className="bg-white p-8 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all group">
                <MessageCircle className="text-brand-gold mb-6 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">WhatsApp Direct</p>
                <p className="text-lg font-serif text-brand-navy">Chat with us</p>
              </a>
              <a href="mailto:support@coolzo.com" className="bg-white p-8 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all group">
                <Mail className="text-brand-gold mb-6 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Email Inquiry</p>
                <p className="text-lg font-serif text-brand-navy">support@coolzo.com</p>
              </a>
              <div className="bg-white p-8 rounded-sm border border-brand-navy/5 group">
                <Clock className="text-brand-gold mb-6" size={24} />
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40 mb-2">Business Hours</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-serif text-brand-navy">08:00 — 22:00</p>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[8px] uppercase tracking-widest font-bold rounded-full">Open Now</span>
                </div>
              </div>
            </div>

            <div className="border-t border-brand-navy/5 pt-12">
              <h3 className="text-2xl font-serif text-brand-navy mb-8">Service Coverage Across Hyderabad</h3>
              <div className="grid grid-cols-2 gap-4">
                {['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Hitech City', 'Madhapur', 'Kondapur'].map(city => (
                  <div key={city} className="flex items-center gap-3 text-brand-navy/50 text-sm">
                    <MapPin size={14} className="text-brand-gold" />
                    {city}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-brand-navy p-12 md:p-16 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-brand-gold/5 skew-x-12 translate-x-1/2" />
            <div className="relative z-10">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="w-20 h-20 bg-brand-gold/20 rounded-full flex items-center justify-center mx-auto mb-8">
                    <ShieldCheck size={40} className="text-brand-gold" />
                  </div>
                  <h3 className="text-3xl font-serif text-white mb-4">Inquiry Received.</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-12">
                    Our professional team will review your request and contact you within the next 60 minutes.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-brand-gold text-[10px] uppercase tracking-widest font-bold hover:text-white transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-3xl font-serif text-white mb-12">Send an Inquiry</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Full Name</label>
                        <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Phone Number</label>
                        <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Email Address</label>
                      <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Subject</label>
                      <select className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors appearance-none">
                        <option className="bg-brand-navy">General Inquiry</option>
                        <option className="bg-brand-navy">Emergency Repair</option>
                        <option className="bg-brand-navy">AMC Enrollment</option>
                        <option className="bg-brand-navy">Installation Consultation</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-white/40">Message</label>
                      <textarea required rows={4} className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-brand-gold text-brand-navy py-5 rounded-sm text-xs uppercase tracking-widest font-bold hover:bg-white transition-all shadow-xl">
                      Submit Inquiry
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
