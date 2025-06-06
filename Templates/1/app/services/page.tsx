import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Star, 
  BookOpen, 
  Heart, 
  Gift,
  ArrowRight,
  CheckCircle
} from "lucide-react"

export default function ServicesPage() {
  const services = [
    {
      title: "Pujas & Rituals",
      description: "Traditional ceremonies and rituals performed with authentic Vedic practices for spiritual blessings and divine grace.",
      items: [
        "Daily Aarti & Abhishekam",
        "Special Archana Services",
        "Homam & Havan Ceremonies",
        "Birthday & Anniversary Pujas",
        "Grihapravesham (House Warming)",
        "Naming Ceremony (Namakaranam)",
        "Festival Celebrations",
        "Personal Prayer Services"
      ],
      image: "/placeholder.svg?height=400&width=600",
      icon: <Gift className="h-6 w-6" />,
      price: "Starting from $25",
      duration: "30-120 min",
      features: ["Experienced Priests", "All Materials Included", "Prasadam Provided"]
    },
    {
      title: "Life Cycle Ceremonies",
      description: "Sacred ceremonies marking important milestones in life's spiritual journey, performed according to ancient traditions.",
      items: [
        "Namakaranam (Naming Ceremony)",
        "Annaprasana (First Solid Food)",
        "Upanayanam (Sacred Thread)",
        "Vivaha (Wedding Ceremony)",
        "Seemantham (Baby Shower)",
        "Shashtiabdapurti (60th Birthday)",
        "Satabhishekam (80th Birthday)",
        "Final Rites & Memorials"
      ],
      image: "/placeholder.svg?height=400&width=600",
      icon: <Heart className="h-6 w-6" />,
      price: "Starting from $75",
      duration: "1-4 hours",
      features: ["Custom Ceremonies", "Family Guidance", "Photo Documentation"]
    },
    {
      title: "Educational Programs",
      description: "Comprehensive learning programs for spiritual growth, cultural preservation, and personal development.",
      items: [
        "Vedic Chanting & Sanskrit",
        "Bhagavad Gita Study Groups",
        "Yoga & Meditation Classes",
        "Cultural Dance & Music",
        "Children's Religious Education",
        "Adult Learning Programs",
        "Spiritual Workshops",
        "Philosophy Discussions"
      ],
      image: "/placeholder.svg?height=400&width=600",
      icon: <BookOpen className="h-6 w-6" />,
      price: "Starting from $15",
      duration: "Weekly classes",
      features: ["Expert Instructors", "All Ages Welcome", "Flexible Schedules"]
    },
    {
      title: "Community Services",
      description: "Compassionate outreach programs serving our community with love, support, and spiritual guidance.",
      items: [
        "Free Food Distribution",
        "Health & Wellness Camps",
        "Senior Citizen Support",
        "Youth Mentoring Programs",
        "Counseling & Guidance",
        "Charitable Activities",
        "Cultural Integration",
        "Emergency Assistance"
      ],
      image: "/placeholder.svg?height=400&width=600",
      icon: <Users className="h-6 w-6" />,
      price: "Free/Donation",
      duration: "Ongoing",
      features: ["Community Impact", "Volunteer Opportunities", "Social Support"]
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-saffron-25 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Temple Background" fill className="object-cover" />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Welcome Header */}
            <div className="inline-block mb-6">
              <div className="w-24 h-1 bg-gold-400 mx-auto mb-2"></div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-gold-gradient">
                Our Sacred Services
              </h1>
              <div className="w-24 h-1 bg-gold-400 mx-auto"></div>
            </div>

            <p className="text-lg md:text-xl text-gold-200 mb-4 font-sanskrit">
              सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः
            </p>
            <p className="text-sm md:text-base text-gold-300 mb-8 italic">
              "May all beings be happy, may all beings be free from illness"
            </p>

            <p className="text-base md:text-xl leading-relaxed mb-8 text-white/90 max-w-3xl mx-auto">
              Experience the divine through our comprehensive range of religious services, ceremonies, and community programs. 
              Each service is conducted with devotion, authenticity, and deep spiritual significance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gold-500 hover:bg-gold-600 text-maroon-900 px-8 py-4 text-lg font-medium rounded-lg group flex items-center justify-center transition-colors">
                <Calendar className="mr-2 h-5 w-5" />
                Book a Service
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button className="bg-transparent border-2 border-gold-400 text-gold-300 hover:bg-gold-400 hover:text-maroon-900 px-8 py-4 text-lg font-medium rounded-lg transition-colors flex items-center justify-center">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-white px-8 py-4 rounded-lg shadow-md border-b-4 border-maroon-700 mb-8">
            <h2 className="text-3xl font-bold text-maroon-700">
              Temple Services & Programs
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto bg-white/80 p-4 rounded-lg shadow-sm">
            Discover the various services, ceremonies, and programs our temple offers to serve your spiritual needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-2 border-gold-200 hover:border-maroon-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-lg"
            >
              {/* Card Header */}
              <CardHeader className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-maroon-700 text-white shadow-lg group-hover:bg-maroon-800 transition-colors duration-300">
                    {service.icon}
                  </div>
                  <Badge className="bg-gold-100 text-gold-800 px-3 py-1 rounded-full font-medium border border-gold-200">
                    {service.price}
                  </Badge>
                </div>
                <CardTitle className="text-2xl font-bold text-maroon-700 mb-3 group-hover:text-maroon-800 transition-colors duration-300">
                  {service.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed">
                  {service.description}
                </CardDescription>
                
                {/* Service Info */}
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gold-600" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-gold-500" />
                    <span>4.9 Rating</span>
                  </div>
                </div>
              </CardHeader>

              {/* Service Features */}
              <CardContent className="px-6 pb-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-maroon-700 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Key Features
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary" 
                        className="bg-saffron-50 text-maroon-700 px-3 py-1 rounded-full text-xs border border-gold-200"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Service Items */}
                <div className="mb-6">
                  <h4 className="font-semibold text-maroon-700 mb-3">Services Included</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                    {service.items.map((item, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-700 py-1">
                        <div className="w-2 h-2 rounded-full bg-maroon-700 mr-3 flex-shrink-0"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    className="flex-1 bg-maroon-700 hover:bg-maroon-800 text-white rounded-lg font-semibold transition-all duration-300 group"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-maroon-700 text-maroon-700 hover:bg-maroon-50 rounded-lg font-semibold transition-all duration-300 group"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-saffron-50">
        <div className="container">
          <div className="bg-white rounded-lg p-8 md:p-12 shadow-lg border border-gold-200">
            <div className="text-center mb-10">
              <div className="inline-block mb-6">
                <div className="w-16 h-1 bg-gold-400 mx-auto mb-2"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-maroon-700 mb-2">
                  Ready to Begin Your Spiritual Journey?
                </h2>
                <div className="w-16 h-1 bg-gold-400 mx-auto"></div>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our experienced priests and spiritual guides are here to help you with personalized services and ceremonies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="text-center p-6 rounded-lg bg-saffron-25 border border-gold-200">
                <div className="w-16 h-16 bg-maroon-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-maroon-700 mb-2">Call Us</h3>
                <p className="text-maroon-600 font-semibold">(555) 123-4567</p>
                <p className="text-gray-600 text-sm">Mon-Sun: 8:00 AM - 8:00 PM</p>
              </div>

              <div className="text-center p-6 rounded-lg bg-saffron-25 border border-gold-200">
                <div className="w-16 h-16 bg-maroon-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-maroon-700 mb-2">Email Us</h3>
                <p className="text-maroon-600 font-semibold">services@hindutemple.org</p>
                <p className="text-gray-600 text-sm">Quick response guaranteed</p>
              </div>

              <div className="text-center p-6 rounded-lg bg-saffron-25 border border-gold-200">
                <div className="w-16 h-16 bg-maroon-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-bold text-maroon-700 mb-2">Visit Us</h3>
                <p className="text-maroon-600 font-semibold">123 Temple Street</p>
                <p className="text-gray-600 text-sm">Open daily for devotees</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button className="bg-maroon-700 hover:bg-maroon-800 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 group flex items-center justify-center">
                <Calendar className="h-5 w-5 mr-2" />
                Schedule Consultation
                <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
              <button className="bg-transparent border-2 border-maroon-700 text-maroon-700 hover:bg-maroon-50 px-10 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Become a Member
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container py-16">
        <div className="text-center mb-12">
          <div className="inline-block bg-white px-8 py-4 rounded-lg shadow-md border-b-4 border-maroon-700 mb-8">
            <h2 className="text-3xl font-bold text-maroon-700">
              Why Choose Our Services?
            </h2>
          </div>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto bg-white/80 p-4 rounded-lg shadow-sm">
            We combine traditional authenticity with modern convenience to serve your spiritual needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg bg-white shadow-lg border border-gold-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-maroon-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-maroon-700 mb-2">Authentic Traditions</h3>
            <p className="text-gray-600">All services performed according to ancient Vedic scriptures and traditions</p>
          </div>

          <div className="text-center p-8 rounded-lg bg-white shadow-lg border border-gold-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-maroon-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-maroon-700 mb-2">Experienced Priests</h3>
            <p className="text-gray-600">Highly qualified and experienced priests with deep spiritual knowledge</p>
          </div>

          <div className="text-center p-8 rounded-lg bg-white shadow-lg border border-gold-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-16 h-16 bg-maroon-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-maroon-700 mb-2">Community Focus</h3>
            <p className="text-gray-600">Serving our community with love, compassion, and spiritual guidance</p>
          </div>
        </div>
      </section>
    </main>
  )
}
