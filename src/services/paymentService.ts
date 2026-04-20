import { apiConfig } from '../config/apiConfig';
import apiClient from './apiClient';
import { mockResponse } from './mockUtils';

export interface PaymentRecord {
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  method: string;
  createdAt: string;
}

export const PaymentService = {
  async initiatePayment(bookingId: string, amount: number): Promise<{ checkoutUrl?: string; paymentId: string }> {
    if (apiConfig.IS_MOCK) {
      return mockResponse({
        paymentId: `PAY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        checkoutUrl: 'https://checkout.stripe.com/mock_session'
      });
    }
    return apiClient.post('/payments/initiate', { bookingId, amount });
  },

  async verifyPayment(paymentId: string): Promise<PaymentRecord> {
    if (apiConfig.IS_MOCK) {
      return mockResponse({
        transactionId: paymentId,
        amount: 499,
        currency: 'INR',
        status: 'success',
        method: 'UPI',
        createdAt: new Date().toISOString()
      });
    }
    return apiClient.get(`/payments/verify/${paymentId}`);
  }
};
