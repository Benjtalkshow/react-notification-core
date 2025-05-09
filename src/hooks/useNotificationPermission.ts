"use client"

import { useState, useEffect } from "react"

type NotificationPermissionState = "default" | "granted" | "denied" | "unsupported"

export const useNotificationPermission = () => {
  const [permission, setPermission] = useState<NotificationPermissionState>(
    typeof Notification !== "undefined" ? (Notification.permission as NotificationPermissionState) : "unsupported",
  )

  useEffect(() => {
    // Check if browser supports notifications
    if (typeof Notification === "undefined") {
      setPermission("unsupported")
      return
    }

    // Update permission state when component mounts
    setPermission(Notification.permission as NotificationPermissionState)

    // Set up permission change listener if supported
    if ("permissions" in navigator && navigator.permissions.query) {
      navigator.permissions
        .query({ name: "notifications" as PermissionName })
        .then((status) => {
          setPermission(status.state as NotificationPermissionState)

          status.onchange = () => {
            setPermission(status.state as NotificationPermissionState)
          }
        })
        .catch((error) => {
          console.error("Error querying notification permission:", error)
        })
    }
  }, [])

  const requestPermission = async (): Promise<NotificationPermissionState> => {
    if (typeof Notification === "undefined") {
      return "unsupported"
    }

    if (permission === "granted") {
      return "granted"
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermissionState)
      return result as NotificationPermissionState
    } catch (error) {
      console.error("Error requesting notification permission:", error)
      return "denied"
    }
  }

  return {
    permission,
    requestPermission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
    isUnsupported: permission === "unsupported",
  }
}
