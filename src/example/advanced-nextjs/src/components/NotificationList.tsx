"use client"
import type { Notification } from "react-notification-core"

interface NotificationListProps {
  notifications: Notification[] | null
  groupedNotifications: Record<string, Notification[]> | null
  groups: string[] | null
  markAsRead: (id: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

export default function NotificationList({
  notifications,
  groupedNotifications,
  groups,
  markAsRead,
  deleteNotification,
  isLoading,
  error,
}: NotificationListProps) {
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

  // Get notification type badge
  const getTypeBadge = (type?: string) => {
    switch (type) {
      case "success":
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Success</span>
      case "warning":
        return <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Warning</span>
      case "error":
        return <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">Error</span>
      case "info":
      default:
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Info</span>
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading notifications...</div>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>
  }

  // Render grouped notifications
  if (groupedNotifications && groups) {
    if (groups.length === 0) {
      return <div className="p-8 text-center text-gray-500">No notifications</div>
    }

    return (
      <div className="space-y-6">
        {groups.map((date) => (
          <div key={date} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 px-4 py-2 font-medium">{date}</div>
            <ul className="divide-y">
              {groupedNotifications[date].map((notification) => (
                <li
                  key={notification.id}
                  className={`p-4 ${!notification.read ? "bg-blue-50" : ""} ${getTypeStyle(notification.type)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{notification.title}</h4>
                        {getTypeBadge(notification.type)}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
                  </div>
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
          </div>
        ))}
      </div>
    )
  }

  // Render flat list of notifications
  if (notifications) {
    if (notifications.length === 0) {
      return <div className="p-8 text-center text-gray-500">No notifications</div>
    }

    return (
      <ul className="border rounded-lg overflow-hidden divide-y">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`p-4 ${!notification.read ? "bg-blue-50" : ""} ${getTypeStyle(notification.type)}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{notification.title}</h4>
                  {getTypeBadge(notification.type)}
                </div>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              <span className="text-xs text-gray-500">{formatTime(notification.timestamp)}</span>
            </div>
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
    )
  }

  return null
}
