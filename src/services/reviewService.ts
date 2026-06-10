import apiClient from './apiClient';
import type { PagedResult } from '../types/common';

/** Normalised review shape consumed by the UI. */
export interface ReviewResponse {
  reviewId: number;
  customerName: string;
  customerPhoto?: string;
  rating: number;
  comment: string;
  serviceId?: number;
  serviceName?: string;
  bookingId?: number;
  dateCreated: string;
  isVerified?: boolean;
}

/** Raw shape returned by GET /api/customer-reviews (data payload, post-unwrap). */
interface RawReview {
  customerReviewId: number;
  customerId?: number;
  userName?: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  serviceId?: number | null;
  serviceName?: string | null;
  bookingId?: number | null;
  createdAt: string;
  isVerified?: boolean;
}

export interface SubmitReviewRequest {
  bookingId?: number;
  serviceId?: number;
  rating: number;
  comment: string;
}

function mapReview(r: RawReview): ReviewResponse {
  return {
    reviewId: r.customerReviewId,
    customerName: r.userName ?? 'Coolzo Customer',
    customerPhoto: r.userPhoto || undefined,
    rating: r.rating,
    comment: r.comment,
    serviceId: r.serviceId ?? undefined,
    serviceName: r.serviceName ?? undefined,
    bookingId: r.bookingId ?? undefined,
    dateCreated: r.createdAt,
    isVerified: r.isVerified ?? undefined,
  };
}

export const ReviewService = {
  async getReviews(
    serviceId?: number,
    pageNumber = 1,
    pageSize = 20,
  ): Promise<PagedResult<ReviewResponse>> {
    // The customer-reviews endpoint currently returns a bare array as its
    // data payload (no paging envelope). Handle both shapes defensively.
    const raw = await apiClient.get<RawReview[] | PagedResult<RawReview>>(
      '/api/customer-reviews',
      { params: { serviceId, pageNumber, pageSize } },
    );

    if (Array.isArray(raw)) {
      const items = raw.map(mapReview);
      return {
        items,
        totalCount: items.length,
        pageNumber,
        pageSize,
        totalPages: 1,
        hasNext: false, // backend does not paginate this list yet
        hasPrevious: false,
      };
    }

    return { ...raw, items: (raw.items ?? []).map(mapReview) };
  },

  async submitReview(data: SubmitReviewRequest): Promise<ReviewResponse> {
    const raw = await apiClient.post<RawReview>('/api/customer-reviews', data);
    return mapReview(raw);
  },
};
