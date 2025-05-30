import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiPlus, FiEdit2, FiExternalLink, FiTrash2, FiCheckCircle, FiAlertCircle, FiTrendingUp, FiUsers, FiGlobe, FiDollarSign, FiStar, FiClock, FiZap, FiAward, FiTarget, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import CreateWebsiteModal from './website/CreateWebsiteModal';
import UpgradeModal from './website/UpgradeModal';
import WebsiteDetailsModal from './website/WebsiteDetailsModal';
import DeleteWebsiteModal from './website/DeleteWebsiteModal';
import { getAuthState } from '../utils/auth';
import { fetchMyWebsites, cacheWebsites, getCachedWebsites, clearWebsitesCache, refreshWebsiteData, type Website } from '../utils/api';

// Get username from auth state
const { username } = getAuthState();

// Mock analytics data (as requested to keep for now)
const mockAnalytics = {
  visitors: 2547,
  pageViews: 8429,
  conversionRate: 3.2,
  revenue: 1250
};

const setupSteps = [
  { name: 'Account Setup', label: 'Account Setup', done: true, icon: <FiUsers className="w-4 h-4" /> },
  { name: 'First Website', label: 'First Website', done: true, icon: <FiStar className="w-4 h-4" /> },
  { name: 'Domain Configuration', label: 'Domain Configuration', done: false, icon: <FiGlobe className="w-4 h-4" /> },
  { name: 'Payment Setup', label: 'Payment Setup', done: false, icon: <FiDollarSign className="w-4 h-4" /> },
];

// Convert API website data to component format
function convertApiWebsiteToComponent(apiWebsite: Website, index: number) {
  return {
    id: index + 1, // Use index as ID since API doesn't return ID
    name: apiWebsite.domain || `Website ${index + 1}`,
    status: apiWebsite.status === 'published' ? 'Published' : 
            apiWebsite.status === 'draft' ? 'Draft' : 'Archived',
    lastUpdated: new Date().toISOString().split('T')[0], // Mock last updated
    organizationName: apiWebsite.organization_name,
    organizationType: apiWebsite.organization_type,
    tagline: apiWebsite.tagline,
    contactEmail: apiWebsite.contact_email,
    contactPhone: apiWebsite.contact_phone,
    address: apiWebsite.address,
    logo: null, // File objects not supported from API
    favicon: null,
    primaryColor: apiWebsite.primary_color,
    secondaryColor: apiWebsite.secondary_color,
    font: apiWebsite.font,
    heroImage: null,
    bannerImages: [],
    introText: apiWebsite.intro_text,
    gallery: [],
    video: apiWebsite.video_youtube_link,
    about: apiWebsite.about,
    mission: apiWebsite.mission,
    history: apiWebsite.history,
    team: apiWebsite.team_members || [],
    services: apiWebsite.services_offerings || [],
    social: apiWebsite.social_media_links || {},
    domain: apiWebsite.domain,
    paidTill: apiWebsite.paid_till,
    analytics: mockAnalytics // Use mock analytics as requested
  };
}

