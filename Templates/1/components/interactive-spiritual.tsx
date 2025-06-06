"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion"
import { Heart, Star, Sparkles } from "lucide-react"

// Mouse Trail Flowers Component
export function MouseTrailFlowers() {
  const [trails, setTrails] = useState<Array<{
    id: number
    x: number
    y: number
    timestamp: number
  }>>([])

  const trailRef = useRef<number>(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        id: trailRef.current++,
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      }

      setTrails(prev => {
        const filtered = prev.filter(trail => Date.now() - trail.timestamp < 1000)
        return [...filtered, newTrail].slice(-10) // Keep only last 10 trails
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {trails.map((trail) => (
          <motion.div
            key={trail.id}
            initial={{ scale: 0, opacity: 1, rotate: 0 }}
            animate={{ scale: 1, opacity: 0, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute"
            style={{
              left: trail.x - 10,
              top: trail.y - 10,
            }}
          >
            <div className="w-5 h-5 text-gold-400">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5L12 2L9 5.5L3 7V9L9 7.5L12 11L15 7.5L21 9ZM12 13L9 16.5L3 18V20L9 18.5L12 22L15 18.5L21 20V18L15 16.5L12 13Z"/>
              </svg>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Click Ripple Mantras Component
export function ClickRippleMantras() {
  const [ripples, setRipples] = useState<Array<{
    id: number
    x: number
    y: number
    mantra: string
  }>>([])

  const mantras = [
    "ॐ", "श्री", "गं", "हं", "ह्रीं", "श्रीं", "क्लीं", "ऐं", "सौः", "स्वाहा"
  ]

  const rippleRef = useRef<number>(0)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const randomMantra = mantras[Math.floor(Math.random() * mantras.length)]
      
      const newRipple = {
        id: rippleRef.current++,
        x: e.clientX,
        y: e.clientY,
        mantra: randomMantra
      }

      setRipples(prev => [...prev, newRipple])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id))
      }, 2000)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute border-2 border-gold-300 rounded-full"
            style={{
              left: ripple.x - 20,
              top: ripple.y - 20,
              width: 40,
              height: 40,
            }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center text-gold-600 font-semibold text-sm"
            >
              {ripple.mantra}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Prayer Wheel Component
interface PrayerWheelProps {
  mantras?: string[]
  onSpin?: (rotations: number) => void
  className?: string
}

export function PrayerWheel({ 
  mantras = ["ॐ मणि पद्मे हूँ", "ॐ गं गणपतये नमः", "ॐ नमः शिवाय"],
  onSpin,
  className = ""
}: PrayerWheelProps) {
  const [rotations, setRotations] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [currentMantra, setCurrentMantra] = useState(0)
  const [spinCount, setSpinCount] = useState(0)
  
  const rotation = useMotionValue(0)
  const smoothRotation = useSpring(rotation, { damping: 30, stiffness: 300 })

  const handleSpin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    const newRotations = rotations + 360 * (3 + Math.random() * 3) // 3-6 rotations
    
    rotation.set(newRotations)
    setRotations(newRotations)
    setSpinCount(prev => prev + 1)
    
    // Change mantra every few spins
    if (spinCount % 3 === 0) {
      setCurrentMantra(prev => (prev + 1) % mantras.length)
    }

    onSpin?.(Math.floor(newRotations / 360))

    setTimeout(() => {
      setIsSpinning(false)
    }, 2000)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Prayer Wheel */}
      <motion.div
        style={{ rotate: smoothRotation }}
        className="relative cursor-pointer"
        onClick={handleSpin}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="w-32 h-32 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full border-4 border-maroon-700 shadow-lg relative overflow-hidden">
          {/* Decorative patterns */}
          <div className="absolute inset-2 border-2 border-maroon-600 rounded-full">
            <div className="absolute inset-2 border border-maroon-500 rounded-full">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-maroon-800 text-2xl font-bold">ॐ</span>
              </div>
            </div>
          </div>
          
          {/* Handle */}
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-6 h-12 bg-amber-700 rounded-r-lg shadow-md" />
        </div>
      </motion.div>

      {/* Mantra Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMantra}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-4 text-center"
        >
          <p className="text-lg font-semibold text-maroon-700 font-cormorant">
            {mantras[currentMantra]}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Spins: {Math.floor(rotations / 360)}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Spinning indicator */}
      {isSpinning && (
        <div className="absolute -inset-4 border-2 border-gold-300 rounded-full animate-pulse" />
      )}
    </div>
  )
}

// Virtual Offering System
interface VirtualOfferingProps {
  onOffer?: (offering: string) => void
  className?: string
}

export function VirtualOfferingSystem({ onOffer, className = "" }: VirtualOfferingProps) {
  const [selectedOffering, setSelectedOffering] = useState<string | null>(null)
  const [isOffering, setIsOffering] = useState(false)
  const [offerings, setOfferings] = useState<Array<{ id: number; type: string; x: number; y: number }>>([])

  const offeringTypes = [
    { emoji: "🌸", name: "Flowers", color: "text-pink-500" },
    { emoji: "🍎", name: "Fruits", color: "text-red-500" },
    { emoji: "🕯️", name: "Lamp", color: "text-yellow-500" },
    { emoji: "🌿", name: "Leaves", color: "text-green-500" },
    { emoji: "🥥", name: "Coconut", color: "text-amber-600" },
    { emoji: "🍯", name: "Honey", color: "text-yellow-600" }
  ]

  const handleDragStart = (offeringType: string) => {
    setSelectedOffering(offeringType)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!selectedOffering) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newOffering = {
      id: Date.now(),
      type: selectedOffering,
      x,
      y
    }

    setOfferings(prev => [...prev, newOffering])
    setIsOffering(true)
    onOffer?.(selectedOffering)

    // Remove offering after animation
    setTimeout(() => {
      setOfferings(prev => prev.filter(o => o.id !== newOffering.id))
      setIsOffering(false)
    }, 3000)

    setSelectedOffering(null)
  }

  return (
    <div className={`${className}`}>
      {/* Offering Items */}
      <div className="flex flex-wrap gap-4 mb-6">
        {offeringTypes.map((offering) => (
          <motion.div
            key={offering.name}
            draggable
            onDragStart={() => handleDragStart(offering.name)}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2, zIndex: 50 }}
            className="cursor-grab active:cursor-grabbing"
          >
            <div className="bg-white p-3 rounded-lg shadow-md border-2 border-gray-200 text-center min-w-[80px]">
              <div className="text-2xl mb-1">{offering.emoji}</div>
              <p className={`text-xs font-medium ${offering.color}`}>
                {offering.name}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drop Zone (Deity/Altar) */}
      <div
        className="relative w-64 h-48 bg-gradient-to-br from-maroon-700 to-maroon-900 rounded-lg border-4 border-gold-400 flex items-center justify-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="text-center text-white">
          <div className="text-6xl mb-2">🕉️</div>
          <p className="text-sm font-medium">Drop offerings here</p>
        </div>

        {/* Animated Offerings */}
        <AnimatePresence>
          {offerings.map((offering) => (
            <motion.div
              key={offering.id}
              initial={{ scale: 0, x: offering.x, y: offering.y }}
              animate={{ 
                scale: [1, 1.5, 0],
                y: offering.y - 50,
                opacity: [1, 1, 0]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3 }}
              className="absolute pointer-events-none"
            >
              <span className="text-2xl">
                {offeringTypes.find(o => o.name === offering.type)?.emoji}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Blessing Effect */}
        {isOffering && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 border-4 border-gold-300 rounded-lg pointer-events-none"
          />
        )}
      </div>
    </div>
  )
}

// Breathing Meditation Guide
export function BreathingMeditationGuide({ 
  isActive = false,
  onComplete,
  duration = 60 
}: { 
  isActive?: boolean
  onComplete?: () => void
  duration?: number 
}) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'rest'>('inhale')
  const [timeLeft, setTimeLeft] = useState(duration)
  const [cycleCount, setCycleCount] = useState(0)

  useEffect(() => {
    if (!isActive) return

    const phaseTimings = {
      inhale: 4,
      hold: 4,
      exhale: 6,
      rest: 2
    }

    let phaseTimer: NodeJS.Timeout
    let mainTimer: NodeJS.Timeout

    const cyclePhases = () => {
      const phases: Array<'inhale' | 'hold' | 'exhale' | 'rest'> = ['inhale', 'hold', 'exhale', 'rest']
      let currentPhaseIndex = 0

      const nextPhase = () => {
        setPhase(phases[currentPhaseIndex])
        const timing = phaseTimings[phases[currentPhaseIndex]] * 1000
        
        phaseTimer = setTimeout(() => {
          currentPhaseIndex = (currentPhaseIndex + 1) % phases.length
          if (currentPhaseIndex === 0) {
            setCycleCount(prev => prev + 1)
          }
          nextPhase()
        }, timing)
      }

      nextPhase()
    }

    cyclePhases()

    mainTimer = setTimeout(() => {
      onComplete?.()
    }, duration * 1000)

    const countdown = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      clearTimeout(phaseTimer)
      clearTimeout(mainTimer)
      clearInterval(countdown)
    }
  }, [isActive, duration, onComplete])

  if (!isActive) return null

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In'
      case 'hold': return 'Hold'
      case 'exhale': return 'Breathe Out'
      case 'rest': return 'Rest'
    }
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600'
      case 'hold': return 'from-purple-400 to-purple-600'
      case 'exhale': return 'from-green-400 to-green-600'
      case 'rest': return 'from-gray-400 to-gray-600'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center text-white">
        {/* Breathing Circle */}
        <motion.div
          animate={{
            scale: phase === 'inhale' ? 1.5 : phase === 'hold' ? 1.5 : 1,
          }}
          transition={{ duration: phase === 'inhale' ? 4 : phase === 'exhale' ? 6 : 0 }}
          className={`w-32 h-32 rounded-full bg-gradient-to-br ${getPhaseColor()} mx-auto mb-8 flex items-center justify-center`}
        >
          <span className="text-white text-lg font-semibold">ॐ</span>
        </motion.div>

        {/* Instructions */}
        <h3 className="text-2xl font-bold mb-4">{getPhaseInstruction()}</h3>
        
        {/* Stats */}
        <div className="space-y-2">
          <p className="text-lg">Cycles: {cycleCount}</p>
          <p className="text-lg">Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</p>
        </div>

        {/* Sanskrit Mantra */}
        <p className="mt-6 text-gold-300 italic">
          सो हम् - So Hum (I am that)
        </p>
      </div>
    </div>
  )
}

// Gesture Recognition for Touch Devices
export function TouchGestureRecognizer({ 
  onGesture,
  className = ""
}: { 
  onGesture?: (gesture: string) => void
  className?: string 
}) {
  const [gesture, setGesture] = useState<string | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStart.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.current.x
    const deltaY = touch.clientY - touchStart.current.y
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    if (distance < 50) {
      // Tap
      setGesture('tap')
      onGesture?.('blessing')
    } else if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0) {
        setGesture('swipe-right')
        onGesture?.('aarti')
      } else {
        setGesture('swipe-left')
        onGesture?.('offering')
      }
    } else {
      // Vertical swipe
      if (deltaY > 0) {
        setGesture('swipe-down')
        onGesture?.('prayer')
      } else {
        setGesture('swipe-up')
        onGesture?.('meditation')
      }
    }

    setTimeout(() => setGesture(null), 1000)
    touchStart.current = null
  }

  return (
    <div
      className={`${className} touch-action-none`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {gesture && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gold-500 text-white px-4 py-2 rounded-lg z-50"
        >
          Gesture: {gesture}
        </motion.div>
      )}
    </div>
  )
} 