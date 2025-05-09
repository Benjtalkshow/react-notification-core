"use client"

import React from "react"
import { useNotifications } from "../context/NotificationContext"
import { NotificationItem } from "./NotificationItem"
import type { NotificationDropdownProps } from "../types"

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
    isOpen,
    onClose,
    headerText = "Notifications",
    emptyText = "No notifications",
    showMarkAllAsRead = true,
    maxHeight = "400px",
    className = "",
    renderNotificationItem,
}) => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications()

    if (!isOpen) return null

    return (
        <div
            className={`
        absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden
        ${className}
      `}
        >
            <div className="p-4 border-b flex justify-between items-center">
                <div>
                    <h3 className="font-semibold">{headerText}</h3>
                    {unreadCount > 0 && <p className="text-xs text-gray-500">{unreadCount} unread</p>}
                </div>

                {showMarkAllAsRead && unreadCount > 0 && (
                    <button onClick={() => markAllAsRead()} className="text-sm text-blue-500 hover:text-blue-700">
                        Mark all as read
                    </button>
                )}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight }}>
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">{emptyText}</div>
                ) : (
                    <div className="p-2">
                        {notifications.map((notification) =>
                            renderNotificationItem ? (
                                <React.Fragment key={notification.id}>
                                    {renderNotificationItem(notification, markAsRead, deleteNotification)}
                                </React.Fragment>
                            ) : (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    onMarkAsRead={markAsRead}
                                    onDelete={deleteNotification}
                                />
                            ),
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
