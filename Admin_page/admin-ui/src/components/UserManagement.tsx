import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  FiUsers, FiSearch, FiFilter, FiShield, FiCheck, FiX, FiClock, 
  FiAlertCircle, FiDownload, FiSettings, FiEye, FiRefreshCw, 
  FiGlobe, FiUserCheck, FiEdit2, FiMoreVertical, FiPlus, FiTrash2,
  FiUserPlus, FiKey, FiUserX, FiMail, FiUser, FiLock, FiCheckCircle
} from 'react-icons/fi';
import { getAuthState } from '../utils/auth';
import { getCachedWebsites } from '../utils/api';

// Types for API integration
interface User {
  id: string | number;
  username?: string;
  email: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role?: string;
  is_active?: boolean;
  status?: 'Active' | 'Inactive' | 'Pending' | 'Suspended';
  last_login?: string | Date | null;
  created_at?: string | Date;
  avatar?: string;
}

interface Website {
  id: number;
  name: string;
  domain: string;
  status: string;
}

interface ApiResponse {
  status: string;
  message: string;
  data: {
    users: User[];
    website_info?: {
      id: number;
      name: string;
      domain: string;
      status: string;
    };
  };
}

// Modal types
type ModalType = 'add-user' | 'edit-user' | 'delete-user' | 'reset-password' | 'view-user' | null;

interface UserFormData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  password?: string;
}

