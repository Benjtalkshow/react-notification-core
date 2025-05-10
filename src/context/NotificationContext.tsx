"use client"

import React from "react"
import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react"
import type {
    Notification,
    NotificationContextType,
    NotificationState,
    NotificationAction,
    NotificationProviderProps,
} from "../types"
import { fetchWithRetry } from "../utils/fetchUtils"

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    lastUpdated: null,
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
                error: null,
                lastUpdated: new Date(),
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
                lastUpdated: new Date(),
            }
        case "MARK_AS_READ":
            return {
                ...state,
                notifications: state.notifications.map((notification) =>
                    notification.id === action.payload ? { ...notification, read: true } : notification,
                ),
                unreadCount: state.unreadCount - (state.notifications.find((n) => n.id === action.payload && !n.read) ? 1 : 0),
                lastUpdated: new Date(),
            }
        case "MARK_ALL_AS_READ":
            return {
                ...state,
                notifications: state.notifications.map((notification) => ({ ...notification, read: true })),
                unreadCount: 0,
                lastUpdated: new Date(),
            }
        case "DELETE_NOTIFICATION":
            const deletedNotification = state.notifications.find((n) => n.id === action.payload)
            return {
                ...state,
                notifications: state.notifications.filter((notification) => notification.id !== action.payload),
                unreadCount: state.unreadCount - (deletedNotification && !deletedNotification.read ? 1 : 0),
                lastUpdated: new Date(),
            }
        case "CLEAR_ALL_NOTIFICATIONS":
            return {
                ...state,
                notifications: [],
                unreadCount: 0,
                lastUpdated: new Date(),
            }
        default:
            return state
    }
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    fetchNotifications,
    onMarkAsRead,
    onMarkAllAsRead,
    onDeleteNotification,
    fetchOptions = { retryCount: 3, retryDelay: 1000, timeout: 10000 },
    initialState: initialStateOverrides = {},
}) => {
    const [state, dispatch] = useReducer(notificationReducer, { ...initialState, ...initialStateOverrides })

    const fetchOptionsRef = useRef(fetchOptions)

    useEffect(() => {
        fetchOptionsRef.current = fetchOptions
    }, [fetchOptions])

    useEffect(() => {
        if (fetchNotifications) {
            loadNotifications()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchNotifications])

    const loadNotifications = useCallback(async () => {
        if (!fetchNotifications) return

        try {
            dispatch({ type: "FETCH_NOTIFICATIONS_REQUEST" })

            const notifications = await fetchWithRetry(fetchNotifications, fetchOptionsRef.current)

            dispatch({ type: "FETCH_NOTIFICATIONS_SUCCESS", payload: notifications })
        } catch (error) {
            dispatch({
                type: "FETCH_NOTIFICATIONS_FAILURE",
                payload: error instanceof Error ? error.message : "Failed to fetch notifications",
            })
        }
    }, [fetchNotifications])

    const markAsRead = useCallback(
        async (id: string) => {
            if (onMarkAsRead) {
                try {
                    await onMarkAsRead(id)
                } catch (error) {
                    console.error("Error marking notification as read:", error)
                    throw error
                }
            }
            dispatch({ type: "MARK_AS_READ", payload: id })
        },
        [onMarkAsRead],
    )

    const markAllAsRead = useCallback(async () => {
        if (onMarkAllAsRead) {
            try {
                await onMarkAllAsRead()
            } catch (error) {
                console.error("Error marking all notifications as read:", error)
                throw error
            }
        }
        dispatch({ type: "MARK_ALL_AS_READ" })
    }, [onMarkAllAsRead])

    const deleteNotification = useCallback(
        async (id: string) => {
            if (onDeleteNotification) {
                try {
                    await onDeleteNotification(id)
                } catch (error) {
                    console.error("Error deleting notification:", error)
                    throw error
                }
            }
            dispatch({ type: "DELETE_NOTIFICATION", payload: id })
        },
        [onDeleteNotification],
    )

    const addNotification = useCallback((notification: Notification) => {
        dispatch({ type: "ADD_NOTIFICATION", payload: notification })
    }, [])

    const clearAllNotifications = useCallback(() => {
        dispatch({ type: "CLEAR_ALL_NOTIFICATIONS" })
    }, [])

    const refreshNotifications = useCallback(async () => {
        await loadNotifications()
    }, [loadNotifications])

    const value = {
        ...state,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        refreshNotifications,
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
