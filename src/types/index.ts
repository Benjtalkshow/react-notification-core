import type React from "react"

export interface Notification {
    id: string
    title: string
    message: string
    timestamp: Date | string
    read: boolean
    type?: "info" | "success" | "warning" | "error"
    link?: string
    data?: Record<string, any>
}

export interface NotificationState {
    notifications: Notification[]
    unreadCount: number
    isLoading: boolean
    error: string | null
    lastUpdated: Date | null
}

export type NotificationAction =
    | { type: "FETCH_NOTIFICATIONS_REQUEST" }
    | { type: "FETCH_NOTIFICATIONS_SUCCESS"; payload: Notification[] }
    | { type: "FETCH_NOTIFICATIONS_FAILURE"; payload: string }
    | { type: "ADD_NOTIFICATION"; payload: Notification }
    | { type: "MARK_AS_READ"; payload: string }
    | { type: "MARK_ALL_AS_READ" }
    | { type: "DELETE_NOTIFICATION"; payload: string }
    | { type: "CLEAR_ALL_NOTIFICATIONS" }

export interface NotificationContextType extends NotificationState {
    addNotification: (notification: Notification) => void
    markAsRead: (id: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    deleteNotification: (id: string) => Promise<void>
    clearAllNotifications: () => void
    refreshNotifications: () => Promise<void>
}

export interface FetchOptions {
    retryCount?: number
    retryDelay?: number
    timeout?: number
    headers?: Record<string, string>
}

export interface NotificationProviderProps {
    children: React.ReactNode
    fetchNotifications?: () => Promise<Notification[]>
    onMarkAsRead?: (id: string) => Promise<void>
    onMarkAllAsRead?: () => Promise<void>
    onDeleteNotification?: (id: string) => Promise<void>
    fetchOptions?: FetchOptions
    initialState?: Partial<NotificationState>
}

export interface UseNotificationPollingOptions {
    enabled?: boolean
    interval?: number
    onError?: (error: any) => void
    retryCount?: number
    retryDelay?: number
}

export interface UseNotificationStorageOptions {
    storageKey?: string
    useSessionStorage?: boolean
}
