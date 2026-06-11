import apiClient from './apiClient';
import { getSnapshotMasters } from './snapshotService';
import type { AmcPlanResponse, CustomerAmcResponse } from '../types/amc';

interface AmcPlansPagedResult {
  items: AmcPlanResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export const AmcService = {
  // Active AMC plans are served from the published snapshot when available (snapshot.masters.amcPlans,
  // already filtered to active), falling back to the live /api/amc/plans when the snapshot predates
  // masters or is unreachable.
  async getPlans(): Promise<AmcPlanResponse[]> {
    const masters = await getSnapshotMasters();
    if (masters?.amcPlans) {
      return masters.amcPlans.filter((plan) => plan.isActive);
    }
    const result = await apiClient.get<AmcPlansPagedResult>('/api/amc/plans', {
      params: { isActive: true, pageSize: 100 },
    });
    return result?.items ?? [];
  },

  async getMySubscriptions(): Promise<CustomerAmcResponse[]> {
    return apiClient.get('/api/amc/customer/me').catch(() => []);
  },
};
