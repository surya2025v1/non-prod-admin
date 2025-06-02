import React, { Component } from 'react';
import type { ErrorInfo } from 'react';
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import { clearAuthData } from '../utils/auth';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // If it's an authentication error, clear auth data
    if (error.message.includes('401') || error.message.includes('unauthorized')) {
      clearAuthData();
      window.location.href = '/login';
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center max-w-lg w-full border border-red-100">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <FiAlertTriangle className="w-10 h-10 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Something went wrong</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              An unexpected error occurred. Please refresh the page or try logging in again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <FiRefreshCw className="w-4 h-4" />
                Refresh Page
              </button>
              <button
                onClick={() => {
                  clearAuthData();
                  window.location.href = '/login';
                }}
                className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 