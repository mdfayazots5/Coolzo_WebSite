import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthService } from '../services/authService';
import { apiConfig } from '../config/apiConfig';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (apiConfig.IS_MOCK) {
       // In mock mode, we might want a persistent dummy user
       setUser({ uid: 'mock-123', email: 'mock@example.com', displayName: 'Mock User' } as any);
       setLoading(false);
       return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const fbUser = await AuthService.loginWithGoogle();
      if (apiConfig.IS_MOCK) setUser(fbUser);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    try {
      const fbUser = await AuthService.loginEmail(email, pass);
      if (apiConfig.IS_MOCK) setUser(fbUser);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, pass: string, name: string) => {
    try {
       const fbUser = await AuthService.register(email, pass, name);
       if (apiConfig.IS_MOCK) setUser(fbUser);
    } catch (error) {
       throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      if (apiConfig.IS_MOCK) setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginEmail, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
