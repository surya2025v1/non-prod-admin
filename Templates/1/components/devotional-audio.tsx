"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface DevotionalAudioProps {
  src: string
  autoPlay?: boolean
  loop?: boolean
  className?: string
  showControls?: boolean
}

export function DevotionalAudio({
  src,
  autoPlay = false,
  loop = true,
  className = "",
  showControls = true,
}: DevotionalAudioProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.3)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Audio playback failed:", error)
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (isMuted && newVolume > 0) {
      setIsMuted(false)
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      <audio ref={audioRef} src={src} loop={loop} autoPlay={autoPlay} />

      {showControls && (
        <>
          <button
            onClick={togglePlay}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-maroon-700 text-white hover:bg-maroon-800 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <div className="flex items-center ml-2">
            <button
              onClick={toggleMute}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-maroon-700 hover:bg-gray-300 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="ml-2 w-20 accent-maroon-700"
              aria-label="Volume"
            />
          </div>
        </>
      )}
    </div>
  )
}

export function DevotionalBackgroundAudio({ autoPlay = false }) {
  const [showControls, setShowControls] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`transition-all duration-300 ${
          showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gold-200 mb-2">
          <DevotionalAudio src="/temple-bells.mp3" autoPlay={autoPlay} />
        </div>
      </div>

      <button
        onClick={() => setShowControls(!showControls)}
        className="w-10 h-10 rounded-full bg-maroon-700 text-white flex items-center justify-center shadow-lg hover:bg-maroon-800 transition-colors border border-gold-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </button>
    </div>
  )
}
