import Link from "next/link"
import { DevotionalDivider, SanskritText } from "@/components/devotional-text"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-maroon-900 to-maroon-800 text-white pt-12 pb-6 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 text-gold-300 devotional-heading">Hindu Temple</h3>
            <p className="mb-6 text-white/80">
              A sacred space dedicated to spiritual growth, community service, and preserving Hindu traditions.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-white/70 hover:text-gold-300 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="text-white/70 hover:text-gold-300 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="text-white/70 hover:text-gold-300 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="text-white/70 hover:text-gold-300 transition-colors">
                <Youtube size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 text-gold-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-white/70 hover:text-gold-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-white/70 hover:text-gold-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-white/70 hover:text-gold-300 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/70 hover:text-gold-300 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/donation" className="text-white/70 hover:text-gold-300 transition-colors">
                  Donation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 text-gold-300">Temple Hours</h4>
            <ul className="space-y-2 text-white/70">
              <li>Monday - Friday: 6:00 AM - 12:00 PM, 4:00 PM - 8:30 PM</li>
              <li>Saturday & Sunday: 6:00 AM - 8:30 PM</li>
              <li>Special Hours on Festival Days</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-bold mb-4 text-gold-300">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-gold-300 mr-2 mt-1 flex-shrink-0" />
                <span className="text-white/70">123 Temple Street, Anytown, ST 12345</span>
              </li>
              <li className="flex items-start">
                <Phone size={18} className="text-gold-300 mr-2 mt-1 flex-shrink-0" />
                <span className="text-white/70">(123) 456-7890</span>
              </li>
              <li className="flex items-start">
                <Mail size={18} className="text-gold-300 mr-2 mt-1 flex-shrink-0" />
                <span className="text-white/70">info@hindutemple.org</span>
              </li>
            </ul>
          </div>
        </div>

        <DevotionalDivider symbol="none" className="opacity-30" />

        <div className="text-center pt-6">
          <SanskritText className="block mb-4 text-gold-200 text-lg">लोकाः समस्ताः सुखिनो भवन्तु</SanskritText>
          <p className="text-white/60 text-sm">"May all beings everywhere be happy and free"</p>
          <p className="mt-6 text-white/50 text-xs">© {new Date().getFullYear()} Hindu Temple. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
