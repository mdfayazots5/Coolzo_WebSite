# Coolzo Frontend → Backend API Integration Plan

## Context

The Coolzo frontend web app (`/mnt/c/Live/Coolzo/Frontend/Web`) was built with Google AI Studio using dummy/mock data. The backend (`/mnt/c/Live/Coolzo/Backend`) has 87 controllers and 300+ endpoints, partially implemented, using ASP.NET Core 8 + PostgreSQL + Clean Architecture.

**Goal**: Replace all mock data with real API calls, screen by screen, without touching any UI/design/layout. Produce a production-grade, scalable service layer.

**Three critical structural bugs to fix first** (in `apiClient.ts`):
1. Base URL has wrong `/v1` suffix — backend routes start at `/api/`, no versioning in path
2. Response interceptor returns `response.data` (full `ApiResponse<T>` envelope) but callers expect the unwrapped payload — must return `response.data.data`
3. Auth header injection currently returns `{}` — must read JWT from token storage

---

## Screen-to-API Mapping

| Screen | File | Backend Endpoints |
|--------|------|-------------------|
| **Home** | `pages/Home.tsx` | `GET /api/cms/public/home`, `GET /api/cms/public/banners`, `GET /api/customer-reviews` |
| **Services** | `pages/Services.tsx` | `GET /api/booking-lookups/service-categories`, `GET /api/booking-lookups/services` |
| **ServiceDetail** | `pages/ServiceDetail.tsx` | `GET /api/booking-lookups/services`, `GET /api/cms/public/faqs`, `GET /api/customer-reviews?serviceId=` |
| **Reviews** | `pages/Reviews.tsx` | `GET /api/customer-reviews` |
| **AMC (public)** | `pages/AMC.tsx` | `GET /api/amc/plans` |
| **Blog** | `pages/Blog.tsx` | `GET /api/cms/public/blogs` |
| **BlogDetail** | `pages/BlogDetail.tsx` | `GET /api/cms/blocks/{key}` or blog detail endpoint |
| **BookingWizard** | `pages/BookingWizard.tsx` | `GET /api/booking-lookups/service-categories`, `GET /api/booking-lookups/services`, `GET /api/booking-lookups/ac-types`, `GET /api/booking-lookups/tonnage`, `GET /api/booking-lookups/brands`, `GET /api/booking-lookups/zones/by-pincode/{pincode}`, `GET /api/booking-lookups/slots?zoneId=&slotDate=`, `POST /api/bookings/customer` (auth) or `POST /api/bookings/guest` |
| **BookingConfirmation** | `pages/BookingConfirmation.tsx` | `GET /api/bookings/{id}` |
| **Login** | `pages/Login.tsx` | `POST /api/auth/login` (email/pw), `POST /api/auth/otp/send` + `POST /api/auth/otp/verify` (OTP) |
| **Register** | `pages/Register.tsx` | `POST /api/customer-auth/register` + OTP verify |
| **ForgotPassword** | `pages/ForgotPassword.tsx` | `POST /api/auth/forgot-password` |
| **ResetPassword** | `pages/ResetPassword.tsx` | `POST /api/auth/reset-password` |
| **Dashboard** | `pages/portal/Dashboard.tsx` | `GET /api/bookings/my-bookings?pageSize=5`, `GET /api/customers/me/equipment`, `GET /api/amc/customer/me` |
| **BookingsList** | `pages/portal/BookingsList.tsx` | `GET /api/bookings/my-bookings?pageNumber=&pageSize=` (paginated) |
| **BookingDetail** | `pages/portal/BookingDetail.tsx` | `GET /api/bookings/{id}`, `POST /api/bookings/{id}/reschedule` |
| **AMCDashboard** | `pages/portal/AMCDashboard.tsx` | `GET /api/amc/customer/me`, `GET /api/amc/plans` |
| **EquipmentList** | `pages/portal/EquipmentList.tsx` | `GET /api/customers/me/equipment`, `POST /api/customers/me/equipment` |
| **EquipmentDetail** | `pages/portal/EquipmentDetail.tsx` | `GET /api/customers/me/equipment/{id}` ⚠️ MISSING, `PUT /api/customers/me/equipment/{id}`, `DELETE /api/customers/me/equipment/{id}` |
| **InvoicesList** | `pages/portal/InvoicesList.tsx` | `GET /api/invoices/customer?pageNumber=&pageSize=` |
| **InvoiceDetail** | `pages/portal/InvoiceDetail.tsx` | `GET /api/invoices/{id}`, `GET /api/invoices/{id}/pdf` |
| **TicketsList** | `pages/portal/TicketsList.tsx` | `GET /api/support-tickets/my-tickets?pageNumber=&pageSize=` |
| **TicketDetail** | `pages/portal/TicketDetail.tsx` | `GET /api/support-tickets/{id}`, `POST /api/support-tickets/{id}/replies`, `POST /api/support-tickets/{id}/close`, `POST /api/support-tickets/{id}/reopen` |
| **NewTicket** | `pages/portal/NewTicket.tsx` | `GET /api/support-ticket-lookups/categories`, `GET /api/support-ticket-lookups/priorities`, `POST /api/support-tickets` (CustomerId is nullable — backend resolves from JWT) |
| **Addresses** | `pages/portal/Addresses.tsx` | `GET /api/customers/me/addresses`, `POST /api/customers/me/addresses`, `PUT /api/customers/me/addresses/{id}`, `DELETE /api/customers/me/addresses/{id}`, `GET /api/booking-lookups/zones/by-pincode/{pincode}` |
| **Profile** | `pages/portal/Profile.tsx` | `GET /api/customers/me/profile`, `PUT /api/customers/me/profile`, `POST /api/auth/change-password` |
| **Notifications** | `pages/portal/Notifications.tsx` | `GET /api/customer-notifications` or `GET /api/notifications`, `POST /api/customer-notifications/{id}/mark-read` |
| **NotificationPreferences** | `pages/portal/NotificationPreferences.tsx` | `GET /api/communication-preferences/me`, `PUT /api/communication-preferences/me` |
| **Feedback** | `pages/portal/Feedback.tsx` | `GET /api/bookings/{id}`, `POST /api/customer-reviews` |
| **Referral** | `pages/portal/Referral.tsx` | `GET /api/loyalty/me`, `GET /api/offers` |

