"use client"

import React, { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Bell, Play, Pause } from "lucide-react"

// Audio Context for managing spiritual sounds
const SpiritualAudioContext = createContext<{
  isAudioEnabled: boolean
  toggleAudio: () => void
  playSound: (type: string, options?: { loop?: boolean; volume?: number }) => void
  stopSound: (type: string) => void
  stopAllSounds: () => void
}>({
  isAudioEnabled: false,
  toggleAudio: () => {},
  playSound: () => {},
  stopSound: () => {},
  stopAllSounds: () => {}
})

// Audio Provider Component
export function SpiritualAudioProvider({ children }: { children: ReactNode }) {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})
  const audioContext = useRef<AudioContext | null>(null)

  useEffect(() => {
    // Initialize Web Audio API context
    if (typeof window !== 'undefined' && !audioContext.current) {
      audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    return () => {
      // Cleanup audio resources
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause()
        audio.remove()
      })
    }
  }, [])

  const createAudio = (frequency: number, type: 'sine' | 'triangle' | 'sawtooth' = 'sine', duration: number = 1000) => {
    if (!audioContext.current || !isAudioEnabled) return

    const oscillator = audioContext.current.createOscillator()
    const gainNode = audioContext.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.current.destination)
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime)
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.1, audioContext.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.current.currentTime + duration / 1000)
    
    oscillator.start(audioContext.current.currentTime)
    oscillator.stop(audioContext.current.currentTime + duration / 1000)
  }

  const createTempleBell = () => {
    if (!audioContext.current || !isAudioEnabled) return

    // Create a complex temple bell sound with multiple harmonics
    const fundamentalFreq = 400 // Base frequency for temple bell
    const harmonics = [1, 2.4, 3.8, 5.2, 6.8] // Bell-like harmonic series
    
    harmonics.forEach((harmonic, index) => {
      const oscillator = audioContext.current!.createOscillator()
      const gainNode = audioContext.current!.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.current!.destination)
      
      oscillator.frequency.setValueAtTime(fundamentalFreq * harmonic, audioContext.current!.currentTime)
      oscillator.type = 'sine'
      
      // Different volume levels for each harmonic
      const initialGain = 0.15 / (index + 1)
      gainNode.gain.setValueAtTime(initialGain, audioContext.current!.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current!.currentTime + 3)
      
      oscillator.start(audioContext.current!.currentTime)
      oscillator.stop(audioContext.current!.currentTime + 3)
    })
  }

  const createAartiBells = () => {
    if (!audioContext.current || !isAudioEnabled) return

    // Create multiple bell rings for Aarti ceremony
    const bellSequence = [
      { delay: 0, freq: 500 },
      { delay: 0.3, freq: 400 },
      { delay: 0.6, freq: 600 },
      { delay: 1.0, freq: 450 },
      { delay: 1.4, freq: 550 },
      { delay: 1.8, freq: 500 }
    ]

    bellSequence.forEach(({ delay, freq }) => {
      setTimeout(() => {
        if (!audioContext.current || !isAudioEnabled) return
        
        const oscillator = audioContext.current.createOscillator()
        const gainNode = audioContext.current.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.current.destination)
        
        oscillator.frequency.setValueAtTime(freq, audioContext.current.currentTime)
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0.2, audioContext.current.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.current.currentTime + 1.5)
        
        oscillator.start(audioContext.current.currentTime)
        oscillator.stop(audioContext.current.currentTime + 1.5)
      }, delay * 1000)
    })
  }

  const playSound = (type: string, options?: { loop?: boolean; volume?: number }) => {
    if (!isAudioEnabled) return

    switch (type) {
      case 'bell':
        createTempleBell()
        break
      case 'aarti':
        createAartiBells()
        break
      case 'om':
        createAudio(136.1, 'sine', 3000) // Om frequency
        break
      case 'mantra':
        createAudio(528, 'sine', 2000) // Love frequency
        break
      case 'temple-ambient':
        // Could be extended with recorded temple sounds
        createAudio(200, 'triangle', 5000)
        break
      default:
        createAudio(440, 'sine', 1000)
    }
  }

  const stopSound = (type: string) => {
    if (audioRefs.current[type]) {
      audioRefs.current[type].pause()
      audioRefs.current[type].currentTime = 0
    }
  }

  const stopAllSounds = () => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled)
    if (!isAudioEnabled && audioContext.current?.state === 'suspended') {
      audioContext.current.resume()
    }
  }

  return (
    <SpiritualAudioContext.Provider value={{
      isAudioEnabled,
      toggleAudio,
      playSound,
      stopSound,
      stopAllSounds
    }}>
      {children}
    </SpiritualAudioContext.Provider>
  )
}

