/** One ticket row in the customer's support ticket list. */
export interface SupportTicketListItemResponse {
  supportTicketId: number;
  ticketNumber: string;
  subject: string;
  categoryName?: string;
  priorityName?: string;
  currentStatus: string;    // Open | InProgress | Resolved | Closed
  dateCreated: string;
  lastReplyAt?: string;
  hasUnreadReplies?: boolean;
}

/** Full ticket detail — from GET /api/support-tickets/{id} */
export interface SupportTicketDetailResponse {
  supportTicketId: number;
  ticketNumber: string;
  subject: string;
  description: string;
  categoryId: number;
  categoryName?: string;
  priorityId: number;
  priorityName?: string;
  currentStatus: string;
  assignedTo?: string;
  customerName?: string;
  dateCreated: string;
  dateUpdated?: string;
  replies: SupportTicketReplyResponse[];
  links: SupportTicketLinkResponse[];
  canClose: boolean;
  canReopen: boolean;
  canManage: boolean;
}

export interface SupportTicketReplyResponse {
  replyId: number;
  message: string;
  senderName: string;
  isStaff: boolean;
  dateCreated: string;
  attachmentUrls?: string[];
}

export interface SupportTicketLinkResponse {
  linkId: number;
  linkedEntityType: string;
  linkedEntityId: string;
  linkReference?: string;
  linkSummary?: string;
}

export interface SupportTicketLookupItem {
  id: number;
  name: string;
}
