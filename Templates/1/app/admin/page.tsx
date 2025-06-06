"use client"

import { 
  Globe,
  Users,
  MessageSquare,
  HandHeart,
  ClipboardList,
  Coins,
  Settings,
  Quote,
  Activity,
  TrendingUp,
  Shield,
  User,
  BarChart3,
  Calendar,
  Bell,
  FileText,
  Star,
  Edit3,
  Eye,
  Database
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // This would come from auth context in a real app
  const currentUser = {
    name: "Temple Administrator",
    email: "admin@temple.org",
    role: "admin"
  }

  const currentTime = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Main Admin Management Sections
  const adminSections = [
    {
      id: 'website',
      title: 'Website Maintenance',
      description: 'Manage website content, pages, and design elements',
      icon: <Globe className="h-8 w-8" />,
      href: '/admin/website-edit',
      color: 'from-blue-500 to-blue-600',
      stats: { label: 'Pages', value: '8', status: 'active' },
      subItems: [
        { name: 'Home Page', href: '/admin/home-edit' },
        { name: 'Services', href: '/admin/services-edit' },
        { name: 'Events', href: '/admin/events-edit' },
        { name: 'Contact Us', href: '/admin/contact-edit' }
      ]
    },
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions',
      icon: <Users className="h-8 w-8" />,
      href: '/admin/users',
      color: 'from-green-500 to-green-600',
      stats: { label: 'Users', value: '156', status: 'active' },
      subItems: [
        { name: 'All Users', href: '/admin/users' },
        { name: 'Roles & Permissions', href: '/admin/users/roles' },
        { name: 'User Analytics', href: '/admin/users/analytics' }
      ]
    },
    {
      id: 'feedback',
      title: 'Comments & Feedback',
      description: 'Review and manage user feedback and comments',
      icon: <MessageSquare className="h-8 w-8" />,
      href: '/admin/feedback',
      color: 'from-purple-500 to-purple-600',
      stats: { label: 'Comments', value: '42', status: 'pending' },
      subItems: [
        { name: 'Recent Comments', href: '/admin/feedback' },
        { name: 'Feedback Reports', href: '/admin/feedback/reports' },
        { name: 'Moderation Queue', href: '/admin/feedback/moderation' }
      ]
    },
    {
      id: 'volunteering',
      title: 'Volunteer Services',
      description: 'Manage volunteer programs and opportunities',
      icon: <HandHeart className="h-8 w-8" />,
      href: '/admin/volunteering',
      color: 'from-orange-500 to-orange-600',
      stats: { label: 'Volunteers', value: '89', status: 'active' },
      subItems: [
        { name: 'Volunteer Programs', href: '/admin/volunteering' },
        { name: 'Applications', href: '/admin/volunteering/applications' },
        { name: 'Scheduling', href: '/admin/volunteering/schedule' }
      ]
    },
    {
      id: 'requests',
      title: 'Requests Management',
      description: 'Handle service requests and bookings',
      icon: <ClipboardList className="h-8 w-8" />,
      href: '/admin/requests',
      color: 'from-indigo-500 to-indigo-600',
      stats: { label: 'Requests', value: '23', status: 'pending' },
      subItems: [
        { name: 'Service Requests', href: '/admin/requests' },
        { name: 'Booking Calendar', href: '/admin/requests/calendar' },
        { name: 'Request Reports', href: '/admin/requests/reports' }
      ]
    },
    {
      id: 'donations',
      title: 'Donations Management',
      description: 'Track and manage donations and contributions',
      icon: <Coins className="h-8 w-8" />,
      href: '/admin/donations',
      color: 'from-yellow-500 to-yellow-600',
      stats: { label: 'This Month', value: '₹45,230', status: 'positive' },
      subItems: [
        { name: 'Donation Records', href: '/admin/donations' },
        { name: 'Payment Analytics', href: '/admin/donations/analytics' },
        { name: 'Tax Reports', href: '/admin/donations/tax' }
      ]
    },
    {
      id: 'profile',
      title: 'Profile Management',
      description: 'Manage admin account and system settings',
      icon: <Settings className="h-8 w-8" />,
      href: '/admin/profile',
      color: 'from-gray-500 to-gray-600',
      stats: { label: 'Settings', value: '12', status: 'configured' },
      subItems: [
        { name: 'Account Settings', href: '/admin/profile' },
        { name: 'System Config', href: '/admin/profile/system' },
        { name: 'Security', href: '/admin/profile/security' }
      ]
    },
    {
      id: 'testimonials',
      title: 'Testimonial Management',
      description: 'Manage testimonials and reviews',
      icon: <Quote className="h-8 w-8" />,
      href: '/admin/testimonials',
      color: 'from-pink-500 to-pink-600',
      stats: { label: 'Reviews', value: '67', status: 'active' },
      subItems: [
        { name: 'All Testimonials', href: '/admin/testimonials' },
        { name: 'Featured Reviews', href: '/admin/testimonials/featured' },
        { name: 'Review Analytics', href: '/admin/testimonials/analytics' }
      ]
    }
  ]

  // Quick Stats for Overview
  const overviewStats = [
    { name: 'Total Users', value: '156', icon: Users, change: '+12%', trend: 'up' },
    { name: 'Active Requests', value: '23', icon: ClipboardList, change: '+5%', trend: 'up' },
    { name: 'Monthly Donations', value: '₹45,230', icon: Coins, change: '+18%', trend: 'up' },
    { name: 'Website Views', value: '2.4K', icon: Eye, change: '+25%', trend: 'up' },
  ]

  // Recent System Activity
  const recentActivity = [
    { action: 'New user registration', user: 'Priya Sharma', time: '15 mins ago', type: 'user' },
    { action: 'Service request submitted', user: 'Raj Patel', time: '32 mins ago', type: 'request' },
    { action: 'Donation received', user: 'Anonymous', time: '1 hour ago', type: 'donation' },
    { action: 'Feedback submitted', user: 'Maya Singh', time: '2 hours ago', type: 'feedback' },
    { action: 'Volunteer application', user: 'Arjun Kumar', time: '3 hours ago', type: 'volunteer' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'positive': return 'text-blue-600 bg-blue-100'
      case 'configured': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-green-500" />
      case 'request': return <ClipboardList className="h-4 w-4 text-blue-500" />
      case 'donation': return <Coins className="h-4 w-4 text-yellow-500" />
      case 'feedback': return <MessageSquare className="h-4 w-4 text-purple-500" />
      case 'volunteer': return <HandHeart className="h-4 w-4 text-orange-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Control Center</h1>
              <p className="text-maroon-100 text-lg mt-1">
                Complete system management and oversight
              </p>
              <div className="flex items-center mt-2 space-x-4 text-sm text-maroon-200">
                <span>{currentUser.email}</span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                  SUPER ADMIN
                </span>
                <span>{currentTime}</span>
              </div>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-maroon-200 text-sm">Temple Management System</p>
            <p className="text-white font-semibold text-xl">Administrative Dashboard</p>
            <div className="flex items-center justify-end mt-2 space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-maroon-200 text-xs">System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-maroon-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-maroon-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Admin Management Sections */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Management Sections</h2>
          <p className="text-gray-600">Access all administrative functions and system management tools</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adminSections.map((section) => (
            <Link
              key={section.id}
              href={section.href}
              className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] overflow-hidden"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
              
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white group-hover:scale-110 transition-transform`}>
                    {section.icon}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(section.stats.status)}`}>
                    {section.stats.value} {section.stats.label}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-maroon-700 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  {/* Sub-items */}
                  <div className="space-y-1">
                    {section.subItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-500">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">Quick Access</span>
                  <div className="flex items-center text-maroon-600 group-hover:text-maroon-700">
                    <span className="text-sm font-medium mr-1">Manage</span>
                    <Edit3 className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-maroon-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Recent System Activity</h3>
              </div>
              <Link href="/admin/activity" className="text-sm text-maroon-600 hover:text-maroon-700">
                View All
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">by {activity.user}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center">
              <Database className="h-5 w-5 text-maroon-600 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">System Status</h3>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Website</p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
                  <p className="text-sm font-medium text-gray-900">Database</p>
                  <p className="text-xs text-green-600">Connected</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Load</span>
                  <span className="text-sm font-medium text-green-600">Normal (23%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium text-gray-900">2 hours ago</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Security Status</span>
                  <span className="text-sm font-medium text-green-600">Secure</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 