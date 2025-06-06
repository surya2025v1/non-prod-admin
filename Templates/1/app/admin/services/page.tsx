"use client"

import { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move, 
  Eye, 
  EyeOff,
  Save,
  X,
  Calendar,
  Users,
  BookOpen,
  Settings as SettingsIcon
} from "lucide-react"
import Image from "next/image"

interface ServiceCard {
  id: number
  card_title: string
  card_subtitle: string
  description: string
  image_url: string
  icon_name: string
  features: string[]
  button_text: string
  button_link: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface ServicesHeader {
  id: number
  main_title: string
  subtitle: string
  is_active: boolean
}

export default function ServicesManagement() {
  const [servicesHeader, setServicesHeader] = useState<ServicesHeader>({
    id: 1,
    main_title: "Our Services & Events",
    subtitle: "Discover the various services, events, and activities our temple offers to the community.",
    is_active: true
  })

  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([
    {
      id: 1,
      card_title: "Daily Pujas",
      card_subtitle: "Morning & Evening Ceremonies",
      description: "Join our daily rituals to seek divine blessings and spiritual guidance. Our experienced priests perform traditional ceremonies following ancient Vedic traditions.",
      image_url: "/placeholder.svg?height=400&width=600",
      icon_name: "Calendar",
      features: ["Morning Aarti: 6:00 AM", "Noon Aarti: 12:00 PM", "Evening Aarti: 6:30 PM"],
      button_text: "View All Ceremonies",
      button_link: "/ceremonies",
      display_order: 1,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    },
    {
      id: 2,
      card_title: "Community Services",
      card_subtitle: "Serving Our Community",
      description: "We offer various community services focused on education, cultural preservation, and humanitarian aid. Our temple serves as a center for community growth and support.",
      image_url: "/placeholder.svg?height=400&width=600",
      icon_name: "Users",
      features: ["Free Food Distribution (Sundays)", "Health Camps (Monthly)", "Youth Mentoring Programs"],
      button_text: "Join Our Services",
      button_link: "/services",
      display_order: 2,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    },
    {
      id: 3,
      card_title: "Spiritual Learning",
      card_subtitle: "Ancient Wisdom & Modern Practice",
      description: "Deepen your spiritual understanding through our comprehensive learning programs, from ancient Sanskrit texts to modern meditation practices.",
      image_url: "/placeholder.svg?height=400&width=600",
      icon_name: "BookOpen",
      features: ["Sanskrit Classes (Weekends)", "Meditation Workshops", "Spiritual Discussion Groups"],
      button_text: "Start Learning",
      button_link: "/education",
      display_order: 3,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<ServiceCard | null>(null)
  const [editingHeader, setEditingHeader] = useState(false)
  const [formData, setFormData] = useState({
    card_title: "",
    card_subtitle: "",
    description: "",
    image_url: "",
    icon_name: "Calendar",
    features: [""],
    button_text: "",
    button_link: "",
    is_active: true
  })

  const iconOptions = [
    { name: "Calendar", component: Calendar },
    { name: "Users", component: Users },
    { name: "BookOpen", component: BookOpen },
    { name: "Settings", component: SettingsIcon }
  ]

  const handleEdit = (card: ServiceCard) => {
    setEditingCard(card)
    setFormData({
      card_title: card.card_title,
      card_subtitle: card.card_subtitle,
      description: card.description,
      image_url: card.image_url,
      icon_name: card.icon_name,
      features: [...card.features],
      button_text: card.button_text,
      button_link: card.button_link,
      is_active: card.is_active
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this service card?")) {
      setServiceCards(prev => prev.filter(card => card.id !== id))
    }
  }

  const toggleActive = (id: number) => {
    setServiceCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, is_active: !card.is_active } : card
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCard) {
      // Update existing card
      setServiceCards(prev => 
        prev.map(card => 
          card.id === editingCard.id 
            ? { 
                ...card, 
                ...formData, 
                updated_at: new Date().toISOString() 
              }
            : card
        )
      )
    } else {
      // Add new card
      const newCard: ServiceCard = {
        id: Math.max(...serviceCards.map(card => card.id)) + 1,
        ...formData,
        display_order: serviceCards.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setServiceCards(prev => [...prev, newCard])
    }

    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCard(null)
    setFormData({
      card_title: "",
      card_subtitle: "",
      description: "",
      image_url: "",
      icon_name: "Calendar",
      features: [""],
      button_text: "",
      button_link: "",
      is_active: true
    })
  }

  const moveCard = (id: number, direction: 'up' | 'down') => {
    setServiceCards(prev => {
      const cards = [...prev]
      const currentIndex = cards.findIndex(card => card.id === id)
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      if (newIndex >= 0 && newIndex < cards.length) {
        [cards[currentIndex], cards[newIndex]] = [cards[newIndex], cards[currentIndex]]
        
        // Update display_order
        cards.forEach((card, index) => {
          card.display_order = index + 1
        })
      }
      
      return cards
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const saveHeader = () => {
    console.log("Saving services header:", servicesHeader)
    setEditingHeader(false)
  }

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(opt => opt.name === iconName)
    return icon ? icon.component : Calendar
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Services Management</h1>
          <p className="mt-2 text-gray-600">
            Manage the services section header and service cards displayed on the homepage.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Service Card
        </button>
      </div>

      {/* Services Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Section Header</h3>
          <button
            onClick={() => setEditingHeader(!editingHeader)}
            className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            <Edit className="h-4 w-4 mr-1" />
            {editingHeader ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingHeader ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Main Title
              </label>
              <input
                type="text"
                value={servicesHeader.main_title}
                onChange={(e) => setServicesHeader(prev => ({ ...prev, main_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle
              </label>
              <textarea
                value={servicesHeader.subtitle}
                onChange={(e) => setServicesHeader(prev => ({ ...prev, subtitle: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <button
              onClick={saveHeader}
              className="flex items-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Header
            </button>
          </div>
        ) : (
          <div>
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{servicesHeader.main_title}</h4>
            <p className="text-gray-600">{servicesHeader.subtitle}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCard ? 'Edit Service Card' : 'Add New Service Card'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    value={formData.card_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, card_title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.card_subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, card_subtitle: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.icon_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  >
                    {iconOptions.map(option => (
                      <option key={option.name} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                        placeholder="Feature description"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="px-3 py-2 text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-sm text-maroon-600 hover:text-maroon-700"
                  >
                    + Add Feature
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="/page-url or #section"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {editingCard ? 'Update' : 'Add'} Service Card
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Cards List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Service Cards ({serviceCards.filter(card => card.is_active).length} active)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {serviceCards.map((card, index) => {
            const IconComponent = getIconComponent(card.icon_name)
            
            return (
              <div key={card.id} className="p-6 flex items-start space-x-4">
                {/* Card Preview */}
                <div className="flex-shrink-0 w-32 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={card.image_url}
                    alt={card.card_title}
                    width={128}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className="h-5 w-5 text-maroon-600" />
                    <h4 className="text-lg font-medium text-gray-900">{card.card_title}</h4>
                    {card.is_active ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{card.card_subtitle}</p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">{card.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Order: {card.display_order}</span>
                    <span>Features: {card.features.length}</span>
                    <span>Button: {card.button_text}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* Move buttons */}
                  <button
                    onClick={() => moveCard(card.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Move className="h-4 w-4 rotate-180" />
                  </button>
                  <button
                    onClick={() => moveCard(card.id, 'down')}
                    disabled={index === serviceCards.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Move className="h-4 w-4" />
                  </button>

                  {/* Toggle active */}
                  <button
                    onClick={() => toggleActive(card.id)}
                    className={`p-1 ${card.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    {card.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => handleEdit(card)}
                    className="p-1 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          Tips for Service Cards:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Use clear, descriptive titles that explain the service</li>
          <li>Keep descriptions concise but informative</li>
          <li>Add specific features to make services more appealing</li>
          <li>Use high-quality images that represent each service</li>
          <li>Ensure button links lead to relevant pages</li>
          <li>Only active cards will be displayed on the website</li>
        </ul>
      </div>
    </div>
  )
} 