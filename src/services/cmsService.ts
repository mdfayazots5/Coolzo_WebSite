import apiClient from './apiClient';

export interface CMSBlockResponse {
  blockKey: string;
  title?: string;
  content?: string;
  imageUrl?: string;
  linkUrl?: string;
  sortOrder?: number;
  isPublished?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CMSBannerResponse {
  bannerId: number;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  linkUrl?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface CMSFaqResponse {
  faqId: number;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
}

export interface CMSHomeResponse {
  banners?: CMSBannerResponse[];
  featuredServices?: CMSBlockResponse[];
  testimonials?: CMSBlockResponse[];
  [key: string]: unknown;
}

export const CMSService = {
  async getHomeContent(): Promise<CMSHomeResponse> {
    return apiClient.get('/api/cms/public/home');
  },

  async getBanners(): Promise<CMSBannerResponse[]> {
    return apiClient.get('/api/cms/public/banners').catch(() => []);
  },

  async getBlogs(): Promise<CMSBlockResponse[]> {
    return apiClient.get('/api/cms/public/blogs').catch(() => []);
  },

  async getBlogByKey(key: string): Promise<CMSBlockResponse | null> {
    return apiClient.get(`/api/cms/blocks/${key}`).catch(() => null);
  },

  async getFaqs(category?: string): Promise<CMSFaqResponse[]> {
    return apiClient
      .get('/api/cms/public/faqs', { params: { category } })
      .catch(() => []);
  },

  async getServiceContent(serviceKey: string): Promise<CMSBlockResponse | null> {
    return apiClient
      .get(`/api/cms/public/service-content/${serviceKey}`)
      .catch(() => null);
  },
};
