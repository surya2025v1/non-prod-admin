"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Testimonial {
  id: number
  text: string
  name: string
  role: string
  fullText: string
}

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const testimonials: Testimonial[] = [
    {
      id: 1,
      text: "The peaceful atmosphere of this temple has been a source of great comfort to me. The priests are knowledgeable and the community is welcoming...",
      fullText:
        "The peaceful atmosphere of this temple has been a source of great comfort to me. The priests are knowledgeable and the community is welcoming. I've learned so much about our traditions here and feel spiritually connected every time I visit. The temple has become an integral part of my life's journey, providing guidance during both challenging and joyful times.",
      name: "Priya Sharma",
      role: "Temple Member for 5 years",
    },
    {
      id: 2,
      text: "I bring my children here to connect with our cultural roots. The educational programs and festival celebrations have helped them understand...",
      fullText:
        "I bring my children here to connect with our cultural roots. The educational programs and festival celebrations have helped them understand and appreciate our heritage. The youth programs are excellent and engage children in meaningful activities that teach them important values. The temple staff is always patient with children and creates a family-friendly environment that makes everyone feel welcome.",
      name: "Raj Patel",
      role: "Parent & Community Volunteer",
    },
    {
      id: 3,
      text: "The community services provided by this temple have made a real difference in my life. From spiritual guidance to practical support...",
      fullText:
        "The community services provided by this temple have made a real difference in my life. From spiritual guidance to practical support, they truly embody the values they teach. During difficult times, the temple community rallied around me and provided both emotional and practical assistance. The sense of belonging and support here is unmatched, and I'm grateful to be part of such a caring community.",
      name: "Anita Desai",
      role: "Senior Community Member",
    },
    {
      id: 4,
      text: "The festivals celebrated at this temple are authentic and vibrant. It feels like being back in India, with all the traditional rituals...",
      fullText:
        "The festivals celebrated at this temple are authentic and vibrant. It feels like being back in India, with all the traditional rituals and customs observed meticulously. The attention to detail in every ceremony is impressive, and the cultural programs showcase the rich heritage of Hinduism. These celebrations have helped me stay connected to my roots while living abroad and pass these traditions to the next generation.",
      name: "Vikram Mehta",
      role: "Cultural Committee Member",
    },
  ]

  // Calculate testimonials per page based on screen size
  const getTestimonialsPerPage = () => {
    if (window.innerWidth < 768) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const [testimonialsPerPage, setTestimonialsPerPage] = useState(3)
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage)

  // Update testimonials per page on resize
  useEffect(() => {
    const handleResize = () => {
      setTestimonialsPerPage(getTestimonialsPerPage())
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Get current testimonials
  const getCurrentTestimonials = () => {
    const start = currentPage * testimonialsPerPage
    const end = start + testimonialsPerPage
    return testimonials.slice(start, end)
  }

  // Auto-rotate pages when not paused
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentPage((prev) => (prev + 1) % totalPages)
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, totalPages])

  // Pause rotation when a testimonial is expanded
  useEffect(() => {
    if (activeIndex !== null) {
      setIsPaused(true)
    } else {
      setIsPaused(false)
    }
  }, [activeIndex])

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
    setIsPaused(true)
    setTimeout(() => setIsPaused(false), 10000) // Resume after 10 seconds
  }

  return (
    <section className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="container">
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-block bg-maroon-50 px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-md border-b-4 border-maroon-700 mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-maroon-700">
              Devotee Testimonials
            </h2>
          </div>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Hear from our community members about their experiences at our temple.
          </p>
        </div>

        <div className="relative px-4">
          {/* Expanded Testimonial Overlay */}
          <AnimatePresence>
            {activeIndex !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                onClick={() => setActiveIndex(null)}
              >
                <motion.div
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  exit={{ y: 50 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white max-w-2xl w-full rounded-xl shadow-2xl p-4 md:p-8 relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-maroon-700"
                    onClick={() => setActiveIndex(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>

                  <div className="text-4xl md:text-6xl text-gold-300 opacity-50 mb-4">"</div>
                  <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
                    {testimonials[activeIndex].fullText}
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-maroon-200 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-bold text-maroon-700">{testimonials[activeIndex].name}</h4>
                      <p className="text-sm text-gray-600">{testimonials[activeIndex].role}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Carousel Navigation */}
          <div className="flex justify-between items-center mb-6 md:mb-8">
            <button
              onClick={prevPage}
              className="bg-maroon-700 text-white p-2 rounded-full hover:bg-maroon-800 transition-colors"
              aria-label="Previous testimonials"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentPage === index ? 'bg-maroon-700' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial page ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextPage}
              className="bg-maroon-700 text-white p-2 rounded-full hover:bg-maroon-800 transition-colors"
              aria-label="Next testimonials"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="wait">
              {getCurrentTestimonials().map((testimonial, localIndex) => (
                <motion.div
                  key={`${currentPage}-${localIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: localIndex * 0.1 }}
                  className="bg-white rounded-lg shadow-lg p-6 border border-gold-200 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setActiveIndex(testimonial.id - 1)}
                >
                  <div className="text-3xl text-gold-300 opacity-50 mb-4">"</div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {testimonial.text}
                  </p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-maroon-200 rounded-full mr-3"></div>
                    <div>
                      <h4 className="font-bold text-maroon-700">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <span className="text-gold-600 text-sm hover:text-gold-700 transition-colors">
                      Read full testimonial →
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
