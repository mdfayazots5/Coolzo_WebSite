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
  // Catalog masters are served from the published snapshot when available (one static fetch, no
  // per-request DB), falling back to the live booking-lookup API when the snapshot predates masters
  // or is unreachable. Dynamic lookups (zones, slots) below always go to the live API.
  async getServiceCategories(search?: string): Promise<ServiceCategoryLookupResponse[]> {
    const masters = await getSnapshotMasters();
    if (masters?.serviceCategories) {
      return search
        ? masters.serviceCategories.filter((category) => matches(category.categoryName, search))
        : masters.serviceCategories;
    }
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/service-categories', { params });
  },

  async getServices(serviceCategoryId?: number, search?: string): Promise<ServiceLookupResponse[]> {
    const masters = await getSnapshotMasters();
    if (masters?.services) {
      return masters.services.filter(
        (service) =>
          (serviceCategoryId == null || service.serviceCategoryId === serviceCategoryId) &&
          (!search || matches(service.serviceName, search)),
      );
    }
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
