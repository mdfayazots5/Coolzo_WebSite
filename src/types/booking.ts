/** One booking row in the customer's booking list. */
export interface BookingListItemResponse {
  bookingId: number;
  bookingReference: string;
  serviceName: string;
  serviceCategory: string;
  scheduledDate: string;       // ISO date
  scheduledTime?: string;
  currentStatus: string;
  technicianName?: string;
  technicianRating?: number;
  totalAmount?: number;
  zoneId?: number;
  zoneName?: string;
}

/** Full booking detail — from GET /api/bookings/{id} or GET /api/customer-bookings/{id} */
export interface BookingDetailResponse {
  bookingId: number;
  bookingReference: string;
  serviceId: number;
  serviceName: string;
  serviceCategory: string;
  acTypeName?: string;
  tonnageName?: string;
  brandName?: string;
  scheduledDate: string;
  scheduledTime?: string;
  currentStatus: string;
  technicianId?: number;
  technicianName?: string;
  technicianPhone?: string;
  technicianRating?: number;
  customerName: string;
  customerMobile: string;
  addressLine1: string;
  addressLine2?: string;
  cityName: string;
  pincode: string;
  zoneName?: string;
  issueNotes?: string;
  totalAmount?: number;
  isCancelled: boolean;
  cancellationReason?: string;
  dateCreated: string;
  statusHistory?: BookingStatusHistoryItem[];
}

export interface BookingStatusHistoryItem {
  status: string;
  remarks?: string;
  statusDateUtc: string;
  updatedBy?: string;
}

/** Returned immediately after creating a booking (POST /api/bookings/guest or /customer). */
export interface BookingSummaryResponse {
  bookingId: number;
  bookingReference: string;
  status: string;
  serviceName: string;
  customerName: string;
  mobileNumber: string;
  slotDate: string;           // "YYYY-MM-DD"
  slotLabel: string;          // "09:00 AM - 11:00 AM"
  addressSummary: string;
  estimatedPrice: number;
  isEmergency: boolean;
  emergencySurchargeAmount: number;
}

/** Request shape for POST /api/bookings/customer */
export interface CustomerBookingCreateRequest {
  serviceId: number;
  acTypeId?: number;
  tonnageId?: number;
  brandId?: number;
  slotAvailabilityId?: number | null;
  addressId?: number;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  cityName?: string;
  pincode?: string;
  addressLabel?: string;
  customerName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  modelName?: string;
  issueNotes?: string;
  isEmergency?: boolean;
  emergencySurchargeAmount?: number;
  sourceChannel?: string;
  latitude?: number;
  longitude?: number;
}

/** Booking feature flags returned by GET /api/bookings/public/settings */
export interface BookingPublicSettings {
  openBookingMode: boolean;
  enforceSlotCapacity: boolean;
}

/** Request shape for POST /api/bookings/guest */
export interface GuestBookingCreateRequest extends CustomerBookingCreateRequest {
  customerName: string;
  mobileNumber: string;
  emailAddress?: string;
}
