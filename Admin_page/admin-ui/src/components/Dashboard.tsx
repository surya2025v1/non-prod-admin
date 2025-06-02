import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FiPlus, FiEdit2, FiExternalLink, FiTrash2, FiCheckCircle, FiAlertCircle, 
  FiTrendingUp, FiUsers, FiGlobe, FiDollarSign, FiStar, FiClock, 
  FiZap, FiAward, FiTarget, FiAlertTriangle, FiRefreshCw, FiArrowUp, FiEye, FiCalendar, FiDownload
} from 'react-icons/fi';
import CreateWebsiteModal from './website/CreateWebsiteModal';
import UpgradeModal from './website/UpgradeModal';
import WebsiteDetailsModal from './website/WebsiteDetailsModal';
import DeleteWebsiteModal from './website/DeleteWebsiteModal';
import SetupProgress from './SetupProgress';
import QuickActions from './QuickActions';
import { getAuthState, clearAuthData, logout } from '../utils/auth';
import { fetchMyWebsites, cacheWebsites, getCachedWebsites, clearWebsitesCache, refreshWebsiteData, deleteWebsite, type Website } from '../utils/api';

// Get username from auth state with proper initialization
const useAuthUser = () => {
  const [username, setUsername] = useState<string>('');
  
  useEffect(() => {
    const { username: authUsername } = getAuthState();
    setUsername(authUsername || '');
  }, []);
  
  return username;
};

// Enhanced analytics data with trend indicators
const mockAnalytics = {
  visitors: { value: 2547, trend: 12.5, isUp: true },
  pageViews: { value: 8429, trend: 8.3, isUp: true },
  conversionRate: { value: 3.2, trend: -2.1, isUp: false },
  revenue: { value: 1250, trend: 18.7, isUp: true }
};

// Extend Website type to include tempIndex
interface WebsiteWithTempIndex extends Website {
  tempIndex?: number;
}

// Convert API website data to component format with enhanced analytics
function convertApiWebsiteToComponent(apiWebsite: Website, index: number) {
  const tempIndex = (apiWebsite as any).tempIndex || index;
  return {
    id: (apiWebsite as any).Website_id || tempIndex,
    name: (apiWebsite as any).organization_name || 'Unnamed Website',
    domain: (apiWebsite as any).domain || '',
    status: (apiWebsite as any).status || 'draft',
    plan: 'Premium',
    lastUpdated: new Date().toISOString(),
    analytics: {
      visitors: Math.floor(Math.random() * 1000) + 100,
      pageViews: Math.floor(Math.random() * 5000) + 500,
      revenue: Math.floor(Math.random() * 10000) + 1000,
      conversionRate: +(Math.random() * 5 + 1).toFixed(1)
    },
    paid_till: (apiWebsite as any).paid_till,
    paidTill: (apiWebsite as any).paid_till,
    paymentStatus: getPaymentStatus((apiWebsite as any).paid_till),
    tempIndex
  };
}

// Enhanced payment status logic
const getPaymentStatus = (paidTill: string | null) => {
  if (!paidTill) {
    return {
      text: 'Pending',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: FiAlertCircle
    };
  }

  try {
    const paidDate = new Date(paidTill);
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const paidMonth = paidDate.getMonth();
    const paidYear = paidDate.getFullYear();
    
    if (paidYear < currentYear || (paidYear === currentYear && paidMonth < currentMonth)) {
      return {
        text: 'Payment Expired',
        color: 'bg-red-100 text-red-700 border-red-200',
        icon: FiAlertCircle
      };
    } else if (paidYear === currentYear && paidMonth === currentMonth) {
      return {
        text: 'Due this month',
        color: 'bg-orange-100 text-orange-700 border-orange-200',
        icon: FiClock
      };
    } else {
      return {
        text: `Paid: ${paidDate.toLocaleDateString()}`,
        color: 'bg-green-100 text-green-700 border-green-200',
        icon: FiCheckCircle
      };
    }
  } catch (error) {
    return {
      text: 'Pending',
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: FiAlertCircle
    };
  }
};

