import apiClient from './apiClient';
import type { PagedResult } from '../types/common';
import type {
  SupportTicketListItemResponse,
  SupportTicketDetailResponse,
  SupportTicketLookupItem,
} from '../types/ticket';

export interface CreateTicketRequest {
  subject: string;
  categoryId: number;
  priorityId: number;
  description: string;
  links?: { linkedEntityType: string; linkedEntityId: string }[];
}

export const TicketService = {
  async getMyTickets(
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedResult<SupportTicketListItemResponse>> {
    return apiClient.get('/api/support-tickets/my-tickets', {
      params: { pageNumber, pageSize },
    });
  },

  async getTicketById(ticketId: number): Promise<SupportTicketDetailResponse> {
    return apiClient.get(`/api/support-tickets/${ticketId}`);
  },

  async createTicket(data: CreateTicketRequest): Promise<SupportTicketDetailResponse> {
    // CustomerId is intentionally omitted — backend resolves it from the JWT
    return apiClient.post('/api/support-tickets', data);
  },

  async addReply(ticketId: number, message: string): Promise<void> {
    await apiClient.post(`/api/support-tickets/${ticketId}/replies`, { message });
  },

  async closeTicket(ticketId: number, remarks?: string): Promise<void> {
    await apiClient.post(`/api/support-tickets/${ticketId}/close`, { remarks });
  },

  async reopenTicket(ticketId: number, remarks?: string): Promise<void> {
    await apiClient.post(`/api/support-tickets/${ticketId}/reopen`, { remarks });
  },

  async getCategories(): Promise<SupportTicketLookupItem[]> {
    return apiClient.get('/api/support-ticket-lookups/categories');
  },

  async getPriorities(): Promise<SupportTicketLookupItem[]> {
    return apiClient.get('/api/support-ticket-lookups/priorities');
  },
};
