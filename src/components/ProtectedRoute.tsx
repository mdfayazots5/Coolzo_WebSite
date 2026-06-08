/**
 * ProtectedRoute.tsx
 *
 * Authentication guard for the portal route subtree.
 *
 * Behaviour:
 *  - While the auth session is being restored (loading = true):
 *    renders nothing (null) — avoids a flash redirect before the token check.
 *  - If no authenticated user: redirects to /login, preserving the intended
 *    destination in ?returnUrl so Login can send the user back after sign-in.
 *  - If authenticated: renders the child routes via <Outlet />.
 *
 * Optional role gating:
 *  Pass `allowedRoles` to restrict a route to specific roles.
 *  Authenticated users who do not hold a required role are redirected to their
 *  own dashboard instead of a 403, keeping the UX clean.
 *
 * Usage in App.tsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/portal" element={<PortalLayout />}>
 *       ...portal routes...
 *     </Route>
 *   </Route>
 *
 *   // Role-gated:
 *   <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
 *     ...admin-only routes...
 *   </Route>
 */

import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardRoute, hasRole } from '../utils/roleRoutes';
import type { AppRole } from '../utils/roleRoutes';

interface ProtectedRouteProps {
  /**
   * When provided, only users with at least one of these roles may proceed.
   * Users who are authenticated but lack the required role are redirected to
   * their own dashboard (not to /login).
   */
  allowedRoles?: AppRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ── 1. Session still being restored ──────────────────────────────────────
  // Render nothing while the auth context is initialising. This prevents the
  // brief redirect to /login that would occur before the stored token is read.
  if (loading) return null;

  // ── 2. Not authenticated ──────────────────────────────────────────────────
  // Preserve the full path + search + hash so the user returns to exactly
  // where they tried to go once they have signed in.
  if (!user) {
    const returnUrl = encodeURIComponent(
      location.pathname + location.search + location.hash,
    );
    return <Navigate to={`/login?returnUrl=${returnUrl}`} replace />;
  }

  // ── 3. Authenticated but missing required role ────────────────────────────
  if (allowedRoles && allowedRoles.length > 0 && !hasRole(user, allowedRoles)) {
    return <Navigate to={getDashboardRoute(user)} replace />;
  }

  // ── 4. All checks passed — render the protected content ──────────────────
  return <Outlet />;
}