export default function Dashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [modalStep, setModalStep] = useState(0);
  const [editWebsite, setEditWebsite] = useState<null | any>(null);
  const [viewWebsite, setViewWebsite] = useState<null | any>(null);
  const [deleteWebsite, setDeleteWebsite] = useState<null | any>(null);
  const [websiteList, setWebsiteList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiWebsites, setApiWebsites] = useState<Website[]>([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  const previousLocation = useRef<string>('');

  const completedSteps = setupSteps.filter(step => step.done).length;
  const progressPercentage = (completedSteps / setupSteps.length) * 100;

  // Calculate totals from mock analytics (since keeping mock data)
  const totalVisitors = websiteList.reduce((sum, site) => sum + site.analytics.visitors, 0);
  const totalPageViews = websiteList.reduce((sum, site) => sum + site.analytics.pageViews, 0);
  const totalRevenue = websiteList.reduce((sum, site) => sum + site.analytics.revenue, 0);
  const avgConversionRate = websiteList.length > 0 
    ? websiteList.reduce((sum, site) => sum + site.analytics.conversionRate, 0) / websiteList.length 
    : 0;

  // Silent refresh function (no loading indicator)
  const silentRefreshWebsites = async () => {
    try {
      const websites = await refreshWebsiteData();
      
      // Update state with fresh data
      setApiWebsites(websites);
      const convertedWebsites = websites.map(convertApiWebsiteToComponent);
      setWebsiteList(convertedWebsites);
      setError(null);
    } catch (err) {
      console.error('Silent refresh failed, keeping stale data:', err);
      // Don't update error state - keep stale data visible as requested
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
      
      // Only use cache for initial non-silent loads
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

      // Fetch from API (always fresh data)
      websites = await fetchMyWebsites(true); // Always force refresh
      
      // Update state
      setApiWebsites(websites);
      const convertedWebsites = websites.map(convertApiWebsiteToComponent);
      setWebsiteList(convertedWebsites);
      
      if (!silent) {
        setError(null);
      }
      
    } catch (err) {
      console.error('Failed to load websites:', err);
      if (!silent) {
        setError(err instanceof Error ? err.message : 'Failed to load websites');
        setWebsiteList([]); // Show empty state on error only for non-silent calls
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
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
    
    // Check if we're on the dashboard and coming from a different route
    if (currentPath === '/dashboard' && prevPath && prevPath !== '/dashboard') {
      // Perform silent refresh without loading indicator
      silentRefreshWebsites();
    }
    
    // Update previous location for next navigation (do this AFTER the check)
    previousLocation.current = currentPath;
  }, [location.pathname]);

  const handleCreateWebsite = () => {
    setModalStep(0);
    setEditWebsite(null);
    setShowCreateModal(true);
  };

  // Enhanced edit step change handler for API refresh
  const handleStepChange = async (step: number) => {
    await silentRefreshWebsites();
  };

  // Enhanced create website completion handler
  const handleCreateWebsiteComplete = async () => {
    setShowCreateModal(false);
    
    // Refresh data after successful creation
    await silentRefreshWebsites();
  };

  const handleEditWebsite = (website: any) => {
    // Find the corresponding API data for pre-population
    const apiWebsite = apiWebsites.find(api => api.domain === website.domain);
    if (apiWebsite) {
      // Convert API data to form format for editing
      const editData = {
        organizationName: apiWebsite.organization_name,
        organizationType: apiWebsite.organization_type,
        tagline: apiWebsite.tagline,
        contactEmail: apiWebsite.contact_email,
        contactPhone: apiWebsite.contact_phone,
        address: apiWebsite.address,
        primaryColor: apiWebsite.primary_color,
        secondaryColor: apiWebsite.secondary_color,
        font: apiWebsite.font,
        introText: apiWebsite.intro_text,
        about: apiWebsite.about,
        mission: apiWebsite.mission,
        history: apiWebsite.history,
        team: apiWebsite.team_members || [{ name: '', role: '', photo: null }],
        services: apiWebsite.services_offerings || [{ name: '', description: '', image: null, price: '' }],
        social: apiWebsite.social_media_links || { facebook: '', instagram: '', twitter: '', youtube: '', website: '' },
        domain: apiWebsite.domain,
        video: apiWebsite.video_youtube_link,
        // Note: File fields (logo, images) cannot be pre-populated from API
        logo: null,
        favicon: null,
        heroImage: null,
        bannerImages: [],
        gallery: [],
      };
      setEditWebsite(editData);
    }
    setModalStep(0);
    setShowCreateModal(true);
  };

  // Enhanced edit website completion handler
  const handleEditWebsiteComplete = async () => {
    setEditWebsite(null);
    setShowCreateModal(false);
    
    // Refresh data after successful edit
    await silentRefreshWebsites();
  };

  const handleViewWebsite = (website: any) => {
    // Use API data for detailed view
    const apiWebsite = apiWebsites.find(api => api.domain === website.domain);
    if (apiWebsite) {
      const viewData = {
        ...website,
        // Add additional API data for detailed view
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
    setDeleteWebsite(website);
  };

  const confirmDeleteWebsite = (website: any) => {
    setWebsiteList(prev => prev.filter(w => w.id !== website.id));
    setDeleteWebsite(null);
    // TODO: Implement actual API delete call
  };

  const handleRefresh = () => {
    clearWebsitesCache();
    loadWebsites(false); // Force refresh without cache
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Loading Your Websites</h2>
          <p className="text-gray-600">Please wait while we fetch your data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-xl text-center max-w-md">
          <FiAlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Websites</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={handleCreateWebsite}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Create Website
            </button>
          </div>
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
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        <div className="relative px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                Welcome back, <span className="text-yellow-300">{username || 'Builder'}!</span>
              </h1>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                Let's create something amazing together. Build professional websites that convert visitors into customers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center justify-center gap-3 bg-white text-primary-700 px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-yellow-50 transition-all duration-200 transform hover:scale-105 hover:shadow-2xl"
                >
                  <FiPlus className="w-6 h-6" />
                  Create New Website
                </button>
                <button className="flex items-center justify-center gap-3 bg-primary-500/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold text-lg border border-white/20 hover:bg-primary-400/30 transition-all duration-200">
                  <FiTrendingUp className="w-6 h-6" />
                  View Analytics
                </button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{websiteList.length}</div>
                <div className="text-blue-100 text-sm font-medium">Active Websites</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold text-white mb-1">{totalVisitors.toLocaleString()}</div>
                <div className="text-blue-100 text-sm font-medium">Total Visitors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="px-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisitors.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <FiUsers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalPageViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <FiGlobe className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                <FiDollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Conversion</p>
                <p className="text-2xl font-bold text-gray-900">{avgConversionRate.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Websites List */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Websites</h2>
                  <p className="text-gray-600 mt-1">Manage and monitor your website portfolio</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => silentRefreshWebsites()}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    title="Refresh website data"
                  >
                    <FiRefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                  <button
                    onClick={handleCreateWebsite}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="h-4 w-4 mr-2" />
                    Create Website
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {websiteList.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiGlobe className="w-12 h-12 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Websites Yet</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      Get started by creating your first website. Our intuitive builder makes it easy to create professional websites in minutes.
                    </p>
                    <button
                      onClick={handleCreateWebsite}
                      className="flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg mx-auto"
                    >
                      <FiPlus className="w-5 h-5" />
                      Create Your First Website
                    </button>
                  </div>
                ) : (
                  websiteList.map(site => (
                    <div key={site.id} className="group bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                              <span className="text-white font-bold text-lg">{site.name[0].toUpperCase()}</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                              <p className="text-gray-600 text-sm">{site.organizationName}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-4">
                            {site.status === 'Published' ? (
                              <span className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                <FiCheckCircle className="w-4 h-4" />
                                Published
                              </span>
                            ) : (
                              <span className="flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                <FiClock className="w-4 h-4" />
                                Draft
                              </span>
                            )}
                            
                            {site.paidTill ? (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                Paid till {site.paidTill}
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                                Payment Pending
                              </span>
                            )}
                          </div>

                          {/* Analytics Preview */}
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{site.analytics.visitors.toLocaleString()}</div>
                              <div className="text-xs text-gray-600">Visitors</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{site.analytics.pageViews.toLocaleString()}</div>
                              <div className="text-xs text-gray-600">Page Views</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">${site.analytics.revenue.toLocaleString()}</div>
                              <div className="text-xs text-gray-600">Revenue</div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500">
                            Last updated: {site.lastUpdated}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => handleEditWebsite(site)}
                            className="p-3 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-xl transition-colors duration-200"
                            title="Edit"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleViewWebsite(site)}
                            className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors duration-200"
                            title="View"
                          >
                            <FiExternalLink className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteWebsite(site)}
                            className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors duration-200"
                            title="Delete"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Setup Progress & Quick Actions */}
          <div className="space-y-6">
            {/* Setup Progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Setup Progress</h3>
                <div className="text-2xl font-bold text-primary-600">{Math.round(progressPercentage)}%</div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>

              <div className="space-y-3">
                {setupSteps.map((step, index) => (
                  <div key={index} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${step.done ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className={`p-2 rounded-lg ${step.done ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                      {step.done ? <FiCheckCircle className="w-4 h-4" /> : step.icon}
                    </div>
                    <span className={`font-medium ${step.done ? 'text-green-700' : 'text-gray-600'}`}>
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl transition-all duration-200 group">
                  <div className="p-2 bg-blue-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <FiTrendingUp className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">View Analytics</div>
                    <div className="text-sm text-gray-600">Track performance</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl transition-all duration-200 group">
                  <div className="p-2 bg-purple-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <FiZap className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">SEO Optimization</div>
                    <div className="text-sm text-gray-600">Boost visibility</div>
                  </div>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-xl transition-all duration-200 group">
                  <div className="p-2 bg-green-500 text-white rounded-lg group-hover:scale-110 transition-transform">
                    <FiAward className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">Templates Gallery</div>
                    <div className="text-sm text-gray-600">Browse designs</div>
                  </div>
                </button>
              </div>
            </div>
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

      {deleteWebsite && (
        <DeleteWebsiteModal
          open={!!deleteWebsite}
          onClose={() => setDeleteWebsite(null)}
          website={deleteWebsite}
          onDelete={(website) => {
            setWebsiteList(prev => prev.filter(w => w.id !== website.id));
            setDeleteWebsite(null);
          }}
        />
      )}
    </div>
  );
} 