"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, Shield, LogOut, User, Settings } from "lucide-react"
import { DevotionalText } from "@/components/devotional-text"
import { DevotionalButtonOutline } from "@/components/devotional-button-outline"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on the auth page
  const isAuthPage = pathname === '/auth'
  const isDonationPage = pathname === '/donation'

  // Check user authentication status
  useEffect(() => {
    const checkAuth = () => {
      const userData = sessionStorage.getItem('user')
      const isSuccess = sessionStorage.getItem('isSuccess')
      
      if (userData && isSuccess) {
        try {
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Error parsing user data:', error)
          setIsLoggedIn(false)
          setUser(null)
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }

    checkAuth()
    
    // Multiple event listeners for better auth state detection
    window.addEventListener('storage', checkAuth)
    window.addEventListener('focus', checkAuth)
    window.addEventListener('authStateChanged', checkAuth)
    
    // Polling for immediate auth state changes
    const authCheckInterval = setInterval(checkAuth, 1000)
    
    return () => {
      window.removeEventListener('storage', checkAuth)
      window.removeEventListener('focus', checkAuth)
      window.removeEventListener('authStateChanged', checkAuth)
      clearInterval(authCheckInterval)
    }
  }, [])

  const handleLogout = () => {
    sessionStorage.clear()
    setIsLoggedIn(false)
    setUser(null)
    window.location.href = '/'
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (isMenuOpen && !target.closest("nav") && !target.closest("button")) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-white/98 backdrop-blur-xl supports-[backdrop-filter]:bg-white/95 shadow-xl border-b border-gray-200/50"
          : "bg-white/90 backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 border-b border-transparent"
      }`}
    >
      <div className="container flex h-20 items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-maroon-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <span className="text-white font-bold text-lg">॥</span>
          </div>
          <span className="text-2xl font-bold text-maroon-700 devotional-heading group-hover:text-maroon-800 transition-colors duration-300">
            <DevotionalText effect="shimmer">Hindu Temple</DevotionalText>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className={`md:hidden p-3 rounded-2xl transition-all duration-300 ${
            scrolled 
              ? "hover:bg-maroon-50 text-maroon-700" 
              : "hover:bg-white/20 text-maroon-600"
          } ${isMenuOpen ? "bg-maroon-100 text-maroon-800" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <motion.div
            animate={{ rotate: isMenuOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.div>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            href="/" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 rounded-xl hover:bg-maroon-50 group"
          >
            Home
            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-maroon-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>
          <Link 
            href="/services" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 rounded-xl hover:bg-maroon-50 group"
          >
            Services
            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-maroon-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>
          <Link 
            href="/events" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 rounded-xl hover:bg-maroon-50 group"
          >
            Events
            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-maroon-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>
          <Link 
            href="/contact" 
            className="relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 rounded-xl hover:bg-maroon-50 group"
          >
            Contact Us
            <span className="absolute bottom-0 left-1/2 h-0.5 w-0 bg-maroon-600 transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></span>
          </Link>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-3 ml-4">
            {isLoggedIn ? (
              // Logged in user section - Only C Circle
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-maroon-50">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-maroon-100 text-maroon-700 font-semibold">
                        {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'editor' ? '/admin' : '/profile'}>
                    <User className="mr-2 h-4 w-4" />
                    {user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'editor' ? 'Admin Dashboard' : 'My Profile'}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Not logged in section
              <>
                {!isDonationPage && (
                  <Link href="/donation">
                    <Button className="bg-gradient-to-r from-gold-500 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white btn-devotional rounded-xl px-6 py-2.5 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      Donation
                    </Button>
                  </Link>
                )}
                {!isAuthPage && (
                  <Link href="/auth">
                    <DevotionalButtonOutline className="rounded-xl px-6 py-2.5 font-semibold transition-all duration-300 transform hover:scale-105">
                      Login/Signup
                    </DevotionalButtonOutline>
                  </Link>
                )}
              </>
            )}
          </div>
        </nav>

        {/* Mobile navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed top-20 left-0 right-0 bg-white/98 backdrop-blur-xl border-b shadow-2xl md:hidden z-50"
            >
              <div className="container py-6 space-y-2 max-h-[80vh] overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link
                    href="/"
                    className="block text-base font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 p-4 rounded-2xl hover:bg-maroon-50 border border-transparent hover:border-maroon-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  <Link
                    href="/services"
                    className="block text-base font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 p-4 rounded-2xl hover:bg-maroon-50 border border-transparent hover:border-maroon-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Services
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Link
                    href="/events"
                    className="block text-base font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 p-4 rounded-2xl hover:bg-maroon-50 border border-transparent hover:border-maroon-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Events
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                >
                  <Link
                    href="/contact"
                    className="block text-base font-medium text-gray-700 hover:text-maroon-600 transition-all duration-300 p-4 rounded-2xl hover:bg-maroon-50 border border-transparent hover:border-maroon-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  className="flex flex-col space-y-3 pt-4 border-t border-gray-200"
                >
                  {isLoggedIn ? (
                    // Logged in user section (mobile)
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-4 bg-maroon-50 rounded-2xl border border-maroon-200">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-maroon-100 text-maroon-700 font-semibold">
                            {(user?.first_name?.[0] || user?.username?.[0] || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-maroon-700">{user?.username || user?.first_name || 'User'}</p>
                          <p className="text-sm text-maroon-600 capitalize">{user?.role || 'Member'}</p>
                        </div>
                      </div>
                      <Button 
                        className="w-full bg-maroon-700 hover:bg-maroon-800 text-white py-4 rounded-2xl font-semibold text-lg"
                        onClick={() => {
                          setIsMenuOpen(false)
                          window.location.href = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'editor' ? '/admin' : '/profile'
                        }}
                      >
                        <User className="mr-2 h-4 w-4" />
                        {user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'editor' ? 'Admin Dashboard' : 'My Profile'}
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full border-maroon-200 text-maroon-700 hover:bg-maroon-50 py-4 rounded-2xl font-semibold text-lg"
                        onClick={() => {
                          setIsMenuOpen(false)
                          handleLogout()
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    // Not logged in section (mobile)
                    <>
                      {!isDonationPage && (
                        <Link href="/donation" onClick={() => setIsMenuOpen(false)}>
                          <Button className="w-full bg-gradient-to-r from-gold-500 to-gold-700 hover:from-gold-600 hover:to-gold-800 text-white btn-devotional py-4 rounded-2xl font-semibold text-lg shadow-lg">
                            Donation
                          </Button>
                        </Link>
                      )}
                      {!isAuthPage && (
                        <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                          <DevotionalButtonOutline className="w-full py-4 rounded-2xl font-semibold text-lg">
                            Login/Signup
                          </DevotionalButtonOutline>
                        </Link>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
