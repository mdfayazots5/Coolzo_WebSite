/** One invoice row in the customer's invoice list. */
export interface InvoiceListItemResponse {
  invoiceId: number;
  invoiceNumber: string;
  bookingReference?: string;
  serviceRequestId?: number;
  invoiceDate: string;
  dueDate?: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;          // Unpaid | Paid | Overdue | Cancelled
  serviceName?: string;
}

/** Full invoice detail — from GET /api/invoices/{id} */
export interface InvoiceDetailResponse {
  invoiceId: number;
  invoiceNumber: string;
  bookingReference?: string;
  invoiceDate: string;
  dueDate?: string;
  customerName: string;
  customerEmail?: string;
  customerMobile?: string;
  addressLine1?: string;
  cityName?: string;
  lines: InvoiceLineResponse[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: string;
  notes?: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface InvoiceLineResponse {
  lineId: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  taxRate?: number;
}
