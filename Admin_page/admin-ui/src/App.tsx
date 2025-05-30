import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { getAuthState } from './utils/auth';
import PaymentsPage from './components/PaymentsPage';
import UserProfile from './components/UserProfile';
import DashboardLayout from './components/layout/DashboardLayout';

export default function App() {
  const { isAuthenticated } = getAuthState();

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
            <ProtectedRoute allowedRoles={['admin']}>
              <DashboardLayout>
                <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Users Management</h2>
                    <p className="text-gray-600">Coming soon...</p>
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
