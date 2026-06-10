import { Link, useLocation } from "react-router-dom";
import { Plus, Phone } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useContent } from "../contexts/ContentContext";

/**
 * MobileActionBar — persistent bottom action bar for phones/tablets on the public
 * marketing surface. Keeps the two primary jobs ("call us" + "book a service")
 * one tap away no matter how far the visitor has scrolled. Hidden on lg+ where the
 * navbar already exposes both, and on the booking flow itself (its own controls).
 */
const HIDDEN_PATHS = ["/book", "/booking-confirmation"];

export default function MobileActionBar() {
  const { user, loading } = useAuth();
  const { getBlock } = useContent();
  const { pathname } = useLocation();

  if (HIDDEN_PATHS.includes(pathname)) return null;

  // Same CMS source the Footer uses (contact.phone), with the same real fallback.
  const phone = getBlock("contact.phone")?.content?.trim() || "7075949956";
  const telDigits = phone.replace(/\D/g, "");
  const bookingPath = !loading && user ? "/portal/book" : "/book";

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 safe-area-pb bg-brand-cream/95 backdrop-blur-md border-t border-brand-navy/10 shadow-[0_-2px_16px_rgba(0,0,0,0.08)]">
      <div className="flex items-stretch gap-2 px-4 py-3">
        <a
          href={`tel:+91${telDigits}`}
          aria-label="Call Coolzo"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-brand-navy/15 text-brand-navy text-[11px] uppercase tracking-widest font-bold min-h-[48px] active:bg-brand-navy/5 transition-colors"
        >
          <Phone size={16} /> Call
        </a>
        <Link
          to={bookingPath}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-brand-gold text-brand-navy text-[11px] uppercase tracking-widest font-bold min-h-[48px] shadow-md hover:bg-brand-gold/90 transition-colors"
        >
          <Plus size={16} strokeWidth={2.5} /> Book Service
        </Link>
      </div>
    </div>
  );
}
