import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft, ShieldCheck, Clock, Gem, CheckCircle2,
  HelpCircle, ArrowRight, Loader2, AlertCircle, Star,
} from "lucide-react";
import { useState, useEffect } from "react";
import { CatalogService } from "../services/catalogService";
import { CMSService } from "../services/cmsService";
import { ReviewService } from "../services/reviewService";
import type { ServiceLookupResponse } from "../types/catalog";
import type { ReviewResponse } from "../services/reviewService";
import type { CMSFaqResponse } from "../services/cmsService";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2069&auto=format&fit=crop";

function formatDuration(minutes?: number): string {
  if (!minutes) return "60 – 90 min";
  return `${minutes} min`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

const MOCK_INCLUDED = [
  "Full system diagnostic evaluation",
  "Leakage detection and pressure testing",
  "Electrical component health check",
  "Thermostat calibration",
  "Professional sanitation",
  "Digital service report",
];

const MOCK_PROCESS = [
  { title: "Arrival & Inspection", desc: "Our technician arrives within your window and performs a visual inspection of the unit." },
  { title: "Diagnostic Testing", desc: "Using advanced sensors, we identify the root cause of performance issues." },
  { title: "Precision Fix", desc: "The repair is executed using only certified components to ensure reliability." },
  { title: "Validation", desc: "We verify that the cooling curve matches factory specifications." },
];

const MOCK_FAQS = [
  { q: "How long does it take?", a: "Most services are completed within 60 to 90 minutes depending on the complexity." },
  { q: "Do you provide a warranty?", a: "Yes, we provide a 90-day professional warranty on our maintenance and repair work." },
  { q: "What brands do you service?", a: "We specialize in all modern high-end AC brands including Daikin, Samsung, and more." },
];

export default function ServiceDetail() {
  const { id } = useParams();
  const serviceId = Number(id);

  const [service, setService] = useState<ServiceLookupResponse | undefined>(undefined);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [faqs, setFaqs] = useState<CMSFaqResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    if (!serviceId) return;
    setLoading(true);
    Promise.allSettled([
      CatalogService.getServices(),
      ReviewService.getReviews(serviceId, 1, 10),
      CMSService.getFaqs(),
    ]).then(([svcResult, reviewResult, faqResult]) => {
      if (svcResult.status === "fulfilled") {
        const found = (svcResult.value ?? []).find((s) => s.serviceId === serviceId);
        if (found) {
          setService(found);
        } else {
          setError("Service not found");
        }
      } else {
        setError("Failed to load service details");
      }
      if (reviewResult.status === "fulfilled") {
        setReviews(reviewResult.value?.items ?? []);
      }
      if (faqResult.status === "fulfilled") {
        setFaqs(faqResult.value ?? []);
      }
    }).finally(() => setLoading(false));
  }, [serviceId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen pt-32">
        <Loader2 className="animate-spin text-brand-gold" size={48} />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen pt-32 px-6">
        <AlertCircle className="text-red-500 mb-6" size={48} />
        <h2 className="text-3xl font-serif text-brand-navy mb-4">Discovery Failed</h2>
        <p className="text-brand-navy/50 text-center mb-10 max-w-md">
          {error || "The requested service record is missing from our catalog."}
        </p>
        <Link
          to="/services"
          className="bg-brand-navy text-white px-10 py-4 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const isRepair = service.serviceName.toLowerCase().includes("repair");
  const displayPrice = service.basePrice != null ? `₹${service.basePrice.toLocaleString()}` : "Quote";
  const activeFaqs = faqs.length > 0
    ? faqs.map((f) => ({ q: f.question, a: f.answer }))
    : MOCK_FAQS;

  return (
    <div className="pt-32 pb-24 bg-brand-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Breadcrumb */}
        <Link
          to="/services"
          className="flex items-center gap-2 text-brand-navy/40 hover:text-brand-navy text-[10px] uppercase tracking-widest font-bold mb-12 transition-colors group"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Services
        </Link>

        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16 lg:mb-24">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <div className="text-brand-gold mb-8">
              {isRepair ? <ShieldCheck size={48} /> : <Clock size={48} />}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-brand-navy mb-6 leading-tight">
              {service.serviceName}
            </h1>
            <p className="text-brand-navy/60 text-xl font-light leading-relaxed mb-10 max-w-lg italic">
              "{service.summary ?? "Professional AC service by certified technicians."}"
            </p>
            <div className="flex flex-wrap gap-8 mb-12">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-brand-gold" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">Duration</p>
                  <p className="text-sm font-bold text-brand-navy">
                    {formatDuration()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Gem size={20} className="text-brand-gold" />
                <div>
                  <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/40">Investment</p>
                  <p className="text-sm font-bold text-brand-navy">{displayPrice}</p>
                </div>
              </div>
            </div>
            <Link
              to="/book"
              state={{ serviceId: service.serviceId, serviceName: service.serviceName, price: service.basePrice }}
              className="bg-brand-navy text-white px-10 py-5 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-brand-gold transition-all shadow-xl inline-block"
            >
              Book This Service
            </Link>
          </motion.div>
          <div className="relative">
            <div className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full" />
            <img
              src={FALLBACK_IMG}
              alt={service.serviceName}
              className="rounded-sm shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000 w-full aspect-video object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid lg:grid-cols-3 gap-12 lg:gap-20 mb-16 lg:mb-24">
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-serif text-brand-navy mb-8 border-b border-brand-navy/5 pb-4">
              Specialized Benefits
            </h3>
            <ul className="space-y-6">
              {MOCK_INCLUDED.map((item, i) => (
                <li key={i} className="flex gap-4 text-brand-navy/60 text-sm leading-relaxed">
                  <CheckCircle2 size={18} className="text-brand-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif text-brand-navy mb-8 border-b border-brand-navy/5 pb-4">
              The Professional Process
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              {MOCK_PROCESS.map((step, i) => (
                <div key={i} className="group">
                  <span className="text-brand-gold/30 text-3xl font-serif mb-4 block group-hover:text-brand-gold transition-colors">
                    0{i + 1}
                  </span>
                  <h4 className="text-lg font-serif text-brand-navy mb-3">{step.title}</h4>
                  <p className="text-brand-navy/50 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="flex justify-between items-end mb-12 border-b border-brand-navy/5 pb-8">
            <div>
              <h3 className="text-4xl font-serif text-brand-navy mb-2">Client Experiences</h3>
              <p className="text-brand-navy/40 text-[10px] uppercase tracking-[0.2em] font-bold">
                Trusted by the community
              </p>
            </div>
            {reviews.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex gap-1 text-brand-gold">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className="fill-brand-gold" />
                  ))}
                </div>
                <span className="text-2xl font-serif text-brand-navy">
                  {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-12">
              {reviews.map((review) => (
                <div key={review.reviewId} className="grid md:grid-cols-4 gap-8 group">
                  <div className="md:col-span-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-navy/5 flex items-center justify-center text-brand-navy font-bold text-xs">
                        {review.customerName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-bold text-brand-navy">{review.customerName}</p>
                        <p className="text-[9px] uppercase tracking-widest text-brand-navy/40 font-bold">
                          {formatDate(review.dateCreated)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 text-brand-gold">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i < review.rating ? "fill-brand-gold" : "text-brand-navy/10"}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-brand-navy/60 text-lg font-light leading-relaxed mb-4 group-hover:text-brand-navy transition-colors italic">
                      "{review.comment}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white/50 rounded-xl border border-dashed border-brand-navy/10">
              <p className="text-brand-navy/40 text-sm">
                No reviews yet for this service. Be the first to share your experience!
              </p>
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-24">
          <div className="text-center mb-16">
            <HelpCircle size={32} className="text-brand-gold mx-auto mb-4" />
            <h3 className="text-4xl font-serif text-brand-navy">Common Inquiries</h3>
          </div>
          <div className="space-y-4">
            {activeFaqs.map((faq, i) => (
              <div key={i} className="bg-white border border-brand-navy/5 rounded-xl overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  aria-expanded={activeFaq === i}
                  className="w-full px-8 py-6 flex justify-between items-center text-left hover:bg-brand-cream/50 transition-colors"
                >
                  <span className="font-serif text-lg text-brand-navy">{faq.q}</span>
                  <ChevronLeft
                    size={20}
                    className={`text-brand-gold transition-transform duration-300 ${activeFaq === i ? "-rotate-90" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-brand-navy/50 text-sm leading-relaxed">{faq.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        <div className="border-t border-brand-navy/5 pt-24">
          <div className="flex justify-between items-end mb-12">
            <h3 className="text-3xl font-serif text-brand-navy">Complementary Services</h3>
            <Link
              to="/services"
              className="text-[10px] uppercase tracking-widest font-bold text-brand-gold flex items-center gap-2 hover:text-brand-navy transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Deep Jet Wash", icon: <Clock size={24} />, desc: "Deep cleaning with specialized anti-bacterial treatment." },
              { name: "Gas Refilling", icon: <Gem size={24} />, desc: "Precision pressure restoration and leak detection." },
              { name: "Duct Sanitization", icon: <ShieldCheck size={24} />, desc: "Complete air path purification for zero allergens." },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-500 group"
              >
                <div className="text-brand-gold mb-6 group-hover:scale-110 transition-transform duration-500">
                  {s.icon}
                </div>
                <h4 className="text-xl font-serif text-brand-navy mb-3">{s.name}</h4>
                <p className="text-brand-navy/50 text-sm leading-relaxed mb-6">{s.desc}</p>
                <Link
                  to="/services"
                  className="text-[9px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors"
                >
                  Learn More
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-brand-navy/10 p-4 z-40">
        <Link
          to="/book"
          state={{ serviceId: service.serviceId, serviceName: service.serviceName, price: service.basePrice }}
          className="block w-full bg-brand-navy text-white text-center py-4 rounded-lg text-xs uppercase tracking-widest font-bold shadow-xl"
        >
          Book Now{service.basePrice != null ? ` — ₹${service.basePrice.toLocaleString()}` : ""}
        </Link>
      </div>
    </div>
  );
}
