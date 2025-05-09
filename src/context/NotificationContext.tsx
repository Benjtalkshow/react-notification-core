"use client"

import  React from "react"
import { createContext, useContext, useReducer, type ReactNode, useEffect } from "react"
import type { Notification, NotificationContextType, NotificationState, NotificationAction } from "../types"

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

function notificationReducer(state: NotificationState, action: NotificationAction): NotificationState {
  switch (action.type) {
    case "FETCH_NOTIFICATIONS_REQUEST":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "FETCH_NOTIFICATIONS_SUCCESS":
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter((notification) => !notification.read).length,
        isLoading: false,
      }
    case "FETCH_NOTIFICATIONS_FAILURE":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (action.payload.read ? 0 : 1),
      }
    case "MARK_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        ),
        unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === action.payload && !n.read) ? 1 : 0),
      }
    case "MARK_ALL_AS_READ":
      return {
        ...state,
        notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
        unreadCount: 0,
      }
    case "DELETE_NOTIFICATION":
      const deletedNotification = state.notifications.find((n) => n.id === action.payload)
      return {
        ...state,
        notifications: state.notifications.filter((notification) => notification.id !== action.payload),
        unreadCount: state.unreadCount - (deletedNotification && !deletedNotification.read ? 1 : 0),
      }
    default:
      return state
  }
}

export const NotificationProvider: React.FC<{
  children: ReactNode
  fetchNotifications?: () => Promise<Notification[]>
  onMarkAsRead?: (id: string) => Promise<void>
  onMarkAllAsRead?: () => Promise<void>
  onDeleteNotification?: (id: string) => Promise<void>
}> = ({ children, fetchNotifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)

  // Initial fetch of notifications
  useEffect(() => {
    if (fetchNotifications) {
      const loadNotifications = async () => {
        try {
          dispatch({ type: "FETCH_NOTIFICATIONS_REQUEST" })
          const notifications = await fetchNotifications()
          dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: notifications })
        } catch (error) {
          dispatch({
            type: "FETCH_NOTIFICATIONS_FAILURE",
            payload: error instanceof Error ? error.message : "Failed to fetch notifications",
          })
        }
      }

      loadNotifications()
    }
  }, [fetchNotifications])

  const value = {
    ...state,
    addNotification: (notification: Notification) => {
      dispatch({ type: "ADD_NOTIFICATION", payload: notification })
    },
    markAsRead: async (id: string) => {
      if (onMarkAsRead) {
        try {
          await onMarkAsRead(id)
        } catch (error) {
          console.error("Error marking notification as read:", error)
        }
      }
      dispatch({ type: "MARK_AS_READ", payload: id })
    },
    markAllAsRead: async () => {
      if (onMarkAllAsRead) {
        try {
          await onMarkAllAsRead()
        } catch (error) {
          console.error("Error marking all notifications as read:", error)
        }
      }
      dispatch({ type: "MARK_ALL_AS_READ" })
    },
    deleteNotification: async (id: string) => {
      if (onDeleteNotification) {
        try {
          await onDeleteNotification(id)
        } catch (error) {
          console.error("Error deleting notification:", error)
        }
      }
      dispatch({ type: "DELETE_NOTIFICATION", payload: id })
    },
    refreshNotifications: async () => {
      if (fetchNotifications) {
        try {
          dispatch({ type: "FETCH_NOTIFICATIONS_REQUEST" })
          const notifications = await fetchNotifications()
          dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: notifications })
        } catch (error) {
          dispatch({
            type: "FETCH_NOTIFICATIONS_FAILURE",
            payload: error instanceof Error ? error.message : "Failed to fetch notifications",
          })
        }
      }
    },
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