// API Functions
const makeAuthenticatedRequest = async (endpoint: string): Promise<ApiResponse> => {
  const { token } = getAuthState();
  
  if (!token) {
    throw new Error('No authentication token available');
  }

  const response = await fetch(`http://localhost:8000/api/v1${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

const fetchFirstUsers = async (): Promise<ApiResponse> => {
  return makeAuthenticatedRequest('/first_users');
};

const fetchUsersByDomain = async (domain: string): Promise<ApiResponse> => {
  return makeAuthenticatedRequest(`/get_my_users?domain=${encodeURIComponent(domain)}`);
};

// API call to add user
const addUserApi = async (domain: string, data: UserFormData) => {
  const { token } = getAuthState();
  const response = await fetch('http://localhost:8000/api/v1/add_user', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      domain,
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      username: data.username,
      role: data.role,
      password: data.password,
      is_active: data.is_active ? 1 : 0,
    }),
  });
  return response.json();
};

// API call to modify user
const modifyUserApi = async (domain: string, userId: string | number, data: UserFormData) => {
  const { token } = getAuthState();
  const payload: any = {
    user_id: userId,
    domain,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    username: data.username,
    role: data.role,
    is_active: data.is_active ? 1 : 0,
  };
  if (data.password) payload.password = data.password;
  const response = await fetch('http://localhost:8000/api/v1/modify_user', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return response.json();
};

// API call to delete user
const deleteUserApi = async (domain: string, userId: string | number) => {
  const { token } = getAuthState();
  const response = await fetch('http://localhost:8000/api/v1/delete_user', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      domain,
    }),
  });
  return response.json();
};

// Helper Functions
const formatUserData = (user: User): User => {
  return {
    ...user,
    name: user.full_name || user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User',
    status: user.is_active ? 'Active' : 'Inactive',
    last_login: user.last_login ? new Date(user.last_login) : null,
    created_at: user.created_at ? new Date(user.created_at) : new Date(),
    avatar: user.username ? user.username.charAt(0).toUpperCase() : 'U'
  };
};

const getPublishedWebsites = (): Website[] => {
  const cached = getCachedWebsites();
  if (!cached) return [];
  
  return cached
    .filter(site => site.status === 'published' && site.domain)
    .map(site => ({
      id: site.Website_id || 0,
      name: site.name || site.organization_name || 'Unnamed Website',
      domain: site.domain,
      status: site.status
    }));
};

// Helper to get published websites from session storage
const getPublishedWebsitesFromSession = (): Website[] => {
  try {
    const raw = sessionStorage.getItem('websites');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return (Array.isArray(arr) ? arr : []).filter(site => site.status === 'published' && site.domain);
  } catch {
    return [];
  }
};

// Role Badge Component
const RoleBadge = ({ role }: { role: string }) => {
  const getRoleStyle = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'editor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'custom':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return <FiShield className="w-3 h-3" />;
      case 'editor':
        return <FiEdit2 className="w-3 h-3" />;
      case 'viewer':
        return <FiEye className="w-3 h-3" />;
      case 'custom':
        return <FiSettings className="w-3 h-3" />;
      default:
        return <FiUsers className="w-3 h-3" />;
    }
  };

  const displayRole = role || 'User';

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getRoleStyle(displayRole)}`}>
      {getRoleIcon(displayRole)}
      {displayRole}
    </span>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <FiCheck className="w-3 h-3" />;
      case 'Inactive':
        return <FiX className="w-3 h-3" />;
      case 'Pending':
        return <FiClock className="w-3 h-3" />;
      case 'Suspended':
        return <FiAlertCircle className="w-3 h-3" />;
      default:
        return <FiUsers className="w-3 h-3" />;
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(status)}`}>
      {getStatusIcon(status)}
      {status}
    </span>
  );
};

// User Avatar Component
const UserAvatar = ({ user }: { user: User }) => (
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
      {user.avatar || user.name?.charAt(0).toUpperCase() || 'U'}
    </div>
    <div>
      <div className="font-semibold text-gray-900">{user.name || 'Unnamed User'}</div>
      <div className="text-sm text-gray-600">{user.email}</div>
    </div>
  </div>
);

// Filter Panel Component
const FilterPanel = ({ 
  showFilters, 
  roleFilter, 
  statusFilter, 
  onRoleChange, 
  onStatusChange,
  onClearFilters,
  filteredCount,
  totalCount 
}: {
  showFilters: boolean;
  roleFilter: string;
  statusFilter: string;
  onRoleChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
  filteredCount: number;
  totalCount: number;
}) => {
  if (!showFilters) return null;

  return (
    <div className="mt-4 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-blue-900">Filter Users</h3>
        <div className="text-xs text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
          Showing {filteredCount} of {totalCount} users
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-blue-800 mb-2">Role</label>
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors"
          >
            <option value="All" className="text-gray-900">All Roles</option>
            <option value="admin" className="text-gray-900">👑 Admin</option>
            <option value="editor" className="text-gray-900">✏️ Editor</option>
            <option value="viewer" className="text-gray-900">👁️ Viewer</option>
            <option value="user" className="text-gray-900">👤 User</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-medium text-blue-800 mb-2">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 border border-blue-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:border-blue-400 transition-colors"
          >
            <option value="All" className="text-gray-900">All Status</option>
            <option value="Active" className="text-gray-900">✅ Active</option>
            <option value="Inactive" className="text-gray-900">⚫ Inactive</option>
            <option value="Pending" className="text-gray-900">⏳ Pending</option>
            <option value="Suspended" className="text-gray-900">🚫 Suspended</option>
          </select>
        </div>
        
        <div className="md:col-span-2 flex items-end">
          <button
            onClick={onClearFilters}
            className="px-6 py-2 text-sm border border-blue-300 text-blue-700 bg-white rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all duration-200 font-medium shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// Export to CSV function
const exportToCSV = (users: User[], filename: string = 'users.csv') => {
  const headers = ['Name', 'Email', 'Role', 'Status', 'Last Login', 'Created'];
  const csvContent = [
    headers.join(','),
    ...users.map(user => [
      `"${user.name || ''}"`,
      `"${user.email || ''}"`,
      `"${user.role || 'User'}"`,
      `"${user.status || 'Unknown'}"`,
      `"${user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}"`,
      `"${user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

