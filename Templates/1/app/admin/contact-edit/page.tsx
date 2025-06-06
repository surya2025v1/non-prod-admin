"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Edit3,
  Save,
  Eye,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Users,
  MessageSquare,
  CheckCircle
} from "lucide-react"

export default function ContactEdit() {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Mock contact data
  const [contactData, setContactData] = useState({
    general: {
      templeName: "Sacred Hindu Temple",
      tagline: "Path to Spiritual Enlightenment",
      description: "Welcome to our sacred temple where tradition meets spirituality. We serve our community with devotion and provide a peaceful space for worship, learning, and cultural preservation.",
      established: "1985",
      registration: "REG/2024/TEMPLE/001"
    },
    address: {
      street: "123 Temple Street",
      city: "New Delhi",
      state: "Delhi",
      zipCode: "110001",
      country: "India",
      landmarks: "Near City Center Mall, Opposite Government Hospital"
    },
    contact: {
      primaryPhone: "+91 98765 43210",
      secondaryPhone: "+91 98765 43211",
      whatsapp: "+91 98765 43210",
      primaryEmail: "info@sacredtemple.org",
      donationEmail: "donations@sacredtemple.org",
      adminEmail: "admin@sacredtemple.org"
    },
    hours: {
      morningOpen: "05:00",
      morningClose: "12:00",
      eveningOpen: "16:00",
      eveningClose: "21:00",
      special: "Special occasions: 04:00 AM - 10:00 PM",
      closed: "Open all days"
    },
    social: {
      website: "https://www.sacredtemple.org",
      facebook: "https://facebook.com/sacredtemple",
      instagram: "https://instagram.com/sacredtemple",
      twitter: "https://twitter.com/sacredtemple",
      youtube: "https://youtube.com/sacredtemple"
    },
    emergency: {
      priest: "+91 98765 43215",
      security: "+91 98765 43216",
      medical: "+91 98765 43217"
    }
  })

  const tabs = [
    { id: "general", label: "General Info", icon: <Globe className="h-4 w-4" /> },
    { id: "address", label: "Address", icon: <MapPin className="h-4 w-4" /> },
    { id: "contact", label: "Contact Details", icon: <Phone className="h-4 w-4" /> },
    { id: "hours", label: "Operating Hours", icon: <Clock className="h-4 w-4" /> },
    { id: "social", label: "Social Media", icon: <MessageSquare className="h-4 w-4" /> },
    { id: "emergency", label: "Emergency", icon: <Users className="h-4 w-4" /> }
  ]

  const handleSave = () => {
    setIsEditing(false)
    // In real app, this would save to backend
    console.log("Contact data saved:", contactData)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast or notification
  }

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Temple Name</label>
          <input
            type="text"
            value={contactData.general.templeName}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              general: { ...prev.general, templeName: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
          <input
            type="text"
            value={contactData.general.tagline}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              general: { ...prev.general, tagline: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          rows={4}
          value={contactData.general.description}
          onChange={(e) => setContactData(prev => ({
            ...prev,
            general: { ...prev.general, description: e.target.value }
          }))}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
          <input
            type="text"
            value={contactData.general.established}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              general: { ...prev.general, established: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
          <input
            type="text"
            value={contactData.general.registration}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              general: { ...prev.general, registration: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  )

  const renderAddressTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
        <input
          type="text"
          value={contactData.address.street}
          onChange={(e) => setContactData(prev => ({
            ...prev,
            address: { ...prev.address, street: e.target.value }
          }))}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={contactData.address.city}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              address: { ...prev.address, city: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={contactData.address.state}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              address: { ...prev.address, state: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
          <input
            type="text"
            value={contactData.address.zipCode}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              address: { ...prev.address, zipCode: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
          <input
            type="text"
            value={contactData.address.country}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              address: { ...prev.address, country: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Landmarks</label>
        <input
          type="text"
          value={contactData.address.landmarks}
          onChange={(e) => setContactData(prev => ({
            ...prev,
            address: { ...prev.address, landmarks: e.target.value }
          }))}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
        />
      </div>
    </div>
  )

  const renderContactTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone</label>
          <div className="flex">
            <input
              type="tel"
              value={contactData.contact.primaryPhone}
              onChange={(e) => setContactData(prev => ({
                ...prev,
                contact: { ...prev.contact, primaryPhone: e.target.value }
              }))}
              disabled={!isEditing}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
            <button
              onClick={() => copyToClipboard(contactData.contact.primaryPhone)}
              className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 transition-colors"
            >
              <Copy className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
          <input
            type="tel"
            value={contactData.contact.secondaryPhone}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              contact: { ...prev.contact, secondaryPhone: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
          <input
            type="tel"
            value={contactData.contact.whatsapp}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              contact: { ...prev.contact, whatsapp: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email</label>
          <input
            type="email"
            value={contactData.contact.primaryEmail}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              contact: { ...prev.contact, primaryEmail: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Donations Email</label>
          <input
            type="email"
            value={contactData.contact.donationEmail}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              contact: { ...prev.contact, donationEmail: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
          <input
            type="email"
            value={contactData.contact.adminEmail}
            onChange={(e) => setContactData(prev => ({
              ...prev,
              contact: { ...prev.contact, adminEmail: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case "general": return renderGeneralTab()
      case "address": return renderAddressTab()
      case "contact": return renderContactTab()
      // Add other tabs as needed
      default: return renderGeneralTab()
    }
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Contact Information</h1>
            <p className="text-gray-600 mt-1">Manage temple contact details and information</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4 inline mr-2" />
            Preview
          </button>
          {isEditing ? (
            <div className="flex space-x-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
              >
                <Save className="h-4 w-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
            >
              <Edit3 className="h-4 w-4 inline mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Contact Methods</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
            <Phone className="h-8 w-8 text-maroon-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Social Platforms</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <MessageSquare className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Operating Hours</p>
              <p className="text-2xl font-bold text-gray-900">16h</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Updated</p>
              <p className="text-2xl font-bold text-gray-900">2d</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-maroon-500 text-maroon-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Plus className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Add New Contact Method</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <ExternalLink className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Test Contact Links</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Copy className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Export Contact Info</span>
          </button>
        </div>
      </div>
    </div>
  )
} 