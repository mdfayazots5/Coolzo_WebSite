import { Link, useLocation, Outlet } from "react-router-dom";
import {
  Home,
  Calendar,
  ShieldCheck,
  Package,
  Bell,
  Plus,
  FileText,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getDashboardRoute } from "../utils/roleRoutes";

export default function PortalLayout() {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { name: "Home",       path: "/portal",           icon: Home       },
    { name: "Bookings",   path: "/portal/bookings",  icon: Calendar   },
    { name: "Plans",      path: "/portal/amc",       icon: ShieldCheck},
    { name: "Appliances", path: "/portal/equipment", icon: Package    },
    { name: "Billing",    path: "/portal/invoices",  icon: FileText   },
  ];

  const userInitial = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "U";

  const isActive = (path: string) =>
    path === "/portal"
      ? location.pathname === "/portal"
      : location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-30">

        {/* ── Primary row ─────────────────────────────────────────────────────── */}
        <div className="px-4 sm:px-8 h-14 flex items-center gap-3">

          {/* Logo — role-aware: sends each user to their correct dashboard */}
          <Link
            to={getDashboardRoute(user)}
            className="text-lg font-serif font-bold text-brand-navy tracking-tight shrink-0 hover:text-brand-gold transition-colors"
          >
            Coolzo
          </Link>

          {/* Desktop primary nav — laptop+ only; mobile uses the bottom tab bar.
              Hidden below lg so the two navigation systems never co-exist. */}
          <nav className="hidden lg:flex items-center gap-1 ml-6">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-2 h-11 px-3 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 ${
                    active
                      ? "bg-brand-navy text-white"
                      : "text-slate-600 hover:text-brand-navy hover:bg-slate-100"
                  }`}
                >
                  <Icon size={18} strokeWidth={active ? 2.25 : 1.75} className="shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* ml-auto pushes the action cluster to the far right on all breakpoints */}
          <div className="ml-auto flex items-center gap-1">

            {/* Book Service — stays inside portal shell for authenticated users */}
            <Link
              to="/portal/book"
              aria-label="Book Service"
              className="flex items-center justify-center gap-1.5 bg-brand-navy text-white rounded-lg text-sm font-medium transition-colors hover:bg-brand-gold hover:text-brand-navy h-9 px-3 sm:px-4"
            >
              <Plus size={16} strokeWidth={2.5} className="shrink-0" />
              <span>Book Service</span>
            </Link>

            {/* Notifications — 44 × 44 px touch target (WCAG 2.5.5) */}
            <Link
              to="/portal/notifications"
              aria-label="Notifications"
              className="relative w-11 h-11 flex items-center justify-center rounded-lg text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-gold rounded-full pointer-events-none" />
            </Link>

            {/* Profile avatar — ring-offset lifts the focus ring above the circle */}
            <Link
              to="/portal/profile"
              aria-label="My Profile"
              className="w-9 h-9 rounded-full bg-brand-navy flex items-center justify-center text-white font-semibold text-xs hover:ring-2 hover:ring-brand-gold/40 hover:ring-offset-1 transition-all"
            >
              {userInitial}
            </Link>

          </div>
        </div>

      </header>

      {/* ── Page Content ────────────────────────────────────────────────────── */}
      {/*
        Bottom padding is set explicitly via pb-* at every breakpoint to ensure
        the fixed global footer never obscures content — p-* shorthand would
        override a bare pb-24 at sm and lg breakpoints.
      */}
      <main className="flex-1 px-4 pt-4 pb-28 sm:px-6 sm:pt-6 sm:pb-28 lg:px-8 lg:pt-8 lg:pb-10">
        <Outlet />
      </main>

      {/* ── Global Bottom Nav ────────────────────────────────────────────────
           Design: deep navy surface, warm-gold active state, layered elevation.
           Touch targets ≥ 44 px (WCAG 2.5.5). Safe-area padding for iOS notch.
      ──────────────────────────────────────────────────────────────────────── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 safe-area-pb lg:hidden"
        style={{
          background: "linear-gradient(180deg, color-mix(in srgb, var(--color-brand-navy) 85%, #fff) 0%, var(--color-brand-navy) 100%)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.45), 0 -1px 0 rgba(212,175,55,0.18)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Inner flex row — tight vertical rhythm, generous horizontal spread */}
        <div className="flex justify-around items-stretch px-1 pt-2 pb-2">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className="relative flex flex-col items-center gap-1.5 px-3 py-1 min-w-[52px] min-h-[52px] justify-center transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60 rounded-xl"
              >
                {/* Active bar — thin gold line at very top of each item */}
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] rounded-b-full transition-all duration-300"
                  style={{
                    width: active ? "24px" : "0px",
                    background: active ? "var(--color-brand-gold)" : "transparent",
                  }}
                />

                {/* Icon pill — gold fill + glow on active; ghost on inactive */}
                <div
                  className="flex items-center justify-center rounded-2xl transition-all duration-200"
                  style={{
                    width: 40,
                    height: 36,
                    background: active ? "var(--color-brand-gold)" : "rgba(255,255,255,0.05)",
                    boxShadow: active
                      ? "0 4px 18px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.25)"
                      : "none",
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.25 : 1.5}
                    style={{
                      color: active ? "var(--color-brand-navy)" : "rgba(255,255,255,0.45)",
                    }}
                  />
                </div>

                {/* Label — gold on active, muted white on inactive */}
                <span
                  className="text-[9px] font-semibold tracking-widest uppercase transition-colors duration-200 leading-none"
                  style={{
                    color: active ? "var(--color-brand-gold)" : "rgba(255,255,255,0.38)",
                  }}
                >
                  {item.name.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

    </div>
  );
}
