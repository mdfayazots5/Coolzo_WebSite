import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowRight, X, Loader2, Wrench, Wind, Zap, Droplets, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogService } from "../services/catalogService";
import type { ServiceLookupResponse, ServiceCategoryLookupResponse } from "../types/catalog";
import { useAuth } from "../contexts/AuthContext";
import Container from "../components/Container";
import Grid from "../components/Grid";

const STATIC_CATEGORY_ALL: { serviceCategoryId: number; categoryName: string } = {
  serviceCategoryId: 0,
  categoryName: "All Services",
};

// AC-relevant icon resolved from the service's category name.
function serviceIcon(categoryName: string | undefined) {
  const n = (categoryName ?? "").toLowerCase();
  if (n.includes("repair")) return <Wrench size={22} />;
  if (n.includes("clean") || n.includes("wash") || n.includes("service")) return <Wind size={22} />;
  if (n.includes("install")) return <Zap size={22} />;
  if (n.includes("gas") || n.includes("refill")) return <Droplets size={22} />;
  if (n.includes("amc") || n.includes("maint")) return <ShieldCheck size={22} />;
  return <Wind size={22} />;
}

export default function Services() {
  const { user } = useAuth();
  const bookingPath = user ? "/portal/book" : "/book";
  const [activeCategory, setActiveCategory] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<ServiceLookupResponse[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryLookupResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      CatalogService.getServices(),
      CatalogService.getServiceCategories(),
    ]).then(([svcResult, catResult]) => {
      if (svcResult.status === "fulfilled") setServices(svcResult.value ?? []);
      if (catResult.status === "fulfilled") setCategories(catResult.value ?? []);
    }).finally(() => setLoading(false));
  }, []);

  const categoryNameById = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => map.set(cat.serviceCategoryId, cat.categoryName));
    return map;
  }, [categories]);

  const filteredServices = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return services.filter((service) => {
      const matchesCategory = activeCategory === 0 || service.serviceCategoryId === activeCategory;
      const matchesSearch =
        service.serviceName.toLowerCase().includes(q) ||
        (service.summary ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, services]);

  return (
    <div className="pt-28 pb-20 bg-brand-cream min-h-screen">
      <Container>
        {/* Header */}
        <div className="max-w-2xl mb-10">
          <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Service Catalog</span>
          <h1 className="font-serif text-brand-navy mb-4">AC services, done right</h1>
          <p className="text-brand-navy/50 text-base md:text-lg font-light leading-relaxed">
            Repairs, cleaning, gas refills and installations — certified technicians, transparent pricing, on-time arrival.
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
            <Loader2 className="animate-spin text-brand-gold" size={36} />
            <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Loading services…</p>
          </div>
        ) : (
          <>
            {/* Search & filter bar */}
            <div className="sticky top-[60px] sm:top-[68px] z-30 bg-brand-cream/90 backdrop-blur-md py-4 border-y border-brand-navy/5 mb-8">
              <div className="flex flex-col lg:flex-row gap-4 justify-between lg:items-center">
                <div className="flex overflow-x-auto no-scrollbar -mx-1 px-1 lg:mx-0 lg:px-0 lg:flex-wrap gap-2">
                  {[STATIC_CATEGORY_ALL, ...categories].map((cat) => (
                    <button
                      key={cat.serviceCategoryId}
                      type="button"
                      onClick={() => setActiveCategory(cat.serviceCategoryId)}
                      className={`px-5 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all duration-300 whitespace-nowrap min-h-[44px] ${
                        activeCategory === cat.serviceCategoryId
                          ? "bg-brand-navy text-white shadow-md"
                          : "bg-white text-brand-navy/60 hover:text-brand-navy border border-brand-navy/5"
                      }`}
                    >
                      {cat.categoryName}
                    </button>
                  ))}
                </div>
                <div className="relative w-full lg:w-80 shrink-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30" size={18} aria-hidden="true" />
                  <label htmlFor="service-search" className="sr-only">Search services</label>
                  <input
                    id="service-search"
                    type="text"
                    placeholder="Search services…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-brand-navy/10 rounded-lg py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-brand-gold focus-visible:ring-2 focus-visible:ring-brand-gold/60 transition-colors min-h-[44px]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-navy/30 hover:text-brand-navy min-w-[44px] min-h-[44px] flex items-center justify-center"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Grid or empty state */}
            {filteredServices.length > 0 ? (
              <Grid cols={4}>
                <AnimatePresence mode="popLayout">
                  {filteredServices.map((service, i) => (
                    <motion.div
                      key={service.serviceId}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.04, 0.3) }}
                      className="bg-white p-6 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 transition-all duration-300 group flex flex-col h-full shadow-sm hover:shadow-xl"
                    >
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.serviceName}
                          className="w-full aspect-[16/9] object-cover rounded-lg mb-5"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : null}
                      <div className="flex justify-between items-start mb-5">
                        <div className="w-11 h-11 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                          {serviceIcon(categoryNameById.get(service.serviceCategoryId))}
                        </div>
                        <span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 bg-brand-cream text-brand-gold rounded-lg">
                          {service.basePrice != null ? `₹${service.basePrice.toLocaleString()}` : "Quote"}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif text-brand-navy mb-2">{service.serviceName}</h3>
                      <p className="text-brand-navy/50 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                        {service.summary ?? "Professional AC service by certified technicians."}
                      </p>
                      <div className="flex flex-col gap-2.5">
                        <Link
                          to={`/services/${service.serviceId}`}
                          className="text-[10px] uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2 min-h-[44px]"
                        >
                          Learn more <ArrowRight size={12} />
                        </Link>
                        <Link
                          to={bookingPath}
                          state={{ serviceId: service.serviceId }}
                          className="bg-brand-navy text-white text-center py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all min-h-[44px] flex items-center justify-center"
                        >
                          Book Now
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </Grid>
            ) : (
              <div className="py-24 text-center">
                <div className="w-20 h-20 bg-brand-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={30} className="text-brand-navy/20" />
                </div>
                <h3 className="text-2xl font-serif text-brand-navy mb-3">No services found</h3>
                <p className="text-brand-navy/40 max-w-sm mx-auto text-sm">
                  {services.length === 0
                    ? "Our service list is being updated. Please check back shortly or WhatsApp us to book."
                    : "Nothing matches your search or filter. Try adjusting your criteria."}
                </p>
                {services.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setActiveCategory(0); setSearchQuery(""); }}
                    className="mt-6 text-brand-gold-deep text-xs uppercase tracking-widest font-bold hover:text-brand-navy transition-colors min-h-[44px]"
                  >
                    Reset all filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
}