// Hook to use spiritual audio
export function useSpiritualAudio() {
  return useContext(SpiritualAudioContext)
}

// Audio Controls Component
export function SpiritualAudioControls({ className = '' }: { className?: string }) {
  const { isAudioEnabled, toggleAudio } = useSpiritualAudio()

  return (
    <button
      onClick={toggleAudio}
      className={`p-3 rounded-full bg-gold-100 hover:bg-gold-200 transition-colors ${className}`}
      aria-label={isAudioEnabled ? "Disable spiritual audio" : "Enable spiritual audio"}
    >
      {isAudioEnabled ? (
        <Volume2 className="w-5 h-5 text-maroon-700" />
      ) : (
        <VolumeX className="w-5 h-5 text-gray-500" />
      )}
    </button>
  )
}

// Bell Animation Component
export function AnimatedTempleBell({ 
  onClick, 
  className = "",
  size = "w-12 h-12" 
}: { 
  onClick?: () => void
  className?: string
  size?: string 
}) {
  const [isRinging, setIsRinging] = useState(false)
  const { playSound } = useSpiritualAudio()

  const handleClick = () => {
    setIsRinging(true)
    playSound('bell')
    onClick?.()
    setTimeout(() => setIsRinging(false), 500)
  }

  return (
    <div 
      className={`${size} ${className} cursor-pointer transition-all duration-300 hover:scale-110 ${isRinging ? 'bell-ring' : ''}`}
      onClick={handleClick}
    >
      <div className="relative w-full h-full">
        {/* Bell Body */}
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-full border-2 border-yellow-700">
          {/* Bell Mouth */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-700 rounded-b-lg"></div>
          
          {/* Bell Top */}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-yellow-700 rounded-full"></div>
          
          {/* Decorative Pattern */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-1 bg-yellow-700 rounded-full opacity-60"></div>
          
          {/* Clapper */}
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-gray-700 rounded-full"></div>
        </div>
        
        {/* Sound Waves when ringing */}
        {isRinging && (
          <>
            <div className="absolute -top-2 -left-2 w-16 h-16 border-2 border-yellow-400 rounded-full animate-ping opacity-25"></div>
            <div className="absolute -top-1 -left-1 w-14 h-14 border border-yellow-500 rounded-full animate-ping opacity-50 animation-delay-150"></div>
          </>
        )}
      </div>
    </div>
  )
}

// Chanting Visualizer
export function ChantingVisualizer({ isActive = false }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(7)].map((_, i) => (
        <motion.div
          key={i}
          animate={isActive ? {
            scaleY: [1, 2, 1],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: 1,
            repeat: isActive ? Infinity : 0,
            delay: i * 0.1
          }}
          className="w-1 h-4 bg-gradient-to-t from-maroon-600 to-gold-400 rounded-full"
        />
      ))}
    </div>
  )
}

// Enhanced Aarti Flame Component  
interface AartiFlameProps {
  isLit?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export function AartiFlame({ isLit = true, size = 'medium', className = '' }: AartiFlameProps) {
  const sizeClasses = {
    small: 'w-8 h-10',
    medium: 'w-12 h-16',
    large: 'w-16 h-20'
  }

  const flameHeight = {
    small: 'h-6',
    medium: 'h-8', 
    large: 'h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex flex-col items-center`}>
      {/* Wick/Base */}
      <div className="w-2 h-4 bg-gradient-to-t from-amber-800 to-amber-600 rounded-sm mb-1"></div>
      
      {/* Flame */}
      {isLit && (
        <div className={`${flameHeight[size]} w-6 flame-dance relative`}>
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center bottom, #FF6B35 0%, #F7931E 30%, #FFD700 70%, #FFF8DC 100%)',
              filter: 'drop-shadow(0 0 12px rgba(255, 165, 0, 0.8))'
            }}
          />
          
          {/* Inner flame */}
          <div 
            className="absolute top-1 left-1/2 transform -translate-x-1/2 w-3 h-4 rounded-full"
            style={{
              background: 'radial-gradient(ellipse at center bottom, #FFD700 0%, #FFF8DC 70%)',
              opacity: 0.8
            }}
          />
        </div>
      )}
    </div>
  )
}

// Enhanced Audio Button with Spiritual Feedback
export function SpiritualActionButton({
  children,
  soundType = 'bell',
  className = "",
  ...props
}: {
  children: React.ReactNode
  soundType?: string
  className?: string
  [key: string]: any
}) {
  const { playSound, isAudioEnabled } = useSpiritualAudio()

  const handleClick = () => {
    if (isAudioEnabled && soundType) {
      playSound(soundType)
    }
    props.onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={`spiritual-button ${className} ${!isAudioEnabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      {...props}
    >
      {children}
    </button>
  )
} 