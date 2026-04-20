import { apiConfig } from '../config/apiConfig';
import apiClient from './apiClient';
import { mockResponse } from './mockUtils';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
  serviceId?: string;
}

const DUMMY_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Vikram Seth',
    rating: 5,
    comment: 'Exceptional service! The technician was very professional and the cooling is better than ever.',
    date: '2026-04-10'
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Ananya R.',
    rating: 4,
    comment: 'Technician arrived on time. Good job on the deep cleaning.',
    date: '2026-04-05'
  }
];

export const ReviewService = {
  async getReviewsForService(serviceId: string): Promise<Review[]> {
    if (apiConfig.IS_MOCK) {
      return mockResponse(DUMMY_REVIEWS);
    }
    return apiClient.get(`/services/${serviceId}/reviews`);
  },

  async submitReview(data: Omit<Review, 'id' | 'date'>): Promise<Review> {
    if (apiConfig.IS_MOCK) {
      const newReview: Review = {
        ...data,
        id: `rev-${Math.random().toString(36).substring(2, 9)}`,
        date: new Date().toISOString().split('T')[0]
      };
      return mockResponse(newReview);
    }
    return apiClient.post('/reviews', data);
  }
};
