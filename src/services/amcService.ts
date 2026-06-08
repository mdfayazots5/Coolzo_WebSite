import apiClient from './apiClient';
import type { AmcPlanResponse, CustomerAmcResponse } from '../types/amc';

interface AmcPlansPagedResult {
  items: AmcPlanResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const AmcService = {
  async getPlans(): Promise<AmcPlanResponse[]> {
    const result = await apiClient.get<AmcPlansPagedResult>('/api/amc/plans', {
      params: { isActive: true, pageSize: 100 },
    });
    return result?.items ?? [];
  },

  async getMySubscriptions(): Promise<CustomerAmcResponse[]> {
    return apiClient.get('/api/amc/customer/me').catch(() => []);
  },
};
