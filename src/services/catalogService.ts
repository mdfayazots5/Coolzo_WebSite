import { apiConfig } from '../config/apiConfig';
import apiClient from './apiClient';
import { mockResponse } from './mockUtils';

export interface ACService {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  description: string;
  image: string;
  benefits: string[];
}

const DUMMY_SERVICES: ACService[] = [
  {
    id: 's1',
    name: 'Advanced Wet Wash',
    category: 'Maintenance',
    price: 499,
    duration: '45 mins',
    description: 'Deep cleaning of indoor and outdoor units using high-pressure jet.',
    image: 'https://picsum.photos/seed/wetwash/400/300',
    benefits: ['Improved cooling', 'Eco-friendly disposal', 'Bacteria removal']
  },
  {
    id: 's2',
    name: 'Gas Refilling',
    category: 'Repair',
    price: 1299,
    duration: '60 mins',
    description: 'Complete leak detection and gas top-up for all AC types.',
    image: 'https://picsum.photos/seed/gas/400/300',
    benefits: ['Optimized efficiency', 'Leak check included', '6-month warranty']
  },
  {
    id: 's3',
    name: 'Installation Service',
    category: 'Installation',
    price: 1499,
    duration: '120 mins',
    description: 'Professional installation of split or window AC units.',
    image: 'https://picsum.photos/seed/install/400/300',
    benefits: ['Safe mounting', 'Gas check', 'Free demo']
  }
];

export const CatalogService = {
  async getServices(): Promise<ACService[]> {
    if (apiConfig.IS_MOCK) {
      return mockResponse(DUMMY_SERVICES);
    }
    return apiClient.get('/services');
  },

  async getServiceById(id: string): Promise<ACService | undefined> {
    if (apiConfig.IS_MOCK) {
      const service = DUMMY_SERVICES.find(s => s.id === id);
      return mockResponse(service);
    }
    return apiClient.get(`/services/${id}`);
  },

  async searchServices(query: string): Promise<ACService[]> {
    if (apiConfig.IS_MOCK) {
      const filtered = DUMMY_SERVICES.filter(s => 
        s.name.toLowerCase().includes(query.toLowerCase()) || 
        s.category.toLowerCase().includes(query.toLowerCase())
      );
      return mockResponse(filtered);
    }
    return apiClient.get(`/services/search?q=${query}`);
  }
};
