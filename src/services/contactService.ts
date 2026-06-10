import apiClient from './apiClient';

/** Public contact/lead capture — POST /api/leads (AllowAnonymous). */
export interface ContactLeadRequest {
  customerName: string;
  mobileNumber: string;
  emailAddress?: string;
  sourceChannel: string;
  inquiryNotes?: string;
}

export interface LeadResponse {
  leadId: number;
  currentStatus: string;
}

export const ContactService = {
  async submitLead(data: ContactLeadRequest): Promise<LeadResponse> {
    return apiClient.post('/api/leads', data);
  },
};