---

## Missing APIs (Backend — Requires New Code)

### 1. `GET /api/customers/me/equipment/{equipmentId}` — Single Equipment Fetch
**File**: `Coolzo.Api/Controllers/CustomerEquipmentController.cs`

The controller already has GET list + POST + PUT + DELETE. Only single-item GET is missing (needed by `EquipmentDetail.tsx`).

**Add to `CustomerEquipmentController.cs`:**
```csharp
[HttpGet("{equipmentId:long}")]
[ProducesResponseType(typeof(ApiResponse<CustomerEquipmentResponse>), StatusCodes.Status200OK)]
public async Task<ActionResult<ApiResponse<CustomerEquipmentResponse>>> GetMyEquipmentByIdAsync(
    [FromRoute] long equipmentId,
    CancellationToken cancellationToken)
{
    var response = await _sender.Send(
        new GetMyCustomerEquipmentByIdQuery(equipmentId), 
        cancellationToken);
    return Success(response);
}
```

**Add to Application layer** (`Coolzo.Application/Features/CustomerApp/`):
- `GetMyCustomerEquipmentByIdQuery.cs` — `IRequest<CustomerEquipmentResponse>` with `long EquipmentId`
- `GetMyCustomerEquipmentByIdQueryHandler.cs` — resolves `customerId` from `ICurrentUserContext`, fetches equipment, validates ownership, throws 404 if not found

**No new DB table** — `customer_equipment` table exists. No SQL migration needed.

### No Other Backend Changes Required
- Customer equipment: GET list + POST + PUT + DELETE already exist at `/api/customers/me/equipment`
- Support ticket create: `CustomerId` is `long?` — backend auto-resolves from JWT when caller role is Customer
- All other needed endpoints already exist in the 87 controllers

