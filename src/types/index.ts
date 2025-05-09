import type React from "react"
export interface Notification {
  id: string
  title: string
  message: string
  timestamp: Date | string
  read: boolean
  type?: "info" | "success" | "warning" | "error"
  link?: string
  image?: string
  data?: Record<string, any>
}

export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: string | null
}

export type NotificationAction =
  | { type: "FETCH_NOTIFICATIONS_REQUEST" }
  | { type: "FETCH_NOTIFICATIONS_SUCCESS"; payload: Notification[] }
  | { type: "FETCH_NOTIFICATIONS_FAILURE"; payload: string }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "MARK_ALL_AS_READ" }
  | { type: "DELETE_NOTIFICATION"; payload: string }

export interface NotificationContextType extends NotificationState {
  addNotification: (notification: Notification) => void
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  refreshNotifications: () => Promise<void>
}

export interface NotificationIconProps {
  className?: string
  onClick?: () => void
  showBadge?: boolean
  badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  customBadge?: React.ReactNode
}

export interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
  headerText?: string
  emptyText?: string
  showMarkAllAsRead?: boolean
  maxHeight?: string | number
  className?: string
  renderNotificationItem?: (
    notification: Notification,
    markAsRead: (id: string) => Promise<void>,
    deleteNotification: (id: string) => Promise<void>,
  ) => React.ReactNode
}

export interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
  className?: string
}

export interface NotificationCenterProps {
  iconClassName?: string
  dropdownClassName?: string
  badgePosition?: "top-right" | "top-left" | "bottom-right" | "bottom-left"
  headerText?: string
  emptyText?: string
  showMarkAllAsRead?: boolean
  maxHeight?: string | number
  renderNotificationItem?: (
    notification: Notification,
    markAsRead: (id: string) => Promise<void>,
    deleteNotification: (id: string) => Promise<void>,
  ) => React.ReactNode
}
