"use client"

import React, { useState, useEffect, useRef, createContext, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, VolumeX, Eye, EyeOff, Mic, MicOff, Sun, Moon, Type, Accessibility } from "lucide-react"

// Accessibility Context
interface AccessibilityContextType {
  isHighContrast: boolean
  toggleHighContrast: () => void
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  setFontSize: (size: 'small' | 'medium' | 'large' | 'extra-large') => void
  isVoiceEnabled: boolean
  toggleVoice: () => void
  isScreenReaderMode: boolean
  toggleScreenReaderMode: () => void
  announce: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider')
  }
  return context
}

// Accessibility Provider
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false)
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large' | 'extra-large'>('medium')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [isScreenReaderMode, setIsScreenReaderMode] = useState(false)
  const announcementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Apply high contrast mode
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [isHighContrast])

  useEffect(() => {
    // Apply font size
    document.documentElement.setAttribute('data-font-size', fontSize)
  }, [fontSize])

  const toggleHighContrast = () => setIsHighContrast(!isHighContrast)
  const toggleVoice = () => setIsVoiceEnabled(!isVoiceEnabled)
  const toggleScreenReaderMode = () => setIsScreenReaderMode(!isScreenReaderMode)

  const announce = (message: string) => {
    if (announcementRef.current) {
      announcementRef.current.textContent = message
    }
    
    // Also use speech synthesis if voice is enabled
    if (isVoiceEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message)
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }

  const contextValue: AccessibilityContextType = {
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    isVoiceEnabled,
    toggleVoice,
    isScreenReaderMode,
    toggleScreenReaderMode,
    announce
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
      {/* Screen reader announcements */}
      <div
        ref={announcementRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
    </AccessibilityContext.Provider>
  )
}

