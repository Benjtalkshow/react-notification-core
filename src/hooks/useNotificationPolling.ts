"use client"

import { useEffect, useRef } from "react"
import { useNotifications } from "../context/NotificationContext"

interface UseNotificationPollingOptions {
  enabled?: boolean
  interval?: number
  onError?: (error: any) => void
}

export const useNotificationPolling = ({
  enabled = true,
  interval = 60000, // Default to 1 minute
  onError,
}: UseNotificationPollingOptions = {}) => {
  const { refreshNotifications } = useNotifications()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!enabled) return

    const fetchNotifications = async () => {
      try {
        await refreshNotifications()
      } catch (error) {
        if (onError) {
          onError(error)
        } else {
          console.error("Error polling notifications:", error)
        }
      }
    }

    // Initial fetch
    fetchNotifications()

    // Set up interval
    intervalRef.current = setInterval(fetchNotifications, interval)

    // Clean up
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [enabled, interval, refreshNotifications, onError])

  // Return a function to manually refresh
  return {
    refresh: refreshNotifications,
    stopPolling: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    },
    startPolling: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      intervalRef.current = setInterval(async () => {
        try {
          await refreshNotifications()
        } catch (error) {
          if (onError) {
            onError(error)
          } else {
            console.error("Error polling notifications:", error)
          }
        }
      }, interval)
    },
  }
}
