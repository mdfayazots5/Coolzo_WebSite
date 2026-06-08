/** Customer address — GET /api/customers/me/addresses */
export interface CustomerAddressResponse {
  addressId: number;
  addressLabel: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  cityName: string;
  stateName?: string;
  pincode: string;
  zoneId?: number;
  zoneName?: string;
  addressType?: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

/** Request shape for POST/PUT /api/customers/me/addresses */
export interface CreateCustomerAddressRequest {
  addressLabel: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  cityName: string;
  stateName?: string;
  pincode: string;
  zoneId?: number;
  addressType?: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export type UpdateCustomerAddressRequest = Partial<CreateCustomerAddressRequest>;

/** Zone lookup — GET /api/booking-lookups/zones/by-pincode/{pincode} */
export interface ZoneLookupResponse {
  zoneId: number;
  zoneName: string;
  isServiceable: boolean;
  estimatedArival?: string;
}
