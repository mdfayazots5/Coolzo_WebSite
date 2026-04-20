import { apiConfig } from '../config/apiConfig';
import apiClient from './apiClient';
import { mockResponse } from './mockUtils';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'status_update' | 'promotion' | 'reminder';
  isRead: boolean;
  createdAt: string;
}

const DUMMY_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Technician Assigned',
    message: 'Rahul Sharma has been assigned to your booking #CZ-12345.',
    type: 'status_update',
    isRead: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'n2',
    title: 'Seasonal Promo',
    message: 'Get 20% off on your next Gas Refilling service!',
    type: 'promotion',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const NotificationService = {
  async getNotifications(userId: string): Promise<AppNotification[]> {
    if (apiConfig.IS_MOCK) {
      return mockResponse(DUMMY_NOTIFICATIONS);
    }
    return apiClient.get(`/users/${userId}/notifications`);
  },

  async markAsRead(notificationId: string): Promise<void> {
    if (apiConfig.IS_MOCK) {
      const notification = DUMMY_NOTIFICATIONS.find(n => n.id === notificationId);
      if (notification) notification.isRead = true;
      return mockResponse(undefined);
    }
    return apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Prototype for real-time listener (can be implemented with Firebase OnSnapshot or WebSockets)
  subscribeToNotifications(userId: string, callback: (notification: AppNotification) => void) {
    if (apiConfig.IS_MOCK) {
      console.log(`[NotificationService] Monitoring alerts for user: ${userId}`);
      
      const phrases = [
        "Your technician has reached the location.",
        "System check complete: No issues found.",
        "Your booking #CZ-8812 has been rescheduled to tomorrow 4PM.",
        "Special Flash Sale: 50% discount on master cleaning for next 1 hour!"
      ];

      const interval = setInterval(() => {
        // 30% chance to get a notification every 20 seconds
        if (Math.random() > 0.7) {
          const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
          callback({
            id: `n-realtime-${Date.now()}`,
            title: 'Coolzo Alert',
            message: randomPhrase,
            type: randomPhrase.includes('%') ? 'promotion' : 'status_update',
            isRead: false,
            createdAt: new Date().toISOString()
          });
        }
      }, 20000);
      
      return () => {
        console.log(`[NotificationService] Unsubscribed for user: ${userId}`);
        clearInterval(interval);
      };
    }
    // Real implementation would use WebSocket/SSE/Firestore
    return () => {};
  }
};
