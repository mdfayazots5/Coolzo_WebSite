import { motion } from "motion/react";
import { Check, X, Star, ShieldCheck, Clock, Gem, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Basic",
    price: "$199",
    period: "/year",
    desc: "Essential protection for single-unit households.",
    features: [
      { name: "2 Preventive Maintenance Visits", included: true },
      { name: "Priority Scheduling", included: true },
      { name: "Labor Charges Covered", included: true },
      { name: "Spare Parts Replacement", included: false },
      { name: "Gas Refilling", included: false },
      { name: "60-Min Emergency Response", included: false },
    ]
  },
  {
    name: "Standard",
    price: "$349",
    period: "/year",
    desc: "The perfect balance for family residences.",
    popular: true,
    features: [
      { name: "3 Preventive Maintenance Visits", included: true },
      { name: "Priority Scheduling", included: true },
      { name: "Labor Charges Covered", included: true },
      { name: "Spare Parts Replacement", included: true },
      { name: "Gas Refilling", included: false },
      { name: "60-Min Emergency Response", included: false },
    ]
  },
  {
    name: "Total Care",
    price: "$599",
    period: "/year",
    desc: "Comprehensive care for modern homes.",
    features: [
      { name: "4 Preventive Maintenance Visits", included: true },
      { name: "Priority Scheduling", included: true },
      { name: "Labor Charges Covered", included: true },
      { name: "Spare Parts Replacement", included: true },
      { name: "Gas Refilling", included: true },
      { name: "60-Min Emergency Response", included: true },
    ]
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "Tailored solutions for large-scale properties.",
    features: [
      { name: "Monthly Maintenance Visits", included: true },
      { name: "Dedicated Account Manager", included: true },
      { name: "24/7 Priority Support", included: true },
      { name: "Full Parts & Gas Coverage", included: true },
      { name: "Multi-Unit Discount", included: true },
      { name: "Custom SLA Agreements", included: true },
    ]
  }
];

export default function AMC() {
  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">Professional Protection</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-brand-navy mb-8">The Smart Care Advantage.</h1>
          <p className="text-brand-navy/50 text-xl font-light leading-relaxed mb-12">
            Join a circle of smart property owners who demand zero downtime. 
            Proactive care, priority response, and comprehensive health monitoring for your home.
          </p>
          <div className="inline-flex items-center gap-2 bg-brand-gold/10 text-brand-gold px-6 py-2 rounded-sm text-[10px] uppercase tracking-widest font-bold">
            <Star size={14} className="fill-brand-gold" />
            Limited Seasonal Offer: 15% Off All Annual Plans
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-20 lg:mb-32">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-white p-6 sm:p-10 rounded-sm border transition-all duration-500 flex flex-col h-full ${plan.popular ? "border-brand-gold shadow-2xl scale-100 lg:scale-105 z-10" : "border-brand-navy/5 shadow-sm hover:shadow-xl"}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-navy px-4 py-1 rounded-sm text-[9px] uppercase tracking-widest font-bold">
                  Most Popular
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-2xl font-serif text-brand-navy mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-serif text-brand-navy">{plan.price}</span>
                  <span className="text-brand-navy/40 text-xs uppercase tracking-widest font-bold">{plan.period}</span>
                </div>
                <p className="text-brand-navy/50 text-sm leading-relaxed font-light">{plan.desc}</p>
              </div>

              <div className="space-y-6 mb-12 flex-grow">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check size={16} className="text-brand-gold shrink-0 mt-0.5" />
                    ) : (
                      <X size={16} className="text-brand-navy/10 shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${feature.included ? "text-brand-navy/70" : "text-brand-navy/20 line-through"}`}>
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-sm text-[10px] uppercase tracking-widest font-bold transition-all ${plan.popular ? "bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white" : "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy"}`}>
                Enroll in {plan.name}
              </button>
            </motion.div>
          ))}
        </div>

        {/* What is AMC? */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <div className="relative">
            <div className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full" />
            <img 
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop" 
              alt="Professional Maintenance" 
              className="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-4 block">The Concept</span>
            <h2 className="text-5xl font-serif text-brand-navy mb-8">What is AMC?</h2>
            <p className="text-brand-navy/50 text-lg mb-8 leading-relaxed font-light">
              Annual Maintenance Contract (AMC) is our professional subscription service designed for those who value continuity and peace of mind. Instead of reactive repairs, we provide proactive care for your home's climate.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <ShieldCheck className="text-brand-gold mb-4" size={24} />
                <h4 className="text-lg font-serif text-brand-navy mb-2">Zero Downtime</h4>
                <p className="text-brand-navy/40 text-xs leading-relaxed">We fix issues before they even manifest as problems.</p>
              </div>
              <div>
                <Clock className="text-brand-gold mb-4" size={24} />
                <h4 className="text-lg font-serif text-brand-navy mb-2">Priority Access</h4>
                <p className="text-brand-navy/40 text-xs leading-relaxed">AMC members skip the queue, even during peak summer months.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-brand-navy p-12 md:p-20 rounded-sm text-center">
          <span className="text-brand-gold text-[10px] uppercase tracking-[0.5em] font-bold mb-8 block">Member Testimonials</span>
          <div className="max-w-4xl mx-auto">
            <p className="text-white/80 text-3xl font-serif italic leading-relaxed mb-12">
              "Coolzo's AMC is the single best investment I've made for my property. I haven't thought about my AC in three years—it just works perfectly, always."
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center text-brand-navy font-serif italic font-bold">
                S
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-sm">Sebastian Croft</p>
                <p className="text-brand-gold text-[9px] uppercase tracking-widest">Trusted Member since 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
