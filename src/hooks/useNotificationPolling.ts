import { useEffect, useRef, useCallback } from "react"
import { useNotifications } from "../context/NotificationContext"
import type { UseNotificationPollingOptions } from "../types"
import { fetchWithRetry } from "../utils/fetchUtils"

/**
 * Hook for polling notifications at regular intervals
 */
export const useNotificationPolling = ({
    enabled = true,
    interval = 60000, // Default to 1 minute
    onError,
    retryCount = 3,
    retryDelay = 1000,
}: UseNotificationPollingOptions = {}) => {
    const { refreshNotifications } = useNotifications()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isPollingRef = useRef(enabled)

    const fetchNotifications = useCallback(async () => {
        try {
            await fetchWithRetry(refreshNotifications, { retryCount, retryDelay })
        } catch (error) {
            if (onError) {
                onError(error)
            } else {
                console.error("Error polling notifications:", error)
            }
        }
    }, [refreshNotifications, retryCount, retryDelay, onError])

    // Set up and clean up polling
    useEffect(() => {
        isPollingRef.current = enabled

        const setupPolling = () => {
            if (!enabled) return

            // Initial fetch
            fetchNotifications()

            // Set up interval
            intervalRef.current = setInterval(fetchNotifications, interval)
        }

        setupPolling()

        // Clean up
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [enabled, interval, fetchNotifications])

    // Return control functions
    return {
        refresh: fetchNotifications,

        stopPolling: useCallback(() => {
            isPollingRef.current = false
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }, []),

        startPolling: useCallback(() => {
            isPollingRef.current = true
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            fetchNotifications()
            intervalRef.current = setInterval(fetchNotifications, interval)
        }, [fetchNotifications, interval]),

        isPolling: () => isPollingRef.current,
    }
}
