import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useContent } from "../contexts/ContentContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();
  const { logoUrl } = useContent();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "AMC Plans", path: "/amc" },
    { name: "Pricing", path: "/pricing" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" },
  ];

  const isOnHero = location.pathname === "/";
  // Solid (cream) header whenever we're not over the home hero, or once scrolled. This guarantees the
  // navy brand + links stay legible — they no longer sit navy-on-dark over an inner-page banner (item 10).
  const solidBg = scrolled || !isOnHero;
  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        solidBg ? "bg-brand-cream/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Logo — admin-published image (theme.logoUrl) when available, else the wordmark. */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          {logoUrl && !logoFailed ? (
            <img
              src={logoUrl}
              alt="Coolzo"
              onError={() => setLogoFailed(true)}
              className="h-8 sm:h-9 w-auto object-contain"
            />
          ) : (
            <span
              className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter transition-colors duration-500 ${
                solidBg ? "text-brand-navy" : "text-white"
              }`}
            >
              Coolzo
            </span>
          )}
        </Link>

        {/* Desktop nav (lg+) */}
        <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors duration-500 hover:text-brand-gold ${
                solidBg ? "text-brand-navy/70" : "text-white/70"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Book Service — desktop only (lg+); mobile uses the sticky MobileActionBar. */}
          <Link
            to={!loading && user ? "/portal/book" : "/book"}
            className={`hidden lg:flex items-center gap-1.5 px-5 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all duration-500 bg-brand-gold text-brand-navy ${
              solidBg ? "hover:bg-brand-gold/80" : "hover:bg-white"
            }`}
          >
            <Plus size={13} strokeWidth={2.5} />
            Book Service
          </Link>

          {/* Login / Portal CTA — tablet+ (md). Mobile gets it in the scroll strip below. */}
          {!loading && (
            <Link
              to={user ? "/portal" : "/login"}
              className={`hidden md:flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${
                solidBg
                  ? "bg-brand-navy text-white hover:bg-brand-navy/90"
                  : "bg-white text-brand-navy hover:bg-brand-gold hover:text-white"
              }`}
            >
              {user ? (
                <>
                  <LayoutDashboard size={14} /> Portal
                </>
              ) : (
                <>
                  <LogIn size={14} /> Login
                </>
              )}
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav (replaces the old hamburger "More" menu, item 12): an always-visible, borderless
          horizontal-scroll strip of tappable chips — no divider line, just scroll-and-tap. Hidden on lg+. */}
      <div className="lg:hidden mt-2">
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar px-4 sm:px-6">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap shrink-0 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-colors min-h-[40px] flex items-center ${
                  active
                    ? "bg-brand-navy text-white"
                    : solidBg
                      ? "bg-white text-brand-navy/70 hover:text-brand-navy"
                      : "bg-white/15 text-white hover:bg-white/25"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Portal / Login kept reachable on mobile (the old hamburger menu used to host it). */}
          {!loading && (
            <Link
              to={user ? "/portal" : "/login"}
              className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold bg-brand-gold text-brand-navy min-h-[40px]"
            >
              {user ? (
                <>
                  <LayoutDashboard size={12} /> Portal
                </>
              ) : (
                <>
                  <LogIn size={12} /> Login
                </>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
