import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AuthService } from '../services/authService';
import { tokenStorage } from '../services/tokenStorage';
import type { CurrentUserResponse } from '../types/auth';


// ─── Types ────────────────────────────────────────────────────────────────────

export interface AuthContextType {
  user: CurrentUserResponse | null;
  loading: boolean;
  loginEmail: (email: string, password: string) => Promise<CurrentUserResponse>;
  loginOtp: (mobile: string, otp: string) => Promise<CurrentUserResponse>;
  sendOtp: (mobile: string) => Promise<void>;
  /** Create account + send OTP in one step. Call loginOtp() when user submits the code. */
  createAccount: (name: string, mobile: string) => Promise<void>;
  /** @deprecated Use createAccount() + loginOtp() instead. */
  register: (name: string, mobile: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Re-fetches the current user from the server (useful after profile updates). */
  refreshUser: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: restore session using the stored access token.
  // If no tokens exist the user is not logged in — skip the network call entirely.
  // If the access token has expired the 401 interceptor in apiClient will silently
  // refresh it and retry getMe automatically — no proactive refresh needed here.
  useEffect(() => {
    if (!tokenStorage.getAccessToken() && !tokenStorage.hasRefreshToken()) {
      setLoading(false);
      return;
    }

    AuthService.getMe()
      .then((currentUser) => setUser(currentUser))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginEmail = useCallback(async (email: string, password: string): Promise<CurrentUserResponse> => {
    const currentUser = await AuthService.loginEmail(email, password);
    setUser(currentUser);
    return currentUser;
  }, []);

  const loginOtp = useCallback(async (mobile: string, otp: string): Promise<CurrentUserResponse> => {
    const currentUser = await AuthService.loginOtp(mobile, otp);
    setUser(currentUser);
    return currentUser;
  }, []);

  const sendOtp = useCallback(async (mobile: string) => {
    await AuthService.sendOtp(mobile);
  }, []);

  const createAccount = useCallback(
    async (name: string, mobile: string) => {
      await AuthService.createAccount(name, mobile);
      // Account created + OTP sent — user is NOT logged in yet.
      // Login happens when loginOtp() is called with the received code.
    },
    [],
  );

  const register = useCallback(
    async (name: string, mobile: string, otp: string) => {
      const currentUser = await AuthService.register(name, mobile, otp);
      setUser(currentUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    await AuthService.logout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await AuthService.getMe();
      setUser(currentUser);
    } catch {
      // If the token has expired the 401 interceptor will refresh it automatically
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, loginEmail, loginOtp, sendOtp, createAccount, register, logout, refreshUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
