import apiClient from './apiClient';
import { getSnapshotMasters } from './snapshotService';
import type {
  ServiceCategoryLookupResponse,
  ServiceLookupResponse,
  AcTypeLookupResponse,
  TonnageLookupResponse,
  BrandLookupResponse,
  SlotAvailabilityResponse,
  ZoneListItemResponse,
} from '../types/catalog';
import type { ZoneLookupResponse } from '../types/address';

/** Case-insensitive client-side search used when serving masters from the snapshot. */
function matches(value: string | undefined, search: string): boolean {
  return (value ?? '').toLowerCase().includes(search.toLowerCase());
}

export const CatalogService = {
  // Services & categories ALWAYS read the live booking-lookup API so the public catalog reflects
  // admin edits instantly (no republish) and carries live fields like service ImageUrl. The static
  // snapshot is still used for theme/images/content/banners; the stable masters below (ac-types,
  // tonnages, brands) remain snapshot-first since they rarely change. Zones/slots are always live.
  async getServiceCategories(search?: string): Promise<ServiceCategoryLookupResponse[]> {
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/service-categories', { params });
  },

  async getServices(serviceCategoryId?: number, search?: string): Promise<ServiceLookupResponse[]> {
    return apiClient.get('/api/booking-lookups/services', {
      params: { serviceCategoryId, search },
    });
  },

  async getAcTypes(search?: string): Promise<AcTypeLookupResponse[]> {
    const masters = await getSnapshotMasters();
    if (masters?.acTypes) {
      return search ? masters.acTypes.filter((acType) => matches(acType.acTypeName, search)) : masters.acTypes;
    }
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/ac-types', { params });
  },

  async getTonnages(search?: string): Promise<TonnageLookupResponse[]> {
    const masters = await getSnapshotMasters();
    if (masters?.tonnages) {
      return search ? masters.tonnages.filter((tonnage) => matches(tonnage.tonnageName, search)) : masters.tonnages;
    }
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/tonnage', { params });
  },

  async getBrands(search?: string): Promise<BrandLookupResponse[]> {
    const masters = await getSnapshotMasters();
    if (masters?.brands) {
      return search ? masters.brands.filter((brand) => matches(brand.brandName, search)) : masters.brands;
    }
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/brands', { params });
  },

  async getZones(search?: string): Promise<ZoneListItemResponse[]> {
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/zones', { params });
  },

  async getZoneByPincode(pincode: string): Promise<ZoneLookupResponse> {
    return apiClient.get(`/api/booking-lookups/zones/by-pincode/${pincode}`);
  },

  async getAvailableSlots(zoneId: number, slotDate: string): Promise<SlotAvailabilityResponse[]> {
    return apiClient.get('/api/booking-lookups/slots', { params: { zoneId, slotDate } });
  },
};
