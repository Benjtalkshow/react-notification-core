# React Notification Core

A lightweight, UI-agnostic notification management library for React applications with TypeScript support.

## ✨ Features

- 🔄 Complete notification state management
- 🎣 Customizable hooks for notification functionality
- ⏱️ Automatic polling with retry capability
- 💾 Local storage persistence
- 🔍 Filtering and grouping utilities
- 📊 TypeScript support
- 🔄 Async/await support with error handling
- 🔁 Retry mechanism for failed API calls

## 📦 Installation

```bash
npm install react-notification-core
# or
yarn add react-notification-core
```

## Testing examples

- cd `src/examples`
- cd into `basic-nextjs` or `advanced-nextjs`
- Run `npm install` or `yarn install`
- Finally, run install react notification by running `npm install react-notification-core`

## 🚀 Quick Start

```jsx
import React from 'react'
import { NotificationProvider, useNotifications } from 'react-notification-core'

// API functions to fetch and manage notifications
const fetchNotifications = async () => {
  // Your API call to fetch notifications
  const response = await fetch('/api/notifications')
  return response.json()
}

const markAsRead = async (id) => {
  // Your API call to mark notification as read
  await fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
}

const markAllAsRead = async () => {
  // Your API call to mark all notifications as read
  await fetch('/api/notifications/read-all', { method: 'PUT' })
}

const deleteNotification = async (id) => {
  // Your API call to delete notification
  await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
}

// Your notification UI component
function NotificationUI() {
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

  // Implement your own UI using these values and functions
  // For example:
  if (isLoading) return <div>Loading notifications...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <div>Unread: {unreadCount}</div>
      <button onClick={() => markAllAsRead()}>Mark all as read</button>
      <button onClick={() => refreshNotifications()}>Refresh</button>

      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            <h3>{notification.title}</h3>
            <p>{notification.message}</p>
            <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
            <button onClick={() => deleteNotification(notification.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// App setup with provider
function App() {
  return (
    <NotificationProvider
      fetchNotifications={fetchNotifications}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onDeleteNotification={deleteNotification}
      fetchOptions={{
        retryCount: 3,
        retryDelay: 1000,
        timeout: 10000,
      }}
    >
      <NotificationUI />
    </NotificationProvider>
  )
}
```

## 🧩 Core Concepts

### NotificationProvider

The provider component that manages the notification state and provides context to child components.

```jsx
<NotificationProvider
  fetchNotifications={fetchNotificationsFunction}
  onMarkAsRead={markAsReadFunction}
  onMarkAllAsRead={markAllAsReadFunction}
  onDeleteNotification={deleteNotificationFunction}
  fetchOptions={{
    retryCount: 3,
    retryDelay: 1000,
    timeout: 10000,
  }}
  initialState={{
    notifications: [], // Initial notifications
    unreadCount: 0,
  }}
>
  {children}
</NotificationProvider>
```

### useNotifications Hook

Access and manage notifications from anywhere in your component tree.

```jsx
const {
  notifications, // Array of all notifications
  unreadCount, // Count of unread notifications
  isLoading, // Loading state
  error, // Error state
  lastUpdated, // Timestamp of last update

  addNotification, // Function to add a new notification
  markAsRead, // Function to mark a notification as read
  markAllAsRead, // Function to mark all notifications as read
  deleteNotification, // Function to delete a notification
  clearAllNotifications, // Function to clear all notifications
  refreshNotifications, // Function to refresh notifications
} = useNotifications()
```

## 🔧 Advanced Hooks

### useNotificationPolling

Set up automatic polling for new notifications.

```jsx
const {
  refresh, // Function to manually refresh
  stopPolling, // Function to stop polling
  startPolling, // Function to start polling
  isPolling, // Function that returns current polling state
} = useNotificationPolling({
  enabled: true, // Whether polling is enabled
  interval: 60000, // Polling interval in ms (default: 60000)
  onError: (error) => {}, // Error handler
  retryCount: 3, // Number of retries on failure
  retryDelay: 1000, // Delay between retries in ms
})
```

### useNotificationStorage

Persist notifications to localStorage or sessionStorage.

```jsx
const {
  clearStorage, // Function to clear storage
} = useNotificationStorage({
  storageKey: 'notifications', // Key to use in storage
  useSessionStorage: false, // Whether to use sessionStorage instead of localStorage
})
```

### useNotificationFilters

Filter notifications based on various criteria.

```jsx
const {
  filteredNotifications, // Array of filtered notifications
  filterByReadStatus, // Function to filter by read status
  filterByType, // Function to filter by type
  filterBySearch, // Function to filter by search term
  filterByDateRange, // Function to filter by date range
  resetFilters, // Function to reset all filters
  countsByType, // Object with counts by notification type
  totalCount, // Total count of notifications
  filteredCount, // Count of filtered notifications
  unreadCount, // Count of unread notifications
} = useNotificationFilters()
```

### useNotificationGroups

Group notifications by date or custom criteria.

```jsx
const {
  groupedNotifications, // Object with grouped notifications
  groups, // Array of group keys
  getNotificationsForGroup, // Function to get notifications for a group
  groupedByType, // Object with notifications grouped by type
} = useNotificationGroups()
```

## 🛠️ Utility Functions

The library also provides utility functions for working with notifications:

```jsx
import {
  fetchWithRetry, // Function to fetch with retry capability
  formatTimestamp, // Function to format timestamps
  groupNotificationsByDate, // Function to group notifications by date
  filterNotifications, // Function to filter notifications
} from 'react-notification-core'
```

## 📝 TypeScript Support

This library is built with TypeScript and provides full type definitions.

```tsx
import {
  Notification,
  NotificationContextType,
  NotificationState,
  FetchOptions,
  UseNotificationPollingOptions,
} from 'react-notification-core'
```

## ⚠️ Error Handling

The library includes built-in error handling with retry capability:

```jsx
// Example with custom error handling
const { error, isLoading } = useNotifications()

useEffect(() => {
  if (error) {
    // Handle error (e.g., show toast notification)
    console.error('Notification error:', error)
  }
}, [error])
```

## 🔍 Advanced Usage Examples

### Custom Notification Types

```tsx
import { NotificationProvider, useNotifications } from 'react-notification-core'
import type { Notification } from 'react-notification-core'

// Extend the base Notification type
interface CustomNotification extends Notification {
  priority: 'low' | 'medium' | 'high'
  category: string
  actions?: Array<{
    label: string
    action: string
  }>
}

// Use the custom type in your components
function NotificationList() {
  const { notifications } = useNotifications()

  return (
    <ul>
      {notifications.map((notification) => {
        // Cast to custom type
        const customNotification = notification as CustomNotification

        return (
          <li key={notification.id}>
            <span className={`priority-${customNotification.priority}`}>
              {customNotification.title}
            </span>
            <span>Category: {customNotification.category}</span>

            {customNotification.actions?.map((action) => (
              <button
                key={action.action}
                onClick={() => handleAction(action.action, notification.id)}
              >
                {action.label}
              </button>
            ))}
          </li>
        )
      })}
    </ul>
  )
}
```

### [Contribute to react-notification-library](https://github.com/Benjtalkshow/react-notification-core)

## 📄 License

MIT
