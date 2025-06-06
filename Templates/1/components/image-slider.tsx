"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import ImageComponent from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useScreenSize } from "@/components/responsive-utils"

interface Image {
  url: string
  alt: string
}

interface ImageSliderProps {
  images: Image[]
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const { isMobile } = useScreenSize()

  // Auto slide functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying, images.length])

  // Pause auto-play when user interacts with slider
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000) // Resume after 10 seconds
  }

  const goToPrevious = () => {
    pauseAutoPlay()
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    pauseAutoPlay()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left
      goToNext()
    }

    if (touchStart - touchEnd < -50) {
      // Swipe right
      goToPrevious()
    }
  }

  return (
    <div
      className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Image */}
      <div className="h-full w-full relative">
        <AnimatePresence mode="wait">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentIndex ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className={`absolute top-0 left-0 h-full w-full ${index === currentIndex ? "z-10" : "z-0"}`}
              style={{ display: index === currentIndex ? "block" : "none" }}
            >
              <ImageComponent
                src={image.url || "/placeholder.svg"}
                alt={image.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 70vw, 70vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Caption overlay with devotional styling */}
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="bg-maroon-900/60 backdrop-blur-sm p-3 md:p-4 rounded-lg max-w-xl mx-auto text-center border-t-2 border-gold-500"
                >
                  <h3 className="text-lg md:text-2xl font-bold mb-1 md:mb-2 devotional-heading text-gold-300">
                    {image.alt}
                  </h3>
                  <p className="text-sm md:text-base text-white/80">
                    Experience the divine atmosphere of our sacred temple
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation buttons with devotional styling - hidden on mobile, shown on hover for larger screens */}
      <div
        className={`${isMobile ? "hidden" : "opacity-0 hover:opacity-100 transition-opacity"} absolute inset-0 flex items-center justify-between px-4`}
      >
        <button
          onClick={goToPrevious}
          className="bg-maroon-800/50 p-2 rounded-full text-white hover:bg-maroon-700/70 transition-colors border border-gold-500/30 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="bg-maroon-800/50 p-2 rounded-full text-white hover:bg-maroon-700/70 transition-colors border border-gold-500/30 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Indicators with devotional styling */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              pauseAutoPlay()
            }}
            className={`w-2 md:w-3 h-2 md:h-3 rounded-full transition-all ${
              index === currentIndex
                ? "bg-gold-400 w-4 md:w-6 shadow-[0_0_10px_rgba(255,215,0,0.7)]"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
