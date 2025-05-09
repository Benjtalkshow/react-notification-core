"use client"

import React from "react"
import { useNotifications } from "../context/NotificationContext"
import type { NotificationIconProps } from "../types"
import { Bell } from "./icons/Bell"

export const NotificationIcon: React.FC<NotificationIconProps> = ({
    className = "",
    onClick,
    showBadge = true,
    badgePosition = "top-right",
    customBadge,
}) => {
    const { unreadCount } = useNotifications()

    const getBadgePositionClass = () => {
        switch (badgePosition) {
            case "top-left":
                return "top-0 left-0 -translate-x-1/2 -translate-y-1/2"
            case "bottom-right":
                return "bottom-0 right-0 translate-x-1/2 translate-y-1/2"
            case "bottom-left":
                return "bottom-0 left-0 -translate-x-1/2 translate-y-1/2"
            case "top-right":
            default:
                return "top-0 right-0 translate-x-1/2 -translate-y-1/2"
        }
    }

    return (
        <div className={`relative inline-block ${className}`} onClick={onClick}>
            <Bell className="w-6 h-6" />

            {showBadge && unreadCount > 0 && !customBadge && (
                <span
                    className={`absolute ${getBadgePositionClass()} flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full`}
                >
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}

            {showBadge && unreadCount > 0 && customBadge && (
                <span className={`absolute ${getBadgePositionClass()}`}>{customBadge}</span>
            )}
        </div>
    )
}
