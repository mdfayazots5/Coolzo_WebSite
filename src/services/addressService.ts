import apiClient from './apiClient';
import type {
  CustomerAddressResponse,
  CreateCustomerAddressRequest,
  UpdateCustomerAddressRequest,
  ZoneLookupResponse,
} from '../types/address';

export const AddressService = {
  async getMyAddresses(): Promise<CustomerAddressResponse[]> {
    return apiClient.get('/api/customers/me/addresses');
  },

  async createAddress(
    data: CreateCustomerAddressRequest,
  ): Promise<CustomerAddressResponse> {
    return apiClient.post('/api/customers/me/addresses', data);
  },

  async updateAddress(
    addressId: number,
    data: UpdateCustomerAddressRequest,
  ): Promise<CustomerAddressResponse> {
    return apiClient.put(`/api/customers/me/addresses/${addressId}`, data);
  },

  async deleteAddress(addressId: number): Promise<void> {
    await apiClient.delete(`/api/customers/me/addresses/${addressId}`);
  },

  async getZoneByPincode(pincode: string): Promise<ZoneLookupResponse> {
    return apiClient.get(`/api/booking-lookups/zones/by-pincode/${pincode}`);
  },
};
