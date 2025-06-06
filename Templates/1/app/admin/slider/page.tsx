"use client"

import { useState } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Move, 
  Eye, 
  EyeOff,
  Upload,
  Save,
  X
} from "lucide-react"
import Image from "next/image"

interface SliderImage {
  id: number
  image_url: string
  alt_text: string
  title?: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function SliderManagement() {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([
    {
      id: 1,
      image_url: "/placeholder.svg?height=300&width=600",
      alt_text: "Temple main entrance",
      title: "Welcome to Our Sacred Temple",
      description: "Experience divine peace and spiritual growth",
      display_order: 1,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    },
    {
      id: 2,
      image_url: "/placeholder.svg?height=300&width=600",
      alt_text: "Temple celebration",
      title: "Join Our Celebrations",
      description: "Community festivals and spiritual gatherings",
      display_order: 2,
      is_active: true,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    },
    {
      id: 3,
      image_url: "/placeholder.svg?height=300&width=600",
      alt_text: "Temple interior",
      title: "Sacred Interior",
      description: "Beautifully designed prayer halls",
      display_order: 3,
      is_active: false,
      created_at: "2024-01-01T06:00:00Z",
      updated_at: "2024-01-01T06:00:00Z"
    }
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null)
  const [formData, setFormData] = useState({
    image_url: "",
    alt_text: "",
    title: "",
    description: "",
    is_active: true
  })

  const handleEdit = (image: SliderImage) => {
    setEditingImage(image)
    setFormData({
      image_url: image.image_url,
      alt_text: image.alt_text,
      title: image.title || "",
      description: image.description || "",
      is_active: image.is_active
    })
    setShowForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this image?")) {
      setSliderImages(prev => prev.filter(img => img.id !== id))
    }
  }

  const toggleActive = (id: number) => {
    setSliderImages(prev => 
      prev.map(img => 
        img.id === id ? { ...img, is_active: !img.is_active } : img
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingImage) {
      // Update existing image
      setSliderImages(prev => 
        prev.map(img => 
          img.id === editingImage.id 
            ? { 
                ...img, 
                ...formData, 
                updated_at: new Date().toISOString() 
              }
            : img
        )
      )
    } else {
      // Add new image
      const newImage: SliderImage = {
        id: Math.max(...sliderImages.map(img => img.id)) + 1,
        ...formData,
        display_order: sliderImages.length + 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setSliderImages(prev => [...prev, newImage])
    }

    // Reset form
    setShowForm(false)
    setEditingImage(null)
    setFormData({
      image_url: "",
      alt_text: "",
      title: "",
      description: "",
      is_active: true
    })
  }

  const moveImage = (id: number, direction: 'up' | 'down') => {
    setSliderImages(prev => {
      const images = [...prev]
      const currentIndex = images.findIndex(img => img.id === id)
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      
      if (newIndex >= 0 && newIndex < images.length) {
        [images[currentIndex], images[newIndex]] = [images[newIndex], images[currentIndex]]
        
        // Update display_order
        images.forEach((img, index) => {
          img.display_order = index + 1
        })
      }
      
      return images
    })
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingImage(null)
    setFormData({
      image_url: "",
      alt_text: "",
      title: "",
      description: "",
      is_active: true
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Image Slider Management</h1>
          <p className="mt-2 text-gray-600">
            Manage the homepage image slider. Images will display in the order shown below.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Image
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  placeholder="Descriptive text for accessibility"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  placeholder="Image title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                  rows={3}
                  placeholder="Brief description"
                />
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
                  {editingImage ? 'Update' : 'Add'} Image
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

      {/* Images List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Current Images ({sliderImages.filter(img => img.is_active).length} active)
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {sliderImages.map((image, index) => (
            <div key={image.id} className="p-6 flex items-center space-x-4">
              {/* Image Preview */}
              <div className="flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={image.image_url}
                  alt={image.alt_text}
                  width={96}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Image Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.title || image.alt_text}
                  </p>
                  {image.is_active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 truncate">{image.description}</p>
                <p className="text-xs text-gray-400">Order: {image.display_order}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                {/* Move buttons */}
                <button
                  onClick={() => moveImage(image.id, 'up')}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Move className="h-4 w-4 rotate-180" />
                </button>
                <button
                  onClick={() => moveImage(image.id, 'down')}
                  disabled={index === sliderImages.length - 1}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Move className="h-4 w-4" />
                </button>

                {/* Toggle active */}
                <button
                  onClick={() => toggleActive(image.id)}
                  className={`p-1 ${image.is_active ? 'text-green-600 hover:text-green-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {image.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                {/* Edit */}
                <button
                  onClick={() => handleEdit(image)}
                  className="p-1 text-blue-600 hover:text-blue-700"
                >
                  <Edit className="h-4 w-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Tips for optimal slider images:
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Use high-quality images with 1200x600px resolution for best results</li>
                <li>Keep titles short and descriptive</li>
                <li>Use the move arrows to reorder images</li>
                <li>Only active images will be displayed on the website</li>
                <li>Alt text is important for accessibility and SEO</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 