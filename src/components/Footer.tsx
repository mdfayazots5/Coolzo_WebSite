import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { CatalogService } from "../services/catalogService";

// Fallback shown only if the live catalog can't be loaded — links resolve to All Services so a
// click is never broken.
const FALLBACK_EXPERTISE = [
  { label: "System Installation", to: "/services" },
  { label: "Precision Repair", to: "/services" },
  { label: "Gas Refilling", to: "/services" },
  { label: "Deep Jet Wash", to: "/services" },
];

export default function Footer() {
  const { getBlock } = useContent();

  // Expertise links are real service catalogs, deep-linked to the filtered Services view by id.
  const [expertise, setExpertise] = useState<{ label: string; to: string }[]>(FALLBACK_EXPERTISE);
  useEffect(() => {
    let active = true;
    CatalogService.getServiceCategories()
      .then((cats) => {
        if (active && cats?.length) {
          setExpertise(
            cats.slice(0, 4).map((c) => ({
              label: c.categoryName,
              to: `/services?cat=${c.serviceCategoryId}`,
            })),
          );
        }
      })
      .catch(() => {/* keep fallback */});
    return () => { active = false; };
  }, []);

  // Contact details are admin-editable via CMS content blocks (published snapshot).
  // Keys: contact.phone / contact.whatsapp / contact.email / contact.city.
  // Real values below are the fallback shown until an admin publishes those blocks.
  const block = (key: string, fallback: string) => getBlock(key)?.content?.trim() || fallback;
  const phone = block("contact.phone", "7075949956");
  const whatsapp = block("contact.whatsapp", "7075949956");
  const email = block("contact.email", "mdfayazots5@gmail.com");
  const city = block("contact.city", "Hyderabad, India");

  const digits = (s: string) => s.replace(/\D/g, "");
  const telDigits = digits(phone);
  const waDigits = digits(whatsapp).length === 10 ? `91${digits(whatsapp)}` : digits(whatsapp);

  // Social URLs are admin-editable via CMS content blocks (published snapshot).
  // Keys: social.instagram / social.twitter / social.facebook.
  // No fallback: an icon is rendered ONLY when its URL is published — absent = hidden.
  const socialUrl = (key: string) => getBlock(key)?.content?.trim() || "";
  const socials = [
    { key: "social.instagram", label: "Instagram", url: socialUrl("social.instagram"), Icon: Instagram },
    { key: "social.twitter", label: "Twitter", url: socialUrl("social.twitter"), Icon: Twitter },
    { key: "social.facebook", label: "Facebook", url: socialUrl("social.facebook"), Icon: Facebook },
  ].filter((s) => s.url.length > 0);

  return (
    <footer className="bg-brand-black text-white pt-16 md:pt-24 pb-28 lg:pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 md:gap-12 mb-12 md:mb-20">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="text-3xl font-serif font-bold tracking-tighter mb-5 block">Coolzo</Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs font-light">
              The trusted destination for professional air conditioning services and modern climate solutions. Reliable service for modern homes.
            </p>
            {socials.length > 0 && (
              <div className="flex gap-4">
                {socials.map(({ key, label, url, Icon }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow us on ${label}`}
                    className="w-11 h-11 flex items-center justify-center border border-white/10 rounded-lg hover:border-brand-gold transition-colors"
                  >
                    <Icon size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="col-span-1">
            <h4 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-5 md:mb-8">Expertise</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-white/60 font-light">
              {expertise.map((item, i) => (
                <li key={`${item.label}-${i}`}>
                  <Link to={item.to} className="hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1">
            <h4 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-5 md:mb-8">Quick Links</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-white/60 font-light">
              <li><Link to="/services" className="hover:text-white transition-colors">All Services</Link></li>
              <li><Link to="/book" className="hover:text-white transition-colors">Book a Service</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-brand-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-5 md:mb-8">Get in Touch</h4>
            <ul className="space-y-3 md:space-y-4 text-sm text-white/60 font-light">
              <li>
                <a href={`tel:+91${telDigits}`} className="flex items-center gap-3 hover:text-white transition-colors">
                  <Phone size={14} className="text-brand-gold shrink-0" /> +91 {phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors">
                  <MessageCircle size={14} className="text-brand-gold shrink-0" /> WhatsApp {whatsapp}
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-white transition-colors break-all">
                  <Mail size={14} className="text-brand-gold shrink-0" /> {email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={14} className="text-brand-gold shrink-0" /> {city}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 md:pt-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-medium">
            © 2026 Coolzo Professional AC Services. All Rights Reserved.
          </p>
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
            <p className="text-brand-gold text-[10px] uppercase tracking-[0.2em] font-bold">Authorized Professional Service Network</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
