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
  Phone,
  MapPin,
  Clock
} from "lucide-react"

interface InfoCard {
  id: number
  card_type: 'hours' | 'contact' | 'location' | 'other'
  card_title: string
  icon_name: string
  content: Record<string, string>
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface TempleInfoHeader {
  id: number
  section_title: string
  section_subtitle: string
  is_active: boolean
}

export default function TempleInfoManagement() {
  const [templeInfoHeader, setTempleInfoHeader] = useState<TempleInfoHeader>({
    id: 1,
    section_title: "Visit Our Temple",
    section_subtitle: "We welcome all devotees to experience the divine peace and spiritual growth at our sacred temple",
    is_active: true
  })

  const [infoCards, setInfoCards] = useState<InfoCard[]>([
    {
      id: 1,
      card_type: 'hours',
      card_title: "Temple Hours",
      icon_name: "Calendar",
      content: {
        daily: "5:00 AM - 9:00 PM",
        special_events: "Extended Hours",
        festivals: "Open All Day"
      },
      display_order: 1,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    },
    {
      id: 2,
      card_type: 'contact',
      card_title: "Contact Us",
      icon_name: "Phone",
      content: {
        phone: "+1 (555) 123-4567",
        email: "info@temple.org",
        address: "123 Temple Street"
      },
      display_order: 2,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    },
    {
      id: 3,
      card_type: 'location',
      card_title: "Find Us",
      icon_name: "MapPin",
      content: {
        address: "123 Temple Street",
        city: "Sacred City, SC 12345",
        parking: "Free Parking Available"
      },
      display_order: 3,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<InfoCard | null>(null)
  const [editingHeader, setEditingHeader] = useState(false)
  const [formData, setFormData] = useState({
    card_type: 'other' as 'hours' | 'contact' | 'location' | 'other',
    card_title: "",
    icon_name: "Calendar",
    content: {} as Record<string, string>,
    is_active: true
  })

  const iconOptions = [
    { name: "Calendar", component: Calendar },
    { name: "Phone", component: Phone },
    { name: "MapPin", component: MapPin },
    { name: "Clock", component: Clock }
  ]

  const cardTypeTemplates = {
    hours: {
      title: "Temple Hours",
      icon: "Calendar",
      fields: ["daily", "special_events", "festivals"]
    },
    contact: {
      title: "Contact Us",
      icon: "Phone",
      fields: ["phone", "email", "address"]
    },
    location: {
      title: "Find Us",
      icon: "MapPin",
      fields: ["address", "city", "parking"]
    },
    other: {
      title: "Custom Info",
      icon: "Calendar",
      fields: ["info1", "info2", "info3"]
    }
  }

  const handleEdit = (card: InfoCard) => {
    setEditingCard(card)
    setFormData({
      card_type: card.card_type,
      card_title: card.card_title,
      icon_name: card.icon_name,
      content: { ...card.content },
      is_active: card.is_active
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this info card?")) {
      setInfoCards(prev => prev.filter(card => card.id !== id))
    }
  }

  const toggleActive = (id: number) => {
    setInfoCards(prev => 
      prev.map(card => 
        card.id === id ? { ...card, is_active: !card.is_active } : card
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCard) {
      // Update existing card
      setInfoCards(prev => 
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
      const newCard: InfoCard = {
        id: Math.max(...infoCards.map(card => card.id)) + 1,
        ...formData,
        display_order: infoCards.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setInfoCards(prev => [...prev, newCard])
    }

    resetForm()
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingCard(null)
    setFormData({
      card_type: 'other',
      card_title: "",
      icon_name: "Calendar",
      content: {},
      is_active: true
    })
  }

  const moveCard = (id: number, direction: 'up' | 'down') => {
    setInfoCards(prev => {
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

  const saveHeader = () => {
    console.log("Saving temple info header:", templeInfoHeader)
    setEditingHeader(false)
  }

  const getIconComponent = (iconName: string) => {
    const icon = iconOptions.find(opt => opt.name === iconName)
    return icon ? icon.component : Calendar
  }

  const handleCardTypeChange = (cardType: 'hours' | 'contact' | 'location' | 'other') => {
    const template = cardTypeTemplates[cardType]
    setFormData(prev => ({
      ...prev,
      card_type: cardType,
      card_title: template.title,
      icon_name: template.icon,
      content: template.fields.reduce((acc, field) => {
        acc[field] = prev.content[field] || ""
        return acc
      }, {} as Record<string, string>)
    }))
  }

  const handleContentChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [key]: value }
    }))
  }

  const addContentField = () => {
    const newKey = `custom_${Object.keys(formData.content).length + 1}`
    setFormData(prev => ({
      ...prev,
      content: { ...prev.content, [newKey]: "" }
    }))
  }

  const removeContentField = (key: string) => {
    setFormData(prev => ({
      ...prev,
      content: Object.fromEntries(
        Object.entries(prev.content).filter(([k]) => k !== key)
      )
    }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Temple Info Management</h1>
          <p className="mt-2 text-gray-600">
            Manage the temple information section including hours, contact details, and location info.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Info Card
        </button>
      </div>

      {/* Temple Info Header Section */}
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
                Section Title
              </label>
              <input
                type="text"
                value={templeInfoHeader.section_title}
                onChange={(e) => setTempleInfoHeader(prev => ({ ...prev, section_title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Section Subtitle
              </label>
              <textarea
                value={templeInfoHeader.section_subtitle}
                onChange={(e) => setTempleInfoHeader(prev => ({ ...prev, section_subtitle: e.target.value }))}
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
            <h4 className="text-xl font-semibold text-gray-900 mb-2">{templeInfoHeader.section_title}</h4>
            <p className="text-gray-600">{templeInfoHeader.section_subtitle}</p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingCard ? 'Edit Info Card' : 'Add New Info Card'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Card Type
                  </label>
                  <select
                    value={formData.card_type}
                    onChange={(e) => handleCardTypeChange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  >
                    <option value="hours">Temple Hours</option>
                    <option value="contact">Contact Information</option>
                    <option value="location">Location & Directions</option>
                    <option value="other">Custom Information</option>
                  </select>
                </div>

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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Content Fields
                  </label>
                  <button
                    type="button"
                    onClick={addContentField}
                    className="text-sm text-maroon-600 hover:text-maroon-700"
                  >
                    + Add Field
                  </button>
                </div>
                <div className="space-y-3">
                  {Object.entries(formData.content).map(([key, value]) => (
                    <div key={key} className="flex space-x-2">
                      <input
                        type="text"
                        value={key}
                        onChange={(e) => {
                          const newKey = e.target.value
                          const newContent = { ...formData.content }
                          delete newContent[key]
                          newContent[newKey] = value
                          setFormData(prev => ({ ...prev, content: newContent }))
                        }}
                        className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                        placeholder="Field name"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleContentChange(key, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                        placeholder="Field value"
                      />
                      <button
                        type="button"
                        onClick={() => removeContentField(key)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
                  {editingCard ? 'Update' : 'Add'} Info Card
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

      {/* Info Cards List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Info Cards ({infoCards.filter(card => card.is_active).length} active)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {infoCards.map((card, index) => {
            const IconComponent = getIconComponent(card.icon_name)
            
            return (
              <div key={card.id} className="p-6 flex items-start space-x-4">
                {/* Card Preview */}
                <div className="flex-shrink-0 w-16 h-16 bg-maroon-100 rounded-lg flex items-center justify-center">
                  <IconComponent className="h-8 w-8 text-maroon-600" />
                </div>

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{card.card_title}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {card.card_type}
                    </span>
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
                  <div className="space-y-1 mb-2">
                    {Object.entries(card.content).map(([key, value]) => (
                      <div key={key} className="text-sm text-gray-600">
                        <strong className="capitalize">{key.replace('_', ' ')}:</strong> {value}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>Order: {card.display_order}</span>
                    <span>Fields: {Object.keys(card.content).length}</span>
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
                    disabled={index === infoCards.length - 1}
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
          Tips for Info Cards:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>Use clear, descriptive titles for each information card</li>
          <li>Keep content fields concise and informative</li>
          <li>Use appropriate icons that match the content type</li>
          <li>Regularly update hours and contact information</li>
          <li>Only active cards will be displayed on the website</li>
          <li>Custom fields allow for flexible content management</li>
        </ul>
      </div>
    </div>
  )
} 