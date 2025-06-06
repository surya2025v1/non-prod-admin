"use client"

import { Heart, Sparkles, Star, Sun, Moon, Users, Calendar, BookOpen } from "lucide-react"
import { DevotionalText, SanskritText, DevotionalHeading } from "./devotional-text"

export function DesignShowcase() {
  return (
    <div className="bg-gradient-to-br from-saffron-25 to-gold-50 p-8 rounded-3xl shadow-2xl border border-gold-200/50">
      <div className="text-center mb-8">
        <DevotionalHeading level={2} className="text-3xl font-bold mb-4">
          <DevotionalText effect="shimmer" className="text-maroon-gradient">
            Enhanced Temple Website Design
          </DevotionalText>
        </DevotionalHeading>
        
        <SanskritText className="text-lg text-gold-600 mb-4">
          नवीन आध्यात्मिक अनुभव - Enhanced Spiritual Experience
        </SanskritText>
        
        <p className="text-gray-700 max-w-2xl mx-auto leading-relaxed">
          A comprehensive redesign focusing on authentic Hindu spiritual aesthetics, 
          enhanced user experience, and accessible devotional features.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Visual Design Improvements */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/30">
          <div className="bg-gold-500 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-maroon-800 mb-3">Visual Excellence</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Enhanced hero section with immersive background</li>
            <li>• Better typography with Sanskrit fonts</li>
            <li>• Sacred color palette (saffron, gold, maroon)</li>
            <li>• Improved card designs with hover effects</li>
            <li>• Professional gradient overlays</li>
          </ul>
        </div>

        {/* Spiritual Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/30">
          <div className="bg-maroon-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <span className="text-xl text-white">🕉️</span>
          </div>
          <h3 className="text-xl font-semibold text-maroon-800 mb-3">Spiritual Elements</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Time-based Sanskrit greetings</li>
            <li>• Interactive prayer wheel with mantras</li>
            <li>• Virtual offering system</li>
            <li>• Digital aarti with flame animations</li>
            <li>• Sacred mantra displays</li>
          </ul>
        </div>

        {/* User Experience */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/30">
          <div className="bg-saffron-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-maroon-800 mb-3">Enhanced UX</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Intuitive navigation with spiritual context</li>
            <li>• Mobile-first responsive design</li>
            <li>• Floating sidebar for activities</li>
            <li>• Smooth scroll indicators</li>
            <li>• Touch-friendly interactions</li>
          </ul>
        </div>

        {/* Content Organization */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/30">
          <div className="bg-gold-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-maroon-800 mb-3">Content Structure</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Better information hierarchy</li>
            <li>• Comprehensive service descriptions</li>
            <li>• Schedule integration with icons</li>
            <li>• Learning program categorization</li>
            <li>• Clear call-to-action flows</li>
          </ul>
        </div>

        {/* Accessibility */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/30">
          <div className="bg-purple-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-maroon-800 mb-3">Accessibility</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Screen reader optimizations</li>
            <li>• High contrast mode support</li>
            <li>• Font scaling options</li>
            <li>• Keyboard navigation</li>
            <li>• Voice command integration</li>
          </ul>
        </div>

        {/* Interactive Features */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold-200/30">
          <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-maroon-800 mb-3">Interactivity</h3>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Audio-visual spiritual elements</li>
            <li>• Touch gesture recognition</li>
            <li>• Breathing meditation guide</li>
            <li>• Animated sacred symbols</li>
            <li>• Real-time spiritual feedback</li>
          </ul>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mt-8 bg-gradient-to-r from-maroon-700 to-maroon-800 text-white rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 text-center text-gold-200">Design Impact</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-gold-300 mb-1">100%</div>
            <div className="text-sm text-gold-200">Mobile Responsive</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold-300 mb-1">15+</div>
            <div className="text-sm text-gold-200">Spiritual Interactions</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold-300 mb-1">WCAG</div>
            <div className="text-sm text-gold-200">AA Compliant</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gold-300 mb-1">24/7</div>
            <div className="text-sm text-gold-200">Digital Devotion</div>
          </div>
        </div>
      </div>
    </div>
  )
} 