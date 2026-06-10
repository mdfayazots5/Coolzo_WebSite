import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ShieldCheck, Clock, CheckCircle2, HelpCircle, ArrowRight,
  Loader2, AlertCircle, Star, Wrench, Wind, Zap, Droplets, IndianRupee,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CatalogService } from "../services/catalogService";
import { CMSService } from "../services/cmsService";
import { ReviewService } from "../services/reviewService";
import { useAuth } from "../contexts/AuthContext";
import Container from "../components/Container";
import type { ServiceLookupResponse } from "../types/catalog";
import type { ReviewResponse } from "../services/reviewService";
import type { CMSFaqResponse } from "../services/cmsService";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

// AC-relevant icon resolved from the service name.
function iconForName(name: string, size = 22) {
  const n = name.toLowerCase();
  if (n.includes("repair")) return <Wrench size={size} />;
  if (n.includes("clean") || n.includes("wash") || n.includes("service")) return <Wind size={size} />;
  if (n.includes("install")) return <Zap size={size} />;
  if (n.includes("gas") || n.includes("refill")) return <Droplets size={size} />;
  return <ShieldCheck size={size} />;
}

// Descriptive (not data) content — explains a typical visit. Kept generic and honest.
const TYPICAL_INCLUSIONS = [
  "On-site diagnosis by a certified technician",
  "Transparent estimate before any work begins",
  "Genuine parts where replacement is needed",
  "Functional test and cooling check after service",
  "Digital service report shared with you",
];

const VISIT_STEPS = [
  { title: "Arrival & inspection", desc: "Your technician arrives within the booked window and inspects the unit." },
  { title: "Diagnosis & estimate", desc: "The fault is identified and a clear estimate is shared for your approval." },
  { title: "Service & fix", desc: "Work is carried out with genuine components and care for your space." },
  { title: "Check & report", desc: "Cooling is verified and a digital report of the visit is shared with you." },
];

const GENERIC_FAQS = [
  { q: "How long does a typical visit take?", a: "Most AC services are completed within 60 to 90 minutes, depending on the issue." },
  { q: "Is there a warranty on the work?", a: "Repair work carries a 30-day warranty and replaced parts a 90-day warranty. Revisits in this window are free." },
  { q: "How is pricing decided?", a: "You see an estimate before any work starts. Final charges, plus applicable GST, appear on your invoice — no surprises." },
];

