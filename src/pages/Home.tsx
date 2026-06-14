import { motion } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Star,
  ArrowRight,
  Wrench,
  Wind,
  Zap,
  Droplets,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CatalogService } from "../services/catalogService";
import type { ServiceCategoryLookupResponse, ServiceLookupResponse } from "../types/catalog";
import { useAuth } from "../contexts/AuthContext";
import { useContent } from "../contexts/ContentContext";
import Section from "../components/Section";
import Container from "../components/Container";
import SnapshotImage from "../components/SnapshotImage";
import type { SnapshotBanner } from "../services/snapshotService";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: "easeOut" },
};

// AC-relevant icon resolved from the category name.
function categoryIcon(name: string | undefined | null) {
  const n = (name ?? "").toLowerCase();
  if (n.includes("repair")) return <Wrench size={26} />;
  if (n.includes("clean") || n.includes("wash") || n.includes("service")) return <Wind size={26} />;
  if (n.includes("install")) return <Zap size={26} />;
  if (n.includes("gas") || n.includes("refill")) return <Droplets size={26} />;
  if (n.includes("amc") || n.includes("maint")) return <ShieldCheck size={26} />;
  return <Wind size={26} />;
}

// Graceful fallback shown only if the live catalog can't be loaded.
const STATIC_CATEGORIES: { title: string; desc: string }[] = [
  { title: "AC Repair", desc: "Fast diagnosis and fix for any cooling fault." },
  { title: "Service & Cleaning", desc: "Deep jet-wash for cleaner, healthier air." },
  { title: "Gas Refill", desc: "Pressure check and top-up for full cooling." },
  { title: "Installation", desc: "Safe, correct fitting for new units." },
];

// Shown only if the live zones API can't be reached.
const FALLBACK_ZONES = [
  "Banjara Hills", "Jubilee Hills", "Gachibowli", "Madhapur",
  "Kukatpally", "Kondapur", "Secunderabad", "Hitech City",
];

// Count-aware column class so the card row never leaves an awkward orphan
// (e.g. 5 cards => 3+2 on desktop, not 4+1). Mobile stays 2-up for tap targets.
function serviceGridCols(count: number): string {
  if (count <= 2) return "grid-cols-1 sm:grid-cols-2";
  if (count === 3) return "grid-cols-2 sm:grid-cols-3";
  if (count === 4) return "grid-cols-2 lg:grid-cols-4";
  return "grid-cols-2 sm:grid-cols-3"; // 5–6 cards → 3-up desktop, balanced rows
}

