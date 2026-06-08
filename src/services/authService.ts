import apiClient from './apiClient';
import { tokenStorage } from './tokenStorage';
import type {
  AuthTokenResponse,
  CurrentUserResponse,
  CustomerProfileResponse,
} from '../types/auth';

/**
 * AuthService — all calls go to the backend JWT auth endpoints.
 * Firebase has been removed.
 */
export const AuthService = {
  /**
   * Login with email / password.
   * Stores tokens and returns the current user.
   */
  async loginEmail(email: string, password: string): Promise<CurrentUserResponse> {
    const tokenData: AuthTokenResponse = await apiClient.post('/api/auth/login', {
      userNameOrEmail: email,
      password,
    });

    tokenStorage.setTokens(tokenData.accessToken, tokenData.refreshToken);
    return AuthService.getMe();
  },

  /**
   * Send an OTP to the given mobile number.
   */
  async sendOtp(mobileNumber: string): Promise<void> {
    await apiClient.post('/api/auth/otp/send', { phone: mobileNumber });
  },

  /**
   * Verify OTP and log the user in.
   * Stores tokens and returns the current user.
   */
  async loginOtp(mobileNumber: string, otp: string): Promise<CurrentUserResponse> {
    const tokenData: AuthTokenResponse = await apiClient.post('/api/auth/otp/verify', {
      phone: mobileNumber,
      otp,
    });

    tokenStorage.setTokens(tokenData.accessToken, tokenData.refreshToken);
    return AuthService.getMe();
  },

  /**
   * Create a new customer account then immediately send an OTP to the mobile.
   *
   * Flow: POST /api/customer-auth/register → POST /api/auth/otp/send
   * The account must exist BEFORE otp/send is called (backend throws 404 otherwise).
   * Call loginOtp() once the user submits the 6-digit code.
   */
  async createAccount(
    customerName: string,
    mobileNumber: string,
  ): Promise<void> {
    // Step 1 — create the account (no password — backend generates temp)
    await apiClient.post('/api/customer-auth/register', {
      customerName,
      mobileNumber,
    });

    // Step 2 — now that the user exists, send the OTP
    await apiClient.post('/api/auth/otp/send', { phone: mobileNumber });
  },

  /**
   * @deprecated — replaced by createAccount() + loginOtp() two-step flow.
   * Kept to avoid breaking any other callers; delegates to createAccount + loginOtp.
   */
  async register(
    customerName: string,
    mobileNumber: string,
    otp: string,
  ): Promise<CurrentUserResponse> {
    await AuthService.createAccount(customerName, mobileNumber);
    return AuthService.loginOtp(mobileNumber, otp);
  },

  /**
   * Fetch the currently authenticated user from the backend.
   */
  async getMe(): Promise<CurrentUserResponse> {
    return apiClient.get('/api/auth/me');
  },

  /**
   * Log the current user out and clear all stored tokens.
   */
  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    if (refreshToken) {
      try {
        await apiClient.post('/api/auth/logout', { refreshToken });
      } catch {
        // Proceed with local logout even if the server call fails
      }
    }
    tokenStorage.clear();
  },

  /**
   * Trigger a forgot-password email / SMS.
   */
  async forgotPassword(loginId: string): Promise<void> {
    await apiClient.post('/api/auth/forgot-password', { loginId });
  },

  /**
   * Reset password using the token from the forgot-password email.
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/api/auth/reset-password', { token, password: newPassword });
  },

  /**
   * Change password for the currently logged-in customer.
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.post('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },

  /**
   * Fetch the full customer profile (separate from the auth identity).
   */
  async getProfile(): Promise<CustomerProfileResponse> {
    return apiClient.get('/api/customers/me/profile');
  },
};
