import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BRAND = "Coolzo";

// Maps a route to its section label. Exact paths first; dynamic/prefixed routes fall through to the
// startsWith table below. The home page shows the brand alone (no "— Section" suffix).
const EXACT_TITLES: Record<string, string> = {
  "/": "",
  "/services": "Services",
  "/pricing": "Pricing",
  "/amc": "AMC Plans",
  "/about": "About",
  "/why-coolzo": "Why Coolzo",
  "/reviews": "Reviews",
  "/contact": "Contact",
  "/book": "Book a Service",
  "/booking-confirmation": "Booking Confirmed",
  "/terms": "Terms of Service",
  "/privacy": "Privacy Policy",
  "/login": "Login",
  "/register": "Register",
  "/forgot-password": "Reset Password",
  "/reset-password": "Reset Password",
  "/session-expired": "Session Expired",
  "/maintenance": "Maintenance",
  "/error": "Something Went Wrong",
  "/portal": "My Portal",
  "/portal/bookings": "My Bookings",
  "/portal/amc": "My AMC Plans",
  "/portal/equipment": "My Appliances",
  "/portal/invoices": "Billing",
  "/portal/support": "Support",
  "/portal/profile": "My Profile",
  "/portal/addresses": "My Addresses",
  "/portal/notifications": "Notifications",
  "/portal/referral": "Refer & Earn",
};

// Prefix matches for dynamic/detail routes (checked longest-first so the most specific wins).
const PREFIX_TITLES: [string, string][] = [
  ["/services/", "Service Details"],
  ["/portal/bookings/", "Booking Details"],
  ["/portal/equipment/", "Appliance Details"],
  ["/portal/invoices/", "Invoice"],
  ["/portal/support/new", "New Support Ticket"],
  ["/portal/support/", "Support Ticket"],
  ["/portal/feedback/", "Leave Feedback"],
  ["/portal/book", "Book a Service"],
];

function sectionFor(pathname: string): string {
  if (pathname in EXACT_TITLES) {
    return EXACT_TITLES[pathname];
  }
  const match = PREFIX_TITLES
    .filter(([prefix]) => pathname.startsWith(prefix))
    .sort((a, b) => b[0].length - a[0].length)[0];
  return match ? match[1] : "";
}

/**
 * Sets the browser tab title to "Coolzo — <Section>" for the active route (just "Coolzo" on home /
 * unmapped routes). Mounted once inside the router; runs on every navigation.
 */
export default function RouteTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const section = sectionFor(pathname);
    document.title = section ? `${BRAND} — ${section}` : BRAND;
  }, [pathname]);

  return null;
}
