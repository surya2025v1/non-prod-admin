export interface LoginFormData {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  role: string;
  username: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  token: string | null;
  role: string | null;
  username: string | null;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
} 