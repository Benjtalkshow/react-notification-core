import { useState, useCallback, useMemo } from "react"
import { useNotifications } from "../context/NotificationContext"
import { filterNotifications } from "../utils/fetchUtils"
import type { Notification } from "../types"

interface FilterCriteria {
  read?: boolean
  type?: string
  search?: string
  fromDate?: Date
  toDate?: Date
}

/**
 * Hook for filtering notifications
 */
export const useNotificationFilters = () => {
  const { notifications } = useNotifications()
  const [filters, setFilters] = useState<FilterCriteria>({})

  // Apply filters to notifications
  const filteredNotifications = useMemo(() => {
    return filterNotifications(notifications, filters)
  }, [notifications, filters])

  // Filter by read status
  const filterByReadStatus = useCallback((read?: boolean) => {
    setFilters((prev) => ({ ...prev, read }))
  }, [])

  // Filter by type
  const filterByType = useCallback((type?: string) => {
    setFilters((prev) => ({ ...prev, type }))
  }, [])

  // Filter by search term
  const filterBySearch = useCallback((search?: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  // Filter by date range
  const filterByDateRange = useCallback((fromDate?: Date, toDate?: Date) => {
    setFilters((prev) => ({ ...prev, fromDate, toDate }))
  }, [])

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({})
  }, [])

  // Get notification counts by type
  const countsByType = useMemo(() => {
    return notifications.reduce((counts: Record<string, number>, notification: Notification) => {
      const type = notification.type || "default"
      counts[type] = (counts[type] || 0) + 1
      return counts
    }, {})
  }, [notifications])

  return {
    filters,
    filteredNotifications,
    filterByReadStatus,
    filterByType,
    filterBySearch,
    filterByDateRange,
    resetFilters,
    countsByType,
    totalCount: notifications.length,
    filteredCount: filteredNotifications.length,
    unreadCount: notifications.filter((n) => !n.read).length,
  }
}
