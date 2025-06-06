"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Check if the current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // Check if the current route is the profile page
  const isProfileRoute = pathname === '/profile'

  if (isAdminRoute) {
    // Admin layout - no navbar/footer, full screen
    return <>{children}</>
  }

  // For profile page, keep navbar but remove footer
  if (isProfileRoute) {
    return (
      <div className="relative min-h-screen">
        {/* Fixed Navigation */}
        <Navbar />
        
        {/* Main Content with proper spacing for fixed navbar */}
        <main className="pt-20 focus:outline-none">
          {children}
        </main>
      </div>
    )
  }

  // Regular layout with navbar and footer
  return (
    <div className="relative min-h-screen">
      {/* Fixed Navigation */}
      <Navbar />
      
      {/* Main Content with proper spacing for fixed navbar */}
      <main className="pt-20 focus:outline-none">
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
} 