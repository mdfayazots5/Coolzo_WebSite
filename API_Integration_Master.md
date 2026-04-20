# API Integration Master Document

This document outlines the API architecture, service definitions, and integration plan for the Coolzo AC Services application.

## 1. Project API Architecture

The application follows a clean, tiered architecture to separate concerns and ensure maintainability.

### API Configuration (`/src/config/apiConfig.ts`)
- **Base URL**: Managed via environment variables or hardcoded for development.
- **IS_MOCK**: A global toggle to switch between physical API calls and simulated mock data.
- **Timeout**: Global request timeout settings.

### API Client (`/src/services/apiClient.ts`)
- **Axios Instance**: Centralized HTTP client.
- **Interceptors**:
  - **Request**: Automatically attaches Firebase ID Tokens to the `Authorization` header when a user is logged in.
  - **Response**: Uniform error handling and data extraction.

### Mock System (`/src/services/mockUtils.ts`)
- **Simulated Latency**: Consistent use of `setTimeout` to mimic real-world network conditions.
- **Standardized Responses**: Helpers to wrap mock data in successful promise resolutions or simulated errors.

---

## 2. Demo Flag System (IS_MOCK)

- **Location**: `src/config/apiConfig.ts`
- **Behavior**:
  - `TRUE`: Services return curated dummy data from `mockUtils.ts` or local constants.
  - `FALSE`: Services hit the defined `BASE_URL` endpoints.
- **Implementation**: Every service method checks this flag before execution.

---

## 3. Service Definitions & Data Schemas

### Batch 1: Core Services

#### AuthService (`/src/services/authService.ts`)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `loginEmail` | POST | `/auth/login` | Email/Password login. |
| `register` | POST | `/auth/register` | New user registration. |

**Request: `loginEmail`**
```json
{
  "email": "string",
  "pass": "string"
}
```
**Response: `FirebaseUser` (simplified)**
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string"
}
```

#### CatalogService (`/src/services/catalogService.ts`)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getServices` | GET | `/services` | List all services. |
| `getServiceById` | GET | `/services/:id` | Fetch service details. |

**Response Schema: `ACService`**
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "price": "number",
  "duration": "string",
  "description": "string",
  "image": "string",
  "benefits": "string[]"
}
```

#### BookingService (`/src/services/bookingService.ts`)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getBookings` | GET | `/users/:uid/bookings` | Fetch user booking history. |
| `createBooking` | POST | `/bookings` | Create a new service request. |

**Request: `BookingRequest`**
```json
{
  "userId": "string",
  "serviceId": "string",
  "serviceName": "string",
  "date": "string",
  "timeSlot": "string",
  "address": "string",
  "status": "scheduled",
  "price": "number",
  "contactMobile": "string"
}
```
**Response: `Booking`**
```json
{
  "id": "string",
  "serviceId": "string",
  "serviceName": "string",
  "date": "string",
  "time": "string",
  "status": "string",
  "price": "number",
  "technician": {
    "name": "string",
    "rating": "number",
    "image": "string"
  }
}
```

### Batch 2: Advanced Features

#### PaymentService (`/src/services/paymentService.ts`)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `initiatePayment` | POST | `/payments/initiate` | Initiate a checkout session. |
| `verifyPayment` | GET | `/payments/verify/:id` | Verify transaction status. |

**Request: `initiatePayment`**
```json
{
  "bookingId": "string",
  "amount": "number"
}
```
**Response: `initiatePayment`**
```json
{
  "paymentId": "string",
  "checkoutUrl": "string"
}
```

#### ReviewService (`/src/services/reviewService.ts`)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getReviewsForService` | GET | `/services/:id/reviews` | List reviews for a service. |
| `submitReview` | POST | `/reviews` | Submit user feedback. |

**Request: `submitReview`**
```json
{
  "userId": "string",
  "userName": "string",
  "rating": "number",
  "comment": "string",
  "serviceId": "string (optional)"
}
```
**Response: `Review`**
```json
{
  "id": "string",
  "userId": "string",
  "userName": "string",
  "rating": "number",
  "comment": "string",
  "date": "string",
  "serviceId": "string"
}
```

