"use client"

import { useMemo } from "react"
import { useNotifications } from "../context/NotificationContext"
import { groupNotificationsByDate } from "../utils/fetchUtils"
import type { Notification } from "../types"

type GroupingFunction<T> = (notifications: Notification[]) => Record<string, T[]>

/**
 * Hook for grouping notifications
 */
export const useNotificationGroups = <T extends Notification = Notification>(
    groupingFn: GroupingFunction<T> = groupNotificationsByDate as any,
) => {
    const { notifications } = useNotifications()

    // Group notifications using the provided grouping function
    const groupedNotifications = useMemo(() => {
        return groupingFn(notifications as T[])
    }, [notifications, groupingFn])

    // Get all available groups
    const groups = useMemo(() => {
        return Object.keys(groupedNotifications)
    }, [groupedNotifications])

    // Get notifications for a specific group
    const getNotificationsForGroup = (groupKey: string) => {
        return groupedNotifications[groupKey] || []
    }

    // Group by type
    const groupedByType = useMemo(() => {
        return notifications.reduce((groups: Record<string, Notification[]>, notification) => {
            const type = notification.type || "default"
            if (!groups[type]) {
                groups[type] = []
            }
            groups[type].push(notification)
            return groups
        }, {})
    }, [notifications])

    return {
        groupedNotifications,
        groups,
        getNotificationsForGroup,
        groupedByType,
    }
}
