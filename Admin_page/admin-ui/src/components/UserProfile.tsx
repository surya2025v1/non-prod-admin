import { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiCamera, FiShield, FiClock, FiAward, FiTrendingUp, FiGlobe, FiCalendar } from 'react-icons/fi';
import { getCurrentUser, getAuthState } from '../utils/auth';
import SettingsModal from './SettingsModal';

interface UserInfo {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
  lastLogin?: string;
  role?: string;
  avatar?: string;
}

export default function UserProfile() {
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState<UserInfo>({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const { username } = getAuthState();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getCurrentUser() as UserInfo;
        const userData: UserInfo = {
          ...data,
          joinedDate: '2024-01-15',
          lastLogin: '2024-06-20',
          role: 'Premium User'
        };
        setUserInfo(userData);
        setEditForm(userData);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        // Fallback data
        const fallbackData: UserInfo = {
          firstName: '',
          lastName: '',
          username: username || 'User',
          email: 'user@example.com',
          phone: '',
          address: '',
          joinedDate: '2024-01-15',
          lastLogin: '2024-06-20',
          role: 'Premium User'
        };
        setUserInfo(fallbackData);
        setEditForm(fallbackData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [username]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement actual API call to update user info
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUserInfo(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save user info:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm(userInfo);
    setIsEditing(false);
  };

  const displayName = userInfo.firstName || userInfo.lastName
    ? `${userInfo.firstName || ''}${userInfo.lastName ? ' ' + userInfo.lastName : ''}`.trim()
    : userInfo.username || 'User';

  const avatarLetter = (userInfo.firstName && userInfo.firstName[0]) || (userInfo.username && userInfo.username[0]) || 'U';

  if (isLoading) {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-700 to-indigo-700 rounded-3xl mx-8 mt-8 mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-6 text-white mb-8 lg:mb-0">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                  {userInfo.avatar ? (
                    <img src={userInfo.avatar} alt="Profile" className="w-full h-full rounded-2xl object-cover" />
                  ) : (
                    avatarLetter.toUpperCase()
                  )}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 shadow-lg hover:bg-primary-50 transition-colors">
                  <FiCamera className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2">{displayName}</h1>
                <p className="text-xl text-blue-100 mb-2">@{userInfo.username}</p>
                <div className="flex items-center gap-4 text-blue-200">
                  <span className="flex items-center gap-1">
                    <FiAward className="w-4 h-4" />
                    {userInfo.role}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    Member since {userInfo.joinedDate}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/30 transition-all duration-200"
                >
                  <FiEdit2 className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all duration-200 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <FiSave className="w-5 h-5" />
                    )}
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold border border-white/20 hover:bg-white/30 transition-all duration-200"
                  >
                    <FiX className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <FiShield className="w-4 h-4" />
                  Verified
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter first name"
                        value={editForm.firstName || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiUser className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{userInfo.firstName || 'Not set'}</span>
                    </div>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                  {isEditing ? (
                    <div className="relative">
                      <FiUser className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter last name"
                        value={editForm.lastName || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiUser className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{userInfo.lastName || 'Not set'}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <FiMail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter email address"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiMail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{userInfo.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  {isEditing ? (
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter phone number"
                        value={editForm.phone || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{userInfo.phone || 'Not set'}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                        placeholder="Enter address"
                        value={editForm.address || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <FiMapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{userInfo.address || 'Not set'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Stats & Security */}
          <div className="space-y-6">
            {/* Account Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Account Statistics</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                      <FiGlobe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Websites</div>
                      <div className="text-sm text-gray-600">Active projects</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">3</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Total Views</div>
                      <div className="text-sm text-gray-600">This month</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">12.5K</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                      <FiClock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Last Login</div>
                      <div className="text-sm text-gray-600">Recent activity</div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-purple-600">{userInfo.lastLogin}</div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Security</h3>
              
              <div className="space-y-4">
                <button 
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                  onClick={() => setShowSettingsModal(true)}
                >
                  <div className="flex items-center gap-3">
                    <FiShield className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">Change Password</span>
                  </div>
                  <div className="text-primary-600">→</div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <FiShield className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">Two-Factor Auth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Enabled</span>
                    <div className="text-primary-600">→</div>
                  </div>
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                  <div className="flex items-center gap-3">
                    <FiShield className="w-5 h-5 text-primary-600" />
                    <span className="font-semibold text-gray-900">Login Sessions</span>
                  </div>
                  <div className="text-primary-600">→</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal 
        open={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </div>
  );
} 