import { motion } from "motion/react";
import { ShieldCheck, Clock, Gem, UserCheck, Smartphone, Check, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function WhyCoolzo() {
  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-24">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">The Differentiation</span>
          <h1 className="text-6xl font-serif text-brand-navy mb-8">Why Coolzo?</h1>
          <p className="text-brand-navy/50 text-xl font-light leading-relaxed">
            In a market of generic services, we offer professional climate care. Here is how we redefine the standard of reliability.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="mb-32 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-8 text-left bg-transparent border-b border-brand-navy/5 w-1/3"></th>
                <th className="p-8 text-center bg-brand-navy/5 border-b border-brand-navy/5 rounded-t-sm">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Standard Market</span>
                </th>
                <th className="p-8 text-center bg-brand-navy border-b border-white/10 rounded-t-sm">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold">Coolzo Standard</span>
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { feature: "Technician Training", market: "General Experience", coolzo: "Brand-Specific Certification" },
                { feature: "Service Window", market: "4-6 Hour Window", coolzo: "Strict 90-Minute Window" },
                { feature: "Spare Parts", market: "Generic/Compatible", coolzo: "100% OEM Genuine Only" },
                { feature: "Cleanliness", market: "Basic Cleanup", coolzo: "Professional Protocol" },
                { feature: "Digital Integration", market: "Paper Receipts", coolzo: "Real-Time Web Tracking" },
                { feature: "Warranty", market: "30 Days Limited", coolzo: "90 Days Comprehensive" },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="p-8 border-b border-brand-navy/5 font-serif text-lg text-brand-navy">{row.feature}</td>
                  <td className="p-8 border-b border-brand-navy/5 text-center text-brand-navy/40 bg-brand-navy/5">{row.market}</td>
                  <td className="p-8 border-b border-white/5 text-center text-white bg-brand-navy font-bold">{row.coolzo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Differentiation Points */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-32">
          {[
            { title: "Technician Network", icon: <UserCheck className="text-brand-gold" size={32} />, desc: "We don't hire 'handymen'. Every Coolzo technician is a professional engineer with brand-specific training." },
            { title: "Professional Protocol", icon: <ShieldCheck className="text-brand-gold" size={32} />, desc: "Our technicians use floor protectors, wear shoe covers, and perform a 5-point sanitization after every service." },
            { title: "Digital Portal", icon: <Smartphone className="text-brand-gold" size={32} />, desc: "From real-time GPS tracking to digital health reports, your entire service history is managed in our modern web portal." },
            { title: "OEM Integrity", icon: <Gem className="text-brand-gold" size={32} />, desc: "We maintain direct supply lines with manufacturers to ensure every capacitor and fuse is 100% genuine." },
            { title: "90-Min Precision", icon: <Clock className="text-brand-gold" size={32} />, desc: "We respect your time. If we're late beyond our 90-minute window, the service labor is on us." },
            { title: "SLA Guarantee", icon: <ShieldCheck className="text-brand-gold" size={32} />, desc: "Our Service Level Agreements are professional promises of performance, response time, and quality." }
          ].map((point, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-10 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-500"
            >
              <div className="mb-6">{point.icon}</div>
              <h3 className="text-xl font-serif text-brand-navy mb-4">{point.title}</h3>
              <p className="text-brand-navy/50 text-sm leading-relaxed">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Infographic Placeholder */}
        <div className="bg-brand-navy p-12 md:p-24 rounded-sm text-center mb-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-gold/5 blur-3xl rounded-full translate-y-1/2" />
          <div className="relative z-10">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-8 block">The Experience Flow</span>
            <h2 className="text-5xl font-serif text-white mb-16">The Coolzo Journey.</h2>
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 max-w-5xl mx-auto">
              {[
                { title: "Book", icon: <Smartphone size={32} /> },
                { title: "Assign", icon: <UserCheck size={32} /> },
                { title: "Track", icon: <Clock size={32} /> },
                { title: "Restore", icon: <ShieldCheck size={32} /> }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-6 group">
                  <div className="w-20 h-20 rounded-full border border-brand-gold/30 flex items-center justify-center text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-navy transition-all duration-500">
                    {step.icon}
                  </div>
                  <p className="text-white font-serif text-xl">{step.title}</p>
                  {i < 3 && <ArrowRight size={24} className="text-brand-gold/20 hidden md:block absolute translate-x-32" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-4xl font-serif text-brand-navy mb-12">Ready to experience the difference?</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/services" className="bg-brand-navy text-white px-10 py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl">
              Book a Service
            </Link>
            <Link to="/amc" className="border border-brand-navy/20 text-brand-navy px-10 py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-brand-navy hover:text-white transition-all">
              Enroll in AMC
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
