"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  Globe,
  Home,
  Settings,
  Calendar,
  Mail,
  Eye,
  Users,
  Edit3,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowLeft,
  Zap,
  Shield,
  Server,
  Database,
  Wifi,
  RefreshCw
} from "lucide-react"

export default function WebsiteEditDashboard() {
  const [quickEditMode, setQuickEditMode] = useState(false)

  // Load Quick Edit mode from localStorage on component mount
  useEffect(() => {
    const savedQuickEditMode = localStorage.getItem('quickEditMode')
    if (savedQuickEditMode) {
      setQuickEditMode(savedQuickEditMode === 'true')
    }
  }, [])

  // Save Quick Edit mode to localStorage whenever it changes
  const toggleQuickEditMode = () => {
    const newMode = !quickEditMode
    setQuickEditMode(newMode)
    localStorage.setItem('quickEditMode', newMode.toString())
  }

  // Website sections for editing (enhanced with better UX)
  const editSections = [
    {
      id: "home",
      title: "Home Screen",
      description: "Edit homepage content, hero section, and featured elements",
      icon: <Home className="h-8 w-8" />,
      href: "/admin/home-edit",
      color: "from-blue-500 to-blue-600",
      status: "published",
      lastUpdate: "2 hours ago",
      priority: "high",
      pendingChanges: 3
    },
    {
      id: "services",
      title: "Services",
      description: "Manage temple services, schedules, and descriptions",
      icon: <Settings className="h-8 w-8" />,
      href: "/admin/services-edit",
      color: "from-green-500 to-green-600",
      status: "draft",
      lastUpdate: "1 day ago",
      priority: "medium",
      pendingChanges: 1
    },
    {
      id: "events",
      title: "Events",
      description: "Update upcoming events, festivals, and special occasions",
      icon: <Calendar className="h-8 w-8" />,
      href: "/admin/events-edit",
      color: "from-purple-500 to-purple-600",
      status: "published",
      lastUpdate: "2 days ago",
      priority: "high",
      pendingChanges: 0
    },
    {
      id: "contact",
      title: "Contact Us",
      description: "Modify contact information, location, and communication details",
      icon: <Mail className="h-8 w-8" />,
      href: "/admin/contact-edit",
      color: "from-orange-500 to-orange-600",
      status: "needs review",
      lastUpdate: "3 days ago",
      priority: "medium",
      pendingChanges: 2
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'needs review': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published': return <CheckCircle className="h-4 w-4" />
      case 'draft': return <Clock className="h-4 w-4" />
      case 'needs review': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with Admin Navigation */}
      <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 rounded-lg p-6 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-6">
            <Link 
              href="/admin"
              className="flex items-center space-x-2 text-maroon-100 hover:text-white transition-colors group"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Admin Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-maroon-200 text-sm">Website Online</span>
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">
                LIVE SITE
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Website Content Management</h1>
                <p className="text-maroon-100 text-lg mt-1">
                  Edit and manage all website content sections
                </p>
                <div className="flex items-center mt-3 space-x-6 text-sm text-maroon-200">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Last sync: 5 minutes ago</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>6 pending changes</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right hidden md:block">
              <div className="flex items-center justify-end space-x-3 mb-4">
                <button
                  onClick={toggleQuickEditMode}
                  className={`px-4 py-2 rounded-lg text-white transition-all ${
                    quickEditMode 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <Edit3 className="h-4 w-4 inline mr-2" />
                  Quick Edit {quickEditMode ? 'ON' : 'OFF'}
                </button>
                <Link
                  href="/admin"
                  className="px-4 py-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors flex items-center"
                >
                  <span className="mr-2">Admin Panel</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status Cards (Replaced Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Server className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Server Status</p>
              <p className="text-lg font-bold text-green-600">Online</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Database</p>
              <p className="text-lg font-bold text-blue-600">Connected</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Security</p>
              <p className="text-lg font-bold text-purple-600">Secure</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Wifi className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">CDN Status</p>
              <p className="text-lg font-bold text-orange-600">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Enhanced Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Content Management Sections - Enhanced */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Content Management Sections</h2>
                <p className="text-gray-600 mt-1">Edit and manage different sections of your website</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {editSections.map((section) => (
              <Link
                key={section.id}
                href={section.href}
                className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
              >
                {/* Priority Indicator */}
                <div className={`absolute left-0 top-0 w-1 h-full ${
                  section.priority === 'high' ? 'bg-red-400' : 
                  section.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                }`}></div>
                
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className="p-6 pl-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color} text-white group-hover:scale-110 transition-transform shadow-lg`}>
                      {section.icon}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(section.status)}`}>
                        {getStatusIcon(section.status)}
                        <span className="capitalize">{section.status}</span>
                      </div>
                      {section.pendingChanges > 0 && (
                        <div className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                          {section.pendingChanges} pending
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-maroon-700 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed mt-2">
                        {section.description}
                      </p>
                    </div>

                    {/* Priority Badge */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        section.priority === 'high' ? 'bg-red-100 text-red-600' :
                        section.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {section.priority.toUpperCase()} PRIORITY
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">Updated {section.lastUpdate}</span>
                    <div className="flex items-center text-maroon-600 group-hover:text-maroon-700">
                      <span className="text-sm font-medium mr-1">Edit Content</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Sidebar - Quick Actions and System Health Only */}
        <div className="lg:col-span-1 space-y-6">
          {/* Enhanced Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-maroon-50 rounded-lg hover:bg-maroon-100 transition-colors border border-maroon-200">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-maroon-600" />
                    <span className="text-sm font-medium text-maroon-700">Publish All Changes</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-maroon-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Preview Website</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </button>
                
                <Link href="/admin" className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Back to Admin</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-600" />
                </Link>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">System Health</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Website Status</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">Online</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Load</span>
                  <span className="text-sm font-medium text-blue-600">23%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-sm font-medium text-gray-600">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 