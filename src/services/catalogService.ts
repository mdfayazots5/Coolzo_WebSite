import apiClient from './apiClient';
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

export const CatalogService = {
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
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/ac-types', { params });
  },

  async getTonnages(search?: string): Promise<TonnageLookupResponse[]> {
    const params = search ? { search } : undefined;
    return apiClient.get('/api/booking-lookups/tonnage', { params });
  },

  async getBrands(search?: string): Promise<BrandLookupResponse[]> {
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
