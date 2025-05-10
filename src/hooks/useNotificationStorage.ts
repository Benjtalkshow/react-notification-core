"use client"

import { useEffect } from "react"
import { useNotifications } from "../context/NotificationContext"
import type { UseNotificationStorageOptions, Notification } from "../types"

/**
 * Hook for persisting notifications to localStorage or sessionStorage
 */
export const useNotificationStorage = ({
  storageKey = "notifications",
  useSessionStorage = false,
}: UseNotificationStorageOptions = {}) => {
  const { notifications, addNotification, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } =
    useNotifications()

  const storage = useSessionStorage ? sessionStorage : localStorage

  // Load notifications from storage on mount
  useEffect(() => {
    try {
      const storedNotifications = storage.getItem(storageKey)

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications) as Notification[]

        // Add each notification to the context
        parsedNotifications.forEach((notification) => {
          addNotification(notification)
        })
      }
    } catch (error) {
      console.error("Error loading notifications from storage:", error)
    }
  }, [storage, storageKey, addNotification])

  // Save notifications to storage when they change
  useEffect(() => {
    try {
      storage.setItem(storageKey, JSON.stringify(notifications))
    } catch (error) {
      console.error("Error saving notifications to storage:", error)
    }
  }, [notifications, storage, storageKey])

  // Return wrapped functions that update both context and storage
  return {
    addNotification: async (notification: Notification) => {
      addNotification(notification)
    },

    markAsRead: async (id: string) => {
      await markAsRead(id)
    },

    markAllAsRead: async () => {
      await markAllAsRead()
    },

    deleteNotification: async (id: string) => {
      await deleteNotification(id)
    },

    clearAllNotifications: () => {
      clearAllNotifications()
    },

    clearStorage: () => {
      storage.removeItem(storageKey)
    },
  }
}
