import apiClient from './apiClient';

export interface PaymentReceiptResponse {
  receiptId: number;
  invoiceId: number;
  invoiceNumber: string;
  amount: number;
  paymentMethod: string;
  transactionReference?: string;
  paidAt: string;
  customerName: string;
}

export const PaymentService = {
  async collectPayment(
    invoiceId: number,
    method: string,
    reference?: string,
  ): Promise<{ redirectUrl?: string; transactionId?: string; status: string }> {
    return apiClient.post('/api/payments/collect', {
      invoiceId,
      paymentMethod: method,
      reference,
    });
  },

  async getReceipt(invoiceId: number): Promise<PaymentReceiptResponse> {
    return apiClient.get(`/api/payments/receipt/${invoiceId}`);
  },
};
