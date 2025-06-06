"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Calendar, Users, Heart, ExternalLink, Building, Info, ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function ContactPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Enhanced board members with more details
  const boardMembers = [
    {
      name: "Dr. Rajesh Sharma",
      position: "President",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Leading our temple community for 15+ years with dedication to spiritual growth and community service.",
      experience: "15+ Years",
      specialization: "Community Leadership"
    },
    {
      name: "Mrs. Lakshmi Patel",
      position: "Vice President", 
      image: "/placeholder.svg?height=200&width=200",
      bio: "Oversees cultural programs and educational initiatives, fostering spiritual learning for all ages.",
      experience: "12+ Years",
      specialization: "Cultural Programs"
    },
    {
      name: "Mr. Anand Gupta",
      position: "Secretary",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Manages administrative affairs and community outreach programs with exceptional organizational skills.",
      experience: "8+ Years",
      specialization: "Administration"
    },
    {
      name: "Mrs. Priya Iyer",
      position: "Treasurer",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Handles financial matters and fundraising activities with transparency and fiscal responsibility.",
      experience: "10+ Years",
      specialization: "Finance & Operations"
    },
    {
      name: "Dr. Venkat Rao",
      position: "Religious Affairs",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Coordinates religious ceremonies and spiritual activities, ensuring authentic traditional practices.",
      experience: "20+ Years",
      specialization: "Religious Ceremonies"
    },
    {
      name: "Mrs. Sunita Desai",
      position: "Cultural Director",
      image: "/placeholder.svg?height=200&width=200",
      bio: "Organizes cultural events and festivals throughout the year, preserving our rich heritage.",
      experience: "14+ Years",
      specialization: "Cultural Events"
    },
  ]

  const departments = [
    {
      name: "Religious Services",
      phone: "(123) 456-7891",
      email: "religious@temple.org",
      description: "Puja bookings, ceremonies"
    },
    {
      name: "Events",
      phone: "(123) 456-7893",
      email: "events@temple.org", 
      description: "Weddings, celebrations"
    },
    {
      name: "Education",
      phone: "(123) 456-7892", 
      email: "education@temple.org",
      description: "Classes, workshops"
    },
  ]

  const itemsPerSlide = 3
  const totalSlides = Math.ceil(boardMembers.length / itemsPerSlide)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <main>
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Temple Background" fill className="object-cover" />
        </div>
        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="w-20 h-0.5 bg-gold-400 mx-auto mb-2"></div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gold-gradient">Connect With Us</h1>
              <div className="w-20 h-0.5 bg-gold-400 mx-auto"></div>
            </div>
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-white/90 max-w-3xl mx-auto">
              Your spiritual home awaits. Reach out to us for worship, guidance, celebrations, or simply to connect with our divine community.
            </p>
            <div className="text-base md:text-lg text-gold-200 font-sanskrit">
              सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
            </div>
            <p className="text-sm md:text-base text-gold-300 mt-1 italic">
              "May all beings be happy, may all beings be free from illness"
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12 px-4">
        {/* Mobile-First Essential Contact Info */}
        <div className="lg:hidden mb-8">
          {/* Emergency Contact - Most Important */}
          <Card className="p-5 mb-6 bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-xl">
            <h3 className="text-xl font-bold text-red-700 mb-3">🚨 Emergency Contact</h3>
            <a href="tel:(123) 456-7899" className="text-red-800 font-semibold text-2xl block">(123) 456-7899</a>
            <p className="text-base text-red-600 mt-1">Available 24/7</p>
          </Card>

          {/* Essential Contact Cards */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Main Phone */}
            <Card className="p-5 bg-white border border-maroon-200 shadow-xl">
              <div className="flex items-center">
                <div className="p-4 bg-maroon-100 rounded-full mr-5">
                  <Phone className="h-7 w-7 text-maroon-700" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-maroon-700">Call Us</h3>
                  <a href="tel:(123) 456-7890" className="text-2xl font-semibold text-gray-900 block">(123) 456-7890</a>
                  <p className="text-base text-gray-600">Main temple line</p>
                </div>
              </div>
            </Card>

            {/* Address */}
            <Card className="p-5 bg-white border border-maroon-200 shadow-xl">
              <div className="flex items-start">
                <div className="p-4 bg-maroon-100 rounded-full mr-5 mt-1">
                  <MapPin className="h-7 w-7 text-maroon-700" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-maroon-700">Visit Us</h3>
                  <p className="text-gray-700 text-base leading-relaxed">
                    123 Temple Street<br />
                    Anytown, ST 12345
                  </p>
                  <Button variant="outline" size="sm" className="mt-3 text-sm text-maroon-700 border-maroon-300">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </Card>

            {/* Temple Hours */}
            <Card className="p-5 bg-white border border-maroon-200 shadow-xl">
              <div className="flex items-start">
                <div className="p-4 bg-maroon-100 rounded-full mr-5">
                  <Clock className="h-7 w-7 text-maroon-700" />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-xl text-maroon-700 mb-4">Temple Hours</h3>
                  <div className="bg-gradient-to-r from-saffron-50 to-gold-50 p-4 rounded-xl border border-gold-200 mb-4">
                    <h4 className="font-semibold text-maroon-700 mb-3 text-base">Daily Aarti</h4>
                    <div className="space-y-2 text-base">
                      <p><span className="font-medium">Morning:</span> 6:00 AM</p>
                      <p><span className="font-medium">Noon:</span> 12:00 PM</p>
                      <p><span className="font-medium">Evening:</span> 6:30 PM</p>
                    </div>
                  </div>
                  <div className="text-base space-y-2">
                    <p><span className="font-medium">Weekdays:</span> 6AM-12PM, 4PM-8:30PM</p>
                    <p><span className="font-medium">Weekends:</span> 6:00 AM - 8:30 PM</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Email Contact */}
            <Card className="p-5 bg-white border border-maroon-200 shadow-xl">
              <div className="flex items-center">
                <div className="p-4 bg-maroon-100 rounded-full mr-5">
                  <Mail className="h-7 w-7 text-maroon-700" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-maroon-700">Email Us</h3>
                  <a href="mailto:info@hindutemple.org" className="text-maroon-600 font-medium text-lg block">info@hindutemple.org</a>
                  <p className="text-base text-gray-600">General inquiries</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions for Mobile */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Button className="h-20 bg-maroon-700 hover:bg-maroon-800 text-white flex-col text-base font-semibold">
              <Calendar className="h-6 w-6 mb-2" />
              Book Service
            </Button>
            <Button variant="outline" className="h-20 border-maroon-300 text-maroon-700 hover:bg-maroon-50 flex-col text-base font-semibold">
              <Users className="h-6 w-6 mb-2" />
              Join Us
            </Button>
            <Button variant="outline" className="h-20 border-gold-300 text-gold-700 hover:bg-gold-50 flex-col text-base font-semibold">
              <Heart className="h-6 w-6 mb-2" />
              Donate
            </Button>
          </div>

          {/* Department Contacts - Mobile Simplified */}
          <Card className="p-5 bg-white border border-gold-200 shadow-xl">
            <h3 className="font-bold text-xl text-maroon-700 mb-4">Department Contacts</h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                  <div>
                    <p className="font-semibold text-maroon-700 text-base">{dept.name}</p>
                    <p className="text-sm text-gray-600">{dept.description}</p>
                  </div>
                  <a href={`tel:${dept.phone}`} className="text-maroon-700 font-medium text-base">
                    {dept.phone}
                  </a>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Desktop Layout - Hidden on Mobile */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 mb-12">
          {/* Main Temple Information - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gold-200">
              <div className="flex items-center mb-8">
                <div className="p-3 bg-maroon-100 rounded-full mr-4">
                  <Building className="h-8 w-8 text-maroon-700" />
                </div>
                <h2 className="text-3xl font-bold text-maroon-700">Temple Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Address & Contact */}
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-maroon-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <MapPin className="h-6 w-6 text-maroon-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-maroon-700 mb-2">Address</h3>
                      <p className="text-gray-700 text-base leading-relaxed">
                        123 Temple Street<br />
                        Anytown, ST 12345<br />
                        United States
                      </p>
                      <Button variant="outline" size="sm" className="mt-3 text-sm text-maroon-700 border-maroon-300 hover:bg-maroon-50">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-maroon-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <Phone className="h-6 w-6 text-maroon-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-maroon-700 mb-2">Phone Numbers</h3>
                      <div className="space-y-2 text-base">
                        <p className="text-gray-700">
                          <span className="font-medium">Main:</span> (123) 456-7890
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Emergency:</span> (123) 456-7899
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Priest:</span> (123) 456-7891
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-maroon-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <Mail className="h-6 w-6 text-maroon-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-maroon-700 mb-2">Email</h3>
                      <div className="space-y-2 text-base">
                        <p className="text-gray-700">info@hindutemple.org</p>
                        <p className="text-gray-700">services@hindutemple.org</p>
                        <p className="text-gray-700">donations@hindutemple.org</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Temple Hours */}
                <div>
                  <div className="flex items-start">
                    <div className="bg-maroon-100 p-3 rounded-lg mr-4 flex-shrink-0">
                      <Clock className="h-6 w-6 text-maroon-700" />
                    </div>
                    <div className="w-full">
                      <h3 className="font-bold text-lg text-maroon-700 mb-4">Temple Hours</h3>
                      
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-saffron-50 to-gold-50 p-4 rounded-lg border border-gold-200">
                          <h4 className="font-semibold text-maroon-700 mb-3 text-base">Daily Aarti Times</h4>
                          <div className="space-y-1 text-sm">
                            <p className="text-gray-700"><span className="font-medium">Morning:</span> 6:00 AM</p>
                            <p className="text-gray-700"><span className="font-medium">Noon:</span> 12:00 PM</p>
                            <p className="text-gray-700"><span className="font-medium">Evening:</span> 6:30 PM</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-base">
                            <span className="font-medium text-gray-800">Mon-Fri</span>
                            <span className="text-gray-700 text-sm">6AM-12PM, 4PM-8:30PM</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg text-base">
                            <span className="font-medium text-gray-800">Weekends</span>
                            <span className="text-gray-700 text-sm">6:00 AM - 8:30 PM</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg border border-amber-200 text-base">
                            <span className="font-medium text-amber-800">Festivals</span>
                            <span className="text-amber-700 text-sm">Extended Hours</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <Info className="h-4 w-4 inline mr-2" />
                          <span className="font-medium">Note:</span> Special events may have extended hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Department Contacts */}
                <div>
                  <h3 className="font-bold text-lg text-maroon-700 mb-4">Department Contacts</h3>
                  <div className="space-y-4">
                    {departments.map((dept, index) => (
                      <div key={index} className="p-4 bg-white border border-gold-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
                        <h4 className="font-bold text-maroon-700 text-base mb-2">{dept.name}</h4>
                        <p className="text-gray-600 text-sm mb-3">{dept.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 text-maroon-600 mr-2" />
                            <span className="text-gray-800 text-sm">{dept.phone}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-maroon-600 mr-2" />
                            <span className="text-gray-700 text-sm">{dept.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar - Desktop Only */}
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-maroon-50 to-orange-50 border border-maroon-200 shadow-lg">
              <h3 className="text-xl font-bold text-maroon-700 mb-5 flex items-center">
                <Heart className="h-6 w-6 mr-3" />
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white text-base py-4 font-semibold">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book Service
                </Button>
                <Button variant="outline" className="w-full border-maroon-300 text-maroon-700 hover:bg-maroon-50 text-base py-4 font-semibold">
                  <Users className="h-5 w-5 mr-2" />
                  Join Community
                </Button>
                <Button variant="outline" className="w-full border-gold-300 text-gold-700 hover:bg-gold-50 text-base py-4 font-semibold">
                  <Heart className="h-5 w-5 mr-2" />
                  Make Donation
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-3">Emergency Contact</h3>
              <a href="tel:(123) 456-7899" className="text-blue-800 font-semibold text-lg block">(123) 456-7899</a>
              <p className="text-base text-blue-600 mt-2">Available 24/7 for spiritual emergencies and urgent temple matters</p>
            </Card>
          </div>
        </div>

        {/* Enhanced Horizontal Scrollable Team Leadership Section */}
        <div className="mb-8 md:mb-12">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-block bg-maroon-50 px-6 md:px-8 py-3 md:py-4 rounded-xl shadow-lg border-b-4 border-maroon-700 mb-4 md:mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-maroon-700">Temple Leadership</h2>
            </div>
            <p className="text-base md:text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Meet our dedicated temple leaders who guide our community with wisdom, devotion, and years of service.
            </p>
          </div>

          {/* Desktop/Tablet Horizontal Scroll */}
          <div className="hidden md:block relative">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-saffron-25 to-gold-25 p-6 md:p-8">
              
              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-2 border-maroon-200 hover:border-maroon-400 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ChevronLeft className="h-6 w-6 text-maroon-700 group-hover:text-maroon-800" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white border-2 border-maroon-200 hover:border-maroon-400 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <ChevronRight className="h-6 w-6 text-maroon-700 group-hover:text-maroon-800" />
              </button>

              {/* Cards Container */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="flex-shrink-0 w-full">
                      <div className="grid grid-cols-3 gap-6 px-4">
                        {boardMembers.slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide).map((member, index) => (
                          <Card key={index} className="bg-white border-2 border-gold-200 hover:border-maroon-300 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                            <div className="p-6 text-center">
                              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden mb-4 border-4 border-gold-300 shadow-lg group-hover:border-maroon-400 transition-colors duration-300">
                                <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                              </div>
                              <h3 className="font-bold text-lg md:text-xl text-maroon-700 mb-1">{member.name}</h3>
                              <p className="text-gold-600 font-semibold text-sm md:text-base mb-3">{member.position}</p>
                              <div className="space-y-2 mb-4">
                                <div className="inline-block bg-maroon-100 text-maroon-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                                  {member.experience}
                                </div>
                                <div className="inline-block bg-gold-100 text-gold-700 px-3 py-1 rounded-full text-xs md:text-sm font-medium ml-2">
                                  {member.specialization}
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex justify-center mt-8 space-x-3">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentSlide === index 
                        ? 'bg-maroon-700 scale-125' 
                        : 'bg-maroon-300 hover:bg-maroon-500'
                    }`}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="mt-4 bg-white/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-maroon-700 h-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Vertical Layout */}
          <div className="md:hidden space-y-4">
            {boardMembers.map((member, index) => (
              <Card key={index} className="bg-white border-2 border-gold-200 overflow-hidden shadow-lg">
                <div className="p-4 text-center">
                  <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-3 border-gold-300 shadow-lg">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-bold text-base text-maroon-700 mb-1">{member.name}</h3>
                  <p className="text-gold-600 font-semibold text-sm mb-2">{member.position}</p>
                  <div className="space-y-1 mb-3">
                    <div className="inline-block bg-maroon-100 text-maroon-700 px-2 py-1 rounded-full text-xs font-medium">
                      {member.experience}
                    </div>
                    <div className="inline-block bg-gold-100 text-gold-700 px-2 py-1 rounded-full text-xs font-medium ml-2">
                      {member.specialization}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Form - Enhanced Typography */}
        <div className="bg-gradient-to-r from-gold-50 to-saffron-50 p-6 md:p-8 rounded-2xl shadow-xl border border-gold-200">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-maroon-700 mb-3 md:mb-4">Send Us a Message</h2>
            <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Have a question, need spiritual guidance, or want to learn more about our services? We're here to help and connect with you.
            </p>
          </div>

          <form className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-lg border border-gold-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-maroon-700 text-base">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 transition-colors text-base text-gray-700 placeholder-gray-400"
                  placeholder="Your Full Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-maroon-700 text-base">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 transition-colors text-base text-gray-700 placeholder-gray-400"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div className="mb-4 md:mb-6">
              <label htmlFor="phone" className="block mb-2 font-semibold text-maroon-700 text-base">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 transition-colors text-base text-gray-700 placeholder-gray-400"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block mb-2 font-semibold text-maroon-700 text-base">
                Message *
              </label>
              <textarea
                id="message"
                rows={5}
                className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 transition-colors resize-none text-base text-gray-700 placeholder-gray-400"
                placeholder="Please share your message, questions, or how we can assist you..."
                required
              ></textarea>
            </div>

            <div className="text-center">
              <Button
                type="submit"
                className="w-full md:w-auto bg-maroon-700 hover:bg-maroon-800 text-white py-4 px-8 rounded-lg transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-xl"
                size="lg"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Message
              </Button>
              <p className="text-base text-gray-600 mt-4">
                We typically respond within 24 hours during business days
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
