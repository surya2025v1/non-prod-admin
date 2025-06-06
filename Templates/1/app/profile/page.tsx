"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  Heart, 
  Home, 
  Phone, 
  Mail, 
  MapPin,
  Star,
  Gift,
  Users,
  Bell,
  Settings,
  LogOut,
  PlusCircle,
  CheckCircle,
  ArrowRight,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  HandHeart,
  PartyPopper,
  Coins,
  HelpCircle,
  TrendingUp,
  Award,
  Calendar as CalendarIcon
} from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("dashboard")
  const router = useRouter()

  // Check authentication and get user data
  useEffect(() => {
    const userData = sessionStorage.getItem('user')
    const isSuccess = sessionStorage.getItem('isSuccess')
    
    if (!userData || !isSuccess) {
      router.push('/auth')
      return
    }
    
    try {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } catch (error) {
      console.error('Error parsing user data:', error)
      router.push('/auth')
    }
  }, [router])

  const sidebarItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      description: "Overview & Analytics"
    },
    {
      id: "services",
      label: "Temple Services",
      icon: <Heart className="h-5 w-5" />,
      description: "Book Spiritual Services"
    },
    {
      id: "volunteer",
      label: "Volunteer Services",
      icon: <HandHeart className="h-5 w-5" />,
      description: "Community Volunteering"
    },
    {
      id: "requests",
      label: "My Requests",
      icon: <CheckCircle className="h-5 w-5" />,
      description: "Track Your Bookings"
    },
    {
      id: "events",
      label: "Community Events",
      icon: <PartyPopper className="h-5 w-5" />,
      description: "Festivals & Celebrations"
    },
    {
      id: "donations",
      label: "Donations",
      icon: <Coins className="h-5 w-5" />,
      description: "Contributions & History"
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: <Settings className="h-5 w-5" />,
      description: "Account Management"
    },
    {
      id: "help",
      label: "Help & Support",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Get Assistance"
    }
  ]

  const services = [
    {
      id: 1,
      title: "Daily Pooja Booking",
      description: "Book your personalized daily prayers and offerings for spiritual blessings",
      icon: <Heart className="h-7 w-7 text-maroon-600" />,
      category: "Worship",
      duration: "30-60 mins",
      price: "₹101 - ₹501",
      popularity: "Most Popular"
    },
    {
      id: 2,
      title: "Special Occasion Ceremonies",
      description: "Wedding ceremonies, naming rituals, housewarming blessings",
      icon: <Star className="h-7 w-7 text-gold-600" />,
      category: "Ceremonies",
      duration: "2-4 hours",
      price: "₹2,001 - ₹10,001",
      popularity: "Premium"
    },
    {
      id: 3,
      title: "Festival Celebrations",
      description: "Join Diwali, Holi, Navratri and seasonal festival celebrations",
      icon: <Gift className="h-7 w-7 text-orange-600" />,
      category: "Festivals",
      duration: "Full Day",
      price: "₹501 - ₹2,001",
      popularity: "Seasonal"
    },
    {
      id: 4,
      title: "Community Kitchen",
      description: "Volunteer or sponsor community meals and charitable food service",
      icon: <Users className="h-7 w-7 text-green-600" />,
      category: "Community",
      duration: "2-3 hours",
      price: "₹101 - ₹1,001",
      popularity: "Community"
    },
    {
      id: 5,
      title: "Spiritual Counseling",
      description: "Personal guidance sessions with experienced spiritual advisors",
      icon: <Bell className="h-7 w-7 text-purple-600" />,
      category: "Guidance",
      duration: "45 mins",
      price: "Free - ₹501",
      popularity: "Personal"
    },
    {
      id: 6,
      title: "Temple Maintenance",
      description: "Support temple upkeep, renovations and infrastructure development",
      icon: <Home className="h-7 w-7 text-blue-600" />,
      category: "Support",
      duration: "Ongoing",
      price: "₹501+",
      popularity: "Impact"
    }
  ]

  const volunteerOpportunities = [
    {
      id: 1,
      title: "Community Kitchen Helper",
      description: "Help prepare and serve meals to devotees and community members",
      icon: <Users className="h-7 w-7 text-green-600" />,
      commitment: "2-4 hours/week",
      category: "Food Service",
      volunteers: 45
    },
    {
      id: 2,
      title: "Event Organizer",
      description: "Assist in planning and executing temple festivals and special events",
      icon: <PartyPopper className="h-7 w-7 text-purple-600" />,
      commitment: "5-10 hours/month",
      category: "Events",
      volunteers: 28
    },
    {
      id: 3,
      title: "Educational Support",
      description: "Teach spiritual classes, language lessons, or cultural workshops",
      icon: <Award className="h-7 w-7 text-blue-600" />,
      commitment: "1-2 hours/week",
      category: "Education",
      volunteers: 15
    },
    {
      id: 4,
      title: "Maintenance & Cleaning",
      description: "Help maintain temple cleanliness and assist with minor repairs",
      icon: <Home className="h-7 w-7 text-orange-600" />,
      commitment: "3-5 hours/month",
      category: "Maintenance",
      volunteers: 32
    }
  ]

  const recentRequests = [
    {
      id: 1,
      service: "Daily Pooja Booking",
      date: "2024-01-15",
      status: "Confirmed",
      time: "6:00 AM",
      amount: "₹501",
      reference: "DP001234"
    },
    {
      id: 2,
      service: "Festival Celebrations",
      date: "2024-01-20",
      status: "Pending",
      time: "10:00 AM",
      amount: "₹1,501",
      reference: "FC001235"
    },
    {
      id: 3,
      service: "Spiritual Counseling",
      date: "2024-01-18",
      status: "Completed",
      time: "4:00 PM",
      amount: "Free",
      reference: "SC001236"
    }
  ]

  const dashboardStats = [
    {
      title: "Services Booked",
      value: "12",
      change: "+3 this month",
      icon: <Heart className="h-6 w-6 text-maroon-600" />,
      trend: "up"
    },
    {
      title: "Volunteer Hours",
      value: "24",
      change: "+8 this month",
      icon: <HandHeart className="h-6 w-6 text-green-600" />,
      trend: "up"
    },
    {
      title: "Total Donations",
      value: "₹5,250",
      change: "+₹1,200 this month",
      icon: <Coins className="h-6 w-6 text-gold-600" />,
      trend: "up"
    },
    {
      title: "Events Attended",
      value: "8",
      change: "+2 this month",
      icon: <PartyPopper className="h-6 w-6 text-purple-600" />,
      trend: "up"
    }
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saffron-25 via-white to-gold-25">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-600"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="h-full">
            <div className="pt-4 px-8 pb-8">
              {/* Dashboard Header with Red Background - Aligned with sidebar Dashboard text */}
              <div className="bg-gradient-to-r from-maroon-600 to-maroon-700 text-white p-8 rounded-2xl shadow-xl mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Welcome back, Charan!</h1>
                    <p className="text-maroon-100 text-lg">Your spiritual journey and temple engagement at a glance</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <span className="text-3xl font-bold">॥</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
                <p className="text-gray-600">Track your activities, services, and community engagement</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {dashboardStats.map((stat, index) => (
                  <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-gradient-to-br from-saffron-50 to-gold-50 rounded-xl">
                          {stat.icon}
                        </div>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="mt-4">
                        <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                        <p className="text-sm text-gray-600 mt-1">{stat.title}</p>
                        <p className="text-xs text-green-600 mt-2 font-medium">{stat.change}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="h-5 w-5 mr-2 text-maroon-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentRequests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-maroon-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{request.service}</p>
                          <p className="text-sm text-gray-600">{request.date} • {request.amount}</p>
                        </div>
                        <Badge className={request.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2 text-maroon-600" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <PartyPopper className="h-5 w-5 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Makar Sankranti Celebration</p>
                        <p className="text-sm text-gray-600">January 14, 2024 • 9:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Gift className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Community Kitchen Drive</p>
                        <p className="text-sm text-gray-600">January 21, 2024 • 11:00 AM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Heart className="h-5 w-5 text-maroon-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">Spiritual Discourse</p>
                        <p className="text-sm text-gray-600">January 28, 2024 • 6:00 PM</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )

      case "services":
        return (
          <div className="h-full">
            <div className="p-8">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-maroon-700 mb-3">Temple Services</h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                  Explore our comprehensive spiritual services and book your divine experiences. 
                  Connect with the divine through our traditional ceremonies and community programs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {services.map((service) => (
                  <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] bg-white/90 backdrop-blur-sm overflow-hidden">
                    <CardHeader className="pb-4 relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-4 bg-gradient-to-br from-saffron-50 to-gold-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                          {service.icon}
                        </div>
                        <Badge 
                          variant="secondary" 
                          className="bg-maroon-50 text-maroon-700 border-maroon-200 font-medium px-3 py-1"
                        >
                          {service.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-maroon-700 transition-colors leading-tight">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            <span className="font-medium">{service.duration}</span>
                          </div>
                          <Badge variant="outline" className="text-xs font-medium">
                            {service.popularity}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Price Range</span>
                          <span className="font-bold text-maroon-600 text-lg">{service.price}</span>
                        </div>
                      </div>
                      <Separator className="bg-gray-100" />
                      <Button className="w-full bg-maroon-700 hover:bg-maroon-800 text-white group font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                        Request Service
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case "volunteer":
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-maroon-700 mb-3">Volunteer Services</h2>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                Join our community service initiatives and make a meaningful impact. 
                Volunteer your time and skills to help serve our temple community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {volunteerOpportunities.map((opportunity) => (
                <Card key={opportunity.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-[1.02] bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-4 bg-gradient-to-br from-saffron-50 to-gold-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                        {opportunity.icon}
                      </div>
                      <Badge 
                        variant="secondary" 
                        className="bg-green-50 text-green-700 border-green-200 font-medium px-3 py-1"
                      >
                        {opportunity.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-maroon-700 transition-colors leading-tight">
                      {opportunity.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {opportunity.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span className="font-medium">{opportunity.commitment}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="font-medium">{opportunity.volunteers} volunteers</span>
                        </div>
                      </div>
                    </div>
                    <Separator className="bg-gray-100" />
                    <Button className="w-full bg-green-700 hover:bg-green-800 text-white group font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                      Join as Volunteer
                      <HandHeart className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case "requests":
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-maroon-700 mb-3">My Service Requests</h2>
              <p className="text-gray-600 text-lg">Track your temple service bookings and their current status</p>
            </div>

            <div className="space-y-6">
              {recentRequests.map((request, index) => (
                <Card key={request.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="p-4 bg-gradient-to-br from-saffron-50 to-gold-50 rounded-2xl shadow-sm">
                          <CheckCircle className="h-7 w-7 text-maroon-600" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-bold text-gray-800 text-lg">{request.service}</h3>
                          <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(request.date).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {request.time}
                            </span>
                            <span className="font-semibold text-maroon-600">
                              {request.amount}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-mono">Ref: {request.reference}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge 
                          variant={request.status === 'Confirmed' ? 'default' : request.status === 'Completed' ? 'default' : 'secondary'}
                          className={
                            request.status === 'Confirmed' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : request.status === 'Completed'
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }
                        >
                          {request.status}
                        </Badge>
                        {index === 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Activity className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center pt-6">
              <Button variant="outline" className="border-maroon-200 text-maroon-700 hover:bg-maroon-50">
                <PlusCircle className="mr-2 h-4 w-4" />
                View All Requests
              </Button>
            </div>
          </div>
        )

      case "events":
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-maroon-700 mb-3">Community Events</h2>
              <p className="text-gray-600 text-lg">Join our upcoming festivals and community gatherings</p>
            </div>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <PartyPopper className="h-16 w-16 text-maroon-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Events Coming Soon</h3>
                <p className="text-gray-600">Community events feature will be available shortly</p>
              </CardContent>
            </Card>
          </div>
        )

      case "donations":
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-maroon-700 mb-3">Donations & Contributions</h2>
              <p className="text-gray-600 text-lg">Track your charitable contributions to the temple</p>
            </div>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Coins className="h-16 w-16 text-gold-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Donation History</h3>
                <p className="text-gray-600">Donation tracking feature will be available shortly</p>
              </CardContent>
            </Card>
          </div>
        )

      case "profile":
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-maroon-700 mb-3">Profile Settings</h2>
              <p className="text-gray-600 text-lg">Manage your account information and preferences</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-10">
                  <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                    <div className="flex flex-col items-center space-y-4">
                      <Avatar className="h-24 w-24 border-4 border-maroon-200 shadow-lg">
                        <AvatarFallback className="bg-maroon-100 text-maroon-700 font-bold text-3xl">
                          {(user.first_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active Member
                      </Badge>
                    </div>
                    
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}` 
                            : user.username || 'User'
                          }
                        </h3>
                        <p className="text-gray-600 capitalize font-medium flex items-center">
                          <Shield className="h-4 w-4 mr-2" />
                          {user.role || 'Member'} Account
                        </p>
                      </div>

                      <Separator className="bg-gray-200" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                            <Mail className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Email Address</p>
                              <p className="text-gray-800 font-semibold">{user.email || 'No email provided'}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                            <Calendar className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Member Since</p>
                              <p className="text-gray-800 font-semibold">{new Date().getFullYear()}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                            <Activity className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Total Requests</p>
                              <p className="text-gray-800 font-semibold">{recentRequests.length}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                            <Star className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Membership Status</p>
                              <p className="text-gray-800 font-semibold">Premium Member</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-200 my-8" />

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="flex-1 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
                      <Settings className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="flex-1 border-maroon-200 text-maroon-700 hover:bg-maroon-50 font-semibold py-3 rounded-xl transition-all duration-200">
                      <Shield className="mr-2 h-4 w-4" />
                      Privacy Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "help":
        return (
          <div className="space-y-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-maroon-700 mb-3">Help & Support</h2>
              <p className="text-gray-600 text-lg">Get assistance with your temple services and account</p>
            </div>
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-16 w-16 text-maroon-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Support Center</h3>
                <p className="text-gray-600">Help and support features will be available shortly</p>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-saffron-25/30 via-white to-gold-25/30">
      {/* Top Navbar - Unchanged for user role */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gold-200/50 shadow-sm z-40">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-maroon-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">॥</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-maroon-700">Hindu Temple</h1>
              <p className="text-xs text-gray-600">Sacred Space</p>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-700 hover:text-maroon-600 font-medium transition-colors">Home</a>
            <a href="/services" className="text-gray-700 hover:text-maroon-600 font-medium transition-colors">Services</a>
            <a href="/events" className="text-gray-700 hover:text-maroon-600 font-medium transition-colors">Events</a>
            <a href="/contact" className="text-gray-700 hover:text-maroon-600 font-medium transition-colors">Contact Us</a>
          </div>

          {/* User Avatar - Only C Circle */}
          <Avatar className="h-9 w-9 ring-2 ring-maroon-200 hover:ring-maroon-400 transition-all cursor-pointer">
            <AvatarFallback className="bg-maroon-600 text-white font-bold text-sm">
              {(user.first_name?.[0] || user.username?.[0] || user.email?.[0] || 'C').toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </nav>

      {/* Main Layout - Admin Dashboard Style */}
      <div className="flex pt-20">
        {/* Fixed Left Sidebar - Always Expanded, No Collapse Option */}
        <aside className="bg-white border-r border-gray-200 w-72 h-[calc(100vh-5rem)] fixed left-0 top-20 z-30 shadow-lg">
          {/* Sidebar Navigation - No Collapse/Expand Controls */}
          <nav className="h-full overflow-y-auto">
            <div className="p-4 space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className={`w-full justify-start h-auto py-3 px-4 transition-all duration-200 ${
                    activeSection === item.id 
                      ? 'bg-maroon-600 hover:bg-maroon-700 text-white shadow-md' 
                      : 'hover:bg-gray-100 text-gray-700 hover:text-maroon-700'
                  }`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <div className="flex items-center w-full">
                    <div className="mr-3 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.label}</div>
                      <div className="text-xs opacity-75 truncate">{item.description}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content - Permanently positioned next to 288px sidebar */}
        <main className="flex-1 ml-72 bg-gray-50 min-h-[calc(100vh-5rem)] w-[calc(100vw-288px)]">
          {renderContent()}
        </main>
      </div>
    </div>
  )
} 