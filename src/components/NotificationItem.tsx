"use client"

import React from "react"
import type { NotificationItemProps } from "../types"

export const NotificationItem: React.FC<NotificationItemProps> = ({
    notification,
    onMarkAsRead,
    onDelete,
    className = "",
}) => {
    const handleMarkAsRead = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!notification.read) {
            onMarkAsRead(notification.id)
        }
    }

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation()
        onDelete(notification.id)
    }

    const formatTimestamp = (timestamp: Date | string) => {
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
        } else {
            const days = Math.floor(diffInSeconds / 86400)
            return `${days} ${days === 1 ? "day" : "days"} ago`
        }
    }

    const getTypeStyles = () => {
        switch (notification.type) {
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
        <div
            className={`
        p-4 mb-2 bg-white rounded shadow transition-all duration-200
        ${!notification.read ? "bg-blue-50" : ""}
        ${getTypeStyles()}
        ${className}
      `}
            onClick={handleMarkAsRead}
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h4 className="font-semibold text-sm">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <div className="text-xs text-gray-500 mt-2">{formatTimestamp(notification.timestamp)}</div>
                </div>

                <div className="flex space-x-2">
                    {!notification.read && (
                        <button
                            onClick={handleMarkAsRead}
                            className="text-blue-500 hover:text-blue-700 text-xs"
                            aria-label="Mark as read"
                        >
                            Mark read
                        </button>
                    )}
                    <button
                        onClick={handleDelete}
                        className="text-red-500 hover:text-red-700 text-xs"
                        aria-label="Delete notification"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {notification.link && (
                <a
                    href={notification.link}
                    className="text-blue-500 hover:underline text-sm block mt-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    View details
                </a>
            )}

            {notification.image && (
                <img
                    src={notification.image || "/placeholder.svg"}
                    alt="Notification image"
                    className="mt-2 rounded max-w-full h-auto"
                />
            )}
        </div>
    )
}
