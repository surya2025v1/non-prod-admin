import { useState, useEffect } from 'react';
import { FiX, FiEye, FiEyeOff, FiUser, FiLock, FiSave, FiCheck, FiSettings } from 'react-icons/fi';
import { getCurrentUser, updateCurrentUser } from '../utils/auth';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

// Dummy user data for UI demo
const user = {
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
};

export default function SettingsModal({ open, onClose }: SettingsModalProps) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialFirstName, setInitialFirstName] = useState('');
  const [initialLastName, setInitialLastName] = useState('');
  const [initialUsername, setInitialUsername] = useState('');
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  // Helper to refetch user info
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const value = await getCurrentUser();
      const data = value as { username?: string; firstName?: string; lastName?: string };
      setUsername(data.username || '');
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setInitialUsername(data.username || '');
      setInitialFirstName(data.firstName || '');
      setInitialLastName(data.lastName || '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUserInfo();
      setSuccess(false);
      setPassword('');
    }
  }, [open]);

  const isChanged =
    firstName !== initialFirstName ||
    lastName !== initialLastName ||
    password.length > 0;

  const handleUpdate = async () => {
    if (!isChanged) return;
    setUpdating(true);
    try {
      const payload: { firstName?: string; lastName?: string; password?: string } = {};
      if (firstName !== initialFirstName) payload.firstName = firstName;
      if (lastName !== initialLastName) payload.lastName = lastName;
      if (password.length > 0) payload.password = password;
      await updateCurrentUser(payload);
      setPassword('');
      setSuccess(true);
      await fetchUserInfo();
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } finally {
      setUpdating(false);
    }
  };

  if (!open) return null;

  const avatarLetter = firstName ? firstName[0].toUpperCase() : username ? username[0].toUpperCase() : 'U';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
      <div className="bg-white backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-lg relative animate-fadeIn border border-gray-200/50 overflow-hidden">
        {/* Header */}
        <div className="relative overflow-hidden bg-white px-8 py-6 border-b border-gray-100">
          {/* Close Button */}
          <button
            type="button"
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '0',
              border: 'none',
              fontSize: '1.125rem'
            }}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          
          <div className="relative text-center pr-12">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-xl">
              {avatarLetter}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h2>
            <p className="text-gray-600">Manage your profile information</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3 animate-fadeIn">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <FiCheck className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-semibold text-green-900">Profile Updated!</div>
                <div className="text-sm text-green-700">Your changes have been saved successfully.</div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading user information...</p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              {/* Username Field (Readonly) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 cursor-not-allowed"
                    value={username}
                    disabled
                    readOnly
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">Username cannot be changed</p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter new password (optional)"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(s => !s)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Leave blank to keep current password</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  className="flex-1 py-3 px-4 rounded-xl bg-white border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all duration-200"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isChanged || updating}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    isChanged && !updating
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed transform-none shadow-none'
                  }`}
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FiSave className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 