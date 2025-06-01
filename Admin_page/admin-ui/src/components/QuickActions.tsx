import { FiPlus, FiSettings, FiBarChart, FiGlobe, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  gradient: string;
  hoverGradient: string;
  route?: string;
  onClick: () => void;
  disabled?: boolean;
}

interface QuickActionsProps {
  onCreateWebsite: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function QuickActions({ 
  onCreateWebsite, 
  onRefresh,
  isRefreshing = false
}: QuickActionsProps) {
  const navigate = useNavigate();

  const handleNavigation = (route: string) => {
    if (route) {
      navigate(route);
    }
  };

  const quickActions: QuickAction[] = [
    {
      id: 'create_website',
      title: 'Create Website',
      icon: FiPlus,
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'from-blue-600 to-blue-700',
      onClick: onCreateWebsite
    },
    {
      id: 'view_analytics',
      title: 'Analytics',
      icon: FiBarChart,
      gradient: 'from-emerald-500 to-emerald-600',
      hoverGradient: 'from-emerald-600 to-emerald-700',
      route: '/analytics',
      onClick: () => handleNavigation('/analytics')
    },
    {
      id: 'manage_settings',
      title: 'Settings',
      icon: FiSettings,
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'from-purple-600 to-purple-700',
      route: '/settings',
      onClick: () => handleNavigation('/settings')
    }
  ];

  return (
    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100 flex flex-col gap-4">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-base md:text-lg font-bold text-gray-900">Quick Actions</h2>
          <p className="text-xs md:text-sm text-gray-600 mt-1">Essential tools for your success</p>
        </div>
        <div className="flex items-center gap-2">
          <FiGlobe className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-gray-600 font-medium">Ready to build</span>
        </div>
      </div>
      <button 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 disabled:opacity-50 border border-gray-200 w-fit mb-1"
      >
        <FiTrendingUp className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh'}
      </button>

      {/* Horizontal scrollable actions row on small screens */}
      <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={action.disabled}
              className="group min-w-[120px] max-w-[140px] flex-shrink-0 flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 text-center hover:shadow-lg p-3 md:p-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <IconComponent className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-xs md:text-sm text-gray-900 group-hover:text-gray-800 whitespace-nowrap">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-3 mt-2 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-2 border-white shadow"></div>
            <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full border-2 border-white shadow"></div>
            <div className="w-5 h-5 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full border-2 border-white shadow"></div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-900 leading-tight">Everything you need</p>
            <p className="text-xs text-gray-600 leading-tight">Professional tools for modern websites</p>
          </div>
        </div>
        <button 
          onClick={onCreateWebsite}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 shadow hover:shadow-md"
        >
          <FiPlus className="w-4 h-4" />
          Start Building
        </button>
      </div>
    </div>
  );
} 