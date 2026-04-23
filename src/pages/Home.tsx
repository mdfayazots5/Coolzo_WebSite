import { motion } from "motion/react";
import { ChevronRight, ShieldCheck, Clock, CheckCircle2, Star, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" }
};

export default function Home() {
  return (
    <div className="bg-brand-cream">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop" 
            alt="Modern Interior" 
            className="w-full h-full object-cover opacity-30 grayscale"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-brand-gold text-xs uppercase tracking-[0.4em] font-bold mb-6 block">
              Modern Climate Solutions
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-serif text-white leading-tight md:leading-[0.85] mb-8">
              Cooling <br />
              <span className="italic">Perfected.</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl mb-10 max-w-xl leading-relaxed font-light">
              Experience the smart way to manage your indoor environment. 
              Professional, reliable, and flawlessly executed AC services across Hyderabad.
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/book" className="bg-brand-gold text-brand-navy px-10 py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all flex items-center gap-2 shadow-xl">
                Book a Service <ChevronRight size={16} />
              </Link>
              <Link to="/amc" className="border border-white/20 text-white px-10 py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white/10 transition-all">
                Explore AMC Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-white py-12 border-b border-brand-navy/5">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-brand-navy/10 overflow-hidden">
                    <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-1 text-brand-gold mb-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} className="fill-brand-gold" />)}
                </div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy whitespace-nowrap">4.9/5 Hyderabad Rating</p>
              </div>
            </div>
            
            <div className="flex gap-8 sm:gap-12 items-center flex-wrap justify-center">
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-serif text-brand-navy">20+</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Hyderabad Zones</p>
              </div>
              <div className="text-center">
                <p className="text-xl sm:text-2xl font-serif text-brand-navy">500+</p>
                <p className="text-[9px] uppercase tracking-widest font-bold text-brand-gold">Certified Technicians</p>
              </div>
              <div className="hidden sm:flex gap-4 sm:gap-8 opacity-30 grayscale items-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Daikin_logo.svg/1200px-Daikin_logo.svg.png" alt="Daikin" className="h-3 sm:h-4 object-contain" referrerPolicy="no-referrer" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Mitsubishi_Electric_logo.svg/1200px-Mitsubishi_Electric_logo.svg.png" alt="Mitsubishi" className="h-3 sm:h-4 object-contain" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Our Expertise</span>
            <h2 className="text-5xl font-serif text-brand-navy">Professional Climate Solutions</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { title: "Repair", icon: <ShieldCheck size={32} />, desc: "Diagnostic excellence for all systems." },
              { title: "Cleaning", icon: <Clock size={32} />, desc: "Deep jet-wash for pure air." },
              { title: "Gas Refill", icon: <CheckCircle2 size={32} />, desc: "Precision pressure restoration." },
              { title: "Installation", icon: <MapPin size={32} />, desc: "Smart system placement." },
              { title: "AMC Plans", icon: <Star size={32} />, desc: "Proactive total care maintenance." }
            ].map((service, i) => (
              <motion.div 
                key={i}
                {...fadeIn}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-sm border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-500 group flex flex-col h-full"
              >
                <div className="text-brand-gold mb-6 group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                <h3 className="text-xl font-serif text-brand-navy mb-3">{service.title}</h3>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-8 flex-grow">{service.desc}</p>
                <div className="flex flex-col gap-3">
                  <Link to="/services" className="text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2">
                    Learn More <ArrowRight size={12} />
                  </Link>
                  <Link to="/book" className="bg-brand-navy text-white text-center py-3 rounded-sm text-[9px] uppercase tracking-widest font-bold hover:bg-brand-gold transition-all">
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Hyderabad Coverage Section */}
      <section className="py-24 bg-brand-navy/5">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=2070&auto=format&fit=crop" 
                alt="Hyderabad City" 
                className="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Service Coverage</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-brand-navy mb-8">Serving Across Hyderabad.</h2>
              <p className="text-brand-navy/60 text-lg mb-12 leading-relaxed font-light">
                From the bustling streets of Gachibowli to the serene lanes of Jubilee Hills, our technicians are ready to serve you. We cover all major zones with a 4-hour response promise.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {["Banjara Hills", "Jubilee Hills", "Gachibowli", "Madhapur", "Kukatpally", "Kondapur", "Secunderabad", "Hitech City"].map((zone) => (
                  <div key={zone} className="flex items-center gap-3 text-brand-navy/40">
                    <CheckCircle2 size={16} className="text-brand-gold" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-brand-navy text-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">The Process</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mb-12">Seamless Experience.</h2>
              
              <div className="space-y-12">
                {[
                  { step: "01", title: "Smart Booking", desc: "Select your service and preferred window through our modern digital portal." },
                  { step: "02", stepTitle: "Technician Assignment", desc: "We match your system with a specialist certified for your specific brand." },
                  { step: "03", stepTitle: "Real-Time Tracking", desc: "Monitor your technician's arrival with professional precision." },
                  { step: "04", stepTitle: "Comfort Restored", desc: "Enjoy perfect air with a detailed digital health report of your system." }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex gap-8 group"
                  >
                    <span className="text-3xl font-serif text-brand-gold/30 group-hover:text-brand-gold transition-colors">{item.step}</span>
                    <div>
                      <h4 className="text-xl font-serif mb-2">{item.stepTitle || item.title}</h4>
                      <p className="text-white/40 text-sm leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1558389186-438424b00a32?q=80&w=2070&auto=format&fit=crop" 
                alt="Service Experience" 
                className="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AMC Highlight */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-brand-black p-12 md:p-20 rounded-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-6 block">Total Protection</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white mb-8">The Smart Care Advantage.</h2>
                <p className="text-white/50 text-lg mb-10 leading-relaxed font-light">
                  Join our circle of smart property owners. Zero downtime, priority response, and comprehensive health monitoring for your entire cooling infrastructure.
                </p>
                <div className="flex items-center gap-8 mb-12">
                  <div>
                    <p className="text-white text-2xl font-serif">Unlimited</p>
                    <p className="text-brand-gold text-[9px] uppercase tracking-widest font-bold">Service Calls</p>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div>
                    <p className="text-white text-2xl font-serif">60 Min</p>
                    <p className="text-brand-gold text-[9px] uppercase tracking-widest font-bold">Emergency Response</p>
                  </div>
                </div>
                <Link to="/amc" className="bg-brand-gold text-brand-navy px-10 py-5 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-white transition-all inline-block">
                  Enroll in AMC
                </Link>
              </div>
              <div className="hidden lg:block">
                <img 
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop" 
                  alt="Modern Home" 
                  className="rounded-sm shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
