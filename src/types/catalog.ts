/** Service category — GET /api/booking-lookups/service-categories */
export interface ServiceCategoryLookupResponse {
  serviceCategoryId: number;
  categoryName: string;        // backend field: CategoryName (not serviceCategoryName)
  description?: string;
}

/** Individual service — GET /api/booking-lookups/services */
export interface ServiceLookupResponse {
  serviceId: number;
  serviceName: string;
  serviceCategoryId: number;
  summary?: string;
  basePrice?: number;
  pricingModelName?: string;
  imageUrl?: string;
}

/** AC type lookup */
export interface AcTypeLookupResponse {
  acTypeId: number;
  acTypeName: string;
}

/** Tonnage lookup */
export interface TonnageLookupResponse {
  tonnageId: number;
  tonnageName: string;
}

/** Brand lookup */
export interface BrandLookupResponse {
  brandId: number;
  brandName: string;
}

/** Available time slot */
export interface SlotAvailabilityResponse {
  slotAvailabilityId: number;
  slotDate: string;
  startTime: string;
  endTime: string;
  displayLabel: string;
  availableCapacity: number;
  isFullyBooked: boolean;
}

/** Zone listing — GET /api/booking-lookups/zones */
export interface ZoneListItemResponse {
  zoneId: number;
  zoneName: string;
  isActive: boolean;
}
