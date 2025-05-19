import { useState, useRef, useEffect } from "react"
import { useNotifications, formatTimestamp } from "react-notification-core"
import { Bell, Check, Trash2, RefreshCw, X } from "lucide-react"

export default function NotificationDemo() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    isLoading,
    error,
  } = useNotifications()

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Notification Demo</h2>
        <p className="mb-4">
          This is a basic example of how to use the react-notification-core library. Click the bell icon to see your
          notifications.
        </p>

        <div className="flex justify-end items-center">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ""}`}
            >
              <Bell size={24} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-hidden">
                <div className="p-3 border-b flex justify-between items-center bg-gray-50">
                  <h3 className="font-semibold text-gray-800">
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 text-xs font-normal text-gray-500">{unreadCount} unread</span>
                    )}
                  </h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => markAllAsRead()}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Check size={14} />
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center text-gray-500 flex items-center justify-center">
                      <div className="animate-spin mr-2">
                        <RefreshCw size={16} />
                      </div>
                      Loading notifications...
                    </div>
                  ) : error ? (
                    <div className="p-4 text-center text-red-500 flex items-center justify-center gap-2">
                      <X size={16} />
                      Error: {error}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 flex flex-col items-center justify-center">
                      <Bell size={32} className="text-gray-300 mb-2" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <li
                          key={notification.id}
                          className={`p-3 hover:bg-gray-50 transition-colors ${!notification.read ? "bg-blue-50" : ""}`}
                        >
                          <div className="flex justify-between">
                            <h4 className={`font-medium text-gray-800 ${!notification.read ? "font-semibold" : ""}`}>
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.message}</p>
                          <div className="flex justify-end mt-2 space-x-3">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                <Check size={12} />
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <Trash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="p-2 border-t bg-gray-50">
                  <button
                    onClick={() => refreshNotifications()}
                    className="w-full py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <RefreshCw size={14} />
                    Refresh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
