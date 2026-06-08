/** Token pair returned on login / refresh. */
export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/** Logged-in user identity — from GET /api/auth/me */
export interface CurrentUserResponse {
  userId: number;
  userName: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  customerId?: number;
}

/** Customer profile — from GET /api/customers/me/profile */
export interface CustomerProfileResponse {
  customerId: number;
  customerName: string;
  emailAddress: string;
  mobileNumber: string;
  alternateNumber?: string;
  photoUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
  isActive: boolean;
  dateCreated: string;
}

/** Request shape for PUT /api/customers/me/profile */
export interface UpdateCustomerProfileRequest {
  customerName:  string;
  emailAddress:  string;
  mobileNumber:  string;
  alternateNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  preferredLanguage?: string;
}