// Accessibility Control Panel
export function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    isHighContrast,
    toggleHighContrast,
    fontSize,
    setFontSize,
    isVoiceEnabled,
    toggleVoice,
    isScreenReaderMode,
    toggleScreenReaderMode,
    announce
  } = useAccessibility()

  const handleToggle = (action: () => void, message: string) => {
    action()
    announce(message)
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="relative"
      >
        {/* Main Control Button */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center"
          aria-label="Open accessibility controls"
        >
          <Accessibility size={24} />
        </motion.button>

        {/* Expanded Controls */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl p-4 min-w-[280px] border-2 border-blue-200"
            >
              <h3 className="text-lg font-semibold text-blue-800 mb-4">Accessibility Options</h3>
              
              {/* High Contrast Toggle */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">High Contrast</label>
                <button
                  onClick={() => handleToggle(toggleHighContrast, 
                    isHighContrast ? 'High contrast disabled' : 'High contrast enabled'
                  )}
                  className={`w-12 h-6 rounded-full ${
                    isHighContrast ? 'bg-blue-600' : 'bg-gray-300'
                  } relative transition-colors`}
                  aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      isHighContrast ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Text Size</label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFontSize(size)
                        announce(`Text size set to ${size}`)
                      }}
                      className={`px-3 py-1 text-xs rounded ${
                        fontSize === size
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                      aria-label={`Set text size to ${size}`}
                    >
                      {size === 'extra-large' ? 'XL' : size.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Control */}
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-700">Voice Navigation</label>
                <button
                  onClick={() => handleToggle(toggleVoice,
                    isVoiceEnabled ? 'Voice navigation disabled' : 'Voice navigation enabled'
                  )}
                  className={`w-12 h-6 rounded-full ${
                    isVoiceEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  } relative transition-colors`}
                  aria-label={`${isVoiceEnabled ? 'Disable' : 'Enable'} voice navigation`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      isVoiceEnabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Screen Reader Mode */}
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Enhanced Screen Reader</label>
                <button
                  onClick={() => handleToggle(toggleScreenReaderMode,
                    isScreenReaderMode ? 'Screen reader mode disabled' : 'Screen reader mode enabled'
                  )}
                  className={`w-12 h-6 rounded-full ${
                    isScreenReaderMode ? 'bg-blue-600' : 'bg-gray-300'
                  } relative transition-colors`}
                  aria-label={`${isScreenReaderMode ? 'Disable' : 'Enable'} enhanced screen reader mode`}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${
                      isScreenReaderMode ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// Voice Navigation Component
export function VoiceNavigation() {
  const [isListening, setIsListening] = useState(false)
  const [command, setCommand] = useState<string>('')
  const { isVoiceEnabled, announce } = useAccessibility()
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    if (!isVoiceEnabled || typeof window === 'undefined') return

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    recognitionRef.current = new SpeechRecognition()
    const recognition = recognitionRef.current

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      announce('Voice navigation active. Say Om Gam for navigation commands.')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
        .toLowerCase()

      setCommand(transcript)

      // Process voice commands
      if (transcript.includes('om gam')) {
        if (transcript.includes('home')) {
          announce('Navigating to home')
          window.location.href = '/'
        } else if (transcript.includes('prayers') || transcript.includes('prayer')) {
          announce('Navigating to prayers section')
          // Scroll to prayers section or navigate
        } else if (transcript.includes('events')) {
          announce('Navigating to events')
          window.location.href = '/events'
        } else if (transcript.includes('contact')) {
          announce('Navigating to contact')
          window.location.href = '/contact'
        } else if (transcript.includes('stop listening')) {
          recognition.stop()
          announce('Voice navigation stopped')
        }
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    // Start listening
    recognition.start()

    return () => {
      recognition.stop()
    }
  }, [isVoiceEnabled, announce])

  if (!isVoiceEnabled) return null

  return (
    <div className="fixed top-6 right-6 z-40">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-4 border-2 border-blue-200 max-w-xs"
      >
        <div className="flex items-center gap-2 mb-2">
          {isListening ? (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Mic className="text-red-500" size={20} />
            </motion.div>
          ) : (
            <MicOff className="text-gray-400" size={20} />
          )}
          <span className="text-sm font-medium">
            {isListening ? 'Listening...' : 'Voice Navigation'}
          </span>
        </div>
        
        {command && (
          <p className="text-xs text-gray-600 mb-2">
            Heard: "{command}"
          </p>
        )}
        
        <div className="text-xs text-gray-500">
          <p>Say "Om Gam" followed by:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>"home" - Go to homepage</li>
            <li>"prayers" - View prayers</li>
            <li>"events" - View events</li>
            <li>"contact" - Contact page</li>
            <li>"stop listening" - Disable</li>
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

// Enhanced Focus Management
export function FocusManager({ children }: { children: React.ReactNode }) {
  const [focusedElement, setFocusedElement] = useState<string | null>(null)
  const { announce } = useAccessibility()

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      const target = e.target as HTMLElement
      if (target.getAttribute('aria-label')) {
        const label = target.getAttribute('aria-label')
        setFocusedElement(label)
        announce(`Focused on ${label}`)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content with Alt + M
      if (e.altKey && e.key === 'm') {
        e.preventDefault()
        const main = document.querySelector('main')
        if (main) {
          main.focus()
          announce('Skipped to main content')
        }
      }
      
      // Skip to navigation with Alt + N
      if (e.altKey && e.key === 'n') {
        e.preventDefault()
        const nav = document.querySelector('nav')
        if (nav) {
          nav.focus()
          announce('Skipped to navigation')
        }
      }
    }

    document.addEventListener('focus', handleFocus, true)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('focus', handleFocus, true)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [announce])

  return <>{children}</>
}

// Mobile-First Spiritual Interactions
export function MobileSpiritualGestures() {
  const [gestureInProgress, setGestureInProgress] = useState<string | null>(null)
  const { announce } = useAccessibility()
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStartRef.current.x
    const deltaY = touch.clientY - touchStartRef.current.y
    const deltaTime = Date.now() - touchStartRef.current.time
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Double tap for blessing
    if (deltaTime < 300 && distance < 50) {
      setGestureInProgress('blessing')
      announce('Blessing received. May you be blessed with peace.')
      setTimeout(() => setGestureInProgress(null), 2000)
    }
    // Long press for meditation
    else if (deltaTime > 1000 && distance < 50) {
      setGestureInProgress('meditation')
      announce('Entering meditation mode. Find your inner peace.')
      setTimeout(() => setGestureInProgress(null), 3000)
    }
    // Swipe gestures
    else if (distance > 100) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          setGestureInProgress('aarti')
          announce('Performing Aarti. Light spreads divine energy.')
        } else {
          setGestureInProgress('offering')
          announce('Making offering. Your devotion is received.')
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          setGestureInProgress('prayer')
          announce('Sending prayers. Your intentions reach the divine.')
        } else {
          setGestureInProgress('chant')
          announce('Chanting mantras. Om Namah Shivaya.')
        }
      }
      setTimeout(() => setGestureInProgress(null), 2000)
    }

    touchStartRef.current = null
  }

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  return (
    <AnimatePresence>
      {gestureInProgress && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pointer-events-none"
        >
          <div className="text-center text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-4"
            >
              {gestureInProgress === 'blessing' && <span className="text-6xl">🙏</span>}
              {gestureInProgress === 'meditation' && <span className="text-6xl">🧘</span>}
              {gestureInProgress === 'aarti' && <span className="text-6xl">🕯️</span>}
              {gestureInProgress === 'offering' && <span className="text-6xl">🌸</span>}
              {gestureInProgress === 'prayer' && <span className="text-6xl">📿</span>}
              {gestureInProgress === 'chant' && <span className="text-6xl">🕉️</span>}
            </motion.div>
            <h3 className="text-xl font-semibold capitalize">{gestureInProgress}</h3>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Skip Links for Accessibility
export function SkipLinks() {
  return (
    <div className="sr-only focus:not-sr-only">
      <a 
        href="#main-content"
        className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:relative"
      >
        Skip to main content
      </a>
      <a 
        href="#navigation"
        className="absolute top-0 left-0 bg-blue-600 text-white px-4 py-2 z-50 focus:relative"
      >
        Skip to navigation
      </a>
    </div>
  )
} 