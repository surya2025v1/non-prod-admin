"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function FloatingDiyas() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-gold-300"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
            scale: Math.random() * 0.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            y: [`${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
          }}
          transition={{
            duration: Math.random() * 60 + 60,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <div className="w-full h-full animate-pulse bg-gold-500 rounded-full blur-sm"></div>
        </motion.div>
      ))}
    </div>
  )
}

export function OmSymbol({ className = "" }: { className?: string }) {
  return (
    <div className={`text-maroon-700/10 ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
        {/* Replace the Om symbol with a decorative mandala design */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 5 L50 95 M5 50 L95 50 M15 15 L85 85 M15 85 L85 15" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  )
}

export function IncenseSmoke() {
  const particles = Array.from({ length: 50 }, (_, i) => i)

  return (
    <div className="absolute right-0 top-0 h-screen w-20 pointer-events-none overflow-hidden opacity-20">
      {particles.map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 right-10 w-1 h-1 rounded-full bg-gray-200"
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: "-100%",
            x: Math.sin(i) * 50,
            opacity: [0, 0.5, 0],
            scale: [0, 1, 2],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 0.2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

export function MandalaBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center opacity-5">
      <div className="w-[800px] h-[800px] animate-spin-slow">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-maroon-700">
          <path
            d="M50 0 L50 100 M0 50 L100 50 M14.64 14.64 L85.36 85.36 M14.64 85.36 L85.36 14.64"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path
            d="M50 2 A48 48 0 0 1 98 50 A48 48 0 0 1 50 98 A48 48 0 0 1 2 50 A48 48 0 0 1 50 2 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50 10 A40 40 0 0 1 90 50 A40 40 0 0 1 50 90 A40 40 0 0 1 10 50 A40 40 0 0 1 50 10 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50 18 A32 32 0 0 1 82 50 A32 32 0 0 1 50 82 A32 32 0 0 1 18 50 A32 32 0 0 1 50 18 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50 26 A24 24 0 0 1 74 50 A24 24 0 0 1 50 74 A24 24 0 0 1 26 50 A24 24 0 0 1 50 26 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50 34 A16 16 0 0 1 66 50 A16 16 0 0 1 50 66 A16 16 0 0 1 34 50 A16 16 0 0 1 50 34 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
          <path
            d="M50 42 A8 8 0 0 1 58 50 A8 8 0 0 1 50 58 A8 8 0 0 1 42 50 A8 8 0 0 1 50 42 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
          />
        </svg>
      </div>
    </div>
  )
}

export function FlowerPetals() {
  const [petals, setPetals] = useState<{ id: number; x: number; delay: number; duration: number; rotation: number }[]>(
    [],
  )

  useEffect(() => {
    const newPetals = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 15,
      rotation: Math.random() * 360,
    }))
    setPetals(newPetals)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-20">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute top-0"
          style={{ left: `${petal.x}%` }}
          initial={{ y: -20, rotate: petal.rotation }}
          animate={{
            y: "100vh",
            rotate: petal.rotation + 360,
            x: ["-10px", "10px", "-10px"],
          }}
          transition={{
            duration: petal.duration,
            repeat: Number.POSITIVE_INFINITY,
            delay: petal.delay,
            ease: "linear",
            x: {
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            },
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-maroon-300"
          >
            <path
              d="M10 0C7.5 0 5 5 5 10C5 15 7.5 20 10 20C12.5 20 15 15 15 10C15 5 12.5 0 10 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

export function DevotionalBorder({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative border-8 border-gold-100 rounded-lg p-6 bg-gradient-to-b from-saffron-50 to-white">
      <div className="absolute top-0 left-0 w-16 h-16 border-t-8 border-l-8 border-maroon-700 rounded-tl-lg -mt-8 -ml-8"></div>
      <div className="absolute top-0 right-0 w-16 h-16 border-t-8 border-r-8 border-maroon-700 rounded-tr-lg -mt-8 -mr-8"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-8 border-l-8 border-maroon-700 rounded-bl-lg -mb-8 -ml-8"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-8 border-r-8 border-maroon-700 rounded-br-lg -mb-8 -mr-8"></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4">
        <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-maroon-700">
          <path d="M20 0L40 20H0L20 0Z" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 -mb-4 rotate-180">
        <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-maroon-700">
          <path d="M20 0L40 20H0L20 0Z" />
        </svg>
      </div>

      <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 rotate-270">
        <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-maroon-700 rotate-90">
          <path d="M20 0L40 20H0L20 0Z" />
        </svg>
      </div>

      <div className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 rotate-90">
        <svg width="40" height="20" viewBox="0 0 40 20" fill="currentColor" className="text-maroon-700 -rotate-90">
          <path d="M20 0L40 20H0L20 0Z" />
        </svg>
      </div>

      {children}
    </div>
  )
}

export function GlowingText({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10 text-gold-gradient">{children}</span>
      <span className="absolute inset-0 bg-gold-300 opacity-20 blur-md rounded-full animate-pulse"></span>
    </span>
  )
}

export function KalashIcon({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M50,10 C40,10 30,15 30,25 C30,35 40,45 50,45 C60,45 70,35 70,25 C70,15 60,10 50,10 Z"
          fill="url(#goldGradient)"
        />
        <rect x="35" y="45" width="30" height="40" fill="url(#goldGradient)" />
        <ellipse cx="50" cy="85" rx="25" ry="5" fill="url(#goldGradient)" />
        <path d="M35,45 C35,55 65,55 65,45" fill="none" stroke="#FFF" strokeWidth="2" />
        <circle cx="50" cy="25" r="5" fill="#FFF" />
        <circle cx="40" cy="30" r="3" fill="#FFF" />
        <circle cx="60" cy="30" r="3" fill="#FFF" />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="25%" stopColor="#fcf6ba" />
            <stop offset="50%" stopColor="#b38728" />
            <stop offset="75%" stopColor="#fbf5b7" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// New animated bell effect
export function AnimatedBell() {
  return (
    <div className="fixed top-20 right-10 w-16 h-16 pointer-events-none z-0 opacity-20">
      <motion.svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-maroon-700"
        animate={{ rotate: [0, 15, -15, 10, -10, 5, -5, 0] }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 5,
        }}
      >
        <path
          d="M50,10 C45,10 40,15 40,20 L40,25 C30,30 25,40 25,60 L25,70 L75,70 L75,60 C75,40 70,30 60,25 L60,20 C60,15 55,10 50,10 Z"
          fill="currentColor"
        />
        <path d="M40,70 C40,80 60,80 60,70" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="50" cy="20" r="5" fill="currentColor" />
      </motion.svg>
    </div>
  )
}

// Sacred fire animation
export function SacredFire() {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none z-0 opacity-10">
      <div className="relative w-full h-full">
        <motion.div
          className="absolute bottom-0 left-1/4 right-1/4 h-1/2 bg-gradient-to-t from-orange-600 via-orange-500 to-yellow-400 rounded-t-full"
          animate={{
            height: ["50%", "60%", "50%", "55%", "50%"],
            width: ["50%", "45%", "50%", "48%", "50%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-[40%] left-[35%] right-[35%] h-[20%] bg-gradient-to-t from-yellow-400 via-yellow-300 to-white rounded-t-full blur-sm"
          animate={{
            height: ["20%", "25%", "20%", "22%", "20%"],
            width: ["30%", "28%", "30%", "29%", "30%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 0.5,
          }}
        />
      </div>
    </div>
  )
}

export function DevotionalEffects() {
  return (
    <>
      <MandalaBackground />
      <FloatingDiyas />
      <IncenseSmoke />
      <FlowerPetals />
      <AnimatedBell />
      <SacredFire />
    </>
  )
}