// User Actions Dropdown Component
const UserActionsDropdown = ({ 
  user, 
  onEdit, 
  onDelete, 
  onResetPassword, 
  onToggleStatus, 
  onViewDetails 
}: {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onResetPassword: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onViewDetails: (user: User) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [openUpwards, setOpenUpwards] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const DROPDOWN_HEIGHT = 320; // Increased height to accommodate all items
  const DROPDOWN_WIDTH = 220; // Slightly wider for better readability

  useEffect(() => {
    if (isOpen && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Check available space
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = viewportWidth - rect.left;
      
      let top = rect.bottom + window.scrollY + 8;
      let left = rect.right - DROPDOWN_WIDTH + window.scrollX;
      
      // Adjust horizontal position if too close to right edge
      if (spaceRight < DROPDOWN_WIDTH + 20) {
        left = rect.left + window.scrollX - DROPDOWN_WIDTH + rect.width;
      }
      
      // Ensure dropdown doesn't go off-screen horizontally
      if (left < 10) {
        left = 10;
      } else if (left + DROPDOWN_WIDTH > viewportWidth - 10) {
        left = viewportWidth - DROPDOWN_WIDTH - 10;
      }
      
      let maxHeight = DROPDOWN_HEIGHT;
      
      // Determine if dropdown should open upwards
      if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > spaceBelow) {
        setOpenUpwards(true);
        top = rect.top + window.scrollY - Math.min(DROPDOWN_HEIGHT, spaceAbove - 20) - 8;
        maxHeight = Math.min(DROPDOWN_HEIGHT, spaceAbove - 20);
      } else {
        setOpenUpwards(false);
        maxHeight = Math.min(DROPDOWN_HEIGHT, spaceBelow - 20);
      }
      
      const style: React.CSSProperties = {
        position: 'absolute',
        top,
        left,
        width: DROPDOWN_WIDTH,
        maxHeight,
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden',
      };
      
      setDropdownStyle(style);
    }
  }, [isOpen]);

  // Close dropdown on scroll or resize
  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close, true);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close, true);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // Render dropdown in portal
  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        aria-label="User actions"
        type="button"
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>
      {isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-[9998]" 
            onClick={() => setIsOpen(false)}
          />
          {/* Dropdown Menu */}
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className={`bg-white rounded-xl shadow-xl border border-gray-200 py-1 z-[9999] ${openUpwards ? 'animate-slide-up' : 'animate-slide-down'}`}
          >
            {/* View Details */}
            <button
              onClick={() => { onViewDetails(user); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-blue-700 bg-white hover:bg-blue-50 hover:text-blue-800 flex items-center gap-3 transition-colors"
            >
              <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiEye className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">View Details</div>
                <div className="text-xs text-gray-500 truncate">See user information</div>
              </div>
            </button>
            
            {/* Edit User */}
            <button
              onClick={() => { onEdit(user); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-green-700 bg-white hover:bg-green-50 hover:text-green-800 flex items-center gap-3 transition-colors"
            >
              <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiEdit2 className="w-3.5 h-3.5 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">Edit User</div>
                <div className="text-xs text-gray-500 truncate">Modify user details</div>
              </div>
            </button>
            
            {/* Toggle Status */}
            <button
              onClick={() => { onToggleStatus(user); setIsOpen(false); }}
              className={`w-full px-3 py-2 text-left text-sm flex items-center gap-3 transition-colors bg-white ${
                user.status === 'Active' 
                  ? 'text-orange-700 hover:bg-orange-50 hover:text-orange-800' 
                  : 'text-green-700 hover:bg-green-50 hover:text-green-800'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                user.status === 'Active' 
                  ? 'bg-orange-100' 
                  : 'bg-green-100'
              }`}>
                {user.status === 'Active' ? (
                  <FiUserX className="w-3.5 h-3.5 text-orange-600" />
                ) : (
                  <FiUserCheck className="w-3.5 h-3.5 text-green-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">
                  {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {user.status === 'Active' ? 'Disable access' : 'Enable access'}
                </div>
              </div>
            </button>
            
            {/* Reset Password */}
            <button
              onClick={() => { onResetPassword(user); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-purple-700 bg-white hover:bg-purple-50 hover:text-purple-800 flex items-center gap-3 transition-colors"
            >
              <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiKey className="w-3.5 h-3.5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">Reset Password</div>
                <div className="text-xs text-gray-500 truncate">Send password reset</div>
              </div>
            </button>
            
            {/* Divider */}
            <div className="border-t border-gray-100 my-1" />
            
            {/* Delete User */}
            <button
              onClick={() => { onDelete(user); setIsOpen(false); }}
              className="w-full px-3 py-2 text-left text-sm text-red-700 bg-white hover:bg-red-50 hover:text-red-800 flex items-center gap-3 transition-colors"
            >
              <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiTrash2 className="w-3.5 h-3.5 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm">Delete User</div>
                <div className="text-xs text-gray-500 truncate">Remove permanently</div>
              </div>
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

// User Form Modal Component
const UserFormModal = ({ 
  isOpen, 
  mode, 
  user, 
  onClose, 
  onSubmit, 
  roles, 
  rolesLoading, 
  rolesError 
}: {
  isOpen: boolean;
  mode: 'add' | 'edit';
  user?: User;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  roles: string[];
  rolesLoading: boolean;
  rolesError: string | null;
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    email: user?.email || '',
    username: user?.username || '',
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    role: user?.role || 'user',
    is_active: user?.is_active !== false,
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user && mode === 'edit') {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'user',
        is_active: user.is_active !== false,
        password: ''
      });
    } else if (mode === 'add') {
      setFormData({
        email: '',
        username: '',
        first_name: '',
        last_name: '',
        role: 'user',
        is_active: true,
        password: ''
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (mode === 'add' && !formData.password) {
      newErrors.password = 'Password is required for new users';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {mode === 'add' ? 'Add New User' : 'Edit User'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white hover:bg-gray-100 rounded-xl transition-colors border border-gray-200 shadow-sm"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                First Name *
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.first_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter first name"
              />
              {errors.first_name && (
                <p className="mt-1 text-xs text-red-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                  errors.last_name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter last name"
              />
              {errors.last_name && (
                <p className="mt-1 text-xs text-red-600">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                errors.username ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Role
            </label>
            {rolesLoading ? (
              <div className="text-xs text-gray-500">Loading roles...</div>
            ) : rolesError ? (
              <div className="text-xs text-red-500">{rolesError}</div>
            ) : (
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                {roles.map(role => (
                  <option key={role} value={role} className="text-gray-900">{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password {mode === 'add' && '*'} {mode === 'edit' && '(leave blank to keep current)'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder={mode === 'add' ? 'Enter password' : 'Enter new password (optional)'}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-900">
              Active user (can log in and access the system)
            </label>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 hover:text-blue-800 transition-colors font-medium shadow-sm"
            >
              {mode === 'add' ? 'Create User' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  title, 
  message, 
  confirmText, 
  confirmStyle = 'danger',
  onConfirm, 
  onCancel 
}: {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  confirmStyle?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!isOpen) return null;

  const confirmButtonClass = confirmStyle === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-blue-600 hover:bg-blue-700 text-white';

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Details Modal Component
const UserDetailsModal = ({ 
  isOpen, 
  user, 
  onClose 
}: {
  isOpen: boolean;
  user?: User;
  onClose: () => void;
}) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors bg-transparent hover:bg-gray-100"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {user.avatar || user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Username
                </label>
                <p className="text-gray-900">{user.username || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Role
                </label>
                <RoleBadge role={user.role || 'User'} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Status
                </label>
                <StatusBadge status={user.status || 'Unknown'} />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  User ID
                </label>
                <p className="text-gray-900 font-mono text-sm">{user.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Last Login
                </label>
                <p className="text-gray-900">
                  {user.last_login 
                    ? new Date(user.last_login).toLocaleDateString() 
                    : 'Never'
                  }
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Created
                </label>
                <p className="text-gray-900">
                  {user.created_at 
                    ? new Date(user.created_at).toLocaleDateString() 
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main User Management Component
export default function UserManagement() {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWebsiteInfo, setCurrentWebsiteInfo] = useState<any>(null);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();
  const [firstLoad, setFirstLoad] = useState(true);
  const [hasCalledFirstUsers, setHasCalledFirstUsers] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // On mount: load published websites from session, set default domain, call first_users only once
  useEffect(() => {
    const publishedWebsites = getPublishedWebsitesFromSession();
    setWebsites(publishedWebsites);
    if (!selectedDomain && publishedWebsites.length > 0) {
      setSelectedDomain(publishedWebsites[0].domain);
    }
    // Only call first_users on first navigation
    if (firstLoad && !hasCalledFirstUsers) {
      setHasCalledFirstUsers(true);
      fetchFirstUsers().then(response => {
        if (response.status === 'success' && response.data.website_info?.domain) {
          setSelectedDomain(response.data.website_info.domain);
        }
      });
    }
    setFirstLoad(false);
    // eslint-disable-next-line
  }, []);

  // On domain change: always fetch users for the selected domain
  useEffect(() => {
    let cancelled = false;
    const fetchUsers = async () => {
      if (!selectedDomain) {
        setUsers([]);
        setCurrentWebsiteInfo(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetchUsersByDomain(selectedDomain);
        if (!cancelled && response.status === 'success') {
          const formattedUsers = response.data.users.map(formatUserData);
          setUsers(formattedUsers);
          setCurrentWebsiteInfo(response.data.website_info);
        } else if (!cancelled) {
          setUsers([]);
          setCurrentWebsiteInfo(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load user data');
          setUsers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUsers();
    return () => { cancelled = true; };
  }, [selectedDomain]);

  // Refresh handler: call my_website, update session, reload domains, then call get_my_users
  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const { token } = getAuthState();
      const response = await fetch('http://localhost:8000/api/v1/my_website', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('websites', JSON.stringify(data));
        const publishedWebsites = getPublishedWebsitesFromSession();
        setWebsites(publishedWebsites);
        // If current domain is not in new list, select first
        if (!publishedWebsites.find(w => w.domain === selectedDomain)) {
          setSelectedDomain(publishedWebsites[0]?.domain || '');
        }
        // Always call get_my_users for the selected domain
        if (selectedDomain) {
          await fetchUsersByDomain(selectedDomain);
        }
      } else {
        setError('Failed to refresh websites');
      }
    } catch {
      setError('Failed to refresh websites');
    } finally {
      setLoading(false);
    }
  };

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
    setSelectedUsers(new Set());
  };

  // User action handlers
  const handleAddUser = () => {
    setSelectedUser(undefined);
    setModalType('add-user');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalType('edit-user');
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setModalType('delete-user');
  };

  const handleResetPassword = (user: User) => {
    setSelectedUser(user);
    setModalType('reset-password');
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setModalType('view-user');
  };

  const handleToggleStatus = (user: User) => {
    // TODO: Implement status toggle API call
    // For now, just update the local state
    setUsers(prev => prev.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active', is_active: u.status !== 'Active' }
        : u
    ));
  };

  const handleUserFormSubmit = async (data: UserFormData) => {
    if (!selectedDomain) return;
    setLoading(true);
    try {
      if (modalType === 'add-user') {
        await addUserApi(selectedDomain, data);
      } else if (modalType === 'edit-user' && selectedUser) {
        await modifyUserApi(selectedDomain, selectedUser.id, data);
      }
      // Refresh users after add/edit
      const response = await fetchUsersByDomain(selectedDomain);
      if (response.status === 'success') {
        const formattedUsers = response.data.users.map(formatUserData);
        setUsers(formattedUsers);
        setCurrentWebsiteInfo(response.data.website_info);
      }
    } catch (err) {
      setError('Failed to save user');
    } finally {
      setLoading(false);
      setModalType(null);
      setSelectedUser(undefined);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser || !selectedDomain) return;
    setLoading(true);
    try {
      await deleteUserApi(selectedDomain, selectedUser.id);
      // Refresh users after delete
      const response = await fetchUsersByDomain(selectedDomain);
      if (response.status === 'success') {
        const formattedUsers = response.data.users.map(formatUserData);
        setUsers(formattedUsers);
        setCurrentWebsiteInfo(response.data.website_info);
      }
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setLoading(false);
      setModalType(null);
      setSelectedUser(undefined);
    }
  };

  const handleResetPasswordConfirm = () => {
    if (selectedUser) {
      // TODO: Implement reset password API call
      setModalType(null);
      setSelectedUser(undefined);
    }
  };

  // Filter users based on filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || (user.role || 'user').toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleExport = () => {
    const selectedWebsite = websites.find(w => w.domain === selectedDomain);
    const websiteName = selectedWebsite?.name || selectedDomain || 'website';
    const filename = `${websiteName.toLowerCase().replace(/\s+/g, '_')}_users_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCSV(filteredUsers, filename);
  };

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers);
    if (newSelection.has(userId)) {
      newSelection.delete(userId);
    } else {
      newSelection.add(userId);
    }
    setSelectedUsers(newSelection);
  };

  const selectAllUsers = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => String(u.id))));
    }
  };

  const fetchRoles = async () => {
    setRolesLoading(true);
    setRolesError(null);
    try {
      const { token } = getAuthState();
      const response = await fetch('http://localhost:8000/api/v1/get_roles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      if (data.status === 'success') {
        setRoles(data.data);
      } else {
        setRoles([]);
        setRolesError('Failed to fetch roles');
      }
    } catch (err) {
      setRoles([]);
      setRolesError('Failed to fetch roles');
    } finally {
      setRolesLoading(false);
    }
  };

  // Fetch roles when opening Add/Edit User modal
  useEffect(() => {
    if (modalType === 'add-user' || modalType === 'edit-user') {
      fetchRoles();
    }
    // eslint-disable-next-line
  }, [modalType]);

  // On first navigation, perform refresh functionality
  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" style={{ position: 'relative', zIndex: 1 }}>
      {/* Enhanced Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-2xl md:rounded-3xl mx-4 md:mx-8 mt-4 md:mt-8 mb-6 md:mb-8 shadow-2xl">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative px-6 md:px-8 py-8 md:py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white mb-8 lg:mb-0 max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                User Management
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 mb-6 leading-relaxed">
                Manage users and their permissions across your websites. Control access, assign roles, and monitor user activity with our comprehensive management tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddUser}
                  disabled={!selectedDomain}
                  className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-200 transform hover:scale-105 hover:shadow-2xl ${
                    selectedDomain 
                      ? 'bg-white text-blue-700 hover:bg-yellow-50' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <FiUserPlus className="w-6 h-6 group-hover:rotate-12 transition-transform duration-200" />
                  Add New User
                </button>
                <button 
                  onClick={handleRefresh}
                  className="flex items-center justify-center gap-3 bg-blue-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-blue-400/30 transition-all duration-200"
                >
                  <FiRefreshCw className="w-6 h-6" />
                  Refresh Data
                </button>
              </div>
            </div>
            
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6 w-full lg:w-auto">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className="w-6 h-6 text-white" />
                  <div className="text-3xl font-bold text-white">{filteredUsers.length}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">Total Users</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiUserCheck className="w-6 h-6 text-white" />
                  <div className="text-3xl font-bold text-white">{filteredUsers.filter(u => u.status === 'Active').length}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">Active Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Controls Section */}
      <div className="px-4 md:px-8 mb-6 md:mb-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Website Selector */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FiGlobe className="w-5 h-5 text-blue-600" />
                <label className="text-sm font-medium text-gray-700">Website:</label>
              </div>
              <select
                value={selectedDomain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium min-w-[200px] bg-white shadow-sm text-gray-900"
              >
                <option value="" className="text-gray-900">Select a website...</option>
                {websites.map(website => (
                  <option key={website.domain} value={website.domain} className="text-gray-900">
                    {website.name} ({website.domain})
                  </option>
                ))}
              </select>
              {currentWebsiteInfo && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <FiCheckCircle className="w-3 h-3" />
                    {currentWebsiteInfo.status}
                  </span>
                </div>
              )}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors shadow-sm font-medium"
              >
                <FiFilter className="w-4 h-4" />
                Filters
              </button>

              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                disabled={filteredUsers.length === 0}
              >
                <FiDownload className="w-4 h-4" />
                Export ({filteredUsers.length})
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          <FilterPanel
            showFilters={showFilters}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onRoleChange={(value) => setRoleFilter(value)}
            onStatusChange={(value) => setStatusFilter(value)}
            onClearFilters={() => {
              setRoleFilter('All');
              setStatusFilter('All');
            }}
            filteredCount={filteredUsers.length}
            totalCount={users.length}
          />
        </div>

        {/* Users Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6 mb-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{filteredUsers.length}</div>
                <div className="text-sm text-gray-600 font-medium">Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredUsers.filter(u => u.status === 'Active').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Active</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredUsers.filter(u => u.status === 'Pending').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Pending</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filteredUsers.filter(u => (u.role || '').toLowerCase() === 'admin').length}
                </div>
                <div className="text-sm text-gray-600 font-medium">Admins</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedUsers.size > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-6 shadow-lg backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <FiUserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue-900">
                      {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
                    </div>
                    <div className="text-xs text-blue-700">Manage selected users below</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedUsers(new Set())}
                  className="text-blue-700 hover:text-blue-900 font-medium underline hover:no-underline transition-colors bg-transparent"
                >
                  Clear selection
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const selectedUsersList = users.filter(u => selectedUsers.has(String(u.id)));
                    exportToCSV(selectedUsersList, `selected_users_${new Date().toISOString().split('T')[0]}.csv`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-300 text-blue-700 rounded-xl hover:bg-gray-50 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  <FiDownload className="w-4 h-4" />
                  Export Selected
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 p-12">
            <div className="text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin mx-auto"></div>
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiRefreshCw className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Loading Users</h3>
              <p className="text-gray-600 leading-relaxed">Please wait while we fetch the user data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-red-200 p-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FiAlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Error Loading Users</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-3 rounded-xl transition-all duration-200 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiRefreshCw className="w-5 h-5" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Table wrapper with controlled overflow */}
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                        onChange={selectAllUsers}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Last Login</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Created</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group"
                      style={{ position: 'relative' }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.has(String(user.id))}
                          onChange={() => toggleUserSelection(String(user.id))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <UserAvatar user={user} />
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role || 'User'} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status || 'Unknown'} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.last_login 
                          ? new Date(user.last_login).toLocaleDateString() 
                          : 'Never'
                        }
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString() 
                          : 'Unknown'
                        }
                      </td>
                      <td className="px-6 py-4 relative">
                        <UserActionsDropdown
                          user={user}
                          onEdit={handleEditUser}
                          onDelete={handleDeleteUser}
                          onResetPassword={handleResetPassword}
                          onToggleStatus={handleToggleStatus}
                          onViewDetails={handleViewDetails}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-16 px-8">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto shadow-xl">
                    <FiUsers className="w-12 h-12 text-gray-400" />
                  </div>
                  {/* Floating elements */}
                  <div className="absolute top-0 right-1/4 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  <div className="absolute bottom-2 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No users found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed max-w-md mx-auto">
                  {searchTerm || roleFilter !== 'All' || statusFilter !== 'All'
                    ? 'Try adjusting your search criteria or filters to find users'
                    : selectedDomain 
                      ? 'No users are registered for this website domain yet'
                      : 'Select a website from the dropdown above to view its users'
                  }
                </p>
                {selectedDomain && (
                  <button
                    onClick={handleAddUser}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <FiUserPlus className="w-5 h-5" />
                    Add First User
                  </button>
                )}
                {!selectedDomain && websites.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-700">
                      Choose from <strong>{websites.length}</strong> published website{websites.length !== 1 ? 's' : ''} in the dropdown above.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <UserFormModal
        isOpen={modalType === 'add-user' || modalType === 'edit-user'}
        mode={modalType === 'add-user' ? 'add' : 'edit'}
        user={selectedUser}
        onClose={() => { setModalType(null); setSelectedUser(undefined); }}
        onSubmit={handleUserFormSubmit}
        roles={roles}
        rolesLoading={rolesLoading}
        rolesError={rolesError}
      />

      <UserDetailsModal
        isOpen={modalType === 'view-user'}
        user={selectedUser}
        onClose={() => { setModalType(null); setSelectedUser(undefined); }}
      />

      <ConfirmationModal
        isOpen={modalType === 'delete-user'}
        title="Delete User"
        message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
        confirmText="Delete User"
        confirmStyle="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => { setModalType(null); setSelectedUser(undefined); }}
      />

      <ConfirmationModal
        isOpen={modalType === 'reset-password'}
        title="Reset Password"
        message={`Are you sure you want to reset the password for ${selectedUser?.name}? They will need to set a new password.`}
        confirmText="Reset Password"
        confirmStyle="primary"
        onConfirm={handleResetPasswordConfirm}
        onCancel={() => { setModalType(null); setSelectedUser(undefined); }}
      />
    </div>
  );
} 