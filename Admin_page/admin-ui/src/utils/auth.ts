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