import apiClient from './apiClient';
import type { PagedResult } from '../types/common';

export interface ReviewResponse {
  reviewId: number;
  customerName: string;
  rating: number;
  comment: string;
  serviceId?: number;
  serviceName?: string;
  bookingId?: number;
  dateCreated: string;
  isVerified?: boolean;
}

export interface SubmitReviewRequest {
  bookingId?: number;
  serviceId?: number;
  rating: number;
  comment: string;
}

export const ReviewService = {
  async getReviews(
    serviceId?: number,
    pageNumber = 1,
    pageSize = 20,
  ): Promise<PagedResult<ReviewResponse>> {
    return apiClient.get('/api/customer-reviews', {
      params: { serviceId, pageNumber, pageSize },
    });
  },

  async submitReview(data: SubmitReviewRequest): Promise<ReviewResponse> {
    return apiClient.post('/api/customer-reviews', data);
  },
};
