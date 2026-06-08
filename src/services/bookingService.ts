import apiClient from './apiClient';
import type { PagedResult } from '../types/common';
import type {
  BookingListItemResponse,
  BookingDetailResponse,
  BookingSummaryResponse,
  CustomerBookingCreateRequest,
  GuestBookingCreateRequest,
} from '../types/booking';

export const BookingService = {
  async getMyBookings(
    pageNumber = 1,
    pageSize = 10,
  ): Promise<PagedResult<BookingListItemResponse>> {
    return apiClient.get('/api/bookings/my-bookings', {
      params: { pageNumber, pageSize },
    });
  },

  async getBookingById(bookingId: number): Promise<BookingDetailResponse> {
    return apiClient.get(`/api/bookings/${bookingId}`);
  },

  async getCustomerBookingById(bookingId: number): Promise<BookingDetailResponse> {
    return apiClient.get(`/api/customer-bookings/${bookingId}`);
  },

  async createCustomerBooking(
    data: CustomerBookingCreateRequest,
  ): Promise<BookingSummaryResponse> {
    return apiClient.post('/api/bookings/customer', data);
  },

  async createGuestBooking(data: GuestBookingCreateRequest): Promise<BookingSummaryResponse> {
    return apiClient.post('/api/bookings/guest', data);
  },

  async rescheduleBooking(
    bookingId: number,
    slotAvailabilityId: number,
    remarks?: string,
  ): Promise<BookingDetailResponse> {
    return apiClient.post(`/api/bookings/${bookingId}/reschedule`, {
      slotAvailabilityId,
      remarks,
    });
  },

  async getServiceReport(bookingId: number): Promise<BookingDetailResponse> {
    return apiClient.get(`/api/customer-bookings/${bookingId}/service-report`);
  },

  async downloadServiceReportPdf(bookingId: number): Promise<Blob> {
    return apiClient.get(`/api/customer-bookings/${bookingId}/service-report/pdf`, {
      responseType: 'blob',
    });
  },
};