---

## Service Layer Architecture

### Environment Configuration (do this first)

**Files to create/update:**
- `.env.development` → `VITE_API_BASE_URL=https://localhost:44394`
- `.env.production` → `VITE_API_BASE_URL=https://api.coolzo.com`
- `.env.example` → `VITE_API_BASE_URL=` (commit only this one)

**`src/config/apiConfig.ts`** — rewrite:
```typescript
export const apiConfig = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL,
  TIMEOUT: 10000,
};
// Remove IS_MOCK entirely — use .env files per environment
```

### New File: `src/services/tokenStorage.ts`
Centralized JWT token management:
- `getAccessToken()` / `setAccessToken()` → `sessionStorage` (clears on tab close)
- `getRefreshToken()` / `setRefreshToken()` → `localStorage` (persists for silent re-login)
- `clear()` → wipe both tokens on logout

### Rewrite: `src/services/apiClient.ts`
Three fixes:
1. Read `BASE_URL` from `apiConfig.BASE_URL` (no `/v1`)
2. Request interceptor: inject `Authorization: Bearer {token}` from `tokenStorage.getAccessToken()`
3. Response interceptor: return `response.data.data` (unwrap `ApiResponse<T>` envelope)
4. 401 handler: implement token refresh queue pattern → attempt `POST /api/auth/refresh` once, retry queued requests, navigate to `/session-expired` on refresh failure

### New Directory: `src/types/`
TypeScript interfaces aligned with backend contracts:
```
src/types/
  auth.ts        — AuthTokenResponse, CurrentUserResponse, UserProfile
  booking.ts     — BookingListItemResponse, BookingDetailResponse, BookingSummaryResponse, BookingListItem
  invoice.ts     — InvoiceListItemResponse, InvoiceDetailResponse
  ticket.ts      — SupportTicketListItemResponse, SupportTicketDetailResponse
  equipment.ts   — CustomerEquipmentResponse
  address.ts     — CustomerAddressResponse
  notification.ts— CustomerNotificationResponse
  amc.ts         — AmcPlanResponse, CustomerAmcResponse
  catalog.ts     — ServiceCategoryLookupResponse, ServiceLookupResponse, SlotAvailabilityResponse
  common.ts      — PagedResult<T> (items, totalCount, pageNumber, pageSize, hasNext, hasPrevious)
```

### New Hook: `src/hooks/usePaginatedApi.ts`
Wraps `PagedResult<T>` for all list pages:
```typescript
usePaginatedApi<T>(fetcher: (page: number) => Promise<PagedResult<T>>) 
  → { data, loading, error, page, hasNext, hasPrevious, goToPage, refetch }
```

### Services to Create/Rewrite

| File | Status | Purpose |
|------|--------|---------|
| `src/services/authService.ts` | **Rewrite** | Replace Firebase with JWT: `loginEmail`, `loginOTP`, `sendOTP`, `register`, `logout`, `refreshToken`, `forgotPassword`, `resetPassword`, `getMe` |
| `src/services/bookingService.ts` | **Rewrite** | `getMyBookings(page)`, `getBookingById(id)`, `createBooking(data)`, `createGuestBooking(data)`, `reschedule(id, data)` |
| `src/services/catalogService.ts` | **Rewrite** | `getServiceCategories()`, `getServices(categoryId?)`, `getAcTypes()`, `getBrands()`, `getTonnages()` |
| `src/services/reviewService.ts` | **Rewrite** | `getReviews(serviceId?)`, `submitReview(data)` |
| `src/services/notificationService.ts` | **Rewrite** | `getNotifications(page)`, `markRead(id)`, `markAllRead()` — remove fake setInterval |
| `src/services/paymentService.ts` | **Rewrite** | `initiatePayment(invoiceId, method)`, `getReceipt(id)` |
| `src/services/slotService.ts` | **New** | `getZoneByPincode(pincode)`, `getAvailableSlots(zoneId, date)` |
| `src/services/addressService.ts` | **New** | `getMyAddresses()`, `createAddress(data)`, `updateAddress(id, data)`, `deleteAddress(id)` |
| `src/services/equipmentService.ts` | **New** | `getMyEquipment()`, `getEquipmentById(id)`, `createEquipment(data)`, `updateEquipment(id, data)`, `deleteEquipment(id)` |
| `src/services/invoiceService.ts` | **New** | `getCustomerInvoices(page)`, `getInvoiceById(id)`, `downloadPdf(id)` |
| `src/services/ticketService.ts` | **New** | `getMyTickets(page)`, `getTicketById(id)`, `createTicket(data)`, `addReply(id, text)`, `close(id)`, `reopen(id)`, `getCategories()`, `getPriorities()` |
| `src/services/profileService.ts` | **New** | `getMyProfile()`, `updateMyProfile(data)`, `changePassword(oldPw, newPw)` |
| `src/services/amcService.ts` | **New** | `getMySubscriptions()`, `getPlans()` |
| `src/services/communicationPreferenceService.ts` | **New** | `getPreferences()`, `updatePreferences(data)` |
| `src/services/marketingService.ts` | **New** | `getOffers()`, `getReferralStats()`, `getLoyaltyPoints()` |
| `src/services/cmsService.ts` | **New** | `getHomeContent()`, `getFaqs()`, `getBanners()`, `getBlogs()` |

