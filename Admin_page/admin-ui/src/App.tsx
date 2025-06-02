import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { getAuthState, isUserAuthenticated } from './utils/auth';
import PaymentsPage from './components/PaymentsPage';
import UserProfile from './components/UserProfile';
import UserManagement from './components/UserManagement';
import DashboardLayout from './components/layout/DashboardLayout';
import ErrorBoundary from './components/ErrorBoundary';
import { FiAlertCircle } from 'react-icons/fi';

export default function App() {
  const isAuthenticated = isUserAuthenticated();

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        <Route
          path="/forgot-password"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ResetPassword />}
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* User Profile route */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <UserProfile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin-only routes */}
        <Route
          path="/dashboard/users"
          element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <DashboardLayout>
                <UserManagement />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        
        {/* Unauthorized access route */}
        <Route
          path="/unauthorized"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center max-w-lg">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FiAlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
                    
                    {/* Debug info */}
                    <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                      <h3 className="font-semibold text-gray-900 mb-2">Debug Information:</h3>
                      <p className="text-sm text-gray-700">Your current role: <strong>{getAuthState().role || 'None'}</strong></p>
                      <p className="text-sm text-gray-700">Required role: <strong>admin</strong></p>
                      <p className="text-sm text-gray-700">Authenticated: <strong>{getAuthState().isAuthenticated ? 'Yes' : 'No'}</strong></p>
                    </div>
                    
                    <p className="text-gray-600 mb-6">Please contact your administrator if you believe this is an error.</p>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Go Back
                      </button>
                      <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Go to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">System Settings</h2>
                    <p className="text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Analytics route */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
                    <p className="text-gray-600">Advanced analytics coming soon...</p>
                  </div>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Payments route */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PaymentsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback route */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}
