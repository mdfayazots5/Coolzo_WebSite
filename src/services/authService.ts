import { auth, googleProvider } from '../lib/firebase';
import { 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  updateProfile as firebaseUpdateProfile,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { apiConfig } from '../config/apiConfig';
import { mockResponse } from './mockUtils';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  phone?: string;
}

export const AuthService = {
  async loginWithGoogle(): Promise<FirebaseUser> {
    if (apiConfig.IS_MOCK) {
      return mockResponse({
        uid: 'mock-123',
        email: 'mockuser@example.com',
        displayName: 'Mock User',
        photoURL: 'https://picsum.photos/seed/user/100/100',
      } as any);
    }
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  },

  async loginEmail(email: string, pass: string): Promise<FirebaseUser> {
    if (apiConfig.IS_MOCK) {
       if (email === 'admin@coolzo.com' && pass === 'Admin@123') {
         return mockResponse({ uid: 'mock-admin', email, displayName: 'Admin User' } as any);
       }
       throw new Error("Invalid credentials in mock mode");
    }
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  },

  async register(email: string, pass: string, name: string): Promise<FirebaseUser> {
    if (apiConfig.IS_MOCK) {
      return mockResponse({ uid: 'mock-new', email, displayName: name } as any);
    }
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    await firebaseUpdateProfile(result.user, { displayName: name });
    return result.user;
  },

  async updateProfile(user: FirebaseUser, data: { displayName?: string, photoURL?: string }): Promise<void> {
    if (apiConfig.IS_MOCK) {
      return mockResponse(undefined);
    }
    await firebaseUpdateProfile(user, data);
  },

  async logout(): Promise<void> {
    if(apiConfig.IS_MOCK) return mockResponse(undefined);
    await signOut(auth);
  }
};
