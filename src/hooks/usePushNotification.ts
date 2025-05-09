"use client"

import { useEffect, useState } from "react"
import { useNotificationPermission } from "./useNotificationPermission"

interface UsePushNotificationOptions {
  serviceWorkerPath?: string
  vapidPublicKey?: string
  onSubscriptionChange?: (subscription: PushSubscription | null) => void
  onError?: (error: any) => void
}

export const usePushNotification = ({
  serviceWorkerPath = "/sw.js",
  vapidPublicKey,
  onSubscriptionChange,
  onError,
}: UsePushNotificationOptions = {}) => {
  const { permission, requestPermission, isGranted } = useNotificationPermission()
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window

      setIsSupported(supported)

      if (!supported && onError) {
        onError(new Error("Push notifications are not supported in this browser"))
      }
    }

    checkSupport()
  }, [onError])

  // Get existing subscription when component mounts
  useEffect(() => {
    if (!isSupported || !isGranted) return

    const getExistingSubscription = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        if (!registration) return

        const existingSubscription = await registration.pushManager.getSubscription()
        setSubscription(existingSubscription)

        if (onSubscriptionChange) {
          onSubscriptionChange(existingSubscription)
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        if (onError) onError(error)
      }
    }

    getExistingSubscription()
  }, [isSupported, isGranted, onSubscriptionChange, onError])

  // Register for push notifications
  const register = async (): Promise<PushSubscription | null> => {
    if (!isSupported) {
      const error = new Error("Push notifications are not supported in this browser")
      setError(error)
      if (onError) onError(error)
      return null
    }

    setIsRegistering(true)
    setError(null)

    try {
      // Request notification permission if not granted
      if (permission !== "granted") {
        const permissionResult = await requestPermission()
        if (permissionResult !== "granted") {
          throw new Error("Notification permission denied")
        }
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register(serviceWorkerPath)

      // Get push subscription
      const subscribeOptions = {
        userVisibleOnly: true,
        ...(vapidPublicKey && {
          applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
        }),
      }

      const newSubscription = await registration.pushManager.subscribe(subscribeOptions)
      setSubscription(newSubscription)

      if (onSubscriptionChange) {
        onSubscriptionChange(newSubscription)
      }

      return newSubscription
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (onError) onError(error)
      return null
    } finally {
      setIsRegistering(false)
    }
  }

  // Unregister from push notifications
  const unregister = async (): Promise<boolean> => {
    if (!subscription) return false

    try {
      const success = await subscription.unsubscribe()

      if (success) {
        setSubscription(null)
        if (onSubscriptionChange) {
          onSubscriptionChange(null)
        }
      }

      return success
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      if (onError) onError(error)
      return false
    }
  }

  // Helper function to convert base64 to Uint8Array for VAPID key
  function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }

  return {
    isSupported,
    permission,
    subscription,
    isRegistering,
    error,
    register,
    unregister,
    requestPermission,
  }
}
