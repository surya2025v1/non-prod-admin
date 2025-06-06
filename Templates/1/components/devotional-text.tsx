"use client"

import type React from "react"
import { motion } from "framer-motion"
import type { JSX } from "react"

interface DevotionalTextProps {
  children: React.ReactNode
  className?: string
  effect?: "shimmer" | "sacred" | "blessing" | "flame" | "om" | "decorated"
  delay?: number
  duration?: number
}

export function DevotionalText({
  children,
  className = "",
  effect = "sacred",
  delay = 0,
  duration = 0.5,
}: DevotionalTextProps) {
  const getEffectClass = () => {
    switch (effect) {
      case "shimmer":
        return "text-shimmer"
      case "sacred":
        return "text-sacred"
      case "blessing":
        return "blessing-text"
      case "flame":
        return "sacred-flame"
      case "om": // Redirect to another effect
        return "text-sacred"
      case "decorated":
        return "text-decorated"
      default:
        return "text-sacred"
    }
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration }}
      className={`${getEffectClass()} ${className}`}
    >
      {children}
    </motion.span>
  )
}

interface SanskritTextProps {
  children: React.ReactNode
  className?: string
  animate?: boolean
}

export function SanskritText({ children, className = "", animate = false }: SanskritTextProps) {
  return animate ? (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className={`text-sanskrit italic font-medium ${className}`}
    >
      {children}
    </motion.span>
  ) : (
    <span className={`text-sanskrit italic font-medium ${className}`}>{children}</span>
  )
}

interface DevotionalDividerProps {
  symbol?: "om" | "lotus" | "swastika" | "none"
  className?: string
}

export function DevotionalDivider({ symbol = "none", className = "" }: DevotionalDividerProps) {
  const getSymbol = () => {
    switch (symbol) {
      case "lotus":
        return "✾"
      case "swastika":
        return "卐"
      case "none":
      default:
        return ""
    }
  }

  return (
    <div className={`devotional-divider ${className}`}>
      {symbol !== "none" && (
        <>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4">
            {getSymbol()}
          </span>
        </>
      )}
    </div>
  )
}

interface AnimatedMandalaProps {
  className?: string
  size?: string
  color?: string
  speed?: "slow" | "medium" | "fast"
}

export function AnimatedMandala({
  className = "",
  size = "200px",
  color = "#c2410c",
  speed = "medium",
}: AnimatedMandalaProps) {
  const getAnimationDuration = () => {
    switch (speed) {
      case "slow":
        return "120s"
      case "medium":
        return "60s"
      case "fast":
        return "30s"
      default:
        return "60s"
    }
  }

  return (
    <div
      className={`absolute pointer-events-none opacity-10 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: `spin ${getAnimationDuration()} linear infinite`,
        }}
      >
        <g fill="none" stroke={color} strokeWidth="0.5">
          <circle cx="50" cy="50" r="45" />
          <circle cx="50" cy="50" r="40" />
          <circle cx="50" cy="50" r="35" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="25" />
          <circle cx="50" cy="50" r="20" />
          <circle cx="50" cy="50" r="15" />
          <path d="M5,50 h90 M50,5 v90 M14.6,14.6 L85.4,85.4 M14.6,85.4 L85.4,14.6" />
          <path d="M50,5 A45,45 0 0,1 95,50 A45,45 0 0,1 50,95 A45,45 0 0,1 5,50 A45,45 0 0,1 50,5 Z" />
          <path d="M50,10 A40,40 0 0,1 90,50 A40,40 0 0,1 50,90 A40,40 0 0,1 10,50 A40,40 0 0,1 50,10 Z" />
          <path d="M50,15 A35,35 0 0,1 85,50 A35,35 0 0,1 50,85 A35,35 0 0,1 15,50 A35,35 0 0,1 50,15 Z" />
          <path d="M50,20 A30,30 0 0,1 80,50 A30,30 0 0,1 50,80 A30,30 0 0,1 20,50 A30,30 0 0,1 50,20 Z" />
          <path d="M50,25 A25,25 0 0,1 75,50 A25,25 0 0,1 50,75 A25,25 0 0,1 25,50 A25,25 0 0,1 50,25 Z" />
        </g>
      </svg>
    </div>
  )
}

interface DevotionalCardProps {
  children: React.ReactNode
  className?: string
  hoverEffect?: boolean
}

export function DevotionalCard({ children, className = "", hoverEffect = true }: DevotionalCardProps) {
  return (
    <div
      className={`devotional-card bg-white rounded-lg shadow-md overflow-hidden ${
        hoverEffect ? "devotional-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  )
}

interface AnimatedTextRevealProps {
  text: string
  className?: string
  staggerChildren?: number
  delayStart?: number
}

export function AnimatedTextReveal({
  text,
  className = "",
  staggerChildren = 0.03,
  delayStart = 0,
}: AnimatedTextRevealProps) {
  const words = text.split(" ")

  return (
    <motion.div className={`inline-block ${className}`}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-2">
          {Array.from(word).map((char, charIndex) => (
            <motion.span
              key={`${wordIndex}-${charIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: delayStart + (wordIndex * words.length + charIndex) * staggerChildren,
                duration: 0.5,
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  )
}

interface DevotionalButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: "button" | "submit" | "reset"
}

export function DevotionalButton({ children, className = "", onClick, type = "button" }: DevotionalButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn-devotional inline-flex items-center justify-center ${className}`}
    >
      {children}
    </button>
  )
}

interface FloatingSymbolsProps {
  symbols?: string[]
  count?: number
  className?: string
}

export function FloatingSymbols({
  symbols = ["॥", "✾", "☸", "卐", "*", "✺"],
  count = 10,
  className = "",
}: FloatingSymbolsProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{
            opacity: 0.1 + Math.random() * 0.3,
            x: `${Math.random() * 100}%`,
            y: `${Math.random() * 100}%`,
            scale: 0.5 + Math.random() * 1,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            rotate: [Math.random() * 360, Math.random() * 360],
          }}
          transition={{
            duration: 30 + Math.random() * 60,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute text-maroon-700/20 text-xl"
        >
          {symbols[Math.floor(Math.random() * symbols.length)]}
        </motion.div>
      ))}
    </div>
  )
}

export function DevotionalHeading({ children, className = "", level = 2 }) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements

  return (
    <div className={`relative inline-block ${className}`}>
      <Tag className="devotional-heading relative z-10 text-maroon-700">{children}</Tag>
      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
      <div className="absolute -bottom-4 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
    </div>
  )
}
