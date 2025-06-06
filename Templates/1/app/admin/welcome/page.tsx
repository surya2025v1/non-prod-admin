"use client"

import { useState } from "react"
import { Save, Eye, EyeOff, RotateCcw } from "lucide-react"

interface WelcomeSection {
  id: number
  section_title: string
  sanskrit_verse: string
  sanskrit_translation: string
  description: string
  background_image_url: string
  primary_button_text: string
  primary_button_link: string
  secondary_button_text: string
  secondary_button_link: string
  is_active: boolean
  updated_at: string
}

export default function WelcomeManagement() {
  const [welcomeData, setWelcomeData] = useState<WelcomeSection>({
    id: 1,
    section_title: "Welcome to Our Sacred Temple",
    sanskrit_verse: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
    sanskrit_translation: "May all beings be happy, may all beings be free from illness",
    description: "Our temple is a sacred space dedicated to spiritual growth, community service, and preserving Hindu traditions. We welcome devotees from all walks of life to join us in prayer and celebration.",
    background_image_url: "/placeholder.svg?height=600&width=1200",
    primary_button_text: "Explore Our Temple",
    primary_button_link: "#services",
    secondary_button_text: "Visit Us Today",
    secondary_button_link: "/contact",
    is_active: true,
    updated_at: "2024-01-01T06:00:00Z"
  })

  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState<WelcomeSection>({ ...welcomeData })
  const [previewMode, setPreviewMode] = useState(false)

  const handleInputChange = (field: keyof WelcomeSection, value: string | boolean) => {
    setWelcomeData(prev => ({ ...prev, [field]: value }))
    setHasChanges(true)
    if (!isEditing) setIsEditing(true)
  }

  const handleSave = () => {
    // In a real app, this would make an API call
    setWelcomeData(prev => ({ ...prev, updated_at: new Date().toISOString() }))
    setOriginalData({ ...welcomeData })
    setHasChanges(false)
    setIsEditing(false)
    console.log("Saving welcome section data:", welcomeData)
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to discard all changes?")) {
      setWelcomeData({ ...originalData })
      setHasChanges(false)
      setIsEditing(false)
    }
  }

  const toggleActive = () => {
    handleInputChange('is_active', !welcomeData.is_active)
  }

  const defaultVerses = [
    {
      sanskrit: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
      translation: "May all beings be happy, may all beings be free from illness"
    },
    {
      sanskrit: "वसुधैव कुटुम्बकम्",
      translation: "The world is one family"
    },
    {
      sanskrit: "सत्यमेव जयते",
      translation: "Truth alone triumphs"
    },
    {
      sanskrit: "शान्ति शान्ति शान्तिः",
      translation: "Peace, Peace, Peace"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Section Management</h1>
          <p className="mt-2 text-gray-600">
            Edit the welcome section content, Sanskrit verses, and call-to-action buttons.
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              previewMode 
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit Mode' : 'Preview'}
          </button>
          <button
            onClick={toggleActive}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              welcomeData.is_active
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {welcomeData.is_active ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            {welcomeData.is_active ? 'Active' : 'Inactive'}
          </button>
        </div>
      </div>

      {/* Status Bar */}
      {hasChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-yellow-800">
              You have unsaved changes. Don't forget to save your work.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleReset}
                className="flex items-center px-3 py-1 text-sm bg-white border border-yellow-300 text-yellow-700 rounded hover:bg-yellow-50"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Reset
              </button>
              <button
                onClick={handleSave}
                className="flex items-center px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
              >
                <Save className="h-3 w-3 mr-1" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Mode */}
      {previewMode ? (
        <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-lg p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${welcomeData.background_image_url})` }}
            />
          </div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="w-24 h-1 bg-gold-400 mx-auto mb-2"></div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 text-gold-gradient">
                {welcomeData.section_title}
              </h1>
              <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
            </div>

            <p className="text-lg md:text-xl text-gold-200 mb-4 font-sanskrit">
              {welcomeData.sanskrit_verse}
            </p>
            <p className="text-sm md:text-base text-gold-300 mb-8 italic">
              "{welcomeData.sanskrit_translation}"
            </p>

            <p className="text-base md:text-xl leading-relaxed mb-8 text-white/90">
              {welcomeData.description}
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-gold-500 hover:bg-gold-600 text-maroon-900 px-6 py-4 text-lg font-medium rounded-lg transition-colors">
                {welcomeData.primary_button_text}
              </button>
              <button className="bg-transparent border-2 border-gold-400 text-gold-300 hover:bg-gold-400 hover:text-maroon-900 px-6 py-4 text-lg font-medium rounded-lg transition-colors">
                {welcomeData.secondary_button_text}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Content */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Section Content</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={welcomeData.section_title}
                    onChange={(e) => handleInputChange('section_title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="Welcome to Our Sacred Temple"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={welcomeData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="Describe your temple and its mission..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Image URL
                  </label>
                  <input
                    type="url"
                    value={welcomeData.background_image_url}
                    onChange={(e) => handleInputChange('background_image_url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="https://example.com/background.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Call-to-Action Buttons</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Primary Button</h4>
                  <input
                    type="text"
                    value={welcomeData.primary_button_text}
                    onChange={(e) => handleInputChange('primary_button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="Button text"
                  />
                  <input
                    type="text"
                    value={welcomeData.primary_button_link}
                    onChange={(e) => handleInputChange('primary_button_link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="Button link"
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-700">Secondary Button</h4>
                  <input
                    type="text"
                    value={welcomeData.secondary_button_text}
                    onChange={(e) => handleInputChange('secondary_button_text', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="Button text"
                  />
                  <input
                    type="text"
                    value={welcomeData.secondary_button_link}
                    onChange={(e) => handleInputChange('secondary_button_link', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="Button link"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sanskrit Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sanskrit Verse</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sanskrit Text
                  </label>
                  <textarea
                    value={welcomeData.sanskrit_verse}
                    onChange={(e) => handleInputChange('sanskrit_verse', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500 font-sanskrit"
                    placeholder="Sanskrit verse in Devanagari script"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    English Translation
                  </label>
                  <textarea
                    value={welcomeData.sanskrit_translation}
                    onChange={(e) => handleInputChange('sanskrit_translation', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-maroon-500 focus:border-maroon-500"
                    placeholder="English translation of the Sanskrit verse"
                  />
                </div>
              </div>
            </div>

            {/* Quick Sanskrit Options */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-3">Popular Sanskrit Verses</h4>
              <div className="space-y-2">
                {defaultVerses.map((verse, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleInputChange('sanskrit_verse', verse.sanskrit)
                      handleInputChange('sanskrit_translation', verse.translation)
                    }}
                    className="w-full text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <p className="text-sm font-sanskrit text-blue-900">{verse.sanskrit}</p>
                    <p className="text-xs text-blue-600 mt-1">"{verse.translation}"</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      {!previewMode && hasChanges && (
        <div className="sticky bottom-4 flex justify-center">
          <button
            onClick={handleSave}
            className="flex items-center px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors shadow-lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Welcome Section
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          Tips for the Welcome Section:
        </h3>
        <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
          <li>Keep the main title concise and welcoming</li>
          <li>Use authentic Sanskrit verses that resonate with your temple's philosophy</li>
          <li>Make sure the description clearly explains your temple's mission</li>
          <li>Use button links that lead to relevant pages (#services, /contact, etc.)</li>
          <li>Test the preview mode to see how your changes will look on the website</li>
        </ul>
      </div>
    </div>
  )
} 