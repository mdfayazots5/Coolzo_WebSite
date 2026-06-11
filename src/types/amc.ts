/**
 * AMC plan listing — GET /api/amc/plans (and snapshot.masters.amcPlans).
 * Field names mirror the backend Coolzo.Contracts.Responses.Amc.AmcPlanResponse exactly.
 */
export interface AmcPlanResponse {
  amcPlanId: number;
  planName: string;
  planDescription: string;
  durationInMonths: number;
  visitCount: number;
  priceAmount: number;
  isActive: boolean;
  termsAndConditions: string;
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
