/**
 * Authentication Service
 * Handles user authentication, registration, and token management
 */

import { apiClient, storeTokens, clearTokens, isAuthenticated } from '../api/client';

export interface RegisterData {
  email: string;
  password: string;
  role: 'Individual' | 'Provider' | 'Partner' | 'FamilyFriends' | 'Kid';
  firstName?: string;
  lastName?: string;
  age?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
  };
  accessToken: string;
  refreshToken: string;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);

    if (response.data.accessToken && response.data.refreshToken) {
      await storeTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || 'Registration failed');
    }
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);

    if (response.data.accessToken && response.data.refreshToken) {
      await storeTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || 'Login failed');
    }
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = async (): Promise<void> => {
  try {
    await clearTokens();
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const checkAuth = async (): Promise<boolean> => {
  return await isAuthenticated();
};

