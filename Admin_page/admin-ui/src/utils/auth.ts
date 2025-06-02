import axios from 'axios';
import type { LoginFormData, LoginResponse, AuthState } from '../types/auth';
import { clearWebsitesCache } from './api';

const API_URL = 'http://localhost:8000/api/v1';

// Token storage keys
const TOKEN_KEY = 'auth_token';
const ROLE_KEY = 'auth_role';
const USERNAME_KEY = 'auth_username';


// Create axios instance with default config
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login
      clearAuthData();
      // Force navigation to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Store auth data in localStorage
export const storeAuthData = (data: LoginResponse) => {
  localStorage.setItem(TOKEN_KEY, data.access_token);
  localStorage.setItem(ROLE_KEY, data.role);
  localStorage.setItem(USERNAME_KEY, data.username);
};

// Clear auth data from localStorage
export const clearAuthData = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USERNAME_KEY);
  clearWebsitesCache();
  // Clear session storage as well
  sessionStorage.clear();
};

// Logout function
export const logout = () => {
  clearAuthData();
  window.location.href = '/login';
};

// Get current auth state
export const getAuthState = (): AuthState => {
  const token = localStorage.getItem(TOKEN_KEY);
  const role = localStorage.getItem(ROLE_KEY);
  const username = localStorage.getItem(USERNAME_KEY);
  
  return {
    token,
    role,
    username,
    isAuthenticated: !!token,
  };
};

// Check if user is authenticated (with token validation)
export const isUserAuthenticated = (): boolean => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    return false;
  }
  
  // Check if token is expired (basic check)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    if (payload.exp && payload.exp < currentTime) {
      clearAuthData();
      return false;
    }
  } catch (error) {
    // If token is invalid, clear it
    clearAuthData();
    return false;
  }
  
  return true;
};

// Login API call
export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  try {
    // Convert data to x-www-form-urlencoded
    const params = new URLSearchParams();
    params.append('username', data.username);
    params.append('password', data.password);

    const response = await api.post<LoginResponse>(
      '/login',
      params,
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      }
    );
    storeAuthData(response.data);
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };
    if (axiosError.response?.status === 401) {
      throw new Error('Invalid username or password');
    }
    throw new Error(axiosError.response?.data?.detail || 'Login failed');
  }
};

// Get current user info from /me endpoint
export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response.data;
};

// Update current user info via PATCH /me
export const updateCurrentUser = async (data: { firstName?: string; lastName?: string; password?: string }) => {
  const response = await api.patch('/me', data, {
    headers: { 'Content-Type': 'application/json' }
  });
  return response.data;
}; 