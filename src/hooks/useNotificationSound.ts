"use client"

import { useEffect, useRef, useState } from "react"
import { useNotifications } from "../context/NotificationContext"
import type { Notification } from "../types"

interface UseNotificationSoundOptions {
  enabled?: boolean
  soundUrl?: string
  shouldPlaySound?: (notification: Notification) => boolean
}

export const useNotificationSound = ({
  enabled = true,
  soundUrl = "/notification-sound.mp3",
  shouldPlaySound = () => true,
}: UseNotificationSoundOptions = {}) => {
  const { notifications } = useNotifications()
  const [isReady, setIsReady] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const prevNotificationsRef = useRef<Notification[]>([])

  // Initialize audio
  useEffect(() => {
    if (!enabled) return

    const audio = new Audio(soundUrl)
    audio.preload = "auto"

    audio.addEventListener("canplaythrough", () => {
      setIsReady(true)
    })

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [enabled, soundUrl])

  // Check for new notifications and play sound
  useEffect(() => {
    if (!enabled || !isReady || !audioRef.current) return

    const prevNotifications = prevNotificationsRef.current
    const newNotifications = notifications.filter((notification) => {
      // Check if this notification is new (not in the previous list)
      return !prevNotifications.some((prevNotification) => prevNotification.id === notification.id)
    })

    // Play sound for new notifications that match criteria
    if (newNotifications.length > 0) {
      const shouldPlay = newNotifications.some(shouldPlaySound)

      if (shouldPlay && audioRef.current) {
        // Reset audio to beginning and play
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((error) => {
          console.error("Error playing notification sound:", error)
        })
      }
    }

    // Update previous notifications reference
    prevNotificationsRef.current = [...notifications]
  }, [notifications, enabled, isReady, shouldPlaySound])

  // Return controls for manual playing
  return {
    play: () => {
      if (isReady && audioRef.current) {
        audioRef.current.currentTime = 0
        return audioRef.current.play()
      }
      return Promise.reject("Audio not ready")
    },
    isReady,
  }
}