---

## Auth Strategy — Replace Firebase with Backend JWT

### Current State
`AuthContext.tsx` stores a Firebase `User` object and drives auth with `onAuthStateChanged`. `authService.ts` uses Firebase SDK for login/register.

### Target State

**New `CurrentUser` interface** (replaces Firebase `User`):
```typescript
interface CurrentUser {
  userId: number;       // from GET /api/auth/me
  customerId: number;
  email: string;
  name: string;
  roles: string[];      // ['Customer']
}
```

**Login flow:**
1. `POST /api/auth/login` → `{ accessToken, refreshToken, expiresIn }`
2. Store tokens via `tokenStorage`
3. `GET /api/auth/me` → populate `CurrentUser` React state
4. On app mount: if `localStorage` has refresh token → `POST /api/auth/refresh` → silently restore session

**`AuthContext.tsx` changes:**
- Remove Firebase imports and `onAuthStateChanged`
- Remove `loginWithGoogle` (no Google OAuth in backend)
- Replace with JWT-based `loginEmail`, `loginOTP`, `register`, `logout`
- `user` type becomes `CurrentUser | null`

**Firebase removal checklist (after auth works):**
- Delete `src/lib/firebase.ts`
- Delete `firebase-applet-config.json` (sensitive config)
- Remove `firebase` + `@firebase/*` from `package.json`

---

## Integration Order (Dependency-First)

### Phase 1 — Foundation ✅ COMPLETE
1. ✅ Create `.env.development`, `.env.production`, `.env.example`
2. ✅ Rewrite `src/config/apiConfig.ts` — env-based URL, remove IS_MOCK
3. ✅ Create `src/services/tokenStorage.ts`
4. ✅ Rewrite `src/services/apiClient.ts` — fix base URL, response unwrapping, auth header, refresh queue
5. ✅ Create `src/types/` — all TypeScript interfaces (10 files)
6. ✅ Create `src/hooks/usePaginatedApi.ts`

### Phase 2 — Authentication ✅ COMPLETE
7. ✅ Rewrite `src/services/authService.ts` — JWT login, register, OTP, refresh, logout
8. ✅ Rewrite `src/contexts/AuthContext.tsx` — Firebase → JWT
9. ✅ Integrate Login.tsx, Register.tsx, ForgotPassword.tsx, ResetPassword.tsx

