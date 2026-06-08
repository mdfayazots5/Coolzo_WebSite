import apiClient from './apiClient';
import type { PagedResult } from '../types/common';
import type { InvoiceListItemResponse, InvoiceDetailResponse } from '../types/invoice';

export const InvoiceService = {
  async getCustomerInvoices(
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedResult<InvoiceListItemResponse>> {
    return apiClient.get('/api/invoices/customer', { params: { pageNumber, pageSize } });
  },

  async getInvoiceById(invoiceId: number): Promise<InvoiceDetailResponse> {
    return apiClient.get(`/api/invoices/${invoiceId}`);
  },

  async downloadInvoicePdf(invoiceId: number): Promise<Blob> {
    return apiClient.get(`/api/invoices/${invoiceId}/pdf`, { responseType: 'blob' });
  },
};
