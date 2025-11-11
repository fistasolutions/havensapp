/**
 * API Client Service
 * Centralized HTTP client for API communication
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Base URL - Use localhost for iOS simulator, 10.0.2.2 for Android emulator
// In production, this should be set via environment variable or config
const getApiBaseUrl = (): string => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000/api/v1'; // Android emulator localhost
  }
  return 'http://localhost:3000/api/v1'; // iOS simulator localhost
};

const API_BASE_URL = getApiBaseUrl();

// Token storage keys
const ACCESS_TOKEN_KEY = '@havensapp:accessToken';
const REFRESH_TOKEN_KEY = '@havensapp:refreshToken';

/**
 * Create axios instance with default configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000, // 30 seconds
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - Add auth token
  client.interceptors.request.use(
    async (config) => {
      try {
        const token = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error getting token:', error);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Response interceptor - Handle errors and token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      // Handle 401 Unauthorized - Token expired or invalid
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Attempt to refresh token
          const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
          if (refreshToken) {
            // TODO: Implement token refresh endpoint call
            // For now, clear tokens and redirect to login
            await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
          }
        } catch (refreshError) {
          // Clear tokens on refresh failure
          await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();

/**
 * Store authentication tokens
 */
export const storeTokens = async (
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  try {
    await AsyncStorage.multiSet([
      [ACCESS_TOKEN_KEY, accessToken],
      [REFRESH_TOKEN_KEY, refreshToken],
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

/**
 * Get stored access token
 */
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Clear authentication tokens
 */
export const clearTokens = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAccessToken();
  return token !== null;
};