### Phase 3 — Service Layer ✅ COMPLETE (services only; public pages pending)
10. ✅ Rewrite `src/services/catalogService.ts`
11. ✅ Create `src/services/cmsService.ts`
12. ✅ Rewrite `src/services/reviewService.ts`
13. ✅ Rewrite `src/services/bookingService.ts`
14. ✅ Create `src/services/invoiceService.ts`
15. ✅ Create `src/services/ticketService.ts`
16. ✅ Create `src/services/equipmentService.ts`
17. ✅ Create `src/services/addressService.ts`
18. ✅ Create `src/services/profileService.ts`
19. ✅ Rewrite `src/services/notificationService.ts`
20. ✅ Create `src/services/amcService.ts`
21. ✅ Rewrite `src/services/paymentService.ts`
22. ✅ Create `src/services/marketingService.ts`

### Phase 4 — Portal Pages (IN PROGRESS)
23. ✅ Integrate Dashboard.tsx — `Promise.allSettled` for bookings/AMC/equipment
24. ✅ Integrate InvoicesList.tsx — replaced mockInvoices with InvoiceService, pagination, PDF download
25. ✅ Integrate TicketsList.tsx — replace mockTickets with TicketService.getMyTickets(); statusColor/formatActivity helpers; tab filter open/resolved; hasUnreadReplies gold bar; real Prev/Next pagination
26. ✅ Integrate Addresses.tsx — AddressService CRUD; debounced pincode → getZoneByPincode(); isZoneValid/zoneName state; modal edit/create with title switching; MoreVertical dropdown
27. ✅ Integrate EquipmentList.tsx — EquipmentService.getMyEquipment(); EquipmentForm with brand/type/capacity selects; purchaseDate from installYear; brand initial avatar; loading spinner
28. ✅ Integrate EquipmentDetail.tsx — wired GET/PUT/DELETE via EquipmentService; page falls back to list+filter until backend `GET /api/customers/me/equipment/{equipmentId}` lands in Phase 6
29. ✅ Integrate BookingsList.tsx — BookingService.getMyBookings(page,10); statusColor/isOpen/isCompleted/isCancelled helpers; booking.bookingId for route; booking.bookingReference for display; technicianName??'Pending Assignment'; real Prev/Next
30. ✅ Integrate BookingDetail.tsx — BookingService.getBookingById(bookingId); STATUS_STEPS array; deriveStepStatus from currentStatus; statusHistory times; tech avatar; booking.addressLine1/2/cityName/pincode; isCancelled banner; totalAmount sidebar card
31. ✅ Integrate NewTicket.tsx — Promise.allSettled for categories+priorities; TicketService.createTicket(); no customerId in body (JWT-resolved); static fallback options; createdTicketId numeric state; success screen navigates to /portal/support/${id}
32. ✅ Integrate TicketDetail.tsx — TicketService.getTicketById/addReply/closeTicket/reopenTicket; description as first chat bubble; reply.isStaff for left/right alignment; canClose/canReopen flags; rating modal (1-5 stars) on close
33. ✅ Integrate AMCDashboard.tsx — AmcService.getMySubscriptions(); calcDaysToExpiry; completedVisits from visits[]; numberOfVisits/visitsUsed/visitsRemaining; renewal alert when daysToExpiry < 30; nextVisitDate
34. ✅ Integrate Profile.tsx — ProfileService.getMyProfile()+updateMyProfile(); AuthService.changePassword(); avatar fallback ui-avatars.com; dob split 'T'; Firebase User completely removed
35. ✅ Integrate Notifications.tsx — NotificationService.getNotifications(1,20)+markRead(id)+markAllRead(); CustomerNotificationResponse type; hasUnread guard for "Mark all"; notif.actionUrl "View →" link; motion.div layout
36. ✅ Integrate NotificationPreferences.tsx — wired live communication preferences via NotificationService.getPreferences() + updatePreferences(); mandatory categories remain locked in UI
37. ✅ Integrate InvoiceDetail.tsx — wired InvoiceService.getInvoiceById() + PaymentService.collectPayment(); API-driven lines[] map; subtotal/taxAmount/totalAmount; pay button hidden for paid invoices
38. ✅ Integrate Feedback.tsx — wired BookingService.getBookingById() + ReviewService.submitReview()
39. ✅ Integrate Referral.tsx — wired MarketingService.getLoyaltyStats() + getReferralStats() + getOffers(); loyalty summary and live offers now render alongside referral stats

