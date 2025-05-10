import type { FetchOptions } from "../types"

/**
 * Fetches data with retry capability
 * @param fetchFn The function to fetch data
 * @param options Options for retrying
 * @returns The fetched data
 */
export async function fetchWithRetry<T>(fetchFn: () => Promise<T>, options: FetchOptions = {}): Promise<T> {
  const { retryCount = 3, retryDelay = 1000, timeout = 10000 } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Request timed out after ${timeout}ms`))
        }, timeout)
      })

      // Race between the fetch and the timeout
      const result = (await Promise.race([fetchFn(), timeoutPromise])) as T

      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // If this was the last attempt, throw the error
      if (attempt === retryCount) {
        throw lastError
      }

      // Wait before retrying (with exponential backoff)
      const delay = retryDelay * Math.pow(2, attempt)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // This should never be reached due to the throw in the loop,
  // but TypeScript needs it for type safety
  throw lastError || new Error("Unknown error during fetch with retry")
}

/**
 * Formats a timestamp into a human-readable string
 * @param timestamp The timestamp to format
 * @returns A formatted string like "2 minutes ago"
 */
export function formatTimestamp(timestamp: Date | string): string {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return date.toLocaleDateString()
  }
}

/**
 * Groups notifications by date
 * @param notifications Array of notifications
 * @returns Object with dates as keys and arrays of notifications as values
 */
export function groupNotificationsByDate(notifications: any[]): Record<string, any[]> {
  return notifications.reduce((groups: Record<string, any[]>, notification) => {
    const date = typeof notification.timestamp === "string" ? new Date(notification.timestamp) : notification.timestamp

    const dateStr = date.toDateString()

    if (!groups[dateStr]) {
      groups[dateStr] = []
    }

    groups[dateStr].push(notification)
    return groups
  }, {})
}

/**
 * Filters notifications based on criteria
 * @param notifications Array of notifications
 * @param criteria Filter criteria
 * @returns Filtered array of notifications
 */
export function filterNotifications(
  notifications: any[],
  criteria: {
    read?: boolean
    type?: string
    search?: string
    fromDate?: Date
    toDate?: Date
  },
): any[] {
  return notifications.filter((notification) => {
    // Filter by read status
    if (criteria.read !== undefined && notification.read !== criteria.read) {
      return false
    }

    // Filter by type
    if (criteria.type && notification.type !== criteria.type) {
      return false
    }

    // Filter by search term
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase()
      const titleMatch = notification.title?.toLowerCase().includes(searchLower)
      const messageMatch = notification.message?.toLowerCase().includes(searchLower)
      if (!titleMatch && !messageMatch) {
        return false
      }
    }

    // Filter by date range
    if (criteria.fromDate || criteria.toDate) {
      const notifDate =
        typeof notification.timestamp === "string" ? new Date(notification.timestamp) : notification.timestamp

      if (criteria.fromDate && notifDate < criteria.fromDate) {
        return false
      }

      if (criteria.toDate) {
        // Add one day to include the end date fully
        const toDateEnd = new Date(criteria.toDate)
        toDateEnd.setDate(toDateEnd.getDate() + 1)

        if (notifDate > toDateEnd) {
          return false
        }
      }
    }

    return true
  })
}