// Admin-published promo banner (snapshot content.banners, displayArea="Home"). The brand-navy
// gradient is always the base, so a missing/404 image degrades to a styled banner — never a
// broken image. redirectUrl may be an internal route or an external URL.
function PromoBanner({ banner }: { banner: SnapshotBanner }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(banner.imageUrl) && !imageFailed;
  const isExternal = /^https?:\/\//i.test(banner.redirectUrl);

  const card = (
    <div className="relative overflow-hidden rounded-2xl bg-brand-navy shadow-lg group">
      {/* Admin image (when set) sits behind a left-weighted scrim for legible text. */}
      {hasImage && (
        <img
          src={banner.imageUrl}
          alt=""
          aria-hidden="true"
          onError={() => setImageFailed(true)}
          className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-opacity duration-500"
          loading="lazy"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/90 to-brand-navy/50" />
      {/* Decorative gold accent keeps the banner intentional even with no image. */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/3" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 px-6 sm:px-10 py-8 sm:py-9">
        <div className="max-w-2xl">
          {banner.subtitle?.trim() && (
            <span className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-2.5 block">
              {banner.subtitle}
            </span>
          )}
          <h2 className="font-serif text-white text-2xl sm:text-3xl leading-tight">{banner.title}</h2>
        </div>
        {banner.redirectUrl?.trim() && (
          <span className="inline-flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto bg-brand-gold text-brand-navy px-7 py-3.5 rounded-lg text-[11px] uppercase tracking-[0.15em] font-bold group-hover:bg-white transition-all min-h-[44px]">
            Learn more <ArrowRight size={15} />
          </span>
        )}
      </div>
    </div>
  );

  if (!banner.redirectUrl?.trim()) {
    return card;
  }
  return isExternal ? (
    <a href={banner.redirectUrl} target="_blank" rel="noopener noreferrer" className="block">
      {card}
    </a>
  ) : (
    <Link to={banner.redirectUrl} className="block">
      {card}
    </Link>
  );
}

export default function Home() {
  const { user } = useAuth();
  const { getBlock, getBanners } = useContent();
  const bookingPath = user ? "/portal/book" : "/book";
  const homeBanners = getBanners("Home");

  // Trust-strip figures are admin-editable CMS blocks (title = value, body = label); the literals
  // here are the fallback until an admin publishes that block.
  const stat = (key: string, value: string, label: string) => {
    const block = getBlock(key);
    return { value: block?.title?.trim() || value, label: block?.content?.trim() || label };
  };
  const ratingStat = stat("home.stat.rating", "4.9/5", "across Hyderabad");
  const trustStats = [
    stat("home.stat.zones", "20+", "Zones Covered"),
    stat("home.stat.technicians", "500+", "Certified Technicians"),
    stat("home.stat.response", "4 hr", "Emergency Response"),
  ];

  // Admin-editable CMS content blocks (published snapshot). Each block carries a `title`
  // (heading) + `content` (body); fallbacks below are the built-in copy shown until an
  // admin publishes that block. Keys must match Admin KNOWN_BLOCK_KEYS and the snapshot.
  const heroBlock = getBlock("home.hero");
  const aboutBlock = getBlock("home.about");
  const [categories, setCategories] = useState<ServiceCategoryLookupResponse[]>([]);
  const [services, setServices] = useState<ServiceLookupResponse[]>([]);
  const [zones, setZones] = useState<string[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      CatalogService.getServiceCategories(),
      CatalogService.getServices(),
      CatalogService.getZones(),
    ])
      .then(([cat, svc, zone]) => {
        if (cat.status === "fulfilled" && cat.value?.length) setCategories(cat.value);
        if (svc.status === "fulfilled" && svc.value?.length) setServices(svc.value);
        if (zone.status === "fulfilled" && zone.value?.length) {
          setZones(zone.value.filter((z) => z.isActive).map((z) => z.zoneName));
        }
      })
      .catch(() => {/* graceful: fall back to static lists */})
      .finally(() => setLoadingCats(false));
  }, []);

  const displayZones = zones.length > 0 ? zones.slice(0, 8) : FALLBACK_ZONES;

  // Lowest base price per category → "From ₹X" on each card. Categories with no
  // priced service simply omit the price (we never invent one).
  const fromPriceByCategory = useMemo(() => {
    const map: Record<number, number> = {};
    for (const s of services) {
      if (s.basePrice == null) continue;
      const current = map[s.serviceCategoryId];
      if (current == null || s.basePrice < current) map[s.serviceCategoryId] = s.basePrice;
    }
    return map;
  }, [services]);

  // Category cards carry no image in the catalog contract — only individual services do. We derive a
  // representative image per category from the first of its services that has one; cards with no
  // priced/imaged service fall back to the icon (we never invent an image).
  const imageByCategory = useMemo(() => {
    const map: Record<number, string> = {};
    for (const s of services) {
      if (!s.imageUrl?.trim()) continue;
      if (map[s.serviceCategoryId] == null) map[s.serviceCategoryId] = s.imageUrl;
    }
    return map;
  }, [services]);

  const displayCategories =
    categories.length > 0
      ? categories.slice(0, 6).map((cat) => ({
          categoryId: cat.serviceCategoryId as number | undefined,
          title: cat.categoryName ?? "Service",
          desc: cat.description ?? "Professional AC service by certified technicians.",
          fromPrice: fromPriceByCategory[cat.serviceCategoryId] ?? null,
          imageUrl: imageByCategory[cat.serviceCategoryId] ?? null,
        }))
      : STATIC_CATEGORIES.map((c) => ({ categoryId: undefined as number | undefined, fromPrice: null as number | null, imageUrl: null as string | null, ...c }));

  return (
    <div className="bg-brand-cream">
      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center min-h-[88vh] overflow-hidden bg-brand-navy">
        <div className="absolute inset-0 z-0">
          <SnapshotImage
            slotKey="home.hero"
            fallbackSrc="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
            alt="Air conditioning service"
            className="w-full h-full object-cover opacity-25"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/85 to-brand-navy/40" />
        </div>

        <Container className="relative z-10 pt-28 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="text-brand-gold text-[11px] uppercase tracking-[0.3em] font-bold mb-5 block">
              AC Repair · Service · Installation · Gas Refill
            </span>
            <h1 className="font-serif text-white leading-[1.05] mb-6">
              {heroBlock?.title?.trim() ? (
                heroBlock.title
              ) : (
                <>
                  Cool, clean air —<br />
                  <span className="italic">booked in 60 seconds.</span>
                </>
              )}
            </h1>
            <p className="text-white/70 text-base sm:text-lg mb-9 max-w-xl leading-relaxed font-light">
              {heroBlock?.content?.trim() ||
                "Certified AC technicians across Hyderabad. Transparent pricing, on-time arrival, and a digital service report after every visit."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                to={bookingPath}
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-8 py-4 rounded-lg text-xs uppercase tracking-[0.15em] font-bold hover:bg-white transition-all shadow-xl min-h-[44px]"
              >
                Book a Service <ChevronRight size={16} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center border border-white/25 text-white px-8 py-4 rounded-lg text-xs uppercase tracking-[0.15em] font-bold hover:bg-white/10 transition-all min-h-[44px]"
              >
                View All Services
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Trust strip ────────────────────────────────────────────────────── */}
      <Section as="div" surface="white" spacing="compact" className="border-b border-brand-navy/5">
        <Container>
          {/* Mobile-first: rating centered on top, then 3 equal stat columns under a divider.
              From sm: rating on the left, stats spread to the right on one row. */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
            <div className="flex items-center justify-center gap-3 sm:justify-start">
              <div className="flex items-center gap-1 text-brand-gold">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} className="fill-brand-gold" />)}
              </div>
              <p className="text-[11px] uppercase tracking-widest font-bold text-brand-navy">{ratingStat.value} {ratingStat.label}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 border-t border-brand-navy/5 pt-5 sm:flex sm:gap-12 sm:border-t-0 sm:pt-0">
              {trustStats.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-lg sm:text-2xl font-serif text-brand-navy">{item.value}</p>
                  <p className="text-[8px] sm:text-[9px] uppercase tracking-widest font-bold text-brand-gold-deep leading-tight mt-0.5">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── Promo banners (admin-published CMS, displayArea="Home") ────────────
          Renders only when banners are published; absent otherwise (graceful empty). */}
      {homeBanners.length > 0 && (
        <Section surface="white" spacing="compact">
          <Container>
            <div className="flex flex-col gap-4">
              {homeBanners.map((banner, i) => (
                <PromoBanner key={`${banner.title}-${i}`} banner={banner} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* ── Services ───────────────────────────────────────────────────────── */}
      <Section spacing="default">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">What we do</span>
            <h2 className="font-serif text-brand-navy mb-4">Every AC need, one trusted team</h2>
            <p className="text-brand-navy/50 text-sm md:text-base leading-relaxed">
              Pick a service and book a slot — or let our technician diagnose on-site. No hidden charges.
            </p>
          </div>

          {loadingCats ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Loader2 className="animate-spin text-brand-gold" size={32} />
              <p className="text-[10px] uppercase tracking-widest font-bold text-brand-navy/40">Loading services…</p>
            </div>
          ) : (
            <div className={`grid ${serviceGridCols(displayCategories.length)} gap-3 sm:gap-6 lg:gap-8`}>
              {displayCategories.map((service, i) => (
                <motion.div
                  key={service.categoryId ?? i}
                  {...fadeIn}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white p-4 sm:p-6 rounded-xl border border-brand-navy/5 hover:border-brand-gold/30 hover:shadow-xl transition-all duration-300 flex flex-col h-full shadow-sm"
                >
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-full aspect-[16/9] object-cover rounded-lg mb-3 sm:mb-5"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-brand-gold/10 text-brand-gold flex items-center justify-center mb-3 sm:mb-5">
                      {categoryIcon(service.title)}
                    </div>
                  )}
                  <h3 className="text-base sm:text-lg font-serif text-brand-navy mb-1.5 sm:mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-brand-navy/50 leading-relaxed mb-3 sm:mb-5 flex-grow line-clamp-2 sm:line-clamp-none">{service.desc}</p>
                  <p className="font-serif text-brand-navy text-lg sm:text-xl mb-3 sm:mb-4">
                    {service.fromPrice != null ? (
                      <>
                        <span className="text-brand-navy/40 text-[10px] uppercase tracking-widest font-bold align-middle mr-1.5">From</span>
                        ₹{service.fromPrice.toLocaleString("en-IN")}
                      </>
                    ) : (
                      <span className="text-brand-navy/50 text-xs sm:text-sm font-sans">On inspection</span>
                    )}
                  </p>
                  <div className="flex flex-col gap-2">
                    <Link
                      to={bookingPath}
                      state={service.categoryId ? { serviceCategoryId: service.categoryId, serviceCategoryName: service.title } : undefined}
                      className="bg-brand-navy text-white text-center py-2.5 sm:py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold hover:bg-brand-gold hover:text-brand-navy transition-all min-h-[44px] flex items-center justify-center"
                    >
                      Book Now
                    </Link>
                    <Link
                      to={service.categoryId ? `/services?cat=${service.categoryId}` : "/services"}
                      className="hidden sm:flex text-[10px] uppercase tracking-widest font-bold text-brand-navy/50 hover:text-brand-gold-deep transition-colors items-center justify-center gap-1.5 min-h-[36px]"
                    >
                      View details <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {/* ── Hyderabad coverage ─────────────────────────────────────────────── */}
      <Section surface="cream" spacing="default" className="bg-brand-navy/5">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-brand-gold/10 blur-3xl rounded-full" />
              <SnapshotImage
                slotKey="home.coverage"
                fallbackSrc="https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&w=2070&auto=format&fit=crop"
                alt="Hyderabad service coverage"
                className="rounded-xl shadow-2xl relative z-10 w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">Service coverage</span>
              <h2 className="font-serif text-brand-navy mb-6">Serving across Hyderabad</h2>
              <p className="text-brand-navy/60 text-base mb-8 leading-relaxed font-light">
                From Gachibowli to Secunderabad, our technicians reach all major zones — with a 4-hour
                response promise for emergencies.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {displayZones.map((zone) => (
                  <div key={zone} className="flex items-center gap-2.5 text-brand-navy/50">
                    <CheckCircle2 size={15} className="text-brand-gold shrink-0" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">{zone}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── How it works ───────────────────────────────────────────────────── */}
      <Section surface="navy" spacing="default">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <div>
              <span className="text-brand-gold text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">How it works</span>
              <h2 className="font-serif mb-3">Four simple steps</h2>
              <p className="text-white/50 text-sm md:text-base leading-relaxed max-w-md">
                From booking to a comfortable room — handled by certified professionals.
              </p>
            </div>
            <div className="space-y-8">
              {[
                { step: "01", title: "Book online", desc: "Pick your service and a time window in under a minute." },
                { step: "02", title: "Technician assigned", desc: "We match a specialist certified for your AC type." },
                { step: "03", title: "Track arrival", desc: "Get real-time updates as your technician heads over." },
                { step: "04", title: "Comfort restored", desc: "Enjoy cool air plus a digital report of the work done." },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 group"
                >
                  <span className="text-2xl font-serif text-brand-gold/40 group-hover:text-brand-gold transition-colors shrink-0">{item.step}</span>
                  <div>
                    <h4 className="text-lg font-serif mb-1">{item.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed max-w-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ── About (CMS: home.about) ────────────────────────────────────────── */}
      <Section surface="white" spacing="default">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-brand-gold-deep text-[10px] uppercase tracking-[0.4em] font-bold mb-3 block">
              About Coolzo
            </span>
            <h2 className="font-serif text-brand-navy mb-5">
              {aboutBlock?.title?.trim() || "Why customers choose Coolzo"}
            </h2>
            <p className="text-brand-navy/60 text-base md:text-lg leading-relaxed font-light">
              {aboutBlock?.content?.trim() ||
                "Certified technicians, transparent pricing, and a digital service report after every visit — dependable AC care across Hyderabad."}
            </p>
          </div>
        </Container>
      </Section>

      {/* ── Final CTA ──────────────────────────────────────────────────────── */}
      <Section spacing="default">
        <Container>
          <div className="bg-brand-navy rounded-2xl px-8 py-14 md:px-16 md:py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-gold/5 skew-x-12 translate-x-1/4" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 text-brand-gold mb-5">
                <Clock size={16} /> <ShieldCheck size={16} />
              </div>
              <h2 className="font-serif text-white mb-4">Ready for reliable cooling?</h2>
              <p className="text-white/60 text-base mb-9 leading-relaxed font-light">
                Book a certified technician now — on-time arrival and a clean-work guarantee on every visit.
              </p>
              <Link
                to={bookingPath}
                className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-10 py-4 rounded-lg text-xs uppercase tracking-[0.15em] font-bold hover:bg-white transition-all min-h-[44px]"
              >
                Book a Service <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
