"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Users,
  Filter,
  Search,
  CalendarDays,
  User,
  Phone,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
  Grid3X3,
  Calendar1,
  Mail
} from "lucide-react"

interface Activity {
  id: string
  time: string
  name: string
  description: string
  location: string
  priest: string
  attendees: string
  category: "puja" | "education" | "community" | "festival"
  date: string
  duration: number
  contactPhone?: string
  contactEmail?: string
  requirements?: string[]
  specialInstructions?: string
}

interface CalendarViewProps {
  activities?: Activity[]
}

export function CalendarView({ activities = [] }: CalendarViewProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false)
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null)
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [calendarView, setCalendarView] = useState<"week" | "month">("week")

  // Get current date for today's activities
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Enhanced sample activities data
  const sampleActivities: Activity[] = [
    {
      id: "1",
      time: "06:00 AM",
      name: "Morning Aarti",
      description: "Start your day with divine blessings through our morning aarti ceremony dedicated to Lord Ganesha. Experience the spiritual awakening as the temple bells ring and the sacred chants fill the air.",
      location: "Main Temple Hall",
      priest: "Pandit Ramesh Sharma",
      attendees: "Open to all devotees",
      category: "puja",
      date: new Date().toISOString().split('T')[0],
      duration: 45,
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "ramesh@temple.org",
      requirements: ["Remove shoes before entering", "Modest dress code required"],
      specialInstructions: "Please arrive 10 minutes early for seat arrangement"
    },
    {
      id: "2",
      time: "08:00 AM",
      name: "Abhishekam",
      description: "Sacred bathing ritual of the deity with milk, yogurt, honey, and other sacred offerings. This ancient ceremony purifies the mind and brings divine grace.",
      location: "Sanctum Sanctorum",
      priest: "Pandit Suresh Iyer",
      attendees: "Limited to 25 devotees",
      category: "puja",
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      contactPhone: "+1 (555) 123-4568",
      contactEmail: "suresh@temple.org",
      requirements: ["Pre-registration required", "Devotees must fast for 2 hours before"],
      specialInstructions: "Bring your own offering materials if desired"
    },
    {
      id: "3",
      time: "10:00 AM",
      name: "Bhajan Session",
      description: "Join our devotional singing session with traditional bhajans and kirtans. Led by experienced musicians, this session creates a divine atmosphere of peace and devotion.",
      location: "Community Hall",
      priest: "Mrs. Lakshmi Patel",
      attendees: "Open to all devotees",
      category: "community",
      date: new Date().toISOString().split('T')[0],
      duration: 90,
      contactPhone: "+1 (555) 123-4569",
      contactEmail: "lakshmi@temple.org",
      requirements: ["No prior singing experience needed"],
      specialInstructions: "Instruments available, or bring your own"
    },
    {
      id: "4",
      time: "12:00 PM",
      name: "Noon Aarti",
      description: "Midday prayer ceremony with special offerings to the deities. This peaceful ceremony helps center your mind during the day.",
      location: "Main Temple Hall",
      priest: "Pandit Vijay Kumar",
      attendees: "Open to all devotees",
      category: "puja",
      date: new Date().toISOString().split('T')[0],
      duration: 30,
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "vijay@temple.org",
      requirements: ["Modest dress code required"],
      specialInstructions: "Brief ceremony, perfect for lunch break visits"
    },
    {
      id: "5",
      time: "04:00 PM",
      name: "Vedic Classes",
      description: "Learn about ancient Vedic scriptures and their relevance in modern life. Dr. Anand Gupta will guide you through the profound wisdom of our ancestors.",
      location: "Education Center",
      priest: "Dr. Anand Gupta",
      attendees: "Registration required (Max 30)",
      category: "education",
      date: new Date().toISOString().split('T')[0],
      duration: 120,
      contactPhone: "+1 (555) 123-4570",
      contactEmail: "anand@temple.org",
      requirements: ["Notebook and pen required", "Basic Sanskrit knowledge helpful"],
      specialInstructions: "Books available for purchase at the center"
    },
    {
      id: "6",
      time: "06:30 PM",
      name: "Evening Aarti",
      description: "Evening prayer ceremony with lamps and special offerings. The most popular ceremony of the day, featuring beautiful lamp lighting and community prayers.",
      location: "Main Temple Hall",
      priest: "Pandit Ramesh Sharma",
      attendees: "Open to all devotees",
      category: "puja",
      date: new Date().toISOString().split('T')[0],
      duration: 45,
      contactPhone: "+1 (555) 123-4567",
      contactEmail: "ramesh@temple.org",
      requirements: ["Arrive early for good seating"],
      specialInstructions: "Photography allowed during this ceremony"
    },
    {
      id: "7",
      time: "08:00 PM",
      name: "Bhagavad Gita Discussion",
      description: "Interactive session discussing the teachings of Bhagavad Gita and their application in daily life. Join us for enlightening discussions and spiritual growth.",
      location: "Community Hall",
      priest: "Dr. Venkat Rao",
      attendees: "Open to all devotees",
      category: "education",
      date: new Date().toISOString().split('T')[0],
      duration: 90,
      contactPhone: "+1 (555) 123-4571",
      contactEmail: "venkat@temple.org",
      requirements: ["Open mind and willingness to learn"],
      specialInstructions: "Bring your own copy of Bhagavad Gita if available"
    }
  ]

  // Filter today's activities for the main view
  const todaysActivities = sampleActivities.filter(activity => 
    activity.date === new Date().toISOString().split('T')[0]
  )

  useEffect(() => {
    let filtered = sampleActivities

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(activity => activity.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredActivities(filtered)
  }, [selectedCategory, searchTerm])

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    setCurrentDate(newDate)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1))
    setCurrentDate(newDate)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "puja": return "bg-maroon-100 text-maroon-800 border-maroon-200"
      case "education": return "bg-blue-100 text-blue-800 border-blue-200"
      case "community": return "bg-green-100 text-green-800 border-green-200"
      case "festival": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryLightColor = (category: string) => {
    switch (category) {
      case "puja": return "bg-maroon-50 border-maroon-200"
      case "education": return "bg-blue-50 border-blue-200"
      case "community": return "bg-green-50 border-green-200"
      case "festival": return "bg-purple-50 border-purple-200"
      default: return "bg-gray-50 border-gray-200"
    }
  }

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity)
    setIsActivityModalOpen(true)
  }

  const toggleExpand = (index: number) => {
    if (expandedActivity === index) {
      setExpandedActivity(null)
    } else {
      setExpandedActivity(index)
    }
  }

  const formatDateHeader = () => {
    if (calendarView === "week") {
      const weekStart = new Date(currentDate)
      const weekEnd = new Date(currentDate)
      weekEnd.setDate(weekEnd.getDate() + 6)
      
      return `${weekStart.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric" 
      })} - ${weekEnd.toLocaleDateString("en-US", { 
        month: "short", 
        day: "numeric", 
        year: "numeric" 
      })}`
    } else {
      return currentDate.toLocaleDateString("en-US", { 
        month: "long", 
        year: "numeric" 
      })
    }
  }

  const renderWeekView = () => {
    const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
    const weekStart = new Date(currentDate)
    const days: Date[] = []

    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(day.getDate() + i)
      days.push(day)
    }

    return (
      <div className="h-full flex flex-col">
        {/* Week Header */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {weekDays.map((dayName, index) => (
            <div key={dayName} className="text-center">
              <div className="font-bold text-gray-700 text-sm mb-2">{dayName}</div>
              <div className={`text-2xl font-bold p-3 rounded-lg transition-colors ${
                days[index].toDateString() === new Date().toDateString()
                  ? "bg-maroon-700 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}>
                {days[index].getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Week Activities */}
        <div className="grid grid-cols-7 gap-4 flex-1">
          {days.map((day, dayIndex) => {
            const dayActivities = filteredActivities.filter(activity => 
              activity.date === day.toISOString().split('T')[0]
            )

            return (
              <div key={dayIndex} className="border border-gray-200 rounded-lg p-3 bg-white min-h-[300px]">
                {dayActivities.map((activity, actIndex) => (
                  <div
                    key={activity.id}
                    onClick={() => handleActivityClick(activity)}
                    className={`mb-2 p-3 rounded-lg cursor-pointer transition-all duration-200 border-l-4 hover:shadow-md ${getCategoryLightColor(activity.category)}`}
                  >
                    <div className="font-medium text-sm text-gray-900 mb-1">{activity.name}</div>
                    <div className="text-xs text-gray-600 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </div>
                    <Badge className={`${getCategoryColor(activity.category)} text-xs mt-1`}>
                      {activity.category}
                    </Badge>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderCalendarGrid = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const weeks: Date[][] = []
    const currentWeek: Date[] = []

    for (let day = new Date(startDate); day <= lastDay || currentWeek.length < 7; day.setDate(day.getDate() + 1)) {
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek])
        currentWeek.length = 0
      }
      currentWeek.push(new Date(day))
    }

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        const nextDay: Date = new Date(currentWeek[currentWeek.length - 1])
        nextDay.setDate(nextDay.getDate() + 1)
        currentWeek.push(nextDay)
      }
      weeks.push(currentWeek)
    }

    return (
      <div className="h-full flex flex-col">
        {/* Month Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center font-bold text-gray-700 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-rows-6 gap-2 flex-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIndex) => {
                const isCurrentMonth = day.getMonth() === month
                const isToday = day.toDateString() === new Date().toDateString()
                const dayActivities = filteredActivities.filter(activity => 
                  activity.date === day.toISOString().split('T')[0]
                )

                return (
                  <div
                    key={dayIndex}
                    className={`border rounded-lg p-2 min-h-[120px] transition-all duration-200 ${
                      isCurrentMonth ? "bg-white border-gray-200" : "bg-gray-50 border-gray-100"
                    } ${isToday ? "ring-2 ring-maroon-500 bg-maroon-50" : "hover:bg-gray-50"}`}
                    onMouseEnter={() => setHoveredDate(day.toISOString().split('T')[0])}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <div className={`text-sm font-bold mb-2 ${
                      isToday ? "text-maroon-700" : 
                      isCurrentMonth ? "text-gray-900" : "text-gray-400"
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    <div className="space-y-1">
                      {dayActivities.slice(0, 3).map((activity) => (
                        <div
                          key={activity.id}
                          onClick={() => handleActivityClick(activity)}
                          className={`text-xs p-1 rounded cursor-pointer transition-all duration-200 ${getCategoryLightColor(activity.category)} hover:shadow-sm`}
                        >
                          <div className="font-medium truncate">{activity.name}</div>
                          <div className="text-gray-600">{activity.time}</div>
                        </div>
                      ))}
                      {dayActivities.length > 3 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayActivities.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      {/* Today's Activities Header */}
      <div className="bg-gradient-to-r from-maroon-700 to-orange-700 text-white p-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1">Today's Activities</h3>
            <p className="text-maroon-100 text-sm">{formattedDate}</p>
          </div>
          <Button
            onClick={() => setIsCalendarOpen(true)}
            variant="secondary"
            size="sm"
            className="bg-white/20 text-white border-0 hover:bg-white/30 backdrop-blur-sm"
          >
            <CalendarDays className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Today's Activities List */}
      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {todaysActivities.map((activity, index) => (
            <div key={activity.id} className="border border-gold-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <div
                className="cursor-pointer"
                onClick={() => toggleExpand(index)}
              >
                <div className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(activity.category).split(' ')[0]}`}></div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-maroon-700">{activity.name}</p>
                      <Badge className={`${getCategoryColor(activity.category)} text-xs border-0`}>
                        {activity.category}
                      </Badge>
                    </div>
                    {expandedActivity === index ? (
                      <ChevronUp size={16} className="text-maroon-600 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={16} className="text-maroon-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>

              {expandedActivity === index && (
                <div className="px-3 pb-3 pt-0 bg-saffron-50">
                  <div className="border-t border-gold-200 pt-3 mt-1 text-sm">
                    <p className="text-gray-700 mb-3">{activity.description}</p>

                    <div className="grid grid-cols-1 gap-2 mt-3">
                      <div className="flex items-start">
                        <MapPin size={14} className="text-maroon-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{activity.location}</span>
                      </div>

                      <div className="flex items-start">
                        <Users size={14} className="text-maroon-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{activity.priest}</span>
                      </div>

                      <div className="flex items-start">
                        <User size={14} className="text-maroon-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{activity.attendees}</span>
                      </div>
                    </div>

                    <div className="flex items-center mt-3 flex-wrap gap-2">
                      <button
                        onClick={() => handleActivityClick(activity)}
                        className="bg-maroon-700 hover:bg-maroon-800 text-white text-xs py-2 px-3 rounded-full transition-colors flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Details
                      </button>
                      <button className="border border-gold-600 text-gold-700 hover:bg-gold-50 text-xs py-2 px-3 rounded-full transition-colors">
                        Add to Calendar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Professional Calendar Modal */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent 
          className="max-w-6xl max-h-[85vh] flex flex-col p-0 bg-white rounded-xl shadow-2xl border border-gray-200"
          hideCloseButton={true}
        >
          {/* Custom close button */}
          <div className="absolute right-4 top-4 z-10">
            <Button
              onClick={() => setIsCalendarOpen(false)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg shadow-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Header */}
          <div className="bg-gradient-to-r from-maroon-700 to-orange-700 text-white p-6 rounded-t-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Temple Calendar</h2>
                  <p className="text-maroon-100">Discover all temple activities and sacred events</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-6">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white/20 rounded-lg p-1 backdrop-blur-sm">
                <Button
                  variant={calendarView === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCalendarView("week")}
                  className={`rounded-md transition-all duration-200 text-sm px-3 py-2 ${
                    calendarView === "week" 
                      ? "bg-white text-maroon-700 shadow-sm" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Calendar1 className="h-4 w-4 mr-2" />
                  Week
                </Button>
                <Button
                  variant={calendarView === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCalendarView("month")}
                  className={`rounded-md transition-all duration-200 text-sm px-3 py-2 ${
                    calendarView === "month" 
                      ? "bg-white text-maroon-700 shadow-sm" 
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Month
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => calendarView === "week" ? navigateWeek("prev") : navigateMonth("prev")}
                  className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <div className="text-xl font-bold min-w-[200px] text-center">
                  {formatDateHeader()}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => calendarView === "week" ? navigateWeek("next") : navigateMonth("next")}
                  className="text-white hover:bg-white/20 h-10 w-10 p-0 rounded-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-white/60" />
                  <Input
                    placeholder="Search activities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 w-48 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:bg-white/30 focus:border-white/50 rounded-lg text-sm"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40 h-10 bg-white/20 border-white/30 text-white rounded-lg text-sm">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="puja">🕉️ Puja</SelectItem>
                    <SelectItem value="education">📚 Education</SelectItem>
                    <SelectItem value="community">🤝 Community</SelectItem>
                    <SelectItem value="festival">🎉 Festivals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Calendar Content - Fixed scrolling */}
          <div className="flex-1 p-6 bg-gradient-to-br from-gray-50 to-white overflow-y-auto">
            {calendarView === "week" ? renderWeekView() : renderCalendarGrid()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Activity Details Modal */}
      <Dialog open={isActivityModalOpen} onOpenChange={setIsActivityModalOpen}>
        <DialogContent 
          className="max-w-4xl max-h-[85vh] flex flex-col p-0 bg-white rounded-xl shadow-2xl border border-gray-200"
          hideCloseButton={true}
        >
          {selectedActivity && (
            <>
              {/* Custom close button */}
              <div className="absolute right-4 top-4 z-10">
                <Button
                  onClick={() => setIsActivityModalOpen(false)}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-9 w-9 p-0 rounded-lg shadow-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Header */}
              <div className={`flex-shrink-0 p-6 bg-gradient-to-r ${
                selectedActivity.category === 'puja' ? 'from-maroon-600 to-orange-600' :
                selectedActivity.category === 'education' ? 'from-blue-600 to-indigo-600' :
                selectedActivity.category === 'community' ? 'from-green-600 to-emerald-600' :
                'from-purple-600 to-pink-600'
              } text-white rounded-t-xl`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {selectedActivity.name}
                      </h2>
                      <div className="flex items-center gap-4 text-white/90">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{selectedActivity.time} ({selectedActivity.duration} min)</span>
                        </div>
                        <Badge className="bg-white/30 text-white border-0 px-3 py-1 text-sm font-medium backdrop-blur-sm rounded-lg">
                          {selectedActivity.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Description */}
                <div className="mb-6 bg-gradient-to-br from-gray-50 to-white p-5 rounded-lg border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3">About This Activity</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedActivity.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                      <div className="p-2 bg-maroon-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-maroon-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">Location</h5>
                        <p className="text-gray-700">{selectedActivity.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">Led by</h5>
                        <p className="text-gray-700">{selectedActivity.priest}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">Attendance</h5>
                        <p className="text-gray-700">{selectedActivity.attendees}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {selectedActivity.contactPhone && (
                      <div className="p-4 bg-gradient-to-br from-maroon-50 to-orange-50 rounded-lg border border-maroon-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-maroon-100 rounded-lg">
                            <Phone className="h-5 w-5 text-maroon-600" />
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-900 text-sm">Contact</h5>
                            <p className="text-gray-700 font-medium">{selectedActivity.contactPhone}</p>
                            {selectedActivity.contactEmail && (
                              <div className="flex items-center gap-1 mt-1">
                                <Mail className="h-4 w-4 text-gray-500" />
                                <p className="text-gray-600 text-sm">{selectedActivity.contactEmail}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedActivity.requirements && (
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h5 className="font-bold text-gray-900 mb-3 text-sm">Requirements</h5>
                        <ul className="space-y-2">
                          {selectedActivity.requirements.map((req, index) => (
                            <li key={index} className="text-gray-700 text-sm flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedActivity.specialInstructions && (
                      <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                        <h5 className="font-bold text-gray-900 mb-2 text-sm">Special Instructions</h5>
                        <p className="text-gray-700 text-sm leading-relaxed">{selectedActivity.specialInstructions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 border-t border-gray-200 bg-white p-6 rounded-b-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-maroon-600 to-maroon-700 hover:from-maroon-700 hover:to-maroon-800 text-white h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                    <Calendar className="h-4 w-4 mr-2" />
                    Add to My Calendar
                  </Button>
                  <Button variant="outline" className="flex-1 border-2 border-maroon-200 text-maroon-700 hover:bg-maroon-50 hover:border-maroon-300 h-12 font-semibold rounded-lg transition-all duration-200">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact for Details
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 