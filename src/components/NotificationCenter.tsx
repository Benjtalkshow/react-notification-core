"use client"

import React from "react"
import { useState, useRef, useEffect } from "react"
import { NotificationIcon } from "./NotificationIcon"
import { NotificationDropdown } from "./NotificationDropDown"
import type { NotificationCenterProps } from "../types"

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    iconClassName = "",
    dropdownClassName = "",
    badgePosition = "top-right",
    headerText,
    emptyText,
    showMarkAllAsRead = true,
    maxHeight,
    renderNotificationItem,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    const closeDropdown = () => {
        setIsOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                closeDropdown()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    return (
        <div className="relative" ref={ref}>
            <NotificationIcon className={iconClassName} onClick={toggleDropdown} badgePosition={badgePosition} />

            <NotificationDropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                headerText={headerText}
                emptyText={emptyText}
                showMarkAllAsRead={showMarkAllAsRead}
                maxHeight={maxHeight}
                className={dropdownClassName}
                renderNotificationItem={renderNotificationItem}
            />
        </div>
    )
}
