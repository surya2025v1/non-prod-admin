"use client"

import { ImageSlider } from "@/components/image-slider"
import { CalendarView } from "@/components/calendar-view"
import Image from "next/image"
import { Calendar, Users, BookOpen, ArrowRight, Phone, Mail, MapPin } from "lucide-react"
import { TestimonialsSection } from "@/components/testimonials-section"

export default function Home() {
  // Sample images for the slider
  const images = [
    {
      url: "/placeholder.svg?height=600&width=1200",
      alt: "Temple main entrance",
    },
    {
      url: "/placeholder.svg?height=600&width=1200",
      alt: "Temple celebration",
    },
    {
      url: "/placeholder.svg?height=600&width=1200",
      alt: "Temple interior",
    },
    {
      url: "/placeholder.svg?height=600&width=1200",
      alt: "Temple festival",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      <div className="flex flex-col lg:flex-row">
        {/* Image Slider - 70% of screen on desktop, full width on mobile */}
        <div className="w-full lg:w-[70%]">
          <ImageSlider images={images} />
        </div>

        {/* Today's Activities - 30% of screen on desktop, full width on mobile */}
        <div className="w-full lg:w-[30%] bg-saffron-50 min-h-[400px] p-2">
          <div className="h-full">
            <CalendarView />
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Temple Background" fill className="object-cover" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            {/* Welcome Header */}
            <div className="inline-block mb-6">
              <div className="w-24 h-1 bg-gold-400 mx-auto mb-2"></div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-gold-gradient">
                Welcome to Our Sacred Temple
              </h1>
              <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
            </div>

            <p className="text-lg md:text-xl text-gold-200 mb-4 font-sanskrit">
              सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
            </p>
            <p className="text-sm md:text-base text-gold-300 mb-8 italic">
              "May all beings be happy, may all beings be free from illness"
            </p>

            <p className="text-base md:text-xl leading-relaxed mb-8 text-white/90">
              Our temple is a sacred space dedicated to spiritual growth, community service, and preserving
              Hindu traditions. We welcome devotees from all walks of life to join us in prayer and celebration.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-gold-500 hover:bg-gold-600 text-maroon-900 px-6 py-4 text-lg font-medium rounded-lg group flex items-center transition-colors">
                Explore Our Temple
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="bg-transparent border-2 border-gold-400 text-gold-300 hover:bg-gold-400 hover:text-maroon-900 px-6 py-4 text-lg font-medium rounded-lg transition-colors">
                Visit Us Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="container py-12 md:py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-white px-8 py-4 rounded-lg shadow-md border-b-4 border-maroon-700 mb-8">
            <h2 className="text-3xl font-bold text-maroon-700">
              Our Services & Events
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto bg-white/80 p-4 rounded-lg shadow-sm">
            Discover the various services, events, and activities our temple offers to the community.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {/* Daily Pujas Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Daily Pujas"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Daily Pujas</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gold-600 mb-4">
                <Calendar className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Morning & Evening Ceremonies</span>
              </div>
              <p className="text-gray-700 mb-6">
                Join our daily rituals to seek divine blessings and spiritual guidance. Our experienced priests perform
                traditional ceremonies following ancient Vedic traditions.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Morning Aarti: 6:00 AM</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Noon Aarti: 12:00 PM</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Evening Aarti: 6:30 PM</span>
                </div>
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white py-3 px-4 rounded-lg group transition-colors">
                View All Ceremonies
                <ArrowRight className="ml-2 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Community Services Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Community Services"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Community Services</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gold-600 mb-4">
                <Users className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Serving Our Community</span>
              </div>
              <p className="text-gray-700 mb-6">
                We offer various community services focused on education, cultural preservation, and humanitarian aid.
                Our temple serves as a center for community growth and support.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Free Food Distribution (Sundays)</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Health Camps (Monthly)</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Youth Mentoring Programs</span>
                </div>
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white py-3 px-4 rounded-lg group transition-colors">
                Join Our Services
                <ArrowRight className="ml-2 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Spiritual Learning Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Spiritual Learning"
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maroon-900/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">Spiritual Learning</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center text-gold-600 mb-4">
                <BookOpen className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Ancient Wisdom & Modern Practice</span>
              </div>
              <p className="text-gray-700 mb-6">
                Deepen your spiritual understanding through our comprehensive learning programs, from ancient
                Sanskrit texts to modern meditation practices.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Sanskrit Classes (Weekends)</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Meditation Workshops</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-maroon-700 mr-2"></div>
                  <span>Spiritual Discussion Groups</span>
                </div>
              </div>
              <button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white py-3 px-4 rounded-lg group transition-colors">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4 inline transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Temple Information Section */}
      <section className="py-16 bg-gradient-to-br from-saffron-50 to-gold-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-maroon-700">
              Visit Our Temple
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              We welcome all devotees to experience the divine peace and spiritual growth at our sacred temple
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Temple Hours */}
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-maroon-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-maroon-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-maroon-700">Temple Hours</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Daily:</strong> 5:00 AM - 9:00 PM</p>
                <p><strong>Special Events:</strong> Extended Hours</p>
                <p><strong>Festivals:</strong> Open All Day</p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-maroon-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-maroon-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-maroon-700">Contact Us</h3>
              <div className="space-y-2 text-gray-700">
                <p><Phone className="h-4 w-4 inline mr-2" />+1 (555) 123-4567</p>
                <p><Mail className="h-4 w-4 inline mr-2" />info@temple.org</p>
                <p><MapPin className="h-4 w-4 inline mr-2" />123 Temple Street</p>
              </div>
            </div>

            {/* Location */}
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
              <div className="w-16 h-16 bg-maroon-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-maroon-700" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-maroon-700">Find Us</h3>
              <div className="space-y-2 text-gray-700">
                <p>123 Temple Street</p>
                <p>Sacred City, SC 12345</p>
                <p>Free Parking Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />
    </main>
  )
}
