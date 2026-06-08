/**
 * roleRoutes.ts
 *
 * Central authority for role → dashboard URL mapping.
 *
 * Every navigation decision in the application that depends on "where should
 * this user land?" must call getDashboardRoute() — no hardcoded "/portal"
 * strings anywhere else.
 *
 * Design rules:
 *  - Never returns null. Always produces a safe, navigable string.
 *  - Roles are checked in priority order: most privileged first.
 *  - When this app serves only the Customer Web Portal, non-customer roles
 *    fall back to /portal so the app remains functional if an admin account
 *    somehow authenticates here. The Angular Admin Portal is the authoritative
 *    destination for Admin / SuperAdmin users.
 */

import type { CurrentUserResponse } from '../types/auth';

// ─── Role constants ───────────────────────────────────────────────────────────
// Mirror the role names issued by the backend (AuthController /api/auth/me).
// Update here if the backend role strings ever change.
export const ROLES = {
  SUPER_ADMIN : 'SuperAdmin',
  ADMIN       : 'Admin',
  TECHNICIAN  : 'Technician',
  CUSTOMER    : 'Customer',
} as const;

export type AppRole = typeof ROLES[keyof typeof ROLES];

// ─── Dashboard routes ─────────────────────────────────────────────────────────

/** Customer-facing portal dashboard — primary destination for this web app. */
const CUSTOMER_DASHBOARD = '/portal';

/**
 * Returns the correct landing/dashboard URL for the authenticated user.
 *
 * Priority order (highest privilege first):
 *  SuperAdmin  → /portal  (fallback; canonical home is the Angular Admin Portal)
 *  Admin       → /portal  (fallback; canonical home is the Angular Admin Portal)
 *  Technician  → /portal  (read-only fallback; canonical home is the mobile app)
 *  Customer    → /portal
 *  (none)      → /portal  (safe default — avoids a blank redirect)
 */
export function getDashboardRoute(user: CurrentUserResponse | null): string {
  if (!user) return '/login';

  const roles = user.roles ?? [];

  // Highest-privilege roles first — ensures a SuperAdmin who also has the
  // Customer role still routes to the most appropriate destination.
  if (roles.includes(ROLES.SUPER_ADMIN)) return CUSTOMER_DASHBOARD;
  if (roles.includes(ROLES.ADMIN))       return CUSTOMER_DASHBOARD;
  if (roles.includes(ROLES.TECHNICIAN))  return CUSTOMER_DASHBOARD;
  if (roles.includes(ROLES.CUSTOMER))    return CUSTOMER_DASHBOARD;

  // No recognised role — safest default is the customer dashboard.
  return CUSTOMER_DASHBOARD;
}

/**
 * Returns true if the user holds at least one of the given roles.
 * Used by ProtectedRoute to enforce role-level access gates.
 *
 * @example
 *   hasRole(user, [ROLES.ADMIN, ROLES.SUPER_ADMIN])
 */
export function hasRole(
  user: CurrentUserResponse | null,
  allowed: AppRole[],
): boolean {
  if (!user) return false;
  return (user.roles ?? []).some((r) => allowed.includes(r as AppRole));
}

/**
 * Returns the customer portal booking URL for an authenticated user.
 * Authenticated booking lives inside the PortalLayout shell at /portal/book.
 * The public booking wizard at /book is for unauthenticated / guest flows.
 */
export function getBookingRoute(user: CurrentUserResponse | null): string {
  return user ? '/portal/book' : '/book';
}
