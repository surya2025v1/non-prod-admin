"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, Star, Play, Eye, ArrowRight, Bell, Share2, Bookmark, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Enhanced upcoming events with more details
  const upcomingEvents = [
    {
      title: "Diwali Celebration 2025",
      date: "November 12, 2025",
      time: "6:00 PM - 10:00 PM",
      location: "Main Temple Hall",
      description: "Join us for a grand Diwali celebration featuring traditional lamps ceremony, spectacular fireworks display, captivating cultural performances, and blessed prasadam distribution.",
      image: "/placeholder.svg?height=300&width=500",
      category: "festival",
      attendees: "500+",
      featured: true,
      status: "upcoming"
    },
    {
      title: "Navratri Festival",
      date: "October 7-15, 2025",
      time: "6:00 PM - 9:00 PM Daily",
      location: "Temple Grounds",
      description: "Nine sacred nights of devotion to the Divine Mother with traditional garba dancing, dandiya raas, special pujas, and spiritual discourse sessions.",
      image: "/placeholder.svg?height=300&width=500",
      category: "festival",
      attendees: "300+",
      featured: true,
      status: "upcoming"
    },
    {
      title: "Ganesh Chaturthi",
      date: "September 2, 2025",
      time: "8:00 AM - 8:00 PM",
      location: "Main Temple",
      description: "Celebrate Lord Ganesha's auspicious birthday with elaborate abhishekam ceremonies, devotional bhajans, and enriching cultural programs.",
      image: "/placeholder.svg?height=300&width=500",
      category: "festival",
      attendees: "400+",
      featured: false,
      status: "upcoming"
    },
    {
      title: "Yoga & Meditation Retreat",
      date: "August 15-16, 2025",
      time: "7:00 AM - 5:00 PM",
      location: "Temple Meditation Hall",
      description: "Immersive weekend retreat focused on advanced yoga practices, deep meditation techniques, and spiritual awakening guided by experienced gurus.",
      image: "/placeholder.svg?height=300&width=500",
      category: "workshop",
      attendees: "50+",
      featured: false,
      status: "upcoming"
    },
    {
      title: "Sanskrit Learning Workshop",
      date: "July 20, 2025",
      time: "10:00 AM - 4:00 PM",
      location: "Education Center",
      description: "Learn the sacred language of Sanskrit with expert teachers. Perfect for beginners wanting to understand mantras and scriptures.",
      image: "/placeholder.svg?height=300&width=500",
      category: "workshop",
      attendees: "25+",
      featured: false,
      status: "upcoming"
    },
    {
      title: "Community Service Day",
      date: "June 15, 2025",
      time: "9:00 AM - 3:00 PM",
      location: "Community Center",
      description: "Join hands with fellow devotees in serving the community through food distribution, healthcare camps, and educational activities.",
      image: "/placeholder.svg?height=300&width=500",
      category: "community",
      attendees: "100+",
      featured: false,
      status: "upcoming"
    },
  ]

  // Enhanced live events
  const liveEvents = [
    {
      title: "Morning Aarti Live Stream",
      description: "Join our daily morning aarti live stream from the sacred main sanctum with traditional chanting and prayer rituals.",
      videoPlaceholder: "/placeholder.svg?height=300&width=500",
      viewers: "150+",
      isLive: true,
      duration: "30 mins"
    },
    {
      title: "Weekly Bhagavad Gita Discourse",
      description: "Enlightening live streaming of our weekly Bhagavad Gita discourse by our revered head priest with interactive Q&A sessions.",
      videoPlaceholder: "/placeholder.svg?height=300&width=500",
      viewers: "200+",
      isLive: true,
      duration: "90 mins"
    },
    {
      title: "Special Puja Ceremony",
      description: "Sacred live broadcast of special puja ceremonies from our temple with detailed explanations of rituals and their significance.",
      videoPlaceholder: "/placeholder.svg?height=300&width=500",
      viewers: "300+",
      isLive: false,
      duration: "60 mins"
    },
  ]

  const pastEvents = [
    { title: "Ram Navami Celebration 2025", date: "April 6, 2025", views: "1.2K", duration: "120 mins" },
    { title: "Holi Festival Celebration", date: "March 14, 2025", views: "2.1K", duration: "90 mins" },
    { title: "Maha Shivaratri Special", date: "February 26, 2025", views: "1.8K", duration: "180 mins" },
    { title: "Saraswati Puja 2025", date: "February 14, 2025", views: "950", duration: "75 mins" },
    { title: "Makar Sankranti Celebration", date: "January 14, 2025", views: "1.5K", duration: "100 mins" },
    { title: "New Year Blessing Ceremony", date: "January 1, 2025", views: "2.5K", duration: "45 mins" },
  ]

  const categories = [
    { id: "all", label: "All Events", count: upcomingEvents.length },
    { id: "festival", label: "Festivals", count: upcomingEvents.filter(e => e.category === "festival").length },
    { id: "workshop", label: "Workshops", count: upcomingEvents.filter(e => e.category === "workshop").length },
    { id: "community", label: "Community", count: upcomingEvents.filter(e => e.category === "community").length },
  ]

  const filteredEvents = selectedCategory === "all" 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === selectedCategory)

  return (
    <main>
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Temple Events Background" fill className="object-cover" />
        </div>
        <div className="container relative z-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4">
              <div className="w-20 h-0.5 bg-gold-400 mx-auto mb-2"></div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gold-gradient">Temple Events</h1>
              <div className="w-20 h-0.5 bg-gold-400 mx-auto"></div>
            </div>
            <p className="text-lg md:text-xl leading-relaxed mb-6 text-white/90 max-w-3xl mx-auto">
              Stay connected with our sacred community through live spiritual events, traditional celebrations, and enriching cultural programs.
            </p>
            <div className="text-base md:text-lg text-gold-200 font-sanskrit">
              सङ्गे शक्तिः सङ्गे आनन्दः
            </div>
            <p className="text-sm md:text-base text-gold-300 mt-1 italic">
              "In unity there is strength, in unity there is joy"
            </p>
          </div>
        </div>
      </div>

      <div className="container py-8 md:py-12 px-4">
        {/* Events Navigation Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
            <TabsList className="grid w-full md:w-auto grid-cols-2 h-12 bg-saffron-50 rounded-xl p-1 border border-gold-200 mb-4 md:mb-0">
              <TabsTrigger 
                value="upcoming" 
                className="data-[state=active]:bg-maroon-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all duration-300 h-10 text-base"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Upcoming Events
              </TabsTrigger>
              <TabsTrigger 
                value="live" 
                className="data-[state=active]:bg-maroon-700 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg font-semibold transition-all duration-300 h-10 text-base"
              >
                <Play className="h-4 w-4 mr-2" />
                Live Events
              </TabsTrigger>
            </TabsList>
            
            {/* Search and Filter - Desktop Only */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm" className="border-maroon-300 text-maroon-700 hover:bg-maroon-50">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {/* Upcoming Events Tab */}
          <TabsContent value="upcoming" className="mt-0">
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-maroon-700 text-white shadow-lg'
                        : 'bg-white border border-maroon-200 text-maroon-700 hover:bg-maroon-50'
                    }`}
                  >
                    {category.label}
                    <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-gold-100 text-gold-700">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured Events */}
            {selectedCategory === "all" && (
              <div className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-maroon-700 mb-6 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-gold-500" />
                  Featured Events
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {upcomingEvents.filter(event => event.featured).map((event, index) => (
                    <Card key={index} className="overflow-hidden border-2 border-gold-200 hover:border-maroon-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-gold-500 text-white px-3 py-1 text-sm font-semibold">
                            Featured
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors cursor-pointer">
                            <Bookmark className="h-4 w-4 text-maroon-700" />
                          </div>
                        </div>
                      </div>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-xl md:text-2xl text-maroon-700 group-hover:text-maroon-800 transition-colors">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="text-base text-gray-600 leading-relaxed">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3 pb-4">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="mr-3 h-5 w-5 text-maroon-600" />
                          <span className="font-medium">{event.date}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="mr-3 h-5 w-5 text-maroon-600" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="mr-3 h-5 w-5 text-maroon-600" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center text-gray-700">
                            <Users className="mr-2 h-4 w-4 text-gold-600" />
                            <span className="text-sm font-medium">{event.attendees} Expected</span>
                          </div>
                          <Badge variant="outline" className="border-maroon-200 text-maroon-700 capitalize">
                            {event.category}
                          </Badge>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white font-semibold py-3 group">
                          <Bell className="h-4 w-4 mr-2" />
                          Get Notified
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* All Events Grid */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-maroon-700 mb-6">
                {selectedCategory === "all" ? "All Upcoming Events" : `${categories.find(c => c.id === selectedCategory)?.label} Events`}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event, index) => (
                  <Card key={index} className="overflow-hidden border border-gold-200 hover:border-maroon-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors cursor-pointer">
                          <Share2 className="h-3 w-3 text-maroon-700" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-maroon-700 group-hover:text-maroon-800 transition-colors line-clamp-2">
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-sm text-gray-600 line-clamp-3">
                        {event.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-3">
                      <div className="flex items-center text-gray-700 text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-maroon-600" />
                        <span className="font-medium">{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-700 text-sm">
                        <Clock className="mr-2 h-4 w-4 text-maroon-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-gray-700">
                          <Users className="mr-1 h-3 w-3 text-gold-600" />
                          <span className="text-xs">{event.attendees}</span>
                        </div>
                        <Badge variant="outline" className="border-maroon-200 text-maroon-700 text-xs capitalize">
                          {event.category}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" className="w-full border-maroon-300 text-maroon-700 hover:bg-maroon-50 font-medium text-sm">
                        Learn More
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Live Events Tab */}
          <TabsContent value="live" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {liveEvents.map((event, index) => (
                <Card key={index} className="overflow-hidden border border-gold-200 hover:border-maroon-300 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={event.videoPlaceholder || "/placeholder.svg"}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4">
                        <Play className="h-8 w-8 text-maroon-700" />
                      </div>
                    </div>
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      {event.isLive ? (
                        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                          LIVE
                        </div>
                      ) : (
                        <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                          Offline
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/60 text-white px-2 py-1 rounded text-xs">
                        {event.duration}
                      </div>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center">
                      <Eye className="h-3 w-3 text-white mr-1" />
                      <span className="text-white text-xs font-medium">{event.viewers} watching</span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-maroon-700 group-hover:text-maroon-800 transition-colors">
                      {event.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {event.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <Button 
                      className={`w-full font-semibold transition-all duration-300 ${
                        event.isLive 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {event.isLive ? 'Watch Live' : 'Coming Soon'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Past Events Archive */}
            <div className="bg-gradient-to-r from-saffron-25 to-gold-25 p-6 md:p-8 rounded-2xl border border-gold-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-maroon-700 flex items-center">
                  <Star className="h-6 w-6 mr-3 text-gold-500" />
                  Past Event Recordings
                </h2>
                <Button variant="outline" className="border-maroon-300 text-maroon-700 hover:bg-maroon-50 font-medium">
                  View All Archive
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
              
              <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed">
                Missed a live event? Browse our comprehensive archive of past spiritual events, ceremonies, and cultural celebrations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastEvents.map((event, index) => (
                  <Card key={index} className="bg-white hover:bg-gray-50 border border-gold-200 hover:border-maroon-300 shadow-md hover:shadow-lg transition-all duration-300 group cursor-pointer">
                    <div className="relative aspect-video mb-3 overflow-hidden rounded-t-lg">
                      <Image
                        src={`/placeholder.svg?height=180&width=320`}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                          <Play className="h-5 w-5 text-maroon-700" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {event.duration}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-maroon-700 mb-2 group-hover:text-maroon-800 transition-colors">
                        {event.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>Recorded on {event.date}</span>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <span>{event.views} views</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