// Enhanced Analytics Card Component
const AnalyticsCard = ({ title, value, trend, icon: Icon, color, isUp, prefix = '' }: any) => (
  <div className={`group bg-white rounded-xl shadow-soft border border-gray-100 p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden`}>
    {/* Background gradient */}
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
    
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
            isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <FiArrowUp className={`w-3 h-3 ${!isUp ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl lg:text-3xl font-bold text-gray-900">
          {prefix}{typeof value === 'object' ? value.value.toLocaleString() : value.toLocaleString()}
        </p>
        {trend !== undefined && (
          <p className={`text-xs mt-1 ${isUp ? 'text-green-600' : 'text-red-600'}`}>
            {isUp ? '↗' : '↘'} {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
    </div>
  </div>
);

// Enhanced Website Card Component with improved payment status
const WebsiteCard = ({ site, onEdit, onView, onDelete }: any) => {
  console.log('WebsiteCard site data:', {
    name: site.name,
    paid_till: site.paid_till,
    paidTill: site.paidTill
  });
  
  // Try both field names to ensure compatibility
  const paidTillValue = site.paid_till || site.paidTill;
  const paymentStatus = getPaymentStatus(paidTillValue);
  const StatusIcon = paymentStatus.icon;

  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-4 shadow-soft hover:shadow-lg transition-all duration-300 hover:scale-[1.01] relative overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center justify-between gap-4">
        {/* Logo and Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {site.name[0].toUpperCase()}
            </div>
            {site.status === 'published' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow"></div>
            )}
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-900 truncate max-w-[150px] md:max-w-[200px]">{site.name}</h3>
              {site.status === 'published' && <FiStar className="w-4 h-4 text-yellow-500" />}
            </div>
            
            <p className="text-sm text-gray-600 truncate max-w-[150px] md:max-w-[200px] mb-2">
              {site.organization_name || 'No organization name'}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                site.status === 'published' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
              }`}>
                {site.status === 'published' ? (
                  <>
                    <FiCheckCircle className="w-3 h-3" />
                    Published
                  </>
                ) : (
                  <>
                    <FiClock className="w-3 h-3" />
                    Draft
                  </>
                )}
              </span>
              
              {/* Enhanced Payment Status */}
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${paymentStatus.color}`}>
                <StatusIcon className="w-3 h-3" />
                {paymentStatus.text}
              </span>
            </div>
          </div>
        </div>

        {/* Analytics Preview */}
        <div className="hidden lg:flex flex-col items-end gap-1">
          <div className="text-sm font-semibold text-gray-900">{site.analytics.visitors}</div>
          <div className="text-xs text-gray-500">visitors</div>
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button 
            onClick={() => site.status !== 'published' && onEdit(site)}
            disabled={site.status === 'published'}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              site.status === 'published'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-50 hover:bg-blue-100 text-blue-600 hover:scale-110'
            }`}
            title={site.status === 'published' ? 'Cannot edit published website' : 'Edit Website'}
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onView(site)}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors duration-200 hover:scale-110"
            title="View Website"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onDelete(site)}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors duration-200 hover:scale-110"
            title="Delete Website"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Enhanced Loading Component with skeleton loading
