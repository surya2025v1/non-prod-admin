"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SpiritualLoadingProps {
  onComplete?: () => void
  duration?: number
}

export function SpiritualLoading({ onComplete, duration = 3000 }: SpiritualLoadingProps) {
  const [currentMantra, setCurrentMantra] = useState(0)
  const [greeting, setGreeting] = useState("")
  const [isBreathing, setIsBreathing] = useState(true)

  const mantras = [
    { sanskrit: "ॐ गं गणपतये नमः", transliteration: "Om Gam Ganapataye Namaha", meaning: "Salutations to Lord Ganesha" },
    { sanskrit: "ॐ शान्ति शान्ति शान्तिः", transliteration: "Om Shanti Shanti Shantih", meaning: "Om Peace Peace Peace" },
    { sanskrit: "सर्वे भवन्तु सुखिनः", transliteration: "Sarve Bhavantu Sukhinah", meaning: "May all beings be happy" }
  ]

  useEffect(() => {
    // Set time-based greeting
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("शुभ प्रभात") // Good Morning
    } else if (hour < 17) {
      setGreeting("नमस्कार") // Greetings
    } else {
      setGreeting("शुभ संध्या") // Good Evening
    }

    // Cycle through mantras
    const mantraInterval = setInterval(() => {
      setCurrentMantra((prev) => (prev + 1) % mantras.length)
    }, 1000)

    // Complete loading
    const timer = setTimeout(() => {
      setIsBreathing(false)
      setTimeout(() => onComplete?.(), 500)
    }, duration)

    return () => {
      clearInterval(mantraInterval)
      clearTimeout(timer)
    }
  }, [duration, onComplete])

  return (
    <AnimatePresence>
      {isBreathing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-maroon-900 via-maroon-800 to-orange-900"
        >
          {/* Animated Background Mandalas */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/4 left-1/4 w-64 h-64 opacity-10"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-300">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <path d="M50 5 L50 95 M5 50 L95 50 M15 15 L85 85 M15 85 L85 15" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </motion.div>
            
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1/4 right-1/4 w-48 h-48 opacity-10"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full text-gold-300">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
            </motion.div>
          </div>

          <div className="text-center z-10 px-6">
            {/* Greeting */}
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl md:text-4xl font-bold text-gold-200 mb-8 font-cinzel"
            >
              {greeting}
            </motion.h2>

            {/* Breathing Om Symbol */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="mb-8"
            >
              <div className="w-24 h-24 mx-auto text-gold-300">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 10 C70 10, 85 25, 85 45 C85 65, 70 80, 50 80 C30 80, 15 65, 15 45 C15 35, 20 25, 30 20 M30 20 C25 15, 20 10, 15 10 M30 20 C35 15, 45 15, 50 20 M50 20 C55 15, 65 15, 70 20 C75 25, 80 30, 85 35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="50" cy="45" r="3" fill="currentColor" />
                  <path d="M50 70 C55 70, 60 75, 60 80 C60 85, 55 90, 50 90 C45 90, 40 85, 40 80 C40 75, 45 70, 50 70" fill="currentColor" />
                </svg>
              </div>
            </motion.div>

            {/* Cycling Mantras */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentMantra}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <p className="text-2xl md:text-3xl text-gold-200 font-semibold font-cormorant">
                  {mantras[currentMantra].sanskrit}
                </p>
                <p className="text-lg text-gold-300 italic">
                  {mantras[currentMantra].transliteration}
                </p>
                <p className="text-sm text-gold-400">
                  {mantras[currentMantra].meaning}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Breathing Instruction */}
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-gold-300 mt-8 text-sm"
            >
              Take a deep breath and center yourself...
            </motion.p>

            {/* Progress Indicator */}
            <div className="mt-8 w-64 h-1 bg-gold-900 rounded-full mx-auto overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                className="h-full bg-gradient-to-r from-gold-400 to-gold-200 rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for spiritual time-based greetings
export function useSpiritualGreeting() {
  const [greeting, setGreeting] = useState("")
  const [period, setPeriod] = useState("")

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours()
      
      if (hour >= 4 && hour < 12) {
        setGreeting("शुभ प्रभात") // Good Morning
        setPeriod("morning")
      } else if (hour >= 12 && hour < 17) {
        setGreeting("नमस्कार") // Afternoon Greetings
        setPeriod("afternoon")
      } else if (hour >= 17 && hour < 20) {
        setGreeting("शुभ संध्या") // Good Evening
        setPeriod("evening")
      } else {
        setGreeting("शुभ रात्रि") // Good Night
        setPeriod("night")
      }
    }

    updateGreeting()
    const interval = setInterval(updateGreeting, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  return { greeting, period }
} 