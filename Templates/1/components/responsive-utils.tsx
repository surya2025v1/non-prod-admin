"use client"

import type React from "react"

import { useState, useEffect } from "react"

// Custom hook to detect screen size
export function useScreenSize() {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      })
    }

    // Set initial size
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return screenSize
}

// Responsive container component
export function ResponsiveContainer({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`w-full px-4 sm:px-6 md:px-8 lg:container lg:mx-auto ${className}`}>{children}</div>
}

// Responsive grid component
export function ResponsiveGrid({
  children,
  cols = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "gap-6",
  className = "",
}: {
  children: React.ReactNode
  cols?: { mobile: number; tablet: number; desktop: number }
  gap?: string
  className?: string
}) {
  const mobileClass = `grid-cols-${cols.mobile}`
  const tabletClass = `md:grid-cols-${cols.tablet}`
  const desktopClass = `lg:grid-cols-${cols.desktop}`

  return <div className={`grid ${mobileClass} ${tabletClass} ${desktopClass} ${gap} ${className}`}>{children}</div>
}

// Responsive text component
export function ResponsiveText({
  children,
  size = { mobile: "text-base", tablet: "text-lg", desktop: "text-xl" },
  className = "",
}: {
  children: React.ReactNode
  size?: { mobile: string; tablet: string; desktop: string }
  className?: string
}) {
  return <div className={`${size.mobile} ${size.tablet} ${size.desktop} ${className}`}>{children}</div>
}

// Responsive spacing component
export function ResponsiveSpacing({
  className = "",
  my = { mobile: "my-6", tablet: "md:my-8", desktop: "lg:my-12" },
}: {
  className?: string
  my?: { mobile: string; tablet: string; desktop: string }
}) {
  return <div className={`${my.mobile} ${my.tablet} ${my.desktop} ${className}`}></div>
}