const LoadingSpinner = () => (
  <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center max-w-sm w-full border border-gray-200">
      <div className="relative mb-8">
        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin mx-auto"></div>
        <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-1/2 transform -translate-x-1/2"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <FiGlobe className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-3">Loading Dashboard</h2>
      <p className="text-gray-600 leading-relaxed">Preparing your website management experience...</p>
      
      {/* Skeleton elements */}
      <div className="mt-6 space-y-3">
        <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
        <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Enhanced Empty State Component
const EmptyWebsiteState = ({ onCreateWebsite }: { onCreateWebsite: () => void }) => (
  <div className="text-center py-16">
    {/* Illustration */}
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto shadow-xl">
        <FiGlobe className="w-16 h-16 text-blue-600" />
      </div>
      {/* Floating elements */}
      <div className="absolute top-0 right-1/4 w-6 h-6 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-4 left-1/4 w-4 h-4 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-8 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
    </div>
    
    <div className="max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to launch your digital presence?</h3>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Transform your ideas into stunning, professional websites. Our intuitive builder helps you create 
        beautiful sites that engage visitors and grow your business.
      </p>
      
      <div className="space-y-4">
        <button
          onClick={onCreateWebsite}
          className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-xl mx-auto"
        >
          <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          Create Your First Website
          <FiZap className="w-5 h-5 ml-2 animate-pulse" />
        </button>
        
        <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            No coding required
          </div>
          <div className="flex items-center gap-2">
            <FiCheckCircle className="w-4 h-4 text-green-500" />
            Professional templates
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [editWebsite, setEditWebsite] = useState<null | any>(null);
  const [viewWebsite, setViewWebsite] = useState<null | any>(null);
  const [deleteWebsiteData, setDeleteWebsiteData] = useState<null | any>(null);
  const [websiteList, setWebsiteList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiWebsites, setApiWebsites] = useState<Website[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = useRef<string>('');

  const username = useAuthUser();

  // Calculate enhanced totals from analytics
  const totalVisitors = websiteList.reduce((sum, site) => sum + site.analytics.visitors, 0);
  const totalPageViews = websiteList.reduce((sum, site) => sum + site.analytics.pageViews, 0);
  const totalRevenue = websiteList.reduce((sum, site) => sum + site.analytics.revenue, 0);
  const avgConversionRate = websiteList.length > 0 
    ? websiteList.reduce((sum, site) => sum + site.analytics.conversionRate, 0) / websiteList.length 
    : 0;

  // Enhanced refresh function with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      clearWebsitesCache();
      const websites = await fetchMyWebsites(true);
      setApiWebsites(websites);
      const convertedWebsites = websites.map(convertApiWebsiteToComponent);
      setWebsiteList(convertedWebsites);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle browser refresh - detect when page is refreshed
  useEffect(() => {
    const handleBeforeUnload = () => clearWebsitesCache();
    const handleVisibilityChange = () => {
      if (!document.hidden) silentRefreshWebsites();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Silent refresh function (no loading indicator)
  const silentRefreshWebsites = async () => {
    try {
      const websites = await refreshWebsiteData();
      setApiWebsites(websites);
      const convertedWebsites = websites.map(convertApiWebsiteToComponent);
      setWebsiteList(convertedWebsites);
      setError(null);
    } catch (err) {
      // Silent failure - keep existing data
    }
  };

  // Fetch websites data
  const loadWebsites = async (useCache = true, silent = false) => {
    if (!silent) {
      setLoading(true);
      setError(null);
    }
    
    try {
      let websites: Website[];
      
      if (useCache && !silent) {
        const cachedWebsites = getCachedWebsites();
        if (cachedWebsites && cachedWebsites.length > 0) {
          setApiWebsites(cachedWebsites);
          const convertedWebsites = cachedWebsites.map(convertApiWebsiteToComponent);
          setWebsiteList(convertedWebsites);
          setLoading(false);
          return;
        }
      }

      websites = await fetchMyWebsites(true);
      setApiWebsites(websites);
      const convertedWebsites = websites.map(convertApiWebsiteToComponent);
      setWebsiteList(convertedWebsites);
      
      if (!silent) setError(null);
      
    } catch (err) {
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Failed to load websites');
        setWebsiteList([]);
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Load websites on component mount
  useEffect(() => {
    loadWebsites();
  }, []);

  // Navigation detection: refresh data when returning to Dashboard
  useEffect(() => {
    const currentPath = location.pathname;
    const prevPath = previousLocation.current;
    
    if (currentPath === '/dashboard' && prevPath && prevPath !== '/dashboard') {
      silentRefreshWebsites();
    }
    
    previousLocation.current = currentPath;
  }, [location.pathname]);

  // Sort websiteList by tempIndex for display
  useEffect(() => {
    if (apiWebsites && apiWebsites.length > 0) {
      const cachedWebsites = getCachedWebsites() || [];
      const sorted = [...cachedWebsites].sort((a, b) => ((a as any).tempIndex || 0) - ((b as any).tempIndex || 0));
      const convertedWebsites = sorted.map(convertApiWebsiteToComponent);
      setWebsiteList(convertedWebsites);
    }
  }, [apiWebsites]);

  const handleCreateWebsite = () => {
    setModalStep(0);
    setEditWebsite(null);
    setShowCreateModal(true);
  };

  const handleStepChange = async (step: number) => {
    await silentRefreshWebsites();
  };

  const handleCreateWebsiteComplete = async () => {
    setShowCreateModal(false);
    await silentRefreshWebsites();
  };

  // Edit handler: use tempIndex to find the correct website
  const handleEditWebsite = (website: any) => {
    const cachedWebsites = getCachedWebsites() || [];
    let tempIndex = (website as any)?.tempIndex;
    
    if (!tempIndex && (website as any)?.domain) {
      const found = cachedWebsites.find((w: any) => w.domain === (website as any).domain);
      tempIndex = (found as any)?.tempIndex;
    }
    
    const selectedWebsite = cachedWebsites.find((w: any) => (w as any).tempIndex === tempIndex);
    if (selectedWebsite) {
      const editData = {
        id: (selectedWebsite as any).Website_id,
        organizationName: (selectedWebsite as any).organization_name,
        organizationType: (selectedWebsite as any).organization_type,
        tagline: (selectedWebsite as any).tagline,
        contactEmail: (selectedWebsite as any).contact_email,
        contactPhone: (selectedWebsite as any).contact_phone,
        address: (selectedWebsite as any).address,
        primaryColor: (selectedWebsite as any).primary_color,
        secondaryColor: (selectedWebsite as any).secondary_color,
        font: (selectedWebsite as any).font,
        introText: (selectedWebsite as any).intro_text,
        about: (selectedWebsite as any).about,
        mission: (selectedWebsite as any).mission,
        history: (selectedWebsite as any).history,
        team: (selectedWebsite as any).team_members || [{ name: '', role: '', photo: null }],
        services: (selectedWebsite as any).services_offerings || [{ name: '', description: '', image: null, price: '' }],
        social: (selectedWebsite as any).social_media_links || { facebook: '', instagram: '', twitter: '', youtube: '', website: '' },
        domain: (selectedWebsite as any).domain,
        video: (selectedWebsite as any).video_youtube_link,
        logo: null,
        favicon: null,
        heroImage: null,
        bannerImages: [],
        gallery: [],
        tempIndex: (selectedWebsite as any).tempIndex,
      };
      setEditWebsite(editData);
    }
    setModalStep(0);
    setShowCreateModal(true);
  };

  const handleEditWebsiteComplete = async () => {
    setEditWebsite(null);
    setShowCreateModal(false);
    await silentRefreshWebsites();
  };

  const handleViewWebsite = (website: any) => {
    const apiWebsite = apiWebsites.find(api => api.domain === website.domain);
    if (apiWebsite) {
      const viewData = {
        ...website,
        organizationName: apiWebsite.organization_name,
        organizationType: apiWebsite.organization_type,
        tagline: apiWebsite.tagline,
        contactEmail: apiWebsite.contact_email,
        contactPhone: apiWebsite.contact_phone,
        address: apiWebsite.address,
        about: apiWebsite.about,
        mission: apiWebsite.mission,
        history: apiWebsite.history,
        team: apiWebsite.team_members || [],
        services: apiWebsite.services_offerings || []
      };
      setViewWebsite(viewData);
    } else {
      setViewWebsite(website);
    }
  };

  const handleDeleteWebsite = (website: any) => {
    setDeleteWebsiteData(website);
  };

  const confirmDeleteWebsite = async (website: any) => {
    try {
      const cachedWebsites = getCachedWebsites() || [];
      const selectedWebsite = cachedWebsites.find((w: any) => {
        return (w as any).tempIndex === (website as any).tempIndex;
      });
      
      if (!selectedWebsite) {
        alert('Website not found in cache');
        setDeleteWebsiteData(null);
        return;
      }

      const websiteId = (selectedWebsite as any).Website_id || (selectedWebsite as any).id;
      
      if (!websiteId) {
        alert('Website ID not found. Please refresh and try again.');
        setDeleteWebsiteData(null);
        return;
      }

      const response = await deleteWebsite(websiteId);
      
      if (response.success) {
        // Remove from local state immediately
        setWebsiteList(prev => prev.filter(w => (w as any).tempIndex !== (website as any).tempIndex));
        // Refresh data from server
        await silentRefreshWebsites();
      } else {
        alert('Failed to delete website');
      }
    } catch (error) {
      console.error('Failed to delete website:', error);
      alert(`Failed to delete website: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setDeleteWebsiteData(null);
    }
  };

  // Enhanced Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  // Enhanced Error state
  if (error) {
    const isUnauthorized = error && (error.toLowerCase().includes('401') || error.toLowerCase().includes('unauthorized') || error.toLowerCase().includes('authentication'));
    const handleRetry = () => {
      if (isUnauthorized) {
        logout(); // This will clear auth data and redirect to login
      } else {
        handleRefresh();
      }
    };
    
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center max-w-lg w-full border border-red-100">
          {/* Enhanced error illustration */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <FiAlertTriangle className="w-10 h-10 text-red-600" />
            </div>
            {/* Floating warning indicators */}
            <div className="absolute top-0 right-1/4 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-2 left-1/4 w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {isUnauthorized ? 'Session Expired' : 'Something went wrong'}
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            {isUnauthorized 
              ? 'Your session has expired. Please log in again to continue managing your websites.'
              : `We encountered an issue while loading your dashboard. ${error}`
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <FiRefreshCw className="w-4 h-4" />
              {isUnauthorized ? 'Go to Login' : 'Try Again'}
            </button>
            {!isUnauthorized && (
              <button
                onClick={handleCreateWebsite}
                className="flex items-center justify-center gap-2 bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <FiPlus className="w-4 h-4" />
                Create Website
              </button>
            )}
          </div>
          
          {/* Help text */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Enhanced Hero Section */}
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
                Welcome back, <span className="text-yellow-300 bg-yellow-300/10 px-2 py-1 rounded-lg">{username || 'Builder'}!</span>
              </h1>
              <p className="text-lg lg:text-xl text-blue-100 mb-6 leading-relaxed">
                Transform your ideas into stunning websites. Create, manage, and grow your digital presence with our professional tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="group flex items-center justify-center gap-3 bg-white text-blue-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-yellow-50 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
                >
                  <FiPlus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200" />
                  Create New Website
                </button>
                <button className="flex items-center justify-center gap-3 bg-blue-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-blue-400/30 transition-all duration-200">
                  <FiTrendingUp className="w-6 h-6" />
                  Analytics Dashboard
                </button>
              </div>
            </div>
            
            {/* Enhanced Quick Stats */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6 w-full lg:w-auto">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiGlobe className="w-6 h-6 text-white" />
                  <div className="text-3xl font-bold text-white">{websiteList.length}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">Active Websites</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <FiUsers className="w-6 h-6 text-white" />
                  <div className="text-3xl font-bold text-white">{totalVisitors.toLocaleString()}</div>
                </div>
                <div className="text-blue-100 text-sm font-medium">Total Visitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Analytics Overview */}
      <div className="px-4 md:px-8 mb-6 md:mb-8">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Performance Overview</h2>
              <p className="text-lg text-gray-600">Track your websites' performance and growth metrics</p>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-xl">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-blue-700">Live Data</span>
            </div>
          </div>
          
          {/* Quick insights */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span>Overall growth trending upward</span>
            </div>
            <div className="flex items-center gap-1">
              <FiTarget className="w-4 h-4 text-blue-500" />
              <span>{websiteList.filter(w => w.status === 'published').length} active websites</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          <AnalyticsCard
            title="Total Visitors"
            value={mockAnalytics.visitors}
            trend={mockAnalytics.visitors.trend}
            isUp={mockAnalytics.visitors.isUp}
            icon={FiUsers}
            color="from-blue-500 to-blue-600"
          />
          <AnalyticsCard
            title="Page Views"
            value={mockAnalytics.pageViews}
            trend={mockAnalytics.pageViews.trend}
            isUp={mockAnalytics.pageViews.isUp}
            icon={FiGlobe}
            color="from-green-500 to-green-600"
          />
          <AnalyticsCard
            title="Revenue"
            value={mockAnalytics.revenue}
            trend={mockAnalytics.revenue.trend}
            isUp={mockAnalytics.revenue.isUp}
            icon={FiDollarSign}
            color="from-emerald-500 to-emerald-600"
            prefix="$"
          />
          <AnalyticsCard
            title="Conversion Rate"
            value={mockAnalytics.conversionRate}
            trend={mockAnalytics.conversionRate.trend}
            isUp={mockAnalytics.conversionRate.isUp}
            icon={FiTrendingUp}
            color="from-purple-500 to-purple-600"
          />
        </div>
      </div>

      {/* Enhanced Main Content Grid */}
      <div className="px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced Websites List */}
          <div className="xl:col-span-2">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Websites</h2>
                  <p className="text-lg text-gray-600">Manage and monitor your website portfolio</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>{websiteList.length} total websites</span>
                    <span>•</span>
                    <span>{websiteList.filter(w => w.status === 'published').length} published</span>
                    <span>•</span>
                    <span>{websiteList.filter(w => w.status === 'draft').length} drafts</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <button
                    onClick={() => silentRefreshWebsites()}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-200 hover:scale-105 shadow-sm"
                    title="Refresh website data"
                  >
                    <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  <button
                    onClick={handleCreateWebsite}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 text-sm font-semibold hover:scale-105 shadow-lg"
                  >
                    <FiPlus className="h-4 w-4" />
                    Create Website
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {websiteList.length === 0 ? (
                  <EmptyWebsiteState onCreateWebsite={handleCreateWebsite} />
                ) : (
                  <div className="space-y-4">
                    {websiteList.map((site: WebsiteWithTempIndex) => (
                      <WebsiteCard
                        key={(site as any).id}
                        site={site}
                        onEdit={handleEditWebsite}
                        onView={handleViewWebsite}
                        onDelete={handleDeleteWebsite}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Enhanced Setup Progress & Quick Actions */}
          <div className="space-y-6">
            <SetupProgress websites={apiWebsites} />
            <QuickActions 
              onCreateWebsite={handleCreateWebsite}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateWebsiteModal
        open={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditWebsite(null);
        }}
        onComplete={editWebsite ? handleEditWebsiteComplete : handleCreateWebsiteComplete}
        stepIndex={modalStep}
        website={editWebsite}
        editMode={!!editWebsite}
        onStepChange={handleStepChange}
      />
      
      <UpgradeModal
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      {viewWebsite && (
        <WebsiteDetailsModal
          open={!!viewWebsite}
          onClose={() => setViewWebsite(null)}
          website={viewWebsite}
        />
      )}

      {deleteWebsiteData && (
        <DeleteWebsiteModal
          open={!!deleteWebsiteData}
          onClose={() => setDeleteWebsiteData(null)}
          website={deleteWebsiteData}
          onDelete={confirmDeleteWebsite}
        />
      )}
    </div>
  );
} 