### Phase 5 — Public Pages
40. ⬜ Integrate Services.tsx — CatalogService.getServiceCategories() + getServices()
41. ⬜ Integrate ServiceDetail.tsx — CatalogService.getServices() + CmsService.getFaqs() + ReviewService.getReviews()
42. ⬜ Integrate Reviews.tsx — ReviewService.getReviews() with pagination
43. ⬜ Integrate Home.tsx — CmsService.getHomeContent() + getBanners() + ReviewService.getReviews()
44. ⬜ Integrate Blog.tsx — CmsService.getBlogs()
45. ⬜ Integrate BlogDetail.tsx — CmsService.getBlogByKey()
46. ⬜ Integrate AMC.tsx (public) — AmcService.getPlans()
47. ⬜ Integrate BookingWizard.tsx — full lookup chain + POST /api/bookings/customer or /guest
48. ⬜ Integrate BookingConfirmation.tsx — BookingService.getBookingById()

### Phase 6 — Backend New Endpoint
49. ⬜ Add `GET /api/customers/me/equipment/{equipmentId}` to backend (see Missing APIs section above)
50. ⬜ Create `Backend/Docs/Postgres/12_customer_equipment_get_by_id_verify.sql`

### Phase 7 — Cleanup
51. ⬜ Delete `src/services/mockUtils.ts`
52. ⬜ Remove Firebase packages from `package.json`
53. ⬜ Delete `src/lib/firebase.ts`, `firebase-applet-config.json`
54. ⬜ Remove all remaining `IS_MOCK` guards from any service files

---

## PostgreSQL Query Files

**Location**: `C:\Live\Coolzo\Backend\Docs\Postgres`

**No new tables required.** All screen data maps to existing tables (`customer_equipment`, `bookings`, `invoices`, `support_tickets`, `customer_addresses`, etc.).

Create one verification query file:
- `12_customer_equipment_get_by_id_verify.sql` — verify the `customer_equipment` table schema and that the new handler query pattern is correct

---

## Verification

1. **Start backend** locally (`dotnet run` in `Coolzo.Api`) — confirm Swagger at `https://localhost:44394/swagger`
2. **Start frontend** (`npm run dev`) — confirm it loads without mock data errors
3. **Auth flow**: Register new account → Login → `GET /api/auth/me` returns correct profile
4. **BookingWizard**: Complete a booking end-to-end as guest and as logged-in customer
5. **Portal pages**: Navigate all portal pages — each should show real data (or empty state), no mock arrays visible
6. **Addresses**: Add address → PIN code lookup returns zone → save persists to DB
7. **Equipment**: Add equipment → appears in list → edit → delete
8. **Invoices**: Invoice list shows real data; PDF download works
9. **Support tickets**: Create ticket (no CustomerId in request body) → appears in my-tickets list → reply works
10. **Token refresh**: Let access token expire → make a request → silently refreshes → request succeeds

---

## Critical Files Modified

**Frontend:**
- [src/config/apiConfig.ts](Frontend/Web/src/config/apiConfig.ts)
- [src/services/apiClient.ts](Frontend/Web/src/services/apiClient.ts)
- [src/services/authService.ts](Frontend/Web/src/services/authService.ts)
- [src/contexts/AuthContext.tsx](Frontend/Web/src/contexts/AuthContext.tsx)
- All 14 portal page components (inline mock removal)
- All service files listed in Service Layer section

**Backend (new):**
- [Coolzo.Api/Controllers/CustomerEquipmentController.cs](Backend/Coolzo.Api/Controllers/CustomerEquipmentController.cs) — add `GET {equipmentId}`
- New query + handler in `Coolzo.Application/Features/CustomerApp/`

**New files created:**
- `.env.development`, `.env.production`, `.env.example`
- `src/services/tokenStorage.ts`
- `src/types/` (8 interface files)
- `src/hooks/usePaginatedApi.ts`
- 10 new service files in `src/services/`
- `Backend/Docs/Postgres/12_customer_equipment_get_by_id_verify.sql`
