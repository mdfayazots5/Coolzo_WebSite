import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, Plus, LogIn } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu whenever the active route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Services", path: "/services" },
    { name: "AMC Plans", path: "/amc" },
    { name: "Pricing", path: "/pricing" },
    { name: "Reviews", path: "/reviews" },
    { name: "Contact", path: "/contact" },
  ];

  const isOnHero = location.pathname === "/";
  const darkBg   = scrolled || isOpen || !isOnHero;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled || isOpen ? "bg-brand-cream/95 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-6"}`}>
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">

        {/* Logo — always returns to marketing home */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <span className={`text-xl sm:text-2xl font-serif font-bold tracking-tighter transition-colors duration-500 ${darkBg ? "text-brand-navy" : "text-white"}`}>
            Coolzo
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors duration-500 hover:text-brand-gold ${darkBg ? "text-brand-navy/70" : "text-white/70"}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Book Service — desktop only (lg+). On mobile/tablet the persistent
              booking action lives in the sticky MobileActionBar to avoid two
              fixed "Book" CTAs on screen at once. Destination is auth-aware. */}
          <Link
            to={!loading && user ? "/portal/book" : "/book"}
            className={`hidden lg:flex items-center gap-1.5 px-3 py-2 md:px-5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${darkBg ? "bg-brand-gold text-brand-navy hover:bg-brand-gold/80" : "bg-brand-gold text-brand-navy hover:bg-white"}`}
          >
            <Plus size={13} strokeWidth={2.5} />
            Book Service
          </Link>

          {/* Login / Portal CTA — hidden while auth resolves to prevent flash */}
          {!loading && (
            <Link
              to={user ? "/portal" : "/login"}
              className={`hidden md:flex items-center gap-2 px-6 py-2 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all duration-500 ${darkBg ? "bg-brand-navy text-white hover:bg-brand-navy/90" : "bg-white text-brand-navy hover:bg-brand-gold hover:text-white"}`}
            >
              {user ? <><LayoutDashboard size={14} /> Portal</> : <><LogIn size={14} /> Login</>}
            </Link>
          )}

          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="lg:hidden p-2 ml-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen
              ? <X size={24} className={darkBg ? "text-brand-navy" : "text-white"} />
              : <Menu size={24} className={darkBg ? "text-brand-navy" : "text-white"} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-brand-cream/95 backdrop-blur-md border-b border-brand-navy/5 p-6 flex flex-col gap-6 shadow-xl max-h-[80vh] overflow-y-auto"
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs uppercase tracking-widest font-bold text-brand-navy hover:text-brand-gold transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to={!loading && user ? "/portal/book" : "/book"}
              className="bg-brand-gold text-brand-navy px-6 py-4 rounded-lg text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
            >
              <Plus size={14} strokeWidth={2.5} /> Book Service
            </Link>
            {!loading && (
              <Link
                to={user ? "/portal" : "/login"}
                className="bg-brand-navy text-white px-6 py-4 rounded-lg text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2"
              >
                {user ? <><LayoutDashboard size={14} /> My Portal</> : <><LogIn size={14} /> Login</>}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
