import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Check, ShieldCheck, Clock, Loader2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogService } from "../services/catalogService";
import type { ServiceLookupResponse } from "../types/catalog";
import { useAuth } from "../contexts/AuthContext";
import Container from "../components/Container";
import Section from "../components/Section";
import Grid from "../components/Grid";

// Generic AMC benefits (explanatory marketing content, not data).
const AMC_BENEFITS = [
  "Scheduled preventive maintenance visits",
  "Priority response during peak season",
  "Discounted parts and repairs",
  "Health check + digital report each visit",
];

export default function AMC() {
  const { user } = useAuth();
  const bookingPath = user ? "/portal/book" : "/book";
  const [plans, setPlans] = useState<ServiceLookupResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const cats = await CatalogService.getServiceCategories();
        const amcCat = cats.find((c) => /amc|maint/i.test(c.categoryName));
        const services = await CatalogService.getServices(amcCat?.serviceCategoryId);
        // If the category filter returned nothing, fall back to name-matching across all services.
        const amcServices = services.length > 0 && amcCat
          ? services
          : (await CatalogService.getServices()).filter((s) => /amc|maint/i.test(s.serviceName));
        setPlans(amcServices);
      } catch {
        setPlans([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const popularIndex = plans.length > 1 ? plans.length - 1 : 0; // comprehensive (last) = most popular

  return (
    <div className="pt-28 pb-20 bg-brand-cream min-h-screen">
      <Container>
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Annual Maintenance</span>
          <h1 className="font-serif text-brand-navy mb-4">Keep your AC running all year</h1>
          <p className="text-brand-navy/50 text-base md:text-lg font-light leading-relaxed">
            An AMC plan means scheduled servicing, priority support, and fewer breakdowns — for a fixed yearly price.
          </p>
        </div>
      </Container>

      {/* Plans */}
      <Section spacing="compact">
        <Container>
          {loading ? (
            <div className="py-16 flex justify-center"><Loader2 className="animate-spin text-brand-gold" size={36} /></div>
          ) : plans.length === 0 ? (
            <div className="py-16 text-center">
              <ShieldCheck size={44} className="text-brand-navy/20 mx-auto mb-5" />
              <h2 className="text-2xl font-serif text-brand-navy mb-3">Plans coming soon</h2>
              <p className="text-brand-navy/40 text-sm max-w-sm mx-auto">
                Our AMC plans are being finalised. Please WhatsApp us for a personalised quote in the meantime.
              </p>
            </div>
          ) : (
            <Grid cols={plans.length >= 3 ? 3 : 2}>
              {plans.map((plan, i) => {
                const isPopular = i === popularIndex && plans.length > 1;
                return (
                  <motion.div
                    key={plan.serviceId}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className={`relative bg-white p-8 rounded-xl border flex flex-col h-full transition-all duration-300 ${
                      isPopular ? "border-brand-gold shadow-2xl" : "border-brand-navy/5 shadow-sm hover:shadow-xl"
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-navy px-4 py-1 rounded-lg text-[9px] uppercase tracking-widest font-bold">
                        Most Popular
                      </div>
                    )}
                    <h2 className="text-xl font-serif text-brand-navy mb-2">{plan.serviceName}</h2>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-3xl font-serif text-brand-navy">
                        {plan.basePrice != null ? `₹${plan.basePrice.toLocaleString()}` : "Custom"}
                      </span>
                      {plan.basePrice != null && <span className="text-brand-navy/40 text-xs uppercase tracking-widest font-bold">/year</span>}
                    </div>
                    <p className="text-brand-navy/50 text-sm leading-relaxed mb-6">
                      {plan.summary ?? "Comprehensive annual maintenance for your AC."}
                    </p>
                    <div className="space-y-3 mb-8 flex-grow">
                      {AMC_BENEFITS.map((b) => (
                        <div key={b} className="flex items-start gap-3">
                          <Check size={16} className="text-brand-gold shrink-0 mt-0.5" />
                          <span className="text-sm text-brand-navy/70">{b}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      to={bookingPath}
                      state={{ serviceId: plan.serviceId }}
                      className={`w-full py-3.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all text-center min-h-[44px] flex items-center justify-center ${
                        isPopular ? "bg-brand-gold text-brand-navy hover:bg-brand-navy hover:text-white" : "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy"
                      }`}
                    >
                      Enroll now
                    </Link>
                  </motion.div>
                );
              })}
            </Grid>
          )}
        </Container>
      </Section>

      {/* What is AMC + benefits */}
      <Section surface="cream" spacing="default" className="bg-brand-navy/5">
        <Container>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Why AMC</span>
              <h2 className="font-serif text-brand-navy mb-5">Proactive care, not reactive repairs</h2>
              <p className="text-brand-navy/55 text-base leading-relaxed font-light mb-8">
                An Annual Maintenance Contract keeps your AC serviced on schedule so small issues are caught early —
                meaning cooler air, lower bills, and fewer emergency breakdowns when you need it most.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <ShieldCheck className="text-brand-gold mb-3" size={22} />
                  <h3 className="text-base font-serif text-brand-navy mb-1">Fewer breakdowns</h3>
                  <p className="text-brand-navy/45 text-xs leading-relaxed">Issues fixed before they become failures.</p>
                </div>
                <div>
                  <Clock className="text-brand-gold mb-3" size={22} />
                  <h3 className="text-base font-serif text-brand-navy mb-1">Priority access</h3>
                  <p className="text-brand-navy/45 text-xs leading-relaxed">Members skip the queue, even in peak summer.</p>
                </div>
              </div>
            </div>
            <div className="bg-brand-navy rounded-2xl p-10 text-center">
              <div className="flex justify-center gap-1 text-brand-gold mb-5">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={18} className="fill-brand-gold" />)}
              </div>
              <p className="text-white/80 text-xl font-serif italic leading-relaxed mb-5">
                "Regular servicing under AMC keeps an AC efficient and extends its life — the simplest way to avoid summer breakdowns."
              </p>
              <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold">Coolzo Service Promise</p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
