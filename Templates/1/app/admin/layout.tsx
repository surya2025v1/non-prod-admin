"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import "../globals.css"
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Heart, 
  Settings, 
  MapPin, 
  Users, 
  Menu, 
  X,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  HandHeart,
  ClipboardList,
  Coins,
  Quote
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: 'Website Maintenance', href: '/admin/website-edit', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Comments & Feedback', href: '/admin/feedback', icon: MessageSquare },
    { name: 'Volunteer Services', href: '/admin/volunteering', icon: HandHeart },
    { name: 'Requests Management', href: '/admin/requests', icon: ClipboardList },
    { name: 'Donation Management', href: '/admin/donations', icon: Coins },
    { name: 'Testimonial Management', href: '/admin/testimonials', icon: Quote },
    { name: 'Profile Management', href: '/admin/profile', icon: Settings },
  ]

  const handleSignOut = () => {
    // Clear all session storage
    sessionStorage.clear()
    localStorage.clear()
    
    // Clear any bearer tokens or auth cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/")
    })
    
    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'))
    
    // Navigate to main screen
    window.location.href = '/'
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar - Full screen height */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-xl border-r border-gray-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex h-full flex-col">
          {/* Logo/Header */}
          <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-gray-200 bg-gradient-to-r from-maroon-700 to-maroon-800">
            <div className="flex items-center min-w-0">
              <Shield className="h-7 w-7 text-white flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="ml-2 text-lg font-bold text-white truncate">Temple Admin</span>
              )}
            </div>
            
            {/* Collapse/Expand button for desktop */}
            <button
              type="button"
              className="hidden lg:flex p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
            
            {/* Close button for mobile */}
            <button
              type="button"
              className="lg:hidden p-1.5 rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col px-3 py-4 bg-white overflow-y-auto">
            <ul className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-maroon-700 text-white shadow-md'
                          : 'text-gray-700 hover:bg-maroon-50 hover:text-maroon-700 hover:shadow-sm'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                      title={sidebarCollapsed ? item.name : undefined}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>

            {/* Logout */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-1">
              <Link 
                href="/"
                className={`group flex gap-x-3 rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 hover:shadow-sm ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? "Back to Website" : undefined}
              >
                <Shield className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">Back to Website</span>
                )}
              </Link>
              <button 
                className={`group flex w-full gap-x-3 rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-700 transition-all duration-200 hover:shadow-sm ${sidebarCollapsed ? 'justify-center' : ''}`}
                title={sidebarCollapsed ? "Sign Out" : undefined}
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="truncate">Sign Out</span>
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content - Full height, no gaps */}
      <div className={`h-full transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Mobile menu button - Enhanced visibility */}
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-sm px-4 py-3">
          <div className="flex items-center gap-x-3">
            <button
              type="button"
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-maroon-700 text-white hover:bg-maroon-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-maroon-700" />
              <span className="text-lg font-bold text-maroon-700">Temple Admin</span>
            </div>
          </div>
        </div>

        {/* Page content - Start from very top, no padding */}
        <main className="h-full overflow-y-auto bg-gray-50">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 