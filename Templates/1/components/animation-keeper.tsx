"use client"

import { useEffect, useRef } from "react"

/**
 * AnimationKeeper component ensures animations continue to work
 * even when the page is inactive or after long periods
 */
export function AnimationKeeper() {
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const visibilityChangeRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    // Function to refresh animations
    const refreshAnimations = () => {
      // Force a small layout change to restart animations
      document.body.style.opacity = "0.99"
      setTimeout(() => {
        document.body.style.opacity = "1"
      }, 10)

      // Restart CSS animations by toggling animation-play-state
      const animatedElements = document.querySelectorAll('[class*="animate-"]')
      animatedElements.forEach((el) => {
        const element = el as HTMLElement
        const originalPlayState = element.style.animationPlayState
        element.style.animationPlayState = "paused"
        // Force reflow
        void element.offsetWidth
        element.style.animationPlayState = originalPlayState || "running"
      })
    }

    // Check animations periodically
    checkIntervalRef.current = setInterval(() => {
      refreshAnimations()
    }, 60000) // Check every minute

    // Handle visibility change (tab focus/blur)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshAnimations()
      }
    }

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange)
    visibilityChangeRef.current = handleVisibilityChange

    return () => {
      // Clean up
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (visibilityChangeRef.current) {
        document.removeEventListener("visibilitychange", visibilityChangeRef.current)
      }
    }
  }, [])

  // This component doesn't render anything
  return null
}
