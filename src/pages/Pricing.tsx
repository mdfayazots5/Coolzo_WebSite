import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { CatalogService } from "../services/catalogService";
import type { ServiceLookupResponse, ServiceCategoryLookupResponse } from "../types/catalog";
import { useAuth } from "../contexts/AuthContext";
import Container from "../components/Container";
import Section from "../components/Section";

export default function Pricing() {
  const { user } = useAuth();
  const bookingPath = user ? "/portal/book" : "/book";
  const [services, setServices] = useState<ServiceLookupResponse[]>([]);
  const [categories, setCategories] = useState<ServiceCategoryLookupResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([CatalogService.getServices(), CatalogService.getServiceCategories()])
      .then(([svc, cat]) => {
        if (svc.status === "fulfilled") setServices(svc.value ?? []);
        if (cat.status === "fulfilled") setCategories(cat.value ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  // Group services under their category, preserving category order.
  const grouped = useMemo(() => {
    return categories
      .map((cat) => ({
        category: cat,
        items: services.filter((s) => s.serviceCategoryId === cat.serviceCategoryId),
      }))
      .filter((g) => g.items.length > 0);
  }, [categories, services]);

  return (
    <div className="pt-28 pb-20 bg-brand-cream min-h-screen">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Transparent pricing</span>
          <h1 className="font-serif text-brand-navy mb-4">Clear prices, no surprises</h1>
          <p className="text-brand-navy/50 text-base md:text-lg font-light leading-relaxed">
            Starting prices for our services. Final charges are confirmed on-site before any work — plus applicable GST.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-brand-gold" size={36} /></div>
        ) : grouped.length === 0 ? (
          <div className="py-16 text-center">
            <ShieldCheck size={40} className="text-brand-navy/20 mx-auto mb-4" />
            <p className="text-brand-navy/40 text-sm max-w-sm mx-auto">
              Our price list is being updated. Please WhatsApp us for a quote in the meantime.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(({ category, items }) => (
              <Section key={category.serviceCategoryId} as="div" spacing="none">
                <h2 className="text-xl font-serif text-brand-navy mb-4 pb-3 border-b border-brand-navy/10">{category.categoryName}</h2>
                <div className="bg-white rounded-xl border border-brand-navy/5 shadow-sm divide-y divide-brand-navy/5">
                  {items.map((s) => (
                    <div key={s.serviceId} className="flex items-center justify-between gap-4 p-5">
                      <div className="min-w-0">
                        <Link to={`/services/${s.serviceId}`} className="text-base font-semibold text-brand-navy hover:text-brand-gold transition-colors">
                          {s.serviceName}
                        </Link>
                        {s.summary && <p className="text-brand-navy/50 text-sm mt-0.5 line-clamp-1">{s.summary}</p>}
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-[9px] uppercase tracking-widest font-bold text-brand-navy/30">From</p>
                          <p className="text-lg font-serif text-brand-navy">
                            {s.basePrice != null ? `₹${s.basePrice.toLocaleString()}` : "On inspection"}
                          </p>
                        </div>
                        <Link
                          to={bookingPath}
                          state={{ serviceId: s.serviceId }}
                          className="hidden sm:inline-flex items-center gap-1.5 bg-brand-navy text-white px-4 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all min-h-[44px]"
                        >
                          Book <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
