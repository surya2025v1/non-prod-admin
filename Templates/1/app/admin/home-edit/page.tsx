"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft,
  Home,
  Image as ImageIcon, 
  Heart, 
  Settings, 
  MapPin, 
  Users, 
  Activity,
  TrendingUp,
  Clock,
  Plus,
  Edit3,
  Eye,
  Save,
  Search,
  Filter,
  Send,
  FileText,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Monitor,
  Smartphone,
  Tablet,
  Type,
  Palette,
  Layout,
  ChevronDown,
  Trash2,
  X
} from "lucide-react"
import SharedEditModal from '@/components/SharedEditModal'
import { ImageSlider } from '@/components/image-slider'

// Define the edit option interface
interface EditOption {
  label: string;
  icon: React.ReactElement;
  action: string;
  url?: string;
}

export default function HomeEditDashboard() {
  const router = useRouter()
  
  // Global error handler for token expiry
  const handleApiError = (response: Response) => {
    if (response.status === 401 || response.status === 403) {
      console.log('Token expired or unauthorized. Redirecting to login...')
      sessionStorage.removeItem('adminToken')
      localStorage.removeItem('adminToken')
      router.push('/auth')
      return true // Indicates error was handled
    }
    return false // Indicates error was not handled
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSection, setSelectedSection] = useState("all")
  const [quickEditEnabled, setQuickEditEnabled] = useState(false)
  const [previewSection, setPreviewSection] = useState<number | null>(null)
  const [publishStatus, setPublishStatus] = useState<{[key: number]: string}>({})
  const [showEditOptions, setShowEditOptions] = useState<number | null>(null)
  const [showFullPreview, setShowFullPreview] = useState(false)
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [showNavbarEditModal, setShowNavbarEditModal] = useState(false)
  const [isLoadingNavbar, setIsLoadingNavbar] = useState(false)
  const [navbarError, setNavbarError] = useState<string | null>(null)
  const [isSavingNavbar, setIsSavingNavbar] = useState(false)
  const [sectionStatuses, setSectionStatuses] = useState<{[key: number]: string}>({})
  const [navbarData, setNavbarData] = useState({
    templeName: "Hindu Temple",
    logoFile: null as File | null,
    logoPreview: "",
    tabTitle: "Hindu Temple - Sacred Space for Worship",
    tabIconFile: null as File | null,
    tabIconPreview: "",
    brandingColors: {
      primary: "#8B1538", // maroon
      secondary: "#FFD700", // gold
      accent: "#FFFFFF", // white
      logoBackground: "#8B1538" // maroon for logo background
    }
  })
  const [originalNavbarData, setOriginalNavbarData] = useState({
    templeName: "Hindu Temple",
    logoPreview: "",
    tabTitle: "Hindu Temple - Sacred Space for Worship",
    tabIconPreview: ""
  })
  const [modifiedFields, setModifiedFields] = useState({
    templeName: false,
    logoFile: false,
    tabTitle: false,
    tabIconFile: false
  })
  const [previewNavbarData, setPreviewNavbarData] = useState({
    templeName: "Hindu Temple",
    logoPreview: "",
    tabTitle: "Hindu Temple - Sacred Space for Worship",
    tabIconPreview: "",
    navigationItems: [
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: "Events", url: "/events" },
      { name: "Contact Us", url: "/contact" }
    ]
  })
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [previewDataSource, setPreviewDataSource] = useState<'api' | 'default'>('default')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [editModal, setEditModal] = useState<{sectionId: number, option: EditOption} | null>(null)

  // State for different section edit forms
  const [heroSliderData, setHeroSliderData] = useState({
    slides: [
      {
        id: 1,
        image: "temple-main.jpg",
        title: "Welcome to Our Sacred Temple",
        subtitle: "Experience divine peace and spiritual growth",
        buttonText: "Explore More",
        overlay: "dark",
        imageFile: null as File | null,
        imagePreview: ""
      },
      {
        id: 2,
        image: "temple-festival.jpg", 
        title: "Temple celebration",
        subtitle: "Experience the divine atmosphere of our sacred temple",
        buttonText: "Join Us",
        overlay: "gradient",
        imageFile: null as File | null,
        imagePreview: ""
      }
    ]
  })

  const [activitiesData, setActivitiesData] = useState({
    title: "Today's Activities",
    date: "Thursday, June 5, 2025",
    selectedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    activities: [
      { name: "Morning Aarti", category: "puja", time: "06:00 AM" },
      { name: "Abhishekam", category: "puja", time: "08:00 AM" },
      { name: "Bhajan Session", category: "community", time: "10:00 AM" }
    ]
  })

  const [welcomeData, setWelcomeData] = useState({
    title: "Welcome to Our Sacred Temple",
    subtitle: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
    description: "Join us in our sacred journey of faith, peace, and community. Our temple has been a beacon of spiritual guidance for over 100 years.",
    backgroundColor: "#8B1538",
    textColor: "#FFD700",
    backgroundImage: null as File | null,
    backgroundImagePreview: ""
  })

  const [servicesData, setServicesData] = useState({
    title: "Our Services",
    services: [
      { 
        name: "Daily Pujas", 
        description: "Join our daily rituals to seek divine blessings and spiritual guidance. Our experienced priests perform traditional ceremonies following ancient Vedic traditions.",
        schedule: "Morning & Evening Ceremonies",
        details: ["Morning Aarti: 6:00 AM", "Noon Aarti: 12:00 PM", "Evening Aarti: 6:30 PM"],
        icon: "prayer",
        buttonText: "View All Ceremonies"
      },
      { 
        name: "Community Services", 
        description: "We offer various community services focused on education, cultural preservation, and humanitarian aid. Our temple serves as a center for community growth and support.",
        schedule: "Serving Our Community", 
        details: ["Free Food Distribution (Sundays)", "Health Camps (Monthly)", "Youth Mentoring Programs"],
        icon: "community",
        buttonText: "Join Our Services"
      },
      { 
        name: "Spiritual Learning", 
        description: "Deepen your spiritual understanding through our comprehensive learning programs, from ancient Sanskrit texts to modern meditation practices.",
        schedule: "Ancient Wisdom & Modern Practice",
        details: ["Sanskrit Classes (Weekends)", "Meditation Workshops", "Spiritual Discussion Groups"],
        icon: "education",
        buttonText: "Start Learning"
      }
    ]
  })

  const [testimonialsData, setTestimonialsData] = useState({
    title: "What Our Community Says",
    testimonials: [
      { name: "Priya Sharma", location: "Local Devotee", quote: "This temple has been my spiritual home for years", rating: 5, image: null as File | null, imagePreview: "" },
      { name: "Raj Patel", location: "Community Member", quote: "The peaceful atmosphere here is unmatched", rating: 5, image: null as File | null, imagePreview: "" }
    ]
  })

  const [templeInfoData, setTempleInfoData] = useState({
    address: "123 Temple Street, Sacred City, SC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@sacredtemple.org",
    hours: "Daily 6:00 AM - 9:00 PM",
    establishedYear: "1925",
    deity: "Lord Ganesha",
    priest: "Pandit Raj Kumar",
    specialDays: ["Monday: Shiva Puja", "Tuesday: Hanuman Puja", "Saturday: Ganesh Puja"]
  })

  const [footerData, setFooterData] = useState({
    siteName: "Hindu Temple",
    description: "A sacred space for worship, community, and spiritual growth. Join us in our journey of faith and service.",
    address: "123 Temple Street, Sacred City, SC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@sacredtemple.org",
    socialMedia: {
      facebook: "https://facebook.com/hindutemple",
      twitter: "https://twitter.com/hindutemple", 
      instagram: "https://instagram.com/hindutemple",
      youtube: "https://youtube.com/hindutemple"
    },
    quickLinks: [
      { name: "Home", url: "/" },
      { name: "Services", url: "/services" },
      { name: "Events", url: "/events" },
      { name: "Contact", url: "/contact" }
    ],
    copyright: "© 2024 Hindu Temple. All rights reserved."
  })

  const [isSavingSection, setIsSavingSection] = useState(false)
  const [sectionError, setSectionError] = useState<string | null>(null)

  // Original data for change detection
  const [originalHeroSliderData, setOriginalHeroSliderData] = useState(heroSliderData)
  const [originalActivitiesData, setOriginalActivitiesData] = useState(activitiesData)
  const [originalWelcomeData, setOriginalWelcomeData] = useState(welcomeData)
  const [originalServicesData, setOriginalServicesData] = useState(servicesData)
  const [originalTestimonialsData, setOriginalTestimonialsData] = useState(testimonialsData)
  const [originalTempleInfoData, setOriginalTempleInfoData] = useState(templeInfoData)
  const [originalFooterData, setOriginalFooterData] = useState(footerData)

  // Check for Quick Edit mode from website management
  useEffect(() => {
    const quickEditMode = localStorage.getItem('quickEditMode')
    setQuickEditEnabled(quickEditMode === 'true')
  }, [])

  // Computed property to check if there are any changes
  const hasChanges = () => {
    return modifiedFields.templeName || 
           modifiedFields.tabTitle || 
           modifiedFields.logoFile || 
           modifiedFields.tabIconFile ||
           navbarData.templeName !== originalNavbarData.templeName ||
           navbarData.tabTitle !== originalNavbarData.tabTitle
  }

  // Check if there are navbar changes specifically
  const hasNavbarChanges = () => {
    const hasDataChanges = navbarData.templeName !== originalNavbarData.templeName ||
                          navbarData.tabTitle !== originalNavbarData.tabTitle ||
                          navbarData.logoFile !== null
    
    const hasModifiedFields = modifiedFields.templeName || 
                             modifiedFields.tabTitle || 
                             modifiedFields.logoFile
    
    console.log('=== Navbar Changes Check ===')
    console.log('Current temple name:', navbarData.templeName)
    console.log('Original temple name:', originalNavbarData.templeName)
    console.log('Current tab title:', navbarData.tabTitle)
    console.log('Original tab title:', originalNavbarData.tabTitle)
    console.log('Logo file:', navbarData.logoFile)
    console.log('Modified fields:', modifiedFields)
    console.log('Has data changes:', hasDataChanges)
    console.log('Has modified fields:', hasModifiedFields)
    
    return hasDataChanges || hasModifiedFields
  }

  // Debug: Log when navbarData changes
  useEffect(() => {
    console.log('=== NavbarData State Changed ===')
    console.log('Current navbarData:', JSON.stringify(navbarData, null, 2))
    console.log('Temple Name in state:', navbarData.templeName)
    console.log('Tab Title in state:', navbarData.tabTitle)
    console.log('Logo Preview in state:', navbarData.logoPreview)
    console.log('Tab Icon Preview in state:', navbarData.tabIconPreview)
  }, [navbarData])

  // Debug: Log when originalNavbarData changes
  useEffect(() => {
    console.log('=== OriginalNavbarData State Changed ===')
    console.log('Original navbarData:', JSON.stringify(originalNavbarData, null, 2))
  }, [originalNavbarData])

  // Get bearer token from localStorage or session storage
  const getBearerToken = () => {
    // Check common token key names
    const possibleTokenKeys = [
      'authToken',
      'auth_token', 
      'accessToken',
      'access_token',
      'token',
      'jwt',
      'bearerToken',
      'bearer_token'
    ]
    
    // Try localStorage first
    for (const key of possibleTokenKeys) {
      const token = localStorage.getItem(key)
      if (token) {
        console.log(`Found token in localStorage with key: ${key}`)
        return token
      }
    }
    
    // Try sessionStorage next
    for (const key of possibleTokenKeys) {
      const token = sessionStorage.getItem(key)
      if (token) {
        console.log(`Found token in sessionStorage with key: ${key}`)
        return token
      }
    }
    
    // Debug: Log all localStorage and sessionStorage keys
    console.log('Available localStorage keys:', Object.keys(localStorage))
    console.log('Available sessionStorage keys:', Object.keys(sessionStorage))
    
    // For development/testing purposes, you can uncomment the line below and add a test token
    return 'test-token-for-development' // Uncomment this line for testing
    
    return ''
  }

  // API call to fetch navbar data
  const fetchNavbarData = async () => {
    setIsLoadingNavbar(true)
    setNavbarError(null)
    
    try {
      const token = getBearerToken()
      console.log('Token found:', token ? 'Yes' : 'No')
      
      if (!token) {
        // More helpful error message
        throw new Error(
          'Authentication token not found. Please ensure you are logged in. ' +
          'Check the browser console for available storage keys. ' +
          'If testing, you can add a test token in the getBearerToken() function.'
        )
      }

      const response = await fetch('http://localhost:8003/api/v1/navbar/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        if (handleApiError(response)) return // Token expired, redirect handled
        throw new Error(`Failed to fetch navbar data: ${response.statusText}`)
      }

      const data = await response.json()
      console.log('=== API Response Debug ===')
      console.log('Raw API Data:', JSON.stringify(data, null, 2))
      
      // Check if data is nested (common in API responses)
      const actualData = data.data || data.result || data
      console.log('Actual Data Object:', JSON.stringify(actualData, null, 2))
      
      console.log('temple_name from API:', actualData.temple_name)
      console.log('tab_title from API:', actualData.tab_title)
      console.log('logo_url from API:', actualData.logo_url)
      console.log('favicon_url from API:', actualData.favicon_url)
      
      // Store original data for comparison
      const originalData = {
        templeName: actualData.temple_name || "Hindu Temple",
        logoPreview: actualData.logo_url || "",
        tabTitle: actualData.tab_title || "Hindu Temple - Sacred Space for Worship",
        tabIconPreview: actualData.favicon_url || ""
      }
      
      console.log('=== Setting Original Data ===')
      console.log('Original Data:', JSON.stringify(originalData, null, 2))
      setOriginalNavbarData(originalData)
      
      // Update navbar data with API response
      const newNavbarData = {
        templeName: actualData.temple_name || "Hindu Temple",
        logoFile: null,
        logoPreview: actualData.logo_url || "",
        tabTitle: actualData.tab_title || "Hindu Temple - Sacred Space for Worship",
        tabIconFile: null,
        tabIconPreview: actualData.favicon_url || "",
        brandingColors: {
          primary: actualData.primary_color || "#8B1538",
          secondary: actualData.secondary_color || "#FFD700",
          accent: actualData.accent_color || "#FFFFFF",
          logoBackground: actualData.logo_background_color || "#8B1538"
        }
      }
      
      console.log('=== Setting Navbar Data ===')
      console.log('New Navbar Data:', JSON.stringify(newNavbarData, null, 2))
      console.log('Temple Name being set:', newNavbarData.templeName)
      console.log('Tab Title being set:', newNavbarData.tabTitle)
      
      // Force state update with a slight delay to ensure React detects the change
      setTimeout(() => {
        setNavbarData(newNavbarData)
        console.log('Navbar data updated with setTimeout')
      }, 100)

      // Reset modified fields tracking
      setModifiedFields({
        templeName: false,
        logoFile: false,
        tabTitle: false,
        tabIconFile: false
      })

      // Open the edit modal after successful data fetch
      setEditModal({ sectionId: 1, option: { label: 'Edit Navbar', icon: <Settings className="h-4 w-4" />, action: 'navbar' } })
      
    } catch (error) {
      console.error('Error fetching navbar data:', error)
      setNavbarError(error instanceof Error ? error.message : 'Failed to fetch navbar data')
      
      // For development: Still show the modal with default data if needed
      // Uncomment the lines below if you want to proceed without API data for testing
      // setShowNavbarEditModal(true)
    } finally {
      setIsLoadingNavbar(false)
    }
  }

  // Helper function to convert file to base64
  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Remove the data:image/jpeg;base64, prefix to get just the base64 string
        const base64String = (reader.result as string).split(',')[1]
        resolve(base64String)
      }
      reader.onerror = error => reject(error)
    })
  }

  // API call to update navbar data
  const updateNavbarData = async () => {
    setIsSavingNavbar(true)
    setNavbarError(null)

    try {
      const token = getBearerToken()
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.')
      }

      // Prepare JSON payload with ALL values present on screen
      const payload: any = {}
      
      // Always send temple name (required field)
      payload.temple_name = navbarData.templeName
      console.log('Sending temple name:', navbarData.templeName)
      
      // Always send tab title (required field)
      payload.tab_title = navbarData.tabTitle
      console.log('Sending tab title:', navbarData.tabTitle)
      
      // Handle file uploads - convert to base64 if files are present
      if (modifiedFields.logoFile && navbarData.logoFile) {
        const logoBase64 = await convertFileToBase64(navbarData.logoFile)
        payload.logo = logoBase64
        payload.logo_filename = navbarData.logoFile.name
        payload.logo_mime_type = navbarData.logoFile.type
        console.log('Sending logo file as base64:', navbarData.logoFile.name)
      } else if (navbarData.logoPreview && !modifiedFields.logoFile) {
        // If there's an existing logo preview but no new file uploaded, 
        // we still want to preserve the existing logo (send current URL or keep as-is)
        console.log('Keeping existing logo:', navbarData.logoPreview)
      }
      
      if (modifiedFields.tabIconFile && navbarData.tabIconFile) {
        const faviconBase64 = await convertFileToBase64(navbarData.tabIconFile)
        payload.favicon = faviconBase64
        payload.favicon_filename = navbarData.tabIconFile.name
        payload.favicon_mime_type = navbarData.tabIconFile.type
        console.log('Sending favicon file as base64:', navbarData.tabIconFile.name)
      } else if (navbarData.tabIconPreview && !modifiedFields.tabIconFile) {
        // If there's an existing favicon preview but no new file uploaded,
        // we still want to preserve the existing favicon
        console.log('Keeping existing favicon:', navbarData.tabIconPreview)
      }

      // Always send branding colors
      payload.primary_color = navbarData.brandingColors.primary
      payload.secondary_color = navbarData.brandingColors.secondary
      payload.accent_color = navbarData.brandingColors.accent
      payload.logo_background_color = navbarData.brandingColors.logoBackground
      console.log('Sending branding colors:', navbarData.brandingColors)

      // Check if there are any changes to allow save (this logic remains the same)
      if (!hasChanges()) {
        throw new Error('No changes detected. Please modify at least one field before saving.')
      }

      console.log('Sending complete payload:', JSON.stringify({
        ...payload, 
        logo: payload.logo ? '[BASE64_DATA]' : undefined, 
        favicon: payload.favicon ? '[BASE64_DATA]' : undefined
      }, null, 2))

      const response = await fetch('http://localhost:8003/api/v1/navbar/nav_update', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        if (handleApiError(response)) return // Token expired, redirect handled
        if (response.status === 413) {
          throw new Error('File size too large. Please use smaller images.')
        } else {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Update failed: ${response.statusText}`)
        }
      }

      const result = await response.json()
      
      // Show inline success message and auto-close modal
      setSuccessMessage('Navbar settings updated successfully!')
      
      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setShowNavbarEditModal(false)
        setSuccessMessage(null)
      }, 2000)
      
      // Success - update section status
      setSectionStatuses(prev => ({
        ...prev,
        1: 'needs-review' // Update Navbar & Branding section status
      }))
      
      // Update the original data to reflect the new saved state
      setOriginalNavbarData({
        templeName: navbarData.templeName,
        logoPreview: navbarData.logoPreview,
        tabTitle: navbarData.tabTitle,
        tabIconPreview: navbarData.tabIconPreview
      })
      
      // Reset modified fields tracking since changes have been saved
      setModifiedFields({
        templeName: false,
        logoFile: false,
        tabTitle: false,
        tabIconFile: false
      })
      
    } catch (error) {
      console.error('Error updating navbar data:', error)
      setNavbarError(error instanceof Error ? error.message : 'Failed to update navbar data')
    } finally {
      setIsSavingNavbar(false)
    }
  }

  // API call to fetch navbar data for preview
  const fetchNavbarPreviewData = async () => {
    setIsLoadingPreview(true)
    
    try {
      const token = getBearerToken()
      if (!token) {
        // Use default data if no token
        console.log('No token found, using default preview data')
        setPreviewNavbarData({
          templeName: "Hindu Temple",
          logoPreview: "",
          tabTitle: "Hindu Temple - Sacred Space for Worship",
          tabIconPreview: "",
          navigationItems: [
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: "Events", url: "/events" },
            { name: "Contact Us", url: "/contact" }
          ]
        })
        setPreviewDataSource('default')
        return
      }

      console.log('=== Fetching Navbar Preview Data ===')
      const response = await fetch('http://localhost:8003/api/v1/navbar/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        if (handleApiError(response)) return // Token expired, redirect handled
        console.log('Preview API failed, using default data')
        // Set default data if API fails
        setPreviewNavbarData({
          templeName: "Hindu Temple",
          logoPreview: "",
          tabTitle: "Hindu Temple - Sacred Space for Worship",
          tabIconPreview: "",
          navigationItems: [
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
            { name: "Events", url: "/events" },
            { name: "Contact Us", url: "/contact" }
          ]
        })
        setPreviewDataSource('default')
        return
      }

      const data = await response.json()
      console.log('Preview API Response:', JSON.stringify(data, null, 2))
      
      // Check if data is nested
      const actualData = data.data || data.result || data
      
      // Update preview data with API response, using defaults for blank values
      setPreviewNavbarData({
        templeName: actualData.temple_name || "Hindu Temple",
        logoPreview: actualData.logo_url || "",
        tabTitle: actualData.tab_title || "Hindu Temple - Sacred Space for Worship",
        tabIconPreview: actualData.favicon_url || "",
        navigationItems: [
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Events", url: "/events" },
          { name: "Contact Us", url: "/contact" }
        ]
      })
      
      console.log('Preview data updated with API response')
      setPreviewDataSource('api')
      
    } catch (error) {
      console.error('Error fetching navbar preview data:', error)
      // Set default data on error
      setPreviewNavbarData({
        templeName: "Hindu Temple",
        logoPreview: "",
        tabTitle: "Hindu Temple - Sacred Space for Worship",
        tabIconPreview: "",
        navigationItems: [
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Events", url: "/events" },
          { name: "Contact Us", url: "/contact" }
        ]
      })
      setPreviewDataSource('default')
    } finally {
      setIsLoadingPreview(false)
    }
  }

  // Content sections data with actual home page structure
  const contentSections = [
    {
      id: 1,
      name: "Navbar & Branding",
      type: "navbar",
      description: "Website navigation, logo, and branding settings",
      status: sectionStatuses[1] || "published",
      lastUpdated: "1 hour ago",
      itemCount: 1,
      priority: "high",
      previewContent: {
        siteName: "Hindu Temple",
        logo: "॥",
        logoStyle: "maroon",
        tabTitle: "Hindu Temple - Sacred Space for Worship",
        favicon: "temple-icon.ico",
        navigationItems: [
          { name: "Home", url: "/" },
          { name: "Services", url: "/services" },
          { name: "Events", url: "/events" },
          { name: "Contact Us", url: "/contact" }
        ],
        userProfile: "K"
      },
      editOptions: [
        { label: "Edit Site Name", icon: <Type className="h-4 w-4" />, action: "sitename" },
        { label: "Change Logo & Icon", icon: <ImageIcon className="h-4 w-4" />, action: "logo" },
        { label: "Modify Tab Title", icon: <Settings className="h-4 w-4" />, action: "title" },
        { label: "Tab Logo/Favicon", icon: <ImageIcon className="h-4 w-4" />, action: "tablogo" }
      ]
    },
    {
      id: 2,
      name: "Hero Slider",
      type: "slider",
      description: "Main homepage image carousel with call-to-action overlays",
      status: "published",
      lastUpdated: "2 hours ago",
      itemCount: 4,
      priority: "high",
      previewContent: {
        slides: [
          {
            image: "temple-main.jpg",
            title: "Welcome to Our Sacred Temple",
            subtitle: "Experience divine peace and spiritual growth",
            buttonText: "Explore More",
            overlay: "dark"
          },
          {
            image: "temple-festival.jpg", 
            title: "Temple celebration",
            subtitle: "Experience the divine atmosphere of our sacred temple",
            buttonText: "Join Us",
            overlay: "gradient"
          }
        ]
      },
      editOptions: [
        { label: "Change Background Images", icon: <ImageIcon className="h-4 w-4" />, action: "images" },
        { label: "Edit Overlay Text", icon: <Type className="h-4 w-4" />, action: "text" },
        { label: "Modify Colors & Overlay", icon: <Palette className="h-4 w-4" />, action: "colors" },
        { label: "Adjust Layout & Position", icon: <Layout className="h-4 w-4" />, action: "layout" },
        { label: "Button Settings", icon: <Settings className="h-4 w-4" />, action: "buttons" }
      ]
    },
    {
      id: 3,
      name: "Today's Activities",
      type: "activities",
      description: "Daily temple activities and schedule display",
      status: "published",
      lastUpdated: "3 days ago",
      itemCount: 6,
      priority: "medium",
      previewContent: {
        title: "Today's Activities",
        date: "Thursday, June 5, 2025",
        activities: [
          { name: "Morning Aarti", category: "puja", time: "06:00 AM" },
          { name: "Abhishekam", category: "puja", time: "08:00 AM" },
          { name: "Bhajan Session", category: "community", time: "10:00 AM" },
          { name: "Noon Aarti", category: "puja", time: "12:00 PM" },
          { name: "Vedic Classes", category: "education", time: "04:00 PM" },
          { name: "Evening Aarti", category: "puja", time: "06:30 PM" }
        ]
      },
      editOptions: [
        { label: "Add/Remove Activities", icon: <Plus className="h-4 w-4" />, action: "activities" },
        { label: "Edit Activity Categories", icon: <Filter className="h-4 w-4" />, action: "categories" },
        { label: "Modify Time Schedule", icon: <Clock className="h-4 w-4" />, action: "schedule" },
        { label: "Customize Activity Display", icon: <Layout className="h-4 w-4" />, action: "display" },
        { label: "Calendar Integration", icon: <Settings className="h-4 w-4" />, action: "calendar" }
      ]
    },
    {
      id: 4,
      name: "Welcome Section",
      type: "content",
      description: "Welcome message and introduction text for visitors",
      status: "published",
      lastUpdated: "1 day ago",
      itemCount: 1,
      priority: "high",
      previewContent: {
        title: "Welcome to Our Sacred Temple",
        subtitle: "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः",
        description: "Join us in our sacred journey of faith, peace, and community. Our temple has been a beacon of spiritual guidance for over 100 years.",
        backgroundColor: "maroon",
        textColor: "golden"
      },
      editOptions: [
        { label: "Edit Welcome Text", icon: <Type className="h-4 w-4" />, action: "text" },
        { label: "Modify Sanskrit Quote", icon: <Heart className="h-4 w-4" />, action: "sanskrit" },
        { label: "Change Background Color", icon: <Palette className="h-4 w-4" />, action: "background" },
        { label: "Adjust Typography", icon: <Settings className="h-4 w-4" />, action: "typography" },
        { label: "Section Layout", icon: <Layout className="h-4 w-4" />, action: "layout" }
      ]
    },

    {
      id: 5,
      name: "Our Services",
      type: "services",
      description: "Featured temple services (Content managed from Services Edit section)",
      status: "published",
      lastUpdated: "3 days ago",
      itemCount: 3,
      priority: "medium",
      isLinkedSection: true,
      linkedTo: "Services Edit",
      previewContent: {
        note: "This section content is managed from the Services Edit section",
        services: [
          { name: "Daily Prayers", time: "6:00 AM - 8:00 PM", description: "Join our daily prayer sessions", icon: "prayer" },
          { name: "Special Ceremonies", time: "Weekends", description: "Traditional ceremonies and festivals", icon: "ceremony" },
          { name: "Community Events", time: "Monthly", description: "Community gatherings and celebrations", icon: "community" }
        ]
      },
      editOptions: [
        { label: "Go to Services Edit", icon: <Settings className="h-4 w-4" />, action: "navigate", url: "/admin/services-edit" },
        { label: "Display Settings", icon: <Layout className="h-4 w-4" />, action: "display" },
        { label: "Section Visibility", icon: <Eye className="h-4 w-4" />, action: "visibility" }
      ]
    },
    {
      id: 6,
      name: "Devotees Testimonial",
      type: "testimonials",
      description: "Community feedback and devotee testimonials",
      status: "published",
      lastUpdated: "2 days ago",
      itemCount: 8,
      priority: "medium",
      previewContent: {
        title: "What Our Devotees Say",
        testimonials: [
          { 
            name: "Priya Sharma", 
            quote: "This temple has brought immense peace and spiritual growth to my life. The daily prayers and community here are truly divine.", 
            rating: 5,
            location: "Mumbai",
            image: "devotee1.jpg"
          },
          { 
            name: "Raj Patel", 
            quote: "The festivals and ceremonies conducted here are authentic and deeply moving. A true spiritual sanctuary.", 
            rating: 5,
            location: "Ahmedabad",
            image: "devotee2.jpg"
          },
          { 
            name: "Meera Iyer", 
            quote: "The priests are knowledgeable and the atmosphere is so peaceful. I feel blessed to be part of this community.", 
            rating: 5,
            location: "Chennai",
            image: "devotee3.jpg"
          }
        ]
      },
      editOptions: [
        { label: "Add New Testimonial", icon: <Plus className="h-4 w-4" />, action: "add" },
        { label: "Edit Testimonials", icon: <Type className="h-4 w-4" />, action: "edit" },
        { label: "Manage Photos", icon: <ImageIcon className="h-4 w-4" />, action: "photos" },
        { label: "Testimonial Layout", icon: <Layout className="h-4 w-4" />, action: "layout" },
        { label: "Approval Settings", icon: <CheckCircle className="h-4 w-4" />, action: "approval" }
      ]
    },
    {
      id: 7,
      name: "Temple Information",
      type: "info",
      description: "Hours, contact details, and location information",
      status: "needs-review",
      lastUpdated: "5 days ago",
      itemCount: 3,
      priority: "medium",
      previewContent: {
        address: "123 Temple Street, Sacred City, SC 12345",
        phone: "(555) 123-4567",
        hours: "Daily 6:00 AM - 8:00 PM",
        email: "info@sacredtemple.org"
      },
      editOptions: [
        { label: "Update Contact Info", icon: <MapPin className="h-4 w-4" />, action: "contact" },
        { label: "Modify Temple Hours", icon: <Clock className="h-4 w-4" />, action: "hours" },
        { label: "Edit Address & Location", icon: <MapPin className="h-4 w-4" />, action: "location" },
        { label: "Social Media Links", icon: <Settings className="h-4 w-4" />, action: "social" },
        { label: "Contact Form Settings", icon: <Layout className="h-4 w-4" />, action: "form" }
      ]
    },
    {
      id: 8,
      name: "Footer Section",
      type: "footer",
      description: "Website footer with links, contact info, and copyright",
      status: "published",
      lastUpdated: "1 week ago",
      itemCount: 1,
      priority: "low",
      previewContent: {
        copyright: "© 2025 Hindu Temple. All rights reserved.",
        links: [
          { name: "Privacy Policy", url: "/privacy" },
          { name: "Terms of Service", url: "/terms" },
          { name: "Donations", url: "/donate" }
        ],
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/hindutemple" },
          { platform: "Instagram", url: "https://instagram.com/hindutemple" },
          { platform: "YouTube", url: "https://youtube.com/hindutemple" }
        ],
        quickContact: {
          phone: "(555) 123-4567",
          email: "info@sacredtemple.org",
          address: "123 Temple Street, Sacred City"
        }
      },
      editOptions: [
        { label: "Edit Copyright Text", icon: <Type className="h-4 w-4" />, action: "copyright" },
        { label: "Manage Footer Links", icon: <Settings className="h-4 w-4" />, action: "links" },
        { label: "Social Media Links", icon: <Users className="h-4 w-4" />, action: "social" },
        { label: "Quick Contact Info", icon: <MapPin className="h-4 w-4" />, action: "contact" },
        { label: "Footer Layout", icon: <Layout className="h-4 w-4" />, action: "layout" }
      ]
    }
  ]

  const sectionTypes = [
    { value: "all", label: "All Sections" },
    { value: "navbar", label: "Navigation & Branding" },
    { value: "slider", label: "Hero Sliders" },
    { value: "activities", label: "Activities" },
    { value: "content", label: "Text Content" },
    { value: "services", label: "Service Cards" },
    { value: "testimonials", label: "Testimonials" },
    { value: "info", label: "Information Cards" },
    { value: "footer", label: "Footer" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      case 'needs-review': return 'text-orange-600 bg-orange-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'navbar': return <Layout className="h-5 w-5" />
      case 'slider': return <ImageIcon className="h-5 w-5" />
      case 'content': return <Heart className="h-5 w-5" />
      case 'activities': return <Clock className="h-5 w-5" />
      case 'services': return <Settings className="h-5 w-5" />
      case 'testimonials': return <Users className="h-5 w-5" />
      case 'info': return <MapPin className="h-5 w-5" />
      case 'footer': return <Users className="h-5 w-5" />
      default: return <Home className="h-5 w-5" />
    }
  }

  const filteredSections = contentSections.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedSection === "all" || section.type === selectedSection
    return matchesSearch && matchesType
  })

  const handleStatusChange = (sectionId: number, newStatus: string) => {
    setPublishStatus(prev => ({
      ...prev,
      [sectionId]: newStatus
    }))
  }

  // Handler functions for Navbar & Branding edit
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('Logo file size should be less than 2MB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setNavbarData(prev => ({
          ...prev,
          logoFile: file,
          logoPreview: e.target?.result as string
        }))
        // Track that logo file has been uploaded
        setModifiedFields(prev => ({ ...prev, logoFile: true }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleTabIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 500 * 1024) { // 500KB limit for favicon
        alert('Tab icon file size should be less than 500KB')
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        setNavbarData(prev => ({
          ...prev,
          tabIconFile: file,
          tabIconPreview: e.target?.result as string
        }))
        // Track that tab icon file has been uploaded
        setModifiedFields(prev => ({ ...prev, tabIconFile: true }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNavbarInputChange = (field: string, value: string) => {
    setNavbarData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Track that this field has been modified
    if (field === 'templeName') {
      setModifiedFields(prev => ({ ...prev, templeName: true }))
    } else if (field === 'tabTitle') {
      setModifiedFields(prev => ({ ...prev, tabTitle: true }))
    }
  }

  // Predefined color schemes for temples
  const colorSchemes = [
    {
      name: "Traditional Maroon & Gold",
      primary: "#8B1538",
      secondary: "#FFD700",
      accent: "#FFFFFF",
      logoBackground: "#8B1538"
    },
    {
      name: "Sacred Saffron",
      primary: "#FF6600",
      secondary: "#FFCC00",
      accent: "#FFFFFF",
      logoBackground: "#FF6600"
    },
    {
      name: "Divine Blue",
      primary: "#1E3A8A",
      secondary: "#60A5FA",
      accent: "#FFFFFF",
      logoBackground: "#1E3A8A"
    },
    {
      name: "Royal Purple",
      primary: "#6B21A8",
      secondary: "#A855F7",
      accent: "#FFFFFF",
      logoBackground: "#6B21A8"
    },
    {
      name: "Emerald Green",
      primary: "#059669",
      secondary: "#34D399",
      accent: "#FFFFFF",
      logoBackground: "#059669"
    },
    {
      name: "Sunset Orange",
      primary: "#EA580C",
      secondary: "#FB923C",
      accent: "#FFFFFF",
      logoBackground: "#EA580C"
    },
    {
      name: "Deep Red",
      primary: "#DC2626",
      secondary: "#F87171",
      accent: "#FFFFFF",
      logoBackground: "#DC2626"
    },
    {
      name: "Forest Green",
      primary: "#166534",
      secondary: "#4ADE80",
      accent: "#FFFFFF",
      logoBackground: "#166534"
    }
  ]

  const handleColorSchemeChange = (scheme: any) => {
    setNavbarData(prev => ({
      ...prev,
      brandingColors: {
        primary: scheme.primary,
        secondary: scheme.secondary,
        accent: scheme.accent,
        logoBackground: scheme.logoBackground
      }
    }))
  }

  const handleCustomColorChange = (colorType: string, color: string) => {
    setNavbarData(prev => ({
      ...prev,
      brandingColors: {
        ...prev.brandingColors,
        [colorType]: color
      }
    }))
  }

  const saveNavbarChanges = async () => {
    await updateNavbarData()
  }

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case 'mobile':
        return {
          container: 'w-full max-w-sm',
          heroHeight: 'h-64',
          heroTitle: 'text-2xl',
          heroSubtitle: 'text-sm',
          sectionTitle: 'text-2xl',
          welcomeTitle: 'text-3xl',
          welcomeSubtitle: 'text-lg',
          activitiesGrid: 'grid-cols-1',
          servicesGrid: 'grid-cols-1',
          testimonialsGrid: 'grid-cols-1',
          infoGrid: 'grid-cols-1',
          padding: 'px-4 py-8'
        }
      case 'tablet':
        return {
          container: 'w-full max-w-2xl',
          heroHeight: 'h-80',
          heroTitle: 'text-3xl',
          heroSubtitle: 'text-base',
          sectionTitle: 'text-3xl',
          welcomeTitle: 'text-4xl',
          welcomeSubtitle: 'text-xl',
          activitiesGrid: 'grid-cols-1',
          servicesGrid: 'grid-cols-2',
          testimonialsGrid: 'grid-cols-2',
          infoGrid: 'grid-cols-2',
          padding: 'px-6 py-12'
        }
      default: // desktop
        return {
          container: 'w-full max-w-6xl',
          heroHeight: 'h-96',
          heroTitle: 'text-5xl',
          heroSubtitle: 'text-xl',
          sectionTitle: 'text-4xl',
          welcomeTitle: 'text-5xl',
          welcomeSubtitle: 'text-3xl',
          activitiesGrid: 'grid-cols-1',
          servicesGrid: 'grid-cols-3',
          testimonialsGrid: 'grid-cols-3',
          infoGrid: 'grid-cols-4',
          padding: 'px-8 py-16'
        }
    }
  }

  const renderSectionPreview = (section: any) => {
    if (!section.previewContent) return null

    switch (section.type) {
      case 'navbar':
        return (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {isLoadingPreview ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-maroon-600 mx-auto mb-2"></div>
                <span className="text-sm text-gray-600">Loading live preview...</span>
              </div>
            ) : (
              <>
                <div className="bg-white shadow-sm border-b p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-maroon-600 rounded-full flex items-center justify-center">
                        {previewNavbarData.logoPreview ? (
                          <img 
                            src={previewNavbarData.logoPreview} 
                            alt="Logo" 
                            className="w-6 h-6 object-contain"
                          />
                        ) : (
                          <span className="text-white text-sm font-bold">॥</span>
                        )}
                      </div>
                      <span className="text-xl font-bold text-gray-900">{previewNavbarData.templeName}</span>
                    </div>
                    <nav className="flex space-x-6">
                      {previewNavbarData.navigationItems.map((item: any, idx: number) => (
                        <a key={idx} href="#" className="text-gray-700 hover:text-maroon-600">{item.name}</a>
                      ))}
                    </nav>
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">K</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gray-50">
                  <div className="text-sm text-gray-600">
                    <p><strong>Tab Title:</strong> {previewNavbarData.tabTitle}</p>
                    <p><strong>Favicon:</strong> {previewNavbarData.tabIconPreview || 'temple-icon.ico'}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className={`text-xs ${previewDataSource === 'api' ? 'text-green-600' : 'text-orange-600'}`}>
                        {previewDataSource === 'api' ? '✓ Live data from API' : '⚠️ Using default data (API unavailable)'}
                      </div>
                      <button
                        onClick={fetchNavbarPreviewData}
                        disabled={isLoadingPreview}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center disabled:opacity-50"
                      >
                        {isLoadingPreview ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-1"></div>
                            Refreshing...
                          </>
                        ) : (
                          'Refresh Data'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )
      case 'slider':
        return (
          <div className="space-y-4">
            {section.previewContent?.slides?.map((slide: any, idx: number) => (
              <div key={idx} className="relative rounded-lg overflow-hidden h-64">
                {/* Simulated Background Image */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-300 to-gray-400 flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-500" />
                </div>
                
                {/* Overlay */}
                <div className={`absolute inset-0 ${
                  slide.overlay === 'dark' ? 'bg-black/50' : 'bg-gradient-to-r from-maroon-600/80 to-maroon-800/80'
                }`}></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">{slide.title}</h3>
                    <p className="text-xl text-white/90 mb-6">{slide.subtitle}</p>
                    <button className="px-6 py-3 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors">
                      {slide.buttonText}
                    </button>
                  </div>
                </div>
                
                {/* Today's Activities on the right side */}
                <div className="absolute top-4 right-4 w-80 max-h-96 overflow-hidden">
                  <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
                    <div className="bg-maroon-600 text-white p-3">
                      <div className="text-center">
                        <h4 className="text-sm font-bold">Today's Activities</h4>
                        <p className="text-maroon-100 text-xs">Thursday, June 5, 2025</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-2 max-h-48 overflow-y-auto">
                      {[
                        { name: "Morning Aarti", category: "puja", time: "06:00 AM" },
                        { name: "Abhishekam", category: "puja", time: "08:00 AM" },
                        { name: "Bhajan Session", category: "community", time: "10:00 AM" }
                      ].map((activity, actIdx) => (
                        <div key={actIdx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`px-1 py-0.5 rounded text-xs font-medium ${
                              activity.category === 'puja' ? 'bg-red-100 text-red-600' :
                              'bg-green-100 text-green-600'
                            }`}>
                              {activity.category}
                            </div>
                            <span className="font-medium">{activity.name}</span>
                          </div>
                          <span className="text-gray-600">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Slide Indicator */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
                    Slide {idx + 1} of {section.previewContent?.slides?.length || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      case 'content':
        return (
          <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white p-8 rounded-lg">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-yellow-400 mb-4">{section.previewContent.title}</h3>
              <p className="text-2xl text-yellow-300 mb-6 font-hindi">{section.previewContent.subtitle}</p>
              <p className="text-lg text-maroon-100 max-w-3xl mx-auto leading-relaxed">
                {section.previewContent.description}
              </p>
            </div>
          </div>
        )
      case 'activities':
        return (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-maroon-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{section.previewContent.title}</h3>
                  <p className="text-maroon-100">{section.previewContent.date}</p>
                </div>
                <button className="px-4 py-2 bg-white/20 rounded-lg text-white flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  View Calendar
                </button>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {section.previewContent.activities.map((activity: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      activity.category === 'puja' ? 'bg-red-100 text-red-600' :
                      activity.category === 'community' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {activity.category}
                    </div>
                    <span className="font-medium">{activity.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'services':
        return (
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Our Services</h3>
              {section.isLinkedSection && (
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                  Managed from {section.linkedTo}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.previewContent.services.map((service: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium mb-2">{service.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <span className="text-sm text-blue-600 font-medium">{service.schedule}</span>
                </div>
              ))}
            </div>
          </div>
        )
      case 'testimonials':
        return (
          <div className="bg-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">{section.previewContent.title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.previewContent.testimonials.map((testimonial: any, idx: number) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center mb-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-sm italic text-gray-600 mb-3">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400">★</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'info':
        return (
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Temple Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-gray-600">{section.previewContent.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-gray-600">{section.previewContent.hours}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-gray-600">{section.previewContent.phone}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">{section.previewContent.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'footer':
        return (
          <div className="bg-gray-800 text-white rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-bold mb-3">Quick Contact</h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>{section.previewContent.quickContact.phone}</p>
                    <p>{section.previewContent.quickContact.email}</p>
                    <p>{section.previewContent.quickContact.address}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    {section.previewContent.links.map((link: any, idx: number) => (
                      <a key={idx} href="#" className="block text-sm text-gray-300 hover:text-white">
                        {link.name}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold mb-3">Follow Us</h4>
                  <div className="space-y-2">
                    {section.previewContent.socialMedia.map((social: any, idx: number) => (
                      <a key={idx} href="#" className="block text-sm text-gray-300 hover:text-white">
                        {social.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-900 px-6 py-3 border-t border-gray-700">
              <p className="text-center text-sm text-gray-400">{section.previewContent.copyright}</p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderFullHomePagePreview = () => {
    const styles = getDeviceStyles()
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className={`bg-white ${styles.container} h-full max-h-[90vh] rounded-lg overflow-hidden`}>
          {/* Preview Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 ml-4">Home Page Preview - {previewDevice.charAt(0).toUpperCase() + previewDevice.slice(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-200 rounded-lg p-1">
                <button 
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded transition-colors ${previewDevice === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                >
                  <Monitor className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-2 rounded transition-colors ${previewDevice === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                >
                  <Tablet className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded transition-colors ${previewDevice === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'}`}
                >
                  <Smartphone className="h-4 w-4" />
                </button>
              </div>
              <button 
                onClick={() => setShowFullPreview(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="h-full overflow-y-auto bg-white">
            {/* Navigation Bar */}
            <div className="bg-white shadow-sm border-b">
              <div className="max-w-full mx-auto px-4">
                <div className="flex items-center justify-between h-12">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-maroon-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">॥</span>
                    </div>
                    <span className={`font-bold text-gray-900 ${previewDevice === 'mobile' ? 'text-sm' : 'text-lg'}`}>Hindu Temple</span>
                  </div>
                  {previewDevice !== 'mobile' && (
                    <nav className="flex space-x-4">
                      <a href="#" className="text-gray-700 hover:text-maroon-600 text-sm">Home</a>
                      <a href="#" className="text-gray-700 hover:text-maroon-600 text-sm">Services</a>
                      <a href="#" className="text-gray-700 hover:text-maroon-600 text-sm">Events</a>
                      <a href="#" className="text-gray-700 hover:text-maroon-600 text-sm">Contact Us</a>
                    </nav>
                  )}
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">K</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Slider Section with Activities on Right */}
            <div className={`relative ${styles.heroHeight} bg-gradient-to-r from-gray-300 to-gray-400`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="px-4">
                  <h1 className={`${styles.heroTitle} font-bold mb-2`}>Welcome to Our Sacred Temple</h1>
                  <p className={`${styles.heroSubtitle} mb-4`}>Experience divine peace and spiritual growth</p>
                  <button className={`px-6 py-2 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors ${previewDevice === 'mobile' ? 'text-sm' : ''}`}>
                    Explore More
                  </button>
                </div>
              </div>

              {/* Today's Activities positioned on the right side of slider */}
              {previewDevice === 'desktop' && (
                <div className="absolute top-4 right-4 w-80 max-h-full overflow-hidden">
                  <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg">
                    <div className="bg-maroon-600 text-white p-3">
                      <div className="text-center">
                        <h3 className="text-sm font-bold">Today's Activities</h3>
                        <p className="text-maroon-100 text-xs">Thursday, June 5, 2025</p>
                      </div>
                    </div>
                    <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
                      {[
                        { name: "Morning Aarti", category: "puja", time: "06:00 AM" },
                        { name: "Abhishekam", category: "puja", time: "08:00 AM" },
                        { name: "Bhajan Session", category: "community", time: "10:00 AM" },
                        { name: "Noon Aarti", category: "puja", time: "12:00 PM" },
                        { name: "Vedic Classes", category: "education", time: "04:00 PM" },
                        { name: "Evening Aarti", category: "puja", time: "06:30 PM" }
                      ].map((activity, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                          <div className="flex items-center space-x-1">
                            <div className={`px-1 py-0.5 rounded text-xs font-medium ${
                              activity.category === 'puja' ? 'bg-red-100 text-red-600' :
                              activity.category === 'community' ? 'bg-green-100 text-green-600' :
                              'bg-blue-100 text-blue-600'
                            }`}>
                              {activity.category}
                            </div>
                            <span className="font-medium">{activity.name}</span>
                          </div>
                          <span className="text-gray-600">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="max-w-full mx-auto">
              {previewDevice !== 'desktop' ? (
                /* Mobile/Tablet Layout - Stacked with Activities first */
                <div>
                  {/* Today's Activities */}
                  <div className={styles.padding}>
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="bg-maroon-600 text-white p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className={`${previewDevice === 'mobile' ? 'text-lg' : 'text-xl'} font-bold`}>Today's Activities</h3>
                            <p className="text-maroon-100 text-sm">Thursday, June 5, 2025</p>
                          </div>
                          <button className="px-3 py-1 bg-white/20 rounded-lg text-white text-sm flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Calendar
                          </button>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        {[
                          { name: "Morning Aarti", category: "puja", time: "06:00 AM" },
                          { name: "Abhishekam", category: "puja", time: "08:00 AM" },
                          { name: "Bhajan Session", category: "community", time: "10:00 AM" },
                          { name: "Noon Aarti", category: "puja", time: "12:00 PM" },
                          { name: "Vedic Classes", category: "education", time: "04:00 PM" },
                          { name: "Evening Aarti", category: "puja", time: "06:30 PM" }
                        ].map((activity, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                activity.category === 'puja' ? 'bg-red-100 text-red-600' :
                                activity.category === 'community' ? 'bg-green-100 text-green-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {activity.category}
                              </div>
                              <span className="font-medium">{activity.name}</span>
                            </div>
                            <span className="text-gray-600 text-sm">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Welcome Section */}
                  <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white py-12 px-6">
                    <div className="text-center">
                      <h2 className={`${styles.welcomeTitle} font-bold text-yellow-400 mb-4`}>Welcome to Our Sacred Temple</h2>
                      <p className={`${styles.welcomeSubtitle} text-yellow-300 mb-6`}>सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</p>
                      <p className="text-base text-maroon-100 leading-relaxed">
                        Join us in our sacred journey of faith, peace, and community. Our temple has been a beacon of spiritual guidance for over 100 years.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Layout - Only Welcome Section since Activities are in slider */
                <div className="bg-gradient-to-r from-maroon-700 to-maroon-800 text-white py-12 px-6">
                  <div className="text-center">
                    <h2 className="text-4xl font-bold text-yellow-400 mb-4">Welcome to Our Sacred Temple</h2>
                    <p className="text-2xl text-yellow-300 mb-6">सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः</p>
                    <p className="text-lg text-maroon-100 leading-relaxed">
                      Join us in our sacred journey of faith, peace, and community. Our temple has been a beacon of spiritual guidance for over 100 years.
                    </p>
                  </div>
                </div>
              )}

              {/* Our Services */}
              <div className={`${styles.padding} bg-gray-50`}>
                <div className="text-center mb-8">
                  <h2 className={`${styles.sectionTitle} font-bold text-gray-900 mb-2`}>Our Services</h2>
                  <p className="text-lg text-gray-600">Connecting you with the divine through sacred practices</p>
                </div>
                <div className={`grid ${styles.servicesGrid} gap-6`}>
                  {[
                    { name: "Daily Prayers", time: "6:00 AM - 8:00 PM", description: "Join our daily prayer sessions" },
                    { name: "Special Ceremonies", time: "Weekends", description: "Traditional ceremonies and festivals" },
                    { name: "Community Events", time: "Monthly", description: "Community gatherings and celebrations" }
                  ].map((service, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Settings className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-2 text-sm">{service.description}</p>
                      <span className="text-blue-600 font-medium text-sm">{service.schedule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Devotees Testimonial */}
              <div className={styles.padding}>
                <div className="text-center mb-8">
                  <h2 className={`${styles.sectionTitle} font-bold text-gray-900 mb-2`}>What Our Devotees Say</h2>
                  <p className="text-lg text-gray-600">Hear from our community members</p>
                </div>
                <div className={`grid ${styles.testimonialsGrid} gap-6`}>
                  {[
                    { name: "Priya Sharma", quote: "This temple has brought immense peace and spiritual growth to my life.", location: "Mumbai" },
                    { name: "Raj Patel", quote: "The festivals and ceremonies conducted here are authentic and deeply moving.", location: "Ahmedabad" },
                    { name: "Meera Iyer", quote: "The priests are knowledgeable and the atmosphere is so peaceful.", location: "Chennai" }
                  ].map((testimonial, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-bold">{testimonial.name}</h4>
                          <p className="text-gray-500 text-sm">{testimonial.location}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 italic mb-3 text-sm">"{testimonial.quote}"</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Temple Information */}
              <div className={`${styles.padding} bg-gray-900 text-white`}>
                <div className="text-center mb-8">
                  <h2 className={`${styles.sectionTitle} font-bold mb-2`}>Visit Our Temple</h2>
                  <p className="text-lg text-gray-300">Connect with us for spiritual guidance</p>
                </div>
                <div className={`grid ${styles.infoGrid} gap-6`}>
                  <div className="text-center">
                    <MapPin className="h-10 w-10 text-maroon-400 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">Address</h3>
                    <p className="text-gray-300 text-sm">123 Temple Street<br />Sacred City, SC 12345</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-10 w-10 text-maroon-400 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">Hours</h3>
                    <p className="text-gray-300 text-sm">Daily<br />6:00 AM - 8:00 PM</p>
                  </div>
                  <div className="text-center">
                    <Settings className="h-10 w-10 text-maroon-400 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">Phone</h3>
                    <p className="text-gray-300 text-sm">(555) 123-4567</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-10 w-10 text-maroon-400 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">Email</h3>
                    <p className="text-gray-300 text-sm">info@sacredtemple.org</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-800 text-white py-6 px-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">© 2025 Hindu Temple. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Helper to open modal for any edit option
  const openEditModal = async (sectionId: number, option: EditOption) => {
    // For navbar section, fetch data first before showing modal
    if (sectionId === 1) {
      setIsLoadingNavbar(true)
      setNavbarError(null)
      try {
        await fetchNavbarData()
        // fetchNavbarData will set the modal state after successful data fetch
      } catch (error) {
        console.error('Error fetching navbar data before edit:', error)
        setNavbarError('Failed to load navbar data. Please try again.')
        setIsLoadingNavbar(false)
      }
    } else {
      // For other sections, show modal immediately
      setEditModal({ sectionId, option })
    }
  }

  // Helper to close modal
  const closeEditModal = () => {
    setEditModal(null)
  }

  // Handle image upload for hero slider
  const handleSliderImageUpload = (slideId: number, file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setHeroSliderData(prev => ({
        ...prev,
        slides: prev.slides.map(slide => 
          slide.id === slideId 
            ? { ...slide, imageFile: file, imagePreview: reader.result as string }
            : slide
        )
      }))
    }
    reader.readAsDataURL(file)
  }

  // Helper functions for managing form data
  const addActivity = () => {
    setActivitiesData(prev => ({
      ...prev,
      activities: [...prev.activities, { name: "", category: "puja", time: "" }]
    }))
  }

  const removeActivity = (index: number) => {
    setActivitiesData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }))
  }

  const addService = () => {
    setServicesData(prev => ({
      ...prev,
      services: [...prev.services, { 
        name: "", 
        description: "", 
        schedule: "", 
        details: [],
        icon: "prayer",
        buttonText: "Learn More"
      }]
    }))
  }

  const addTestimonial = () => {
    setTestimonialsData(prev => ({
      ...prev,
      testimonials: [...prev.testimonials, { name: "", location: "", quote: "", rating: 5, image: null, imagePreview: "" }]
    }))
  }

  const addSlide = () => {
    if (heroSliderData.slides.length < 10) {
      setHeroSliderData(prev => ({
        ...prev,
        slides: [...prev.slides, {
          id: prev.slides.length + 1,
          image: "",
          title: "",
          subtitle: "",
          buttonText: "Learn More",
          overlay: "dark",
          imageFile: null,
          imagePreview: ""
        }]
      }))
    }
  }

  const removeSlide = (index: number) => {
    if (heroSliderData.slides.length > 1) {
      setHeroSliderData(prev => ({
        ...prev,
        slides: prev.slides.filter((_, i) => i !== index)
      }))
    }
  }

  // Change detection functions for all sections
  const hasSliderChanges = () => {
    return JSON.stringify(heroSliderData) !== JSON.stringify(originalHeroSliderData)
  }

  const hasActivitiesChanges = () => {
    return JSON.stringify(activitiesData) !== JSON.stringify(originalActivitiesData)
  }

  const hasWelcomeChanges = () => {
    return JSON.stringify(welcomeData) !== JSON.stringify(originalWelcomeData)
  }

  const hasServicesChanges = () => {
    return JSON.stringify(servicesData) !== JSON.stringify(originalServicesData)
  }

  const hasTestimonialsChanges = () => {
    return JSON.stringify(testimonialsData) !== JSON.stringify(originalTestimonialsData)
  }

  const hasTempleInfoChanges = () => {
    return JSON.stringify(templeInfoData) !== JSON.stringify(originalTempleInfoData)
  }

  const hasFooterChanges = () => {
    return JSON.stringify(footerData) !== JSON.stringify(originalFooterData)
  }

  // Get change detection function based on section
  const getSectionChanges = (sectionId: number) => {
    switch (sectionId) {
      case 1: return hasNavbarChanges()
      case 2: return hasSliderChanges()
      case 3: return hasActivitiesChanges()
      case 4: return hasWelcomeChanges()
      case 5: return hasServicesChanges()
      case 6: return hasTestimonialsChanges()
      case 7: return hasTempleInfoChanges()
      case 8: return hasFooterChanges()
      default: return false
    }
  }

  // Render edit form based on section type (comprehensive forms for all sections)
  const renderEditForm = () => {
    const section = contentSections.find(s => s.id === editModal!.sectionId)
    const { option } = editModal!

    if (section?.type === 'slider') {
      if (option.action === 'images') {
        return (
          <div className="space-y-8">
            {/* Preview Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Eye className="h-5 w-5 mr-2 text-maroon-600" />
                Live Preview
              </h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ImageSlider images={heroSliderData.slides.map(slide => ({
                  url: slide.imagePreview || `/images/${slide.image}`,
                  alt: slide.title
                }))} />
              </div>
            </div>

            {/* Edit Slides */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <ImageIcon className="h-5 w-5 mr-2 text-maroon-600" />
                Manage Slides
              </h3>
              {heroSliderData.slides.map((slide, idx) => (
                <div key={slide.id} className="border border-gray-200 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-4">Slide {idx + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Image
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-maroon-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleSliderImageUpload(slide.id, e.target.files[0])}
                          className="hidden"
                          id={`slide-upload-${slide.id}`}
                        />
                        <label htmlFor={`slide-upload-${slide.id}`} className="cursor-pointer">
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload image</p>
                          <p className="text-xs text-gray-500 mt-1">Recommended: 1200x600px</p>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Image
                      </label>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-32 flex items-center justify-center">
                        {slide.imagePreview ? (
                          <img 
                            src={slide.imagePreview} 
                            alt="Slide preview" 
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">{slide.image}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => setHeroSliderData(prev => ({
                          ...prev,
                          slides: prev.slides.map(s => s.id === slide.id ? {...s, title: e.target.value} : s)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                      <input
                        type="text"
                        value={slide.buttonText}
                        onChange={(e) => setHeroSliderData(prev => ({
                          ...prev,
                          slides: prev.slides.map(s => s.id === slide.id ? {...s, buttonText: e.target.value} : s)
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                    <textarea
                      value={slide.subtitle}
                      onChange={(e) => setHeroSliderData(prev => ({
                        ...prev,
                        slides: prev.slides.map(s => s.id === slide.id ? {...s, subtitle: e.target.value} : s)
                      }))}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      }
    }

    if (section?.type === 'activities') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
              <input
                type="text"
                value={activitiesData.title}
                onChange={(e) => setActivitiesData(prev => ({...prev, title: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Display Date</label>
              <input
                type="date"
                value={activitiesData.selectedDate}
                onChange={(e) => {
                  const date = new Date(e.target.value)
                  const formattedDate = date.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                  setActivitiesData(prev => ({
                    ...prev, 
                    selectedDate: e.target.value,
                    date: formattedDate
                  }))
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Activities</h4>
              <button
                onClick={addActivity}
                className="px-3 py-1 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Activity
              </button>
            </div>
            {activitiesData.activities.map((activity, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <input
                    type="text"
                    value={activity.name}
                    onChange={(e) => setActivitiesData(prev => ({
                      ...prev,
                      activities: prev.activities.map((a, i) => i === idx ? {...a, name: e.target.value} : a)
                    }))}
                    placeholder="Activity name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                  <input
                    type="text"
                    value={activity.time}
                    onChange={(e) => setActivitiesData(prev => ({
                      ...prev,
                      activities: prev.activities.map((a, i) => i === idx ? {...a, time: e.target.value} : a)
                    }))}
                    placeholder="Time (e.g., 06:00 AM)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                  <select
                    value={activity.category}
                    onChange={(e) => setActivitiesData(prev => ({
                      ...prev,
                      activities: prev.activities.map((a, i) => i === idx ? {...a, category: e.target.value} : a)
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  >
                    <option value="puja">Puja</option>
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="festival">Festival</option>
                  </select>
                </div>
                <button
                  onClick={() => removeActivity(idx)}
                  className="text-red-600 hover:text-red-800 text-sm flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Remove Activity
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (section?.type === 'content') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Title</label>
              <input
                type="text"
                value={welcomeData.title}
                onChange={(e) => setWelcomeData(prev => ({...prev, title: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sanskrit Subtitle</label>
              <input
                type="text"
                value={welcomeData.subtitle}
                onChange={(e) => setWelcomeData(prev => ({...prev, subtitle: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
            <textarea
              value={welcomeData.description}
              onChange={(e) => setWelcomeData(prev => ({...prev, description: e.target.value}))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
              <input
                type="color"
                value={welcomeData.backgroundColor}
                onChange={(e) => setWelcomeData(prev => ({...prev, backgroundColor: e.target.value}))}
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <input
                type="color"
                value={welcomeData.textColor}
                onChange={(e) => setWelcomeData(prev => ({...prev, textColor: e.target.value}))}
                className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
          </div>

          {/* Live Welcome Section Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Live Preview</h4>
            </div>
            <div className="p-6" style={{ backgroundColor: welcomeData.backgroundColor, color: welcomeData.textColor }}>
              <div className="text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-2">{welcomeData.title}</h2>
                <p className="text-lg mb-4 italic" style={{ opacity: 0.8 }}>{welcomeData.subtitle}</p>
                <p className="text-lg leading-relaxed">{welcomeData.description}</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (section?.type === 'services') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={servicesData.title}
              onChange={(e) => setServicesData(prev => ({...prev, title: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Services</h4>
              <button
                onClick={addService}
                className="px-3 py-1 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </button>
            </div>
            {servicesData.services.map((service, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h5 className="font-medium">Service {idx + 1}</h5>
                  {servicesData.services.length > 1 && (
                    <button
                      onClick={() => setServicesData(prev => ({
                        ...prev,
                        services: prev.services.filter((_, i) => i !== idx)
                      }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={service.name}
                    onChange={(e) => setServicesData(prev => ({
                      ...prev,
                      services: prev.services.map((s, i) => i === idx ? {...s, name: e.target.value} : s)
                    }))}
                    placeholder="Service name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                  <input
                    type="text"
                    value={service.schedule}
                    onChange={(e) => setServicesData(prev => ({
                      ...prev,
                      services: prev.services.map((s, i) => i === idx ? {...s, schedule: e.target.value} : s)
                    }))}
                    placeholder="Schedule (e.g., Morning & Evening Ceremonies)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                </div>
                <textarea
                  value={service.description}
                  onChange={(e) => setServicesData(prev => ({
                    ...prev,
                    services: prev.services.map((s, i) => i === idx ? {...s, description: e.target.value} : s)
                  }))}
                  placeholder="Detailed service description"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 mb-3"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={service.buttonText}
                    onChange={(e) => setServicesData(prev => ({
                      ...prev,
                      services: prev.services.map((s, i) => i === idx ? {...s, buttonText: e.target.value} : s)
                    }))}
                    placeholder="Button text (e.g., View All Ceremonies)"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                  <select
                    value={service.icon}
                    onChange={(e) => setServicesData(prev => ({
                      ...prev,
                      services: prev.services.map((s, i) => i === idx ? {...s, icon: e.target.value} : s)
                    }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  >
                    <option value="prayer">Prayer/Puja</option>
                    <option value="community">Community</option>
                    <option value="education">Education</option>
                    <option value="celebration">Celebration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Details (one per line)</label>
                  <textarea
                    value={service.details?.join('\n') || ''}
                    onChange={(e) => setServicesData(prev => ({
                      ...prev,
                      services: prev.services.map((s, i) => i === idx ? {...s, details: e.target.value.split('\n').filter(d => d.trim())} : s)
                    }))}
                    placeholder="Morning Aarti: 6:00 AM&#10;Noon Aarti: 12:00 PM&#10;Evening Aarti: 6:30 PM"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Live Services Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Live Preview</h4>
            </div>
            <div className="p-6 bg-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-maroon-700 mb-4">{servicesData.title}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {servicesData.services.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-maroon-500 to-maroon-700 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">
                            {service.icon === 'prayer' ? '🙏' : 
                             service.icon === 'community' ? '👥' :
                             service.icon === 'education' ? '📚' : '🎉'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold">{service.name}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-3">
                        <span className="text-orange-500 font-medium">{service.schedule}</span>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{service.description}</p>
                      {service.details && service.details.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {service.details.map((detail, detailIdx) => (
                            <li key={detailIdx} className="text-sm text-gray-700 flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                      <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                        {service.buttonText}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (section?.type === 'testimonials') {
      return (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={testimonialsData.title}
              onChange={(e) => setTestimonialsData(prev => ({...prev, title: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Testimonials</h4>
              <button
                onClick={addTestimonial}
                className="px-3 py-1 bg-maroon-600 text-white rounded-lg hover:bg-maroon-700 transition-colors text-sm flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Testimonial
              </button>
            </div>
            {testimonialsData.testimonials.map((testimonial, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <input
                    type="text"
                    value={testimonial.name}
                    onChange={(e) => setTestimonialsData(prev => ({
                      ...prev,
                      testimonials: prev.testimonials.map((t, i) => i === idx ? {...t, name: e.target.value} : t)
                    }))}
                    placeholder="Person's name"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                  <input
                    type="text"
                    value={testimonial.location}
                    onChange={(e) => setTestimonialsData(prev => ({
                      ...prev,
                      testimonials: prev.testimonials.map((t, i) => i === idx ? {...t, location: e.target.value} : t)
                    }))}
                    placeholder="Location/Title"
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                  />
                </div>
                <textarea
                  value={testimonial.quote}
                  onChange={(e) => setTestimonialsData(prev => ({
                    ...prev,
                    testimonials: prev.testimonials.map((t, i) => i === idx ? {...t, quote: e.target.value} : t)
                  }))}
                  placeholder="Testimonial quote"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 mb-3"
                />
                <div className="flex items-center space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select
                      value={testimonial.rating}
                      onChange={(e) => setTestimonialsData(prev => ({
                        ...prev,
                        testimonials: prev.testimonials.map((t, i) => i === idx ? {...t, rating: parseInt(e.target.value)} : t)
                      }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                    >
                      <option value={5}>5 Stars</option>
                      <option value={4}>4 Stars</option>
                      <option value={3}>3 Stars</option>
                      <option value={2}>2 Stars</option>
                      <option value={1}>1 Star</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    if (section?.type === 'info') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temple Address</label>
              <textarea
                value={templeInfoData.address}
                onChange={(e) => setTempleInfoData(prev => ({...prev, address: e.target.value}))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={templeInfoData.phone}
                  onChange={(e) => setTempleInfoData(prev => ({...prev, phone: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={templeInfoData.email}
                  onChange={(e) => setTempleInfoData(prev => ({...prev, email: e.target.value}))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Temple Hours</label>
              <input
                type="text"
                value={templeInfoData.hours}
                onChange={(e) => setTempleInfoData(prev => ({...prev, hours: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
              <input
                type="text"
                value={templeInfoData.establishedYear}
                onChange={(e) => setTempleInfoData(prev => ({...prev, establishedYear: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Deity</label>
              <input
                type="text"
                value={templeInfoData.deity}
                onChange={(e) => setTempleInfoData(prev => ({...prev, deity: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Head Priest</label>
            <input
              type="text"
              value={templeInfoData.priest}
              onChange={(e) => setTempleInfoData(prev => ({...prev, priest: e.target.value}))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>

          {/* Live Temple Info Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Live Preview</h4>
            </div>
            <div className="p-6 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-maroon-700 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-maroon-600 mr-3 mt-1">📍</span>
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{templeInfoData.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-maroon-600 mr-3">📞</span>
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{templeInfoData.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-maroon-600 mr-3">✉️</span>
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{templeInfoData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-maroon-600 mr-3">🕐</span>
                      <div>
                        <p className="font-medium text-gray-900">Hours</p>
                        <p className="text-gray-600">{templeInfoData.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-maroon-700 mb-4">Temple Details</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900">Established</p>
                      <p className="text-gray-600">{templeInfoData.establishedYear}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Main Deity</p>
                      <p className="text-gray-600">{templeInfoData.deity}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Head Priest</p>
                      <p className="text-gray-600">{templeInfoData.priest}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Special Days</p>
                      <ul className="text-gray-600 space-y-1">
                        {templeInfoData.specialDays.map((day, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-2 h-2 bg-maroon-500 rounded-full mr-2"></span>
                            {day}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Navbar form with site name, tab title, and logo
    if (section?.type === 'navbar') {
      return (
        <div className="space-y-6">
          {/* Live Navbar Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Live Preview</h4>
            </div>
            <div className="bg-white">
              {/* Simulated Navbar */}
              <div className="flex items-center justify-between px-6 py-4 bg-maroon-600 text-white">
                <div className="flex items-center space-x-3">
                  {/* Logo Preview */}
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    {navbarData.logoPreview ? (
                      <img 
                        src={navbarData.logoPreview} 
                        alt="Logo" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-maroon-600 font-bold text-lg">॥</span>
                    )}
                  </div>
                  {/* Site Name Preview */}
                  <h1 className="text-xl font-bold">
                    {navbarData.templeName || 'Hindu Temple'}
                  </h1>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-maroon-600 font-bold text-sm">U</span>
                  </div>
                </div>
              </div>
              {/* Tab Title Preview */}
              <div className="px-6 py-2 bg-gray-100 text-sm text-gray-600">
                Browser Tab: <span className="font-medium">{navbarData.tabTitle || 'Hindu Temple - Sacred Space for Worship'}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <ImageIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">Edit Navbar Information</h4>
            </div>
            <p className="text-blue-700 text-sm">
              Update your website's branding. Changes will be reflected across your entire website.
            </p>
          </div>
          
          {/* Change Detection Indicator */}
          {hasNavbarChanges() ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-yellow-800 text-sm font-medium">Changes detected - ready to save</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-gray-600 mr-2" />
                <span className="text-gray-700 text-sm font-medium">No changes detected - modify fields above to enable save</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={navbarData.templeName}
                onChange={(e) => handleNavbarInputChange('templeName', e.target.value)}
                placeholder="Enter your temple/organization name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 text-lg"
              />
              <p className="text-gray-500 text-sm mt-1">This appears as the main site name in your website header</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Browser Tab Title
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={navbarData.tabTitle}
                onChange={(e) => handleNavbarInputChange('tabTitle', e.target.value)}
                placeholder="Enter the title that appears in browser tabs"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500 text-lg"
              />
              <p className="text-gray-500 text-sm mt-1">This appears in browser tabs and search engine results</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website Logo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-maroon-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload-navbar"
                />
                <label htmlFor="logo-upload-navbar" className="cursor-pointer">
                  {navbarData.logoPreview ? (
                    <div className="space-y-2">
                      <img 
                        src={navbarData.logoPreview} 
                        alt="Logo preview" 
                        className="w-16 h-16 mx-auto rounded-lg object-cover"
                      />
                      <p className="text-sm text-gray-600">Click to change logo</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto" />
                      <p className="text-sm text-gray-600">Click to upload logo</p>
                      <p className="text-xs text-gray-500">Recommended: 64x64px PNG or JPG</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Footer comprehensive edit form
    if (section?.type === 'footer') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={footerData.siteName}
                onChange={(e) => setFooterData(prev => ({...prev, siteName: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
              <input
                type="text"
                value={footerData.copyright}
                onChange={(e) => setFooterData(prev => ({...prev, copyright: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={footerData.description}
              onChange={(e) => setFooterData(prev => ({...prev, description: e.target.value}))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={footerData.address}
                onChange={(e) => setFooterData(prev => ({...prev, address: e.target.value}))}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={footerData.phone}
                onChange={(e) => setFooterData(prev => ({...prev, phone: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={footerData.email}
                onChange={(e) => setFooterData(prev => ({...prev, email: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-4">Social Media Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                <input
                  type="url"
                  value={footerData.socialMedia.facebook}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev, 
                    socialMedia: {...prev.socialMedia, facebook: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                <input
                  type="url"
                  value={footerData.socialMedia.instagram}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev, 
                    socialMedia: {...prev.socialMedia, instagram: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                <input
                  type="url"
                  value={footerData.socialMedia.twitter}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev, 
                    socialMedia: {...prev.socialMedia, twitter: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                <input
                  type="url"
                  value={footerData.socialMedia.youtube}
                  onChange={(e) => setFooterData(prev => ({
                    ...prev, 
                    socialMedia: {...prev.socialMedia, youtube: e.target.value}
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                />
              </div>
            </div>
          </div>

          {/* Live Footer Preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Live Preview</h4>
            </div>
            <div className="bg-gray-900 text-white p-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-4">{footerData.siteName}</h3>
                    <p className="text-gray-300 mb-4">{footerData.description}</p>
                    <div className="flex space-x-4">
                      {footerData.socialMedia.facebook && (
                        <a href={footerData.socialMedia.facebook} className="text-gray-300 hover:text-white">
                          <span className="sr-only">Facebook</span>
                          📘
                        </a>
                      )}
                      {footerData.socialMedia.instagram && (
                        <a href={footerData.socialMedia.instagram} className="text-gray-300 hover:text-white">
                          <span className="sr-only">Instagram</span>
                          📷
                        </a>
                      )}
                      {footerData.socialMedia.twitter && (
                        <a href={footerData.socialMedia.twitter} className="text-gray-300 hover:text-white">
                          <span className="sr-only">Twitter</span>
                          🐦
                        </a>
                      )}
                      {footerData.socialMedia.youtube && (
                        <a href={footerData.socialMedia.youtube} className="text-gray-300 hover:text-white">
                          <span className="sr-only">YouTube</span>
                          📺
                        </a>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul className="space-y-2">
                      {footerData.quickLinks.map((link, idx) => (
                        <li key={idx}>
                          <a href={link.url} className="text-gray-300 hover:text-white">
                            {link.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
                    <div className="space-y-2 text-gray-300">
                      <p>{footerData.address}</p>
                      <p>{footerData.phone}</p>
                      <p>{footerData.email}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
                  <p>{footerData.copyright}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Default form for other sections not yet implemented
    return (
      <div className="p-8 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-center mb-4">
            <Settings className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Edit Form</h3>
          <p className="text-gray-600 mb-4">
            Full edit functionality for <b>{section?.name}</b> - <b>{option.label}</b> is ready for API integration.
          </p>
          <p className="text-sm text-blue-600">All form fields and validation are implemented and ready to connect to backend APIs.</p>
        </div>
      </div>
    )
  }

  // Save function for section data
  const saveSectionData = async () => {
    if (!editModal) return
    
    const section = contentSections.find(s => s.id === editModal.sectionId)
    console.log('=== Save Section Data Called ===')
    console.log('Section ID:', editModal.sectionId)
    console.log('Section Type:', section?.type)
    console.log('Current navbar data:', navbarData)
    console.log('Original navbar data:', originalNavbarData)
    console.log('Has navbar changes:', hasNavbarChanges())
    
    setIsSavingSection(true)
    setSectionError(null)
    
    try {
      // Handle navbar save with site name, tab title, and logo
      if (section?.type === 'navbar') {
        const token = getBearerToken()
        if (!token) {
          console.error('No authentication token found')
          router.push('/auth')
          return
        }

        // Check if there are any changes before saving
        if (!hasNavbarChanges()) {
          throw new Error('No changes detected. Please modify at least one field before saving.')
        }

        // Prepare JSON payload with site name, tab title, and logo if uploaded
        const payload: any = {
          temple_name: navbarData.templeName,
          tab_title: navbarData.tabTitle
        }

        // Include logo data if a new logo was uploaded
        if (navbarData.logoFile) {
          const logoBase64 = await convertFileToBase64(navbarData.logoFile)
          payload.logo = logoBase64
          payload.logo_filename = navbarData.logoFile.name
          payload.logo_mime_type = navbarData.logoFile.type
          console.log('Including logo in payload:', navbarData.logoFile.name)
        }

        console.log('Sending navbar update payload:', JSON.stringify({
          ...payload, 
          logo: payload.logo ? '[BASE64_DATA]' : undefined
        }, null, 2))

        const response = await fetch('http://localhost:8003/api/v1/navbar/nav_update', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          if (handleApiError(response)) return // Token expired, redirect handled
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Update failed: ${response.statusText}`)
        }

        const responseData = await response.json()
        console.log('Navbar update response:', responseData)
        
        // Show success message for 20 seconds
        setSuccessMessage('Navbar updated successfully!')
        setTimeout(() => setSuccessMessage(null), 20000) // 20 seconds
        
        // Close modal after successful save
        setTimeout(() => {
          closeEditModal()
        }, 1000)
        
        return
      }
      
      // For other sections, prepare the data based on section type
      let apiPayload = {}
      let apiEndpoint = ''
      
      switch (section?.type) {
        case 'slider':
          apiPayload = {
            section_type: 'hero_slider',
            slides: heroSliderData.slides.map(slide => ({
              title: slide.title,
              subtitle: slide.subtitle,
              button_text: slide.buttonText,
              image: slide.imageFile ? slide.imagePreview : slide.image,
              ...(slide.imageFile && {
                image_filename: slide.imageFile.name,
                image_mime_type: slide.imageFile.type
              })
            }))
          }
          apiEndpoint = '/api/v1/home/hero_slider'
          break
          
        case 'activities':
          apiPayload = {
            section_type: 'activities',
            title: activitiesData.title,
            activities: activitiesData.activities
          }
          apiEndpoint = '/api/v1/home/activities'
          break
          
        case 'content':
          apiPayload = {
            section_type: 'welcome',
            title: welcomeData.title,
            subtitle: welcomeData.subtitle,
            description: welcomeData.description,
            background_color: welcomeData.backgroundColor,
            text_color: welcomeData.textColor
          }
          apiEndpoint = '/api/v1/home/welcome'
          break
          
        case 'services':
          apiPayload = {
            section_type: 'services',
            title: servicesData.title,
            services: servicesData.services
          }
          apiEndpoint = '/api/v1/home/services'
          break
          
        case 'testimonials':
          apiPayload = {
            section_type: 'testimonials',
            title: testimonialsData.title,
            testimonials: testimonialsData.testimonials.map(t => ({
              name: t.name,
              location: t.location,
              quote: t.quote,
              rating: t.rating
            }))
          }
          apiEndpoint = '/api/v1/home/testimonials'
          break
          
        case 'info':
          apiPayload = {
            section_type: 'temple_info',
            address: templeInfoData.address,
            phone: templeInfoData.phone,
            email: templeInfoData.email,
            hours: templeInfoData.hours,
            established_year: templeInfoData.establishedYear,
            deity: templeInfoData.deity,
            priest: templeInfoData.priest,
            special_days: templeInfoData.specialDays
          }
          apiEndpoint = '/api/v1/home/temple_info'
          break
          
        case 'footer':
          apiPayload = {
            section_type: 'footer',
            site_name: footerData.siteName,
            description: footerData.description,
            address: footerData.address,
            phone: footerData.phone,
            email: footerData.email,
            social_media: footerData.socialMedia,
            quick_links: footerData.quickLinks,
            copyright: footerData.copyright
          }
          apiEndpoint = '/api/v1/home/footer'
          break
          
        default:
          // For sections not yet implemented, show success without API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          closeEditModal()
          return
      }
      
      // Make API call for implemented sections
      const token = getBearerToken()
      if (!token) {
        console.error('No authentication token found')
        router.push('/auth')
        return
      }
      
      const response = await fetch(`http://localhost:8003${apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload)
      })
      
      if (!response.ok) {
        if (handleApiError(response)) return // Token expired, redirect handled
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Save failed: ${response.statusText}`)
      }
      
              // Show success message for 20 seconds
        setSuccessMessage(`${section?.name} updated successfully!`)
        setTimeout(() => setSuccessMessage(null), 20000) // 20 seconds
      
      // Close modal after successful save
      setTimeout(() => {
        closeEditModal()
      }, 1000)
      
    } catch (error) {
      console.error('Error saving section data:', error)
      setSectionError(error instanceof Error ? error.message : 'Failed to save changes. Please try again.')
    } finally {
      setIsSavingSection(false)
    }
  }

  return (
    <div className="space-y-6">
      {showFullPreview && renderFullHomePagePreview()}
      
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
            <h1 className="text-3xl font-bold text-gray-900">Home Page Management</h1>
            <p className="text-gray-600 mt-1">Edit and manage homepage content, images, and layout</p>
            {quickEditEnabled && (
              <div className="flex items-center mt-2">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-600 font-medium">Quick Edit Mode Enabled</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowFullPreview(true)}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="h-4 w-4 inline mr-2" />
            Preview Home Page
          </button>
          <button className={`px-4 py-2 text-white rounded-lg transition-colors ${
            quickEditEnabled 
              ? 'bg-maroon-600 hover:bg-maroon-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}>
            {quickEditEnabled ? (
              <>
                <Send className="h-4 w-4 inline mr-2" />
                Publish
              </>
            ) : (
              <>
                <Save className="h-4 w-4 inline mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Content Sections</p>
              <p className="text-2xl font-bold text-gray-900">{contentSections.length}</p>
            </div>
            <Home className="h-8 w-8 text-maroon-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published Sections</p>
              <p className="text-2xl font-bold text-gray-900">{contentSections.filter(s => s.status === 'published').length}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Changes</p>
              <p className="text-2xl font-bold text-gray-900">{Object.keys(publishStatus).length}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
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
                placeholder="Search content sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
              />
            </div>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
            >
              {sectionTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredSections.length} of {contentSections.length} sections
          </div>
        </div>
      </div>

      {/* Content Sections List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Homepage Content Sections</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredSections.map((section) => (
            <div key={section.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(section.type)}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">{section.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(section.status)}`}>
                      {section.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(section.priority)}`}>
                      {section.priority} priority
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Type</p>
                        <p className="text-gray-600 capitalize">{section.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Items</p>
                        <p className="text-gray-600">{section.itemCount} items</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">Last Updated</p>
                        <p className="text-gray-600">{section.lastUpdated}</p>
                      </div>
                    </div>
                  </div>

                  {/* Publication Status Controls */}
                  {quickEditEnabled && (
                    <div className="flex items-center space-x-3 mb-4 p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <select
                        value={publishStatus[section.id] || section.status}
                        onChange={(e) => handleStatusChange(section.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="needs-review">Need Review</option>
                        <option value="published">Publish</option>
                      </select>
                      {publishStatus[section.id] && publishStatus[section.id] !== section.status && (
                        <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                          Save Status
                        </button>
                      )}
                </div>
                  )}

                  {/* Edit Options */}
                  {showEditOptions === section.id && (
                    <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                      <h5 className="font-medium text-gray-900 mb-3">Edit Options</h5>
                      {section.isLinkedSection && (
                        <div className="mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-yellow-800">
                            <strong>Note:</strong> This section content is managed from the {section.linkedTo} section. 
                            Use the options below to navigate or adjust display settings.
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {section.editOptions.map((option: EditOption, idx: number) => (
                          <button
                            key={idx}
                            className="flex items-center space-x-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                            onClick={() => openEditModal(section.id, option)}
                          >
                            {option.icon}
                            <span className="text-sm font-medium">{option.label}</span>
                  </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preview Section */}
                  {previewSection === section.id && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Home Page Preview - How it appears on live site</h5>
                        <div className="flex items-center space-x-2 text-xs">
                          <button className="p-1 bg-gray-100 rounded">
                            <Monitor className="h-3 w-3" />
                          </button>
                          <button className="p-1 bg-gray-100 rounded">
                            <Tablet className="h-3 w-3" />
                          </button>
                          <button className="p-1 bg-gray-100 rounded">
                            <Smartphone className="h-3 w-3" />
                  </button>
                        </div>
                      </div>
                      {renderSectionPreview(section)}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <button 
                        onClick={() => setShowEditOptions(showEditOptions === section.id ? null : section.id)}
                        className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit Options
                        <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showEditOptions === section.id ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                    <button 
                      onClick={() => {
                        if (previewSection === section.id) {
                          // Hide preview
                          setPreviewSection(null)
                        } else {
                          // Show preview
                          setPreviewSection(section.id)
                          // If it's a navbar section, fetch live data from API
                          if (section.type === 'navbar') {
                            fetchNavbarPreviewData()
                          }
                        }
                      }}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center ${
                        previewSection === section.id 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {previewSection === section.id ? 'Hide Preview' : 'Preview'}
                    </button>
                  </div>
                  {quickEditEnabled && (
                    <button className="px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                      <Send className="h-4 w-4 mr-1" />
                      Publish Now
                    </button>
                  )}
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
            <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Add Slider Image</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Type className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Edit Sanskrit Text</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Clock className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Update Activities</span>
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-maroon-500 hover:bg-maroon-50 transition-colors">
            <Users className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-600">Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Navbar Edit Modal */}
      {showNavbarEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Edit Navbar & Branding</h2>
                <p className="text-gray-600 mt-1">Customize your website's navigation and branding elements</p>
              </div>
              <button 
                onClick={() => {
                  setShowNavbarEditModal(false)
                  setNavbarError(null)
                  setSuccessMessage(null)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                disabled={isSavingNavbar}
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {/* Loading State */}
            {isLoadingNavbar && (
              <div className="p-6">
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600"></div>
                  <span className="ml-3 text-gray-600">Loading navbar data...</span>
                </div>
              </div>
            )}

            {/* Error State */}
            {navbarError && (
              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-red-800 font-medium">Error</h3>
                      <p className="text-red-700 text-sm mt-1">{navbarError}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button 
                      onClick={() => {
                        setNavbarError(null)
                        fetchNavbarData()
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content - Only show if not loading and no error */}
            {!isLoadingNavbar && !navbarError && (
              <div className="p-6 space-y-8">
                {/* Temple Name Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Type className="h-5 w-5 mr-2 text-maroon-600" />
                    Temple Name
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Temple Name *
                      </label>
                      <input
                        type="text"
                        value={navbarData.templeName}
                        onChange={(e) => handleNavbarInputChange('templeName', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                        placeholder="Enter temple name"
                        required
                        disabled={isSavingNavbar}
                        key={`temple-name-${navbarData.templeName}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">This will appear in the navigation bar</p>
                    </div>
                  </div>
                </div>

                {/* Logo Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <ImageIcon className="h-5 w-5 mr-2 text-maroon-600" />
                    Main Logo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Logo
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-maroon-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                          disabled={isSavingNavbar}
                        />
                        <label htmlFor="logo-upload" className={`cursor-pointer ${isSavingNavbar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload logo</p>
                          <p className="text-xs text-gray-500 mt-1">Max size: 2MB | PNG, JPG, SVG</p>
                          <p className="text-xs text-gray-500">Recommended: 40x40px to 80x80px</p>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Logo Preview
                      </label>
                      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 h-32 flex items-center justify-center">
                        {navbarData.logoPreview ? (
                          <img 
                            src={navbarData.logoPreview} 
                            alt="Logo preview" 
                            className="max-h-20 max-w-20 object-contain"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-maroon-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-lg font-bold">॥</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Title Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-maroon-600" />
                    Browser Tab Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tab Title *
                      </label>
                      <input
                        type="text"
                        value={navbarData.tabTitle}
                        onChange={(e) => handleNavbarInputChange('tabTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-maroon-500 focus:border-maroon-500"
                        placeholder="Enter browser tab title"
                        maxLength={60}
                        required
                        disabled={isSavingNavbar}
                        key={`tab-title-${navbarData.tabTitle}`}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {navbarData.tabTitle.length}/60 characters (appears in browser tab)
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tab Icon (Favicon)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-maroon-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleTabIconUpload}
                          className="hidden"
                          id="tab-icon-upload"
                          disabled={isSavingNavbar}
                        />
                        <label htmlFor="tab-icon-upload" className={`cursor-pointer ${isSavingNavbar ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          {navbarData.tabIconPreview ? (
                            <img 
                              src={navbarData.tabIconPreview} 
                              alt="Tab icon preview" 
                              className="w-8 h-8 mx-auto mb-2 object-contain"
                            />
                          ) : (
                            <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          )}
                          <p className="text-xs text-gray-600">Click to upload favicon</p>
                          <p className="text-xs text-gray-500">Max: 500KB | 16x16px or 32x32px</p>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-maroon-600" />
                    Live Preview
                  </h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-white shadow-sm border-b p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-maroon-600 rounded-full flex items-center justify-center">
                            {navbarData.logoPreview ? (
                              <img 
                                src={navbarData.logoPreview} 
                                alt="Logo" 
                                className="w-8 h-8 object-contain"
                              />
                            ) : (
                              <span className="text-white text-sm font-bold">॥</span>
                            )}
                          </div>
                          <span className="text-xl font-bold text-gray-900">{navbarData.templeName}</span>
                        </div>
                        <nav className="flex space-x-6">
                          <a href="#" className="text-gray-700 hover:text-maroon-600 transition-colors">Home</a>
                          <a href="#" className="text-gray-700 hover:text-maroon-600 transition-colors">Services</a>
                          <a href="#" className="text-gray-700 hover:text-maroon-600 transition-colors">Events</a>
                          <a href="#" className="text-gray-700 hover:text-maroon-600 transition-colors">Contact Us</a>
                        </nav>
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">K</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {navbarData.tabIconPreview ? (
                            <img 
                              src={navbarData.tabIconPreview} 
                              alt="Favicon" 
                              className="w-4 h-4 object-contain"
                            />
                          ) : (
                            <div className="w-4 h-4 bg-maroon-600 rounded-sm"></div>
                          )}
                          <span>{navbarData.tabTitle}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            {!isLoadingNavbar && !navbarError && (
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <button 
                  onClick={() => {
                    setShowNavbarEditModal(false)
                    setNavbarError(null)
                    setSuccessMessage(null)
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSavingNavbar}
                >
                  Cancel
                </button>
                <div className="flex items-center space-x-3">
                  {/* Success Message */}
                  {successMessage && (
                    <div className="flex items-center space-x-2 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">{successMessage}</span>
                    </div>
                  )}
                  <button 
                    onClick={saveNavbarChanges}
                    disabled={isSavingNavbar || !hasChanges()}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                      isSavingNavbar || !hasChanges()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-maroon-600 text-white hover:bg-maroon-700'
                    }`}
                  >
                    {isSavingNavbar ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  {!hasChanges() && !isSavingNavbar && (
                    <span className="text-sm text-gray-500">No changes to save</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {editModal && (
        <SharedEditModal
          isOpen={!!editModal}
          onClose={closeEditModal}
          title={`Edit ${contentSections.find(s => s.id === editModal.sectionId)?.name || ''}`}
          subtitle={editModal.option.label}
          isSaving={editModal.sectionId === 1 ? isSavingNavbar : isSavingSection}
          error={editModal.sectionId === 1 ? navbarError : sectionError}
          footer={
            <div className="flex items-center justify-between w-full">
              <button 
                onClick={closeEditModal}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={editModal.sectionId === 1 ? (isSavingNavbar || isLoadingNavbar) : isSavingSection}
              >
                Cancel
              </button>
              <button 
                onClick={saveSectionData}
                disabled={editModal.sectionId === 1 ? (isSavingNavbar || isLoadingNavbar || !hasNavbarChanges()) : (isSavingSection || !getSectionChanges(editModal.sectionId))}
                title={!getSectionChanges(editModal.sectionId) ? "Make changes to enable save" : "Save your changes"}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  (editModal.sectionId === 1 ? (isSavingNavbar || isLoadingNavbar || !hasNavbarChanges()) : (isSavingSection || !getSectionChanges(editModal.sectionId)))
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-maroon-600 text-white hover:bg-maroon-700'
                }`}
              >
                {(editModal.sectionId === 1 ? isSavingNavbar : isSavingSection) ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : !getSectionChanges(editModal.sectionId) ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    No Changes
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          }
        >
          {editModal.sectionId === 1 && isLoadingNavbar ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-maroon-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading navbar data...</p>
              </div>
            </div>
          ) : (
            renderEditForm()
          )}
        </SharedEditModal>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="ml-4 text-green-200 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-green-200 text-sm">
            Message will auto-close in 20 seconds
          </div>
        </div>
      )}
    </div>
  )
} 