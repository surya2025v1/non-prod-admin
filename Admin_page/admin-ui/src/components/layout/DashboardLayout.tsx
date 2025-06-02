import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuthState, clearAuthData, getCurrentUser } from '../../utils/auth';
import { FiHome, FiUsers, FiCreditCard, FiSettings, FiLogOut, FiMenu, FiChevronLeft, FiGlobe, FiTrendingUp, FiUser } from 'react-icons/fi';
import SettingsModal from '../SettingsModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', icon: <FiHome size={22} />, to: '/dashboard', badge: null },
  { name: 'Users', icon: <FiUsers size={22} />, to: '/dashboard/users', badge: '3' },
  { name: 'Payments', icon: <FiCreditCard size={22} />, to: '/payments', badge: null },
  { name: 'Analytics', icon: <FiTrendingUp size={22} />, to: '/analytics', badge: 'New' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [expanded, setExpanded] = useState(true);
  const { username } = getAuthState();
  const navigate = useNavigate();
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{ firstName?: string; lastName?: string; username?: string }>({});

  useEffect(() => {
    // Fetch user info from /me on mount
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();
        setUserInfo(data as { firstName?: string; lastName?: string; username?: string });
      } catch (e) {
        // ignore error, fallback to username
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !(userMenuRef.current as any).contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [userMenuOpen]);

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  const handleSettings = () => {
    setUserMenuOpen(false);
    setShowSettingsModal(true);
  };

  // Prefer full name if available, fallback to username
  const displayName = userInfo.firstName || userInfo.lastName
    ? `${userInfo.firstName || ''}${userInfo.lastName ? ' ' + userInfo.lastName : ''}`.trim()
    : username || userInfo.username || 'User';
  const avatarLetter = (userInfo.firstName && userInfo.firstName[0]) || (username && username[0]) || 'U';

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Sidebar */}
      <aside
        className={`h-screen sticky top-0 left-0 z-20 flex flex-col transition-all duration-300 shadow-2xl backdrop-blur-xl border-r border-white/20
          ${expanded ? 'w-64' : 'w-20'}
          bg-gradient-to-b from-primary-600 via-primary-700 to-primary-800
        `}
      >
        {/* Sidebar Header */}
        <div className={`flex ${expanded ? 'items-center justify-between px-6 py-6' : 'flex-col items-center justify-center py-6'} border-b border-white/20`}>
          {expanded && (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-xl font-bold text-primary-600">W</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-wide">WebsiteBuilder</span>
                <div className="text-xs text-blue-200 font-medium">Pro Dashboard</div>
              </div>
            </div>
          )}
          <button
            className={`p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 shadow-lg ${expanded ? '' : 'mb-0 mt-0'}`}
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {expanded ? <FiChevronLeft size={20} className="text-white" /> : <FiMenu size={20} className="text-white" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 flex flex-col gap-2 px-4 py-6">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105
                ${expanded ? 'justify-start' : 'justify-center'}
                ${location.pathname === item.to 
                  ? 'bg-white/20 backdrop-blur-sm text-white shadow-lg border border-white/30' 
                  : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }
              `}
            >
              <span className={`flex items-center justify-center transition-all duration-200 ${expanded ? '' : 'mx-auto'}`}>
                {item.icon}
              </span>
              
              <span className={`transition-all duration-200 whitespace-nowrap ${expanded ? 'opacity-100' : 'opacity-0 w-0 pointer-events-none'}`}>
                {item.name}
              </span>
              
              {item.badge && expanded && (
                <span className={`ml-auto px-2 py-1 text-xs font-bold rounded-full transition-colors ${
                  item.badge === 'New' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-primary-500 text-white'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Active indicator */}
              {location.pathname === item.to && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`relative border-t border-white/20 p-4 ${expanded ? '' : 'flex justify-center'}`} ref={userMenuRef}>
          <button
            className={`group w-full flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200 ${expanded ? '' : 'justify-center w-12 h-12'}`}
            onClick={() => setUserMenuOpen((open) => !open)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-300 to-primary-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {avatarLetter.toUpperCase()}
            </div>
            {expanded && (
              <div className="text-left flex-1">
                <div className="text-white font-semibold text-sm">{displayName}</div>
                <div className="text-blue-200 text-xs">Premium Member</div>
              </div>
            )}
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <div className={`absolute ${expanded ? 'left-4 right-4 bottom-20' : 'left-16 bottom-4'} bg-white rounded-2xl shadow-2xl py-2 z-50 border border-gray-200 animate-fadeIn`}>
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                    {avatarLetter.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{displayName}</div>
                    <div className="text-sm text-gray-500">{userInfo.username || username}</div>
                  </div>
                </div>
              </div>
              
              <div className="py-2 bg-white">
                <button 
                  className="w-full text-left px-4 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 flex items-center gap-3 font-medium transition-colors"
                  onClick={() => navigate('/profile')}
                >
                  <FiUser className="text-primary-600" size={20} />
                  View Profile
                </button>
                <button 
                  className="w-full text-left px-4 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 flex items-center gap-3 font-medium transition-colors"
                  onClick={handleSettings}
                >
                  <FiSettings className="text-primary-600" size={20} />
                  Settings
                </button>
                <button 
                  className="w-full text-left px-4 py-3 rounded-xl bg-white text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium transition-colors"
                  onClick={handleLogout}
                >
                  <FiLogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Pass userInfo to children via context or props if needed */}
        {children}
      </main>
      <SettingsModal open={showSettingsModal} onClose={() => setShowSettingsModal(false)} />
    </div>
  );
} 