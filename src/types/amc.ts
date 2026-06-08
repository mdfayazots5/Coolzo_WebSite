/** AMC plan listing — GET /api/amc/plans */
export interface AmcPlanResponse {
  planId: number;
  planName: string;
  description?: string;
  durationMonths: number;
  numberOfVisits: number;
  price: number;
  features?: string[];
  isActive: boolean;
}

/** Customer's active AMC subscription */
export interface CustomerAmcResponse {
  customerAmcId: number;
  planName: string;
  startDate: string;
  endDate: string;
  numberOfVisits: number;
  visitsUsed: number;
  visitsRemaining: number;
  currentStatus: string;
  nextVisitDate?: string;
  visits?: AmcVisitResponse[];
}

export interface AmcVisitResponse {
  visitId: number;
  scheduledDate: string;
  visitStatus: string;
  technicianName?: string;
  notes?: string;
}
