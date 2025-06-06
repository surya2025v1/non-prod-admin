"use client"

import { useState } from "react"
import { Calendar, Clock, ChevronDown, ChevronUp, MapPin, Users } from "lucide-react"

interface Activity {
  time: string
  name: string
  description: string
  location: string
  priest: string
  attendees: string
}

export function TodayActivities() {
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null)

  // Get current date
  const today = new Date()
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Sample activities for the day with additional details
  const activities: Activity[] = [
    {
      time: "06:00 AM",
      name: "Morning Aarti",
      description: "Start your day with divine blessings through our morning aarti ceremony dedicated to Lord Ganesha.",
      location: "Main Temple Hall",
      priest: "Pandit Ramesh Sharma",
      attendees: "Open to all devotees",
    },
    {
      time: "08:00 AM",
      name: "Abhishekam",
      description: "Sacred bathing ritual of the deity with milk, yogurt, honey, and other offerings.",
      location: "Sanctum Sanctorum",
      priest: "Pandit Suresh Iyer",
      attendees: "Limited to 25 devotees",
    },
    {
      time: "10:00 AM",
      name: "Bhajan Session",
      description: "Join our devotional singing session with traditional bhajans and kirtans.",
      location: "Community Hall",
      priest: "Led by Mrs. Lakshmi Patel",
      attendees: "Open to all devotees",
    },
    {
      time: "12:00 PM",
      name: "Noon Aarti",
      description: "Midday prayer ceremony with special offerings to the deities.",
      location: "Main Temple Hall",
      priest: "Pandit Vijay Kumar",
      attendees: "Open to all devotees",
    },
    {
      time: "04:00 PM",
      name: "Vedic Classes",
      description: "Learn about ancient Vedic scriptures and their relevance in modern life.",
      location: "Education Center",
      priest: "Dr. Anand Gupta",
      attendees: "Registration required",
    },
    {
      time: "06:30 PM",
      name: "Evening Aarti",
      description: "Evening prayer ceremony with lamps and special offerings.",
      location: "Main Temple Hall",
      priest: "Pandit Ramesh Sharma",
      attendees: "Open to all devotees",
    },
    {
      time: "08:00 PM",
      name: "Bhagavad Gita Discussion",
      description: "Interactive session discussing the teachings of Bhagavad Gita and their application in daily life.",
      location: "Community Hall",
      priest: "Dr. Venkat Rao",
      attendees: "Open to all devotees",
    },
  ]

  const toggleExpand = (index: number) => {
    if (expandedActivity === index) {
      setExpandedActivity(null)
    } else {
      setExpandedActivity(index)
    }
  }

  return (
    <div className="p-4 h-full">
      <div
        className="bg-white rounded-lg shadow-md p-4 h-full border border-gold-200 overflow-y-auto"
        style={{ maxHeight: "500px" }}
      >
        <div className="flex items-center mb-4 text-maroon-700">
          <Calendar className="mr-2 flex-shrink-0" size={20} />
          <h2 className="text-xl font-bold">
            Today's Activities
          </h2>
        </div>

        <p className="text-sm text-gray-600 mb-4">{formattedDate}</p>

        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className={`border border-gold-200 rounded-lg overflow-hidden transition-all duration-300 ${
                expandedActivity === index ? "bg-saffron-50" : "bg-white"
              }`}
            >
              <div className="flex items-start p-3 cursor-pointer" onClick={() => toggleExpand(index)}>
                <div className="flex items-center text-maroon-600 mr-2 mt-1 flex-shrink-0">
                  <Clock size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-medium truncate text-maroon-700">
                      {activity.name}
                    </p>
                    {expandedActivity === index ? (
                      <ChevronUp size={16} className="text-maroon-600 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown size={16} className="text-maroon-600 flex-shrink-0 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>

              {expandedActivity === index && (
                <div className="px-3 pb-3 pt-0 bg-saffron-50">
                  <div className="border-t border-gold-200 pt-3 mt-1 text-sm">
                    <p className="text-gray-700 mb-2">{activity.description}</p>

                    <div className="grid grid-cols-1 gap-2 mt-3">
                      <div className="flex items-start">
                        <MapPin size={14} className="text-maroon-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{activity.location}</span>
                      </div>

                      <div className="flex items-start">
                        <Users size={14} className="text-maroon-600 mr-2 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{activity.priest}</span>
                      </div>

                      <div className="flex items-center mt-2 flex-wrap gap-2">
                        <button className="bg-maroon-700 hover:bg-maroon-800 text-white text-xs py-1 px-3 rounded-full transition-colors">
                          Add to Calendar
                        </button>
                        <button className="border border-gold-600 text-gold-700 hover:bg-gold-50 text-xs py-1 px-3 rounded-full transition-colors">
                          Reminder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
