import { motion } from "motion/react";
import { ShieldCheck, Clock, Gem, Award, Users, MapPin } from "lucide-react";

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Story */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Our Heritage</span>
            <h1 className="text-6xl font-serif text-brand-navy mb-8 leading-tight">Crafting the <br />Perfect Atmosphere.</h1>
            <p className="text-brand-navy/60 text-lg font-light leading-relaxed mb-8">
              Founded in 2018, Coolzo was born from a simple observation: while air conditioning is a necessity in modern living, the service industry surrounding it remained stuck in the past.
            </p>
            <p className="text-brand-navy/60 text-lg font-light leading-relaxed mb-12">
              We set out to bridge the gap between architectural excellence and technical maintenance. Today, Coolzo is the trusted climate partner for Hyderabad's most modern homes, offices, and private residences.
            </p>
            <div className="grid grid-cols-3 gap-8 border-t border-brand-navy/5 pt-12">
              <div>
                <p className="text-3xl font-serif text-brand-navy">8+</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Years in Service</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-brand-navy">20+</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Hyderabad Zones</p>
              </div>
              <div>
                <p className="text-3xl font-serif text-brand-navy">25k+</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Services Done</p>
              </div>
            </div>
          </motion.div>
          <div className="relative">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop" 
              alt="Coolzo Office" 
              className="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Credentials */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Our Credentials</span>
            <h2 className="text-4xl font-serif text-brand-navy">Authorized Quality.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { title: "Daikin Authorized", icon: <Award className="text-brand-gold mx-auto mb-6" size={32} />, desc: "Certified for VRV and high-spec residential systems." },
              { title: "Mitsubishi Electric", icon: <ShieldCheck className="text-brand-gold mx-auto mb-6" size={32} />, desc: "Professional service partner for inverter technology." },
              { title: "HVAC Association", icon: <Gem className="text-brand-gold mx-auto mb-6" size={32} />, desc: "Trusted member of the International HVAC Council." },
              { title: "ISO 9001:2015", icon: <Clock className="text-brand-gold mx-auto mb-6" size={32} />, desc: "Certified quality management and service protocols." }
            ].map((item, i) => (
              <div key={i} className="group">
                <div className="group-hover:scale-110 transition-transform duration-500">{item.icon}</div>
                <h4 className="text-lg font-serif text-brand-navy mb-3">{item.title}</h4>
                <p className="text-brand-navy/40 text-xs leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Promise */}
        <div className="bg-brand-navy p-12 md:p-24 rounded-sm relative overflow-hidden mb-32">
          <div className="absolute top-0 left-0 w-full h-full bg-brand-gold/5 -skew-y-6 translate-y-1/2" />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-8 block">The Coolzo Promise</span>
            <h2 className="text-5xl font-serif text-white mb-12 leading-tight">
              "We promise to treat your home with professional care, and your time as our highest priority."
            </h2>
            <div className="w-20 h-px bg-brand-gold mx-auto mb-12" />
            <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-bold">The Founding Principles of Coolzo</p>
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-20">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Leadership</span>
            <h2 className="text-4xl font-serif text-brand-navy">The Visionaries.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { name: "Alexander Vane", role: "Founder & CEO", img: "https://picsum.photos/seed/alex/400/500" },
              { name: "Sarah Chen", role: "Head of Technical Quality", img: "https://picsum.photos/seed/sarah/400/500" },
              { name: "Marcus Thorne", role: "Director of Client Relations", img: "https://picsum.photos/seed/marcus/400/500" }
            ].map((person, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-sm mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <h4 className="text-xl font-serif text-brand-navy mb-1">{person.name}</h4>
                <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold">{person.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
