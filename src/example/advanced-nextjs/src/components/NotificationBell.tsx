"use client"

import { useRef, useEffect } from "react"
import type { Notification } from "react-notification-core"

interface NotificationBellProps {
  unreadCount: number
  onClick: () => void
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export default function NotificationBell({
  unreadCount,
  onClick,
  isOpen,
  onClose,
  notifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  isLoading,
  error,
}: NotificationBellProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  // Format timestamp
  const formatTime = (timestamp: Date | string) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    return date.toLocaleString()
  }

  // Get notification type style
  const getTypeStyle = (type?: string) => {
    switch (type) {
      case "success":
        return "border-l-4 border-green-500"
      case "warning":
        return "border-l-4 border-yellow-500"
      case "error":
        return "border-l-4 border-red-500"
      case "info":
      default:
        return "border-l-4 border-blue-500"
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon with Badge */}
      <button
        onClick={onClick}
        className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10">
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={() => markAllAsRead()} className="text-sm text-blue-500 hover:text-blue-700">
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading notifications...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Error: {error}</div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            ) : (
              <ul>
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`p-4 border-b ${!notification.read ? "bg-blue-50" : ""} ${getTypeStyle(notification.type)}`}
                  >
                    <div className="flex justify-between">
                      <h4 className="font-semibold">{notification.title}</h4>
                      <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex justify-end mt-2 space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
