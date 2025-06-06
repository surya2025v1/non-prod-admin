"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Calendar,
  Plus,
  Edit3,
  Trash2,
  Save,
  Eye,
  Clock,
  MapPin,
  Users,
  Star,
  Image,
  FileText,
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from "lucide-react"

export default function EventsEdit() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list") // list or calendar

  // Mock events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Diwali Celebration",
      type: "festival",
      date: "2024-11-12",
      time: "6:00 PM - 10:00 PM",
      location: "Main Temple Complex",
      description: "Grand Diwali celebration with traditional lighting ceremony, cultural programs, and feast",
      organizer: "Festival Committee",
      expectedAttendees: "500+",
      registrationRequired: true,
      status: "upcoming",
      priority: "high",
      image: "/placeholder.svg",
      lastUpdated: "1 day ago"
    },
    {
      id: 2,
      title: "Weekly Satsang",
      type: "regular",
      date: "2024-02-15",
      time: "7:00 PM - 8:30 PM",
      location: "Prayer Hall",
      description: "Weekly spiritual discourse and devotional singing",
      organizer: "Spiritual Committee",
      expectedAttendees: "100",
      registrationRequired: false,
      status: "recurring",
      priority: "medium",
      image: "/placeholder.svg",
      lastUpdated: "3 days ago"
    },
    {
      id: 3,
      title: "Yoga Workshop",
      type: "workshop",
      date: "2024-02-20",
      time: "8:00 AM - 12:00 PM",
      location: "Yoga Hall",
      description: "Introduction to spiritual yoga and meditation techniques",
      organizer: "Wellness Committee",
      expectedAttendees: "30",
      registrationRequired: true,
      status: "draft",
      priority: "low",
      image: "/placeholder.svg",
      lastUpdated: "5 days ago"
    },
    {
      id: 4,
      title: "Ram Navami Festival",
      type: "festival",
      date: "2024-04-17",
      time: "5:00 AM - 12:00 PM",
      location: "Main Temple",
      description: "Celebration of Lord Rama's birthday with special prayers and procession",
      organizer: "Festival Committee",
      expectedAttendees: "800+",
      registrationRequired: false,
      status: "planning",
      priority: "high",
      image: "/placeholder.svg",
      lastUpdated: "1 week ago"
    }
  ])

  const eventTypes = [
    { value: "all", label: "All Events" },
    { value: "festival", label: "Festivals" },
    { value: "regular", label: "Regular Events" },
    { value: "workshop", label: "Workshops" },
    { value: "special", label: "Special Occasions" }
  ]

  const statusFilters = [
    { value: "all", label: "All Status" },
    { value: "upcoming", label: "Upcoming" },
    { value: "recurring", label: "Recurring" },
    { value: "draft", label: "Draft" },
    { value: "planning", label: "Planning" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-100'
      case 'recurring': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-gray-600 bg-gray-100'
      case 'planning': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'festival': return 'text-pink-600 bg-pink-100'
      case 'regular': return 'text-purple-600 bg-purple-100'
      case 'workshop': return 'text-orange-600 bg-orange-100'
      case 'special': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Star className="h-4 w-4 text-red-500" />
      case 'medium': return <Star className="h-4 w-4 text-yellow-500" />
      case 'low': return <Star className="h-4 w-4 text-gray-400" />
      default: return <Star className="h-4 w-4 text-gray-400" />
    }
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || event.type === selectedFilter || event.status === selectedFilter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/website-edit"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Management</h1>
            <p className="text-gray-600 mt-1">Manage temple events, festivals, and special occasions</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1 rounded-md text-sm ${viewMode === "calendar" ? "bg-white shadow-sm" : ""}`}
            >
              Calendar
            </button>
          </div>
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
          <button className="px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors">
            <Plus className="h-4 w-4 inline mr-2" />
            Add Event
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-maroon-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.filter(e => e.status === 'upcoming').length}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expected Attendees</p>
              <p className="text-2xl font-bold text-gray-900">1.2K</p>
            </div>
            <Users className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              {[...eventTypes, ...statusFilters.slice(1)].map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Events List</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start space-x-6">
                {/* Event Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                </div>
                
                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{event.title}</h4>
                    {getPriorityIcon(event.priority)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Date & Time</p>
                        <p className="text-gray-600">{event.date}</p>
                        <p className="text-gray-600">{event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">{event.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Expected</p>
                        <p className="text-gray-600">{event.expectedAttendees}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Registration</p>
                        <p className="text-gray-600">{event.registrationRequired ? "Required" : "Open"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Organized by: <span className="font-medium">{event.organizer}</span> • 
                      Last updated: {event.lastUpdated}
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Add Festival Event</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Create Recurring Event</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Save className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Import Calendar</span>
          </button>
        </div>
      </div>
    </div>
  )
} 