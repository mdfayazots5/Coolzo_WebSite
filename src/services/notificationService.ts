import apiClient from './apiClient';
import type { CustomerNotificationResponse, CommunicationPreferenceResponse } from '../types/notification';

export const NotificationService = {
  async getNotifications(
    pageNumber = 1,
    pageSize = 20,
  ): Promise<CustomerNotificationResponse[]> {
    return apiClient
      .get<any>('/api/customer-notifications', { params: { pageNumber, pageSize } })
      .then((res: any) => (Array.isArray(res) ? res : (res?.items ?? [])))
      .catch(() =>
        apiClient
          .get<any>('/api/notifications', { params: { pageNumber, pageSize } })
          .then((res: any) => (Array.isArray(res) ? res : (res?.items ?? []))),
      );
  },

  async markRead(notificationId: number): Promise<void> {
    await apiClient.post(`/api/customer-notifications/${notificationId}/mark-read`);
  },

  async markAllRead(): Promise<void> {
    await apiClient.patch('/api/notifications/mark-read', {});
  },

  async getPreferences(): Promise<CommunicationPreferenceResponse> {
    return apiClient.get('/api/communication-preferences/me');
  },

  async updatePreferences(
    data: Partial<CommunicationPreferenceResponse>,
  ): Promise<CommunicationPreferenceResponse> {
    return apiClient.put('/api/communication-preferences/me', data);
  },
};
