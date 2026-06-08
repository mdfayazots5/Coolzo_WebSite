/** Customer notification item */
export interface CustomerNotificationResponse {
  notificationId: number;
  title: string;
  message: string;
  notificationType: string;   // status_update | promotion | system | reminder
  isRead: boolean;
  createdAt: string;
  entityId?: number;
  entityType?: string;
  actionUrl?: string;
}

/** Communication preferences — GET /api/communication-preferences/me */
export interface CommunicationPreferenceResponse {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  push: boolean;
  promotions: boolean;
  reminders: boolean;
  statusUpdates: boolean;
}
