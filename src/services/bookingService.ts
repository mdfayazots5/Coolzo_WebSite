import { apiConfig } from '../config/apiConfig';
import apiClient from './apiClient';
import { mockResponse } from './mockUtils';

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  technician?: {
    name: string;
    rating: number;
    image: string;
  };
}

export interface BookingRequest {
  userId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  address: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  isEmergency?: boolean;
  price: number;
  contactMobile: string;
}

const DUMMY_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    serviceId: 's1',
    serviceName: 'Advanced Wet Wash',
    date: '2026-04-25',
    time: '10:00 AM',
    status: 'scheduled',
    price: 499,
    technician: {
      name: 'Rahul Sharma',
      rating: 4.8,
      image: 'https://picsum.photos/seed/tech1/100/100'
    }
  },
  {
    id: 'b2',
    serviceId: 's2',
    serviceName: 'Gas Refilling',
    date: '2026-04-20',
    time: '02:30 PM',
    status: 'in-progress',
    price: 1299,
    technician: {
      name: 'Amit Kumar',
      rating: 4.9,
      image: 'https://picsum.photos/seed/tech2/100/100'
    }
  }
];

export const BookingService = {
  async getBookings(userId: string): Promise<Booking[]> {
    if (apiConfig.IS_MOCK) {
      return mockResponse(DUMMY_BOOKINGS);
    }
    return apiClient.get(`/users/${userId}/bookings`);
  },

  async createBooking(data: BookingRequest): Promise<Booking> {
    if (apiConfig.IS_MOCK) {
      const newBooking: Booking = {
        id: `CZ-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
        date: data.date,
        time: data.timeSlot === 'morning' ? '10:00 AM' : data.timeSlot === 'afternoon' ? '02:00 PM' : '05:00 PM',
        status: 'scheduled',
        price: data.price,
      };
      return mockResponse(newBooking);
    }
    return apiClient.post('/bookings', data);
  },

  async getBookingDetail(id: string): Promise<Booking | undefined> {
    if (apiConfig.IS_MOCK) {
      return mockResponse(DUMMY_BOOKINGS.find(b => b.id === id));
    }
    return apiClient.get(`/bookings/${id}`);
  }
};
