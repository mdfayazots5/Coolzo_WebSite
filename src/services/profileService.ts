import apiClient from './apiClient';
import type { CustomerProfileResponse, UpdateCustomerProfileRequest } from '../types/auth';

export const ProfileService = {
  async getMyProfile(): Promise<CustomerProfileResponse> {
    return apiClient.get('/api/customers/me/profile');
  },

  async updateMyProfile(
    data: UpdateCustomerProfileRequest,
  ): Promise<CustomerProfileResponse> {
    return apiClient.put('/api/customers/me/profile', data);
  },
};