export default function ServiceDetail() {
  const { id } = useParams();
  const serviceId = Number(id);
  const { user } = useAuth();
  const bookingPath = user ? "/portal/book" : "/book";

  const [service, setService] = useState<ServiceLookupResponse | undefined>(undefined);
  const [related, setRelated] = useState<ServiceLookupResponse[]>([]);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [faqs, setFaqs] = useState<CMSFaqResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    setError(null);
    Promise.allSettled([
      CatalogService.getServices(),
      ReviewService.getReviews(serviceId, 1, 10),
      CMSService.getFaqs(),
    ]).then(([svcResult, reviewResult, faqResult]) => {
      if (svcResult.status === "fulfilled") {
        const all = svcResult.value ?? [];
        const found = all.find((s) => s.serviceId === serviceId);
        if (found) {
          setService(found);
          setRelated(all.filter((s) => s.serviceCategoryId === found.serviceCategoryId && s.serviceId !== found.serviceId).slice(0, 3));
        } else {
          setError("Service not found");
        }
      } else {
        setError("Failed to load service details");
      }
      if (reviewResult.status === "fulfilled") setReviews(reviewResult.value?.items ?? []);
      if (faqResult.status === "fulfilled") setFaqs(faqResult.value ?? []);
    }).finally(() => setLoading(false));
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-28 gap-3">
        <Loader2 className="animate-spin text-brand-gold" size={40} />
        <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Loading service…</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-28 px-6">
        <AlertCircle className="text-brand-gold mb-5" size={44} />
        <h2 className="text-3xl font-serif text-brand-navy mb-3">Service not found</h2>
        <p className="text-brand-navy/50 text-center mb-8 max-w-md text-sm">
          {error === "Service not found"
            ? "This service isn’t in our catalog. It may have been renamed or removed."
            : "We couldn’t load this service right now. Please try again in a moment."}
        </p>
        <Link
          to="/services"
          className="bg-brand-navy text-white px-8 py-3.5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all min-h-[44px] inline-flex items-center"
        >
          Back to all services
        </Link>
      </div>
    );
  }

  const displayPrice = service.basePrice != null ? `₹${service.basePrice.toLocaleString()}` : "On inspection";
  const activeFaqs = faqs.length > 0 ? faqs.map((f) => ({ q: f.question, a: f.answer })) : GENERIC_FAQS;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="pt-28 pb-28 md:pb-20 bg-brand-cream min-h-screen">
      <Container>
        {/* Breadcrumb */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold mb-8 transition-colors group min-h-[44px]"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to services
        </Link>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="w-14 h-14 rounded-xl bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-6">
              {iconForName(service.serviceName, 28)}
            </div>
            <h1 className="font-serif text-brand-navy mb-5 leading-tight">{service.serviceName}</h1>
            <p className="text-brand-navy/60 text-base md:text-lg font-light leading-relaxed mb-8 max-w-lg">
              {service.summary ?? "Professional AC service by certified technicians."}
            </p>
            <div className="flex flex-wrap gap-8 mb-8">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-brand-gold" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">Typical duration</p>
                  <p className="text-sm font-bold text-brand-navy">60 – 90 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <IndianRupee size={20} className="text-brand-gold" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">Starting price</p>
                  <p className="text-sm font-bold text-brand-navy">{displayPrice}</p>
                </div>
              </div>
            </div>
            <Link
              to={bookingPath}
              state={{ serviceId: service.serviceId }}
              className="bg-brand-navy text-white px-9 py-4 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all shadow-xl inline-flex items-center min-h-[44px]"
            >
              Book this service
            </Link>
          </motion.div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full" />
            <img
              src={service.imageUrl || FALLBACK_IMG}
              alt={service.serviceName}
              className="rounded-xl shadow-2xl relative z-10 w-full aspect-video object-cover"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Inclusions + visit steps */}
        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16 mb-16">
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-serif text-brand-navy mb-6 border-b border-brand-navy/5 pb-3">What’s included</h2>
            <ul className="space-y-4">
              {TYPICAL_INCLUSIONS.map((item) => (
                <li key={item} className="flex gap-3 text-brand-navy/60 text-sm leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-gold shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-serif text-brand-navy mb-6 border-b border-brand-navy/5 pb-3">How the visit works</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {VISIT_STEPS.map((step, i) => (
                <div key={step.title}>
                  <span className="text-brand-gold/40 text-2xl font-serif mb-2 block">0{i + 1}</span>
                  <h3 className="text-lg font-serif text-brand-navy mb-1.5">{step.title}</h3>
                  <p className="text-brand-navy/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="flex justify-between items-end mb-8 border-b border-brand-navy/5 pb-5">
            <div>
              <h2 className="text-3xl font-serif text-brand-navy mb-1">What customers say</h2>
              <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.2em] font-bold">Verified service reviews</p>
            </div>
            {avgRating && (
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex gap-1 text-brand-gold">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={15} className="fill-brand-gold" />)}
                </div>
                <span className="text-2xl font-serif text-brand-navy">{avgRating}</span>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.reviewId} className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy font-bold text-xs shrink-0">
                        {review.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-brand-navy">{review.customerName}</p>
                        <p className="text-[9px] uppercase tracking-widest text-brand-navy/40 font-bold">{formatDate(review.dateCreated)}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-brand-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? "fill-brand-gold" : "text-brand-navy/10"} />
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-brand-navy/60 text-base font-light leading-relaxed italic">“{review.comment}”</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/60 rounded-xl border border-dashed border-brand-navy/10">
              <p className="text-brand-navy/40 text-sm">No reviews yet for this service — be the first after your visit.</p>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="text-center mb-10">
            <HelpCircle size={30} className="text-brand-gold mx-auto mb-3" />
            <h2 className="text-3xl font-serif text-brand-navy">Common questions</h2>
          </div>
          <div className="space-y-3">
            {activeFaqs.map((faq, i) => (
              <div key={faq.q} className="bg-white border border-brand-navy/5 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                  className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-brand-cream/50 transition-colors gap-4 min-h-[44px]"
                >
                  <span className="font-serif text-base text-brand-navy">{faq.q}</span>
                  <ChevronLeft size={18} className={`text-brand-gold shrink-0 transition-transform duration-300 ${activeFaq === i ? "-rotate-90" : ""}`} />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                      <div className="px-6 pb-6 text-brand-navy/50 text-sm leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Related services (real, same category) */}
        {related.length > 0 && (
          <div className="border-t border-brand-navy/5 pt-16">
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-2xl font-serif text-brand-navy">Related services</h2>
              <Link to="/services" className="text-[10px] uppercase tracking-widest font-bold text-brand-gold flex items-center gap-2 hover:text-brand-navy transition-colors min-h-[44px]">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((s) => (
                <Link
                  key={s.serviceId}
                  to={`/services/${s.serviceId}`}
                  className="bg-white p-6 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  <div className="w-11 h-11 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-4">
                    {iconForName(s.serviceName)}
                  </div>
                  <h3 className="text-lg font-serif text-brand-navy mb-2">{s.serviceName}</h3>
                  <p className="text-brand-navy/50 text-sm leading-relaxed mb-4 flex-grow line-clamp-2">
                    {s.summary ?? "Professional AC service by certified technicians."}
                  </p>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-brand-navy group-hover:text-brand-gold transition-colors flex items-center gap-2">
                    Learn more <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-brand-navy/10 p-4 z-40 safe-area-pb">
        <Link
          to={bookingPath}
          state={{ serviceId: service.serviceId }}
          className="block w-full bg-brand-navy text-white text-center py-4 rounded-lg text-xs uppercase tracking-widest font-bold shadow-xl min-h-[44px] flex items-center justify-center"
        >
          Book Now{service.basePrice != null ? ` — ₹${service.basePrice.toLocaleString()}` : ""}
        </Link>
      </div>
    </div>
  );
}
