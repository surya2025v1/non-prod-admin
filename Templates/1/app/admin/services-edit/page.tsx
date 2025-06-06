"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Save,
  Eye,
  Clock,
  MapPin,
  Users,
  Phone,
  Calendar,
  DollarSign,
  Search,
  Filter,
  MoreHorizontal
} from "lucide-react"

export default function ServicesEdit() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isAddingService, setIsAddingService] = useState(false)

  // Mock services data
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Daily Aarti",
      category: "regular",
      description: "Morning and evening prayer ceremonies with devotional songs",
      schedule: "6:00 AM - 7:00 AM, 7:00 PM - 8:00 PM",
      duration: "60 minutes",
      capacity: "100 people",
      donation: "₹51 - ₹501",
      priest: "Pandit Sharma",
      status: "active",
      location: "Main Temple Hall",
      lastUpdated: "2 hours ago"
    },
    {
      id: 2,
      name: "Wedding Ceremony",
      category: "special",
      description: "Traditional Hindu wedding ceremonies with full rituals",
      schedule: "By appointment",
      duration: "3-4 hours",
      capacity: "200 people",
      donation: "₹5,001 - ₹25,000",
      priest: "Pandit Gupta",
      status: "active",
      location: "Marriage Hall",
      lastUpdated: "1 day ago"
    },
    {
      id: 3,
      name: "Satyanarayan Puja",
      category: "festival",
      description: "Monthly puja for Lord Vishnu with prasadam distribution",
      schedule: "First Saturday of every month",
      duration: "2 hours",
      capacity: "150 people",
      donation: "₹501 - ₹2,101",
      priest: "Pandit Verma",
      status: "scheduled",
      location: "Main Temple Hall",
      lastUpdated: "3 days ago"
    },
    {
      id: 4,
      name: "Yoga Classes",
      category: "wellness",
      description: "Weekly yoga and meditation sessions for spiritual wellness",
      schedule: "Tuesday & Thursday 6:00 AM",
      duration: "90 minutes",
      capacity: "30 people",
      donation: "₹201 per session",
      priest: "Yoga Instructor Priya",
      status: "active",
      location: "Yoga Hall",
      lastUpdated: "5 days ago"
    }
  ])

  const categories = [
    { value: "all", label: "All Services" },
    { value: "regular", label: "Regular Services" },
    { value: "special", label: "Special Occasions" },
    { value: "festival", label: "Festival Services" },
    { value: "wellness", label: "Wellness Programs" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'scheduled': return 'text-blue-600 bg-blue-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'regular': return 'text-purple-600 bg-purple-100'
      case 'special': return 'text-orange-600 bg-orange-100'
      case 'festival': return 'text-pink-600 bg-pink-100'
      case 'wellness': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory
    return matchesSearch && matchesCategory
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
            <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
            <p className="text-gray-600 mt-1">Manage temple services, schedules, and offerings</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
          <button 
            onClick={() => setIsAddingService(true)}
            className="px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Service
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <Settings className="h-8 w-8 text-maroon-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Services</p>
              <p className="text-2xl font-bold text-gray-900">{services.filter(s => s.status === 'active').length}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <Filter className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Bookings</p>
              <p className="text-2xl font-bold text-gray-900">147</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
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
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredServices.length} of {services.length} services
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Services List</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredServices.map((service) => (
            <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{service.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Schedule</p>
                        <p className="text-gray-600">{service.schedule}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Capacity</p>
                        <p className="text-gray-600">{service.capacity}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Donation</p>
                        <p className="text-gray-600">{service.donation}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">{service.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Conducted by: <span className="font-medium">{service.priest}</span> • 
                      Last updated: {service.lastUpdated}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
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
            <span className="text-gray-600">Add Regular Service</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Schedule Special Event</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Save className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Save as Template</span>
          </button>
        </div>
      </div>
    </div>
  )
} 