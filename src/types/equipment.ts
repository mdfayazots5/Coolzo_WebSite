/** Customer equipment item — GET /api/customers/me/equipment */
export interface CustomerEquipmentResponse {
  equipmentId: number;
  name: string;
  type: string;
  brand: string;
  capacity: string;
  location?: string;
  serialNumber?: string;
  purchaseDate?: string;
  lastServiceDate?: string;
  isActive: boolean;
  dateCreated: string;
}

/** Request shape for POST/PUT /api/customers/me/equipment */
export interface CreateCustomerEquipmentRequest {
  name: string;
  type: string;
  brand: string;
  capacity: string;
  location?: string;
  serialNumber?: string;
  purchaseDate?: string;
  lastServiceDate?: string;
}

export type UpdateCustomerEquipmentRequest = Partial<CreateCustomerEquipmentRequest>;