#### NotificationService (`/src/services/notificationService.ts`)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getNotifications` | GET | `/users/:uid/notifications` | Fetch unread alerts. |
| `markAsRead` | PUT | `/notifications/:id/read` | Mark alert as seen. |

**Response Schema: `AppNotification`**
```json
{
  "id": "string",
  "title": "string",
  "message": "string",
  "type": "status_update | promotion | reminder",
  "isRead": "boolean",
  "createdAt": "string"
}
```

### Batch 3: Resiliency & Infrastructure

#### Standard API Error Model (`/src/services/apiClient.ts`)
The application uses a unified error interceptor to transform raw HTTP errors into a predictable diagnostic object.

**Error Response Structure**
```json
{
  "status": "number",
  "message": "string",
  "url": "string",
  "method": "GET | POST | PUT | DELETE",
  "duration": "string (e.g., '240ms')"
}
```

#### Real-time Event Handling (`/src/services/notificationService.ts`)
| Event | Trigger | Pattern |
|---|---|---|
| `Real-time Notification` | Status Change / Promo | Observer Callback |

**Subscription Signature**
```typescript
NotificationService.subscribeToNotifications(
  userId: string, 
  callback: (notification: AppNotification) => void
): () => void // Returns unsubscribe function
```

### Batch 4: Customer Success & Loyalty

#### SupportService (Ticketing)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getTickets` | GET | `/support/tickets/:uid` | List user support tickets. |
| `getTicketDetail` | GET | `/support/tickets/:id` | Fetch conversation history. |
| `createTicket` | POST | `/support/tickets` | Open a new support request. |

**Request: `createTicket`**
```json
{
  "subject": "string",
  "category": "string",
  "priority": "High | Medium | Low",
  "description": "string",
  "serviceRequestId": "string (optional)"
}
```
**Response: `Ticket`**
```json
{
  "id": "string",
  "subject": "string",
  "status": "Open | In Progress | Resolved | Closed",
  "date": "string",
  "lastReply": "string",
  "messages": [
    {
      "id": "number",
      "sender": "customer | agent",
      "text": "string",
      "time": "string",
      "attachments": "string[]"
    }
  ]
}
```

#### BillingService (Invoices)
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getInvoices` | GET | `/billing/invoices/:uid` | List user billing history. |

**Response Schema: `Invoice`**
```json
{
  "id": "string",
  "sr": "string (Service Request ID)",
  "date": "string",
  "type": "string",
  "amount": "number",
  "tax": "number",
  "status": "Paid | Unpaid | Overdue"
}
```

#### AMCService
| Method | Type | Endpoint | Description |
|---|---|---|---|
| `getAMCDetail` | GET | `/amc/contracts/:uid` | Fetch active maintenance plan. |

**Response Schema: `AMCContract`**
```json
{
  "plan": "string",
  "tier": "string",
  "startDate": "string",
  "endDate": "string",
  "visitsIncluded": "number",
  "visitsUsed": "number",
  "nextVisit": "string (date)",
  "daysToExpiry": "number"
}
```

---

## 4. Integration Roadmap

### Batch 1: Core Foundation (COMPLETED)
- [x] API Client & Config Setup.
- [x] AuthService implementation (Firebase + Mock).
- [x] CatalogService integration.
- [x] BookingService integration.

### Batch 2: Advanced Features & Payments (COMPLETED)
- [x] `PaymentService`: Integrated with `BookingWizard` step 7.
- [x] `ReviewService`: Integrated with `ServiceDetail` and `Feedback` page.
- [x] `NotificationService`: Integrated with `Navbar` (Unread indicator) and `Notifications` center.

### Batch 3: Resiliency & Polish (COMPLETED)
- [x] Global Error Boundary integration for API failures.
- [x] Performance logging & Interceptor refinements.
- [x] Real-time notification logic finalization.
- [x] Accessibility & Polish.

### Batch 4: Customer Success & Loyalty (COMPLETED)
- [x] `SupportService`: Conversational ticketing and resolution flow.
- [x] `Invoices`: Multi-status billing system with transparent history.
- [x] `AMC`: Full maintenance lifecycle tracking and renewal logic.
- [x] `Loyalty`: Referral system and profile preference persistence.

---

## 🚀 Final Production Status: STABLE
The Coolzo AC Service Application is now high-fidelity, resilient, and feature-complete.
