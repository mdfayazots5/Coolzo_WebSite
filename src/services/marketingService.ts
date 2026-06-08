import apiClient from './apiClient';

export interface LoyaltyResponse {
  totalPoints: number;
  tier?: string;
  expiringPoints?: number;
  expiryDate?: string;
  history?: { points: number; reason: string; date: string }[];
}

export interface ReferralStatsResponse {
  referralCode: string;
  referralLink?: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  totalRewardsEarned: number;
  referrals?: {
    name: string;
    date: string;
    status: string;
    reward?: number;
  }[];
}

export interface PromotionalOffer {
  offerId: number;
  title: string;
  description?: string;
  discountType?: string;
  discountValue?: number;
  couponCode?: string;
  validUntil?: string;
  imageUrl?: string;
}

export const MarketingService = {
  async getLoyaltyStats(): Promise<LoyaltyResponse> {
    return apiClient.get('/api/loyalty/me').catch(() => ({
      totalPoints: 0,
      tier: 'Standard',
      history: [],
    }));
  },

  async getReferralStats(): Promise<ReferralStatsResponse> {
    return apiClient.get('/api/referrals/me').catch(() => ({
      referralCode: '',
      totalReferrals: 0,
      successfulReferrals: 0,
      pendingReferrals: 0,
      totalRewardsEarned: 0,
      referrals: [],
    }));
  },

  async getOffers(): Promise<PromotionalOffer[]> {
    return apiClient.get('/api/offers').catch(() => []);
  },
};
