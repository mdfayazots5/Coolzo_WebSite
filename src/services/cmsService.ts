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

export interface CMSFaqResponse {
  faqId: number;
  question: string;
  answer: string;
  category?: string;
  sortOrder: number;
}

export const CMSService = {
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
