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

/** Returned immediately after creating a booking. */
export interface BookingSummaryResponse {
  bookingId: number;
  bookingReference: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTime?: string;
  totalAmount?: number;
  currentStatus: string;
}

/** Request shape for POST /api/bookings/customer */
export interface CustomerBookingCreateRequest {
  serviceId: number;
  acTypeId?: number;
  tonnageId?: number;
  brandId?: number;
  slotAvailabilityId: number;
  addressId?: number;
  addressLine1?: string;
  addressLine2?: string;
  landmark?: string;
  cityName?: string;
  pincode?: string;
  addressLabel?: string;
  modelName?: string;
  issueNotes?: string;
  isEmergency?: boolean;
  sourceChannel?: string;
}

/** Request shape for POST /api/bookings/guest */
export interface GuestBookingCreateRequest extends CustomerBookingCreateRequest {
  customerName: string;
  mobileNumber: string;
  emailAddress?: string;
}
