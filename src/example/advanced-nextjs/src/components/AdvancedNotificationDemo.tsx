"use client"

import type React from "react"
import { useState } from "react"
import {
  useNotifications,
  useNotificationPolling,
  useNotificationStorage,
  useNotificationFilters,
  useNotificationGroups,
  formatTimestamp,
} from "react-notification-core"
import NotificationBell from "./NotificationBell"
import NotificationList from "./NotificationList"
import NotificationFilters from "./NotificationFilters"
import NotificationStats from "./NotificationStats"

export default function AdvancedNotificationDemo() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification,
    clearAllNotifications,
    refreshNotifications,
    isLoading,
    error,
    lastUpdated,
  } = useNotifications()

  // Set up polling with custom options
  const { refresh, stopPolling, startPolling, isPolling } = useNotificationPolling({
    interval: 30000, // 30 seconds
    enabled: false, // Start disabled
    retryCount: 3,
    retryDelay: 2000,
  })

  // Set up local storage persistence
  const { clearStorage } = useNotificationStorage({
    storageKey: "advanced-demo-notifications",
    useSessionStorage: false,
  })

  // Set up filtering
  const {
    filteredNotifications,
    filterByReadStatus,
    filterByType,
    filterBySearch,
    resetFilters,
    countsByType,
    filters,
  } = useNotificationFilters()

  // Set up grouping
  const { groupedNotifications, groups } = useNotificationGroups()

  // Local state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isPollingActive, setIsPollingActive] = useState(false)
  const [showGrouped, setShowGrouped] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Toggle polling
  const togglePolling = () => {
    if (isPollingActive) {
      stopPolling()
      setIsPollingActive(false)
    } else {
      startPolling()
      setIsPollingActive(true)
    }
  }

  // Create a new notification
  const createTestNotification = (type: "info" | "success" | "warning" | "error") => {
    const newNotification = {
      id: `test-${Date.now()}`,
      title: `Test ${type} notification`,
      message: `This is a test ${type} notification created at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date(),
      read: false,
      type,
    }

    addNotification(newNotification)
  }

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    filterBySearch(value)
  }

  // Reset all
  const handleReset = () => {
    resetFilters()
    setSearchTerm("")
    clearAllNotifications()
    clearStorage()
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Advanced Notification Demo</h2>
          <NotificationBell
            unreadCount={unreadCount}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            notifications={notifications}
            markAsRead={markAsRead}
            markAllAsRead={markAllAsRead}
            deleteNotification={deleteNotification}
            isLoading={isLoading}
            error={error}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-medium mb-3">Controls</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => refreshNotifications()}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Refresh
              </button>
              <button
                onClick={togglePolling}
                className={`px-3 py-1 ${isPollingActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white rounded text-sm`}
              >
                {isPollingActive ? "Stop Polling" : "Start Polling"}
              </button>
              <button
                onClick={() => markAllAsRead()}
                className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                disabled={unreadCount === 0}
              >
                Mark All Read
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Reset All
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Create Test Notification</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => createTestNotification("info")}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Info
              </button>
              <button
                onClick={() => createTestNotification("success")}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Success
              </button>
              <button
                onClick={() => createTestNotification("warning")}
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
              >
                Warning
              </button>
              <button
                onClick={() => createTestNotification("error")}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Error
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-3">Filters & Display</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <NotificationFilters
              filterByType={filterByType}
              filterByReadStatus={filterByReadStatus}
              resetFilters={resetFilters}
              countsByType={countsByType}
              currentFilters={filters}
            />

            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrouped}
                  onChange={() => setShowGrouped(!showGrouped)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium">Group by Date</span>
              </label>
            </div>
          </div>
        </div>

        <NotificationStats
          totalCount={notifications.length}
          unreadCount={unreadCount}
          filteredCount={filteredNotifications.length}
          countsByType={countsByType}
          lastUpdated={lastUpdated ? formatTimestamp(lastUpdated) : "Never"}
          isPolling={isPollingActive}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {showGrouped ? "Grouped Notifications" : "Filtered Notifications"}
        </h2>

        <NotificationList
          notifications={showGrouped ? null : filteredNotifications}
          groupedNotifications={showGrouped ? groupedNotifications : null}
          groups={showGrouped ? groups : null}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  )
}
