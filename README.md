# React Notification Core

[![npm version](https://img.shields.io/npm/v/react-notification-core.svg)](https://www.npmjs.com/package/react-notification-core)
[![Downloads](https://img.shields.io/npm/dm/react-notification-core.svg)](https://www.npmjs.com/package/react-notification-core)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Benjtalkshow/react-notification-core/blob/main/CONTRIBUTING.md)

A lightweight, UI-agnostic notification management library for React applications with TypeScript support.

## Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Demo](#-demo)
- [Quick Start](#-quick-start)
- [Core Concepts](#-core-concepts)
  - [NotificationProvider](#notificationprovider)
  - [useNotifications Hook](#usenotifications-hook)
- [Advanced Hooks](#-advanced-hooks)
  - [useNotificationPolling](#usenotificationpolling)
  - [useNotificationStorage](#usenotificationstorage)
  - [useNotificationFilters](#usenotificationfilters)
  - [useNotificationGroups](#usenotificationgroups)
- [API Reference](#-api-reference)
- [TypeScript Support](#-typescript-support)
- [Error Handling](#-error-handling)
- [Advanced Usage Examples](#-advanced-usage-examples)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- 🔄 **Complete State Management**: Comprehensive notification state handling out of the box
- 🎣 **Flexible Hooks**: Customizable hooks for notification functionality
- ⏱️ **Automatic Polling**: Built-in polling system with configurable intervals
- 💾 **Persistence**: Optional local/session storage integration
- 🔍 **Filtering & Grouping**: Powerful utilities for organizing notifications
- 📊 **TypeScript Support**: Full type definitions for improved developer experience
- 🔄 **Async Support**: First-class async/await support with robust error handling
- 🔁 **Retry Mechanism**: Configurable retry logic for failed API calls
- 🎨 **UI-Agnostic**: Bring your own UI components

## 📦 Installation

```bash
# Using npm
npm install react-notification-core

# Using yarn
yarn add react-notification-core

# Using pnpm
pnpm add react-notification-core
```

## 🎮 Demo

See React Notification Core in action with our example implementations:

- **Basic Example**: [Live Demo](https://react-notification-core-basic-example.vercel.app/) | [Source Code](https://github.com/Benjtalkshow/react-notification-core-basic-example)
- **Advanced Example**: [Live Demo](https://react-notification-core-advanced-example.vercel.app/) | [Source Code](https://github.com/Benjtalkshow/react-notification-core-advanced-example)

## 🚀 Quick Start

Here's a basic implementation to get you started:

```jsx
import React from 'react'
import { NotificationProvider, useNotifications } from 'react-notification-core'

// API functions to fetch and manage notifications
const fetchNotifications = async () => {
  const response = await fetch('/api/notifications')
  return response.json()
}

const markAsRead = async (id) => {
  await fetch(`/api/notifications/${id}/read`, { method: 'PUT' })
}

const markAllAsRead = async () => {
  await fetch('/api/notifications/read-all', { method: 'PUT' })
}

const deleteNotification = async (id) => {
  await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
}

// Your notification UI component
function NotificationList() {
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

  if (isLoading) return <div>Loading notifications...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <header>
        <h2>Notifications ({unreadCount} unread)</h2>
        <div>
          <button onClick={refreshNotifications}>Refresh</button>
          <button onClick={markAllAsRead}>Mark all as read</button>
        </div>
      </header>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.read ? 'read' : 'unread'}>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <div>
                {!notification.read && (
                  <button onClick={() => markAsRead(notification.id)}>Mark as read</button>
                )}
                <button onClick={() => deleteNotification(notification.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
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
      <NotificationList />
    </NotificationProvider>
  )
}

export default App
```

## 🧩 Core Concepts

### NotificationProvider

The `NotificationProvider` is the central component that manages notification state and provides context to child components.

#### Props

| Prop                   | Type                            | Required | Description                                   |
| ---------------------- | ------------------------------- | -------- | --------------------------------------------- |
| `fetchNotifications`   | `() => Promise<Notification[]>` | Yes      | Function to fetch notifications from your API |
| `onMarkAsRead`         | `(id: string) => Promise<void>` | No       | Function to mark a notification as read       |
| `onMarkAllAsRead`      | `() => Promise<void>`           | No       | Function to mark all notifications as read    |
| `onDeleteNotification` | `(id: string) => Promise<void>` | No       | Function to delete a notification             |
| `fetchOptions`         | `FetchOptions`                  | No       | Options for fetch behavior (retries, timeout) |
| `initialState`         | `NotificationState`             | No       | Initial state for notifications               |
| `children`             | `ReactNode`                     | Yes      | Child components                              |

#### Example

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
  <YourApp />
</NotificationProvider>
```

### useNotifications Hook

The primary hook to access and manage notifications from anywhere in your component tree.

#### Returns

| Property                | Type                                   | Description                                |
| ----------------------- | -------------------------------------- | ------------------------------------------ |
| `notifications`         | `Notification[]`                       | Array of all notifications                 |
| `unreadCount`           | `number`                               | Count of unread notifications              |
| `isLoading`             | `boolean`                              | Loading state                              |
| `error`                 | `Error \| null`                        | Error state                                |
| `lastUpdated`           | `Date \| null`                         | Timestamp of last update                   |
| `addNotification`       | `(notification: Notification) => void` | Function to add a new notification         |
| `markAsRead`            | `(id: string) => Promise<void>`        | Function to mark a notification as read    |
| `markAllAsRead`         | `() => Promise<void>`                  | Function to mark all notifications as read |
| `deleteNotification`    | `(id: string) => Promise<void>`        | Function to delete a notification          |
| `clearAllNotifications` | `() => void`                           | Function to clear all notifications        |
| `refreshNotifications`  | `() => Promise<void>`                  | Function to refresh notifications          |

#### Example

```jsx
function NotificationBadge() {
  const { unreadCount } = useNotifications()

  return <div className="badge">{unreadCount > 0 && <span>{unreadCount}</span>}</div>
}
```

## 🔧 Advanced Hooks

### useNotificationPolling

Set up automatic polling for new notifications.

#### Options

| Option       | Type                     | Default | Description                  |
| ------------ | ------------------------ | ------- | ---------------------------- |
| `enabled`    | `boolean`                | `true`  | Whether polling is enabled   |
| `interval`   | `number`                 | `60000` | Polling interval in ms       |
| `onError`    | `(error: Error) => void` | -       | Error handler                |
| `retryCount` | `number`                 | `3`     | Number of retries on failure |
| `retryDelay` | `number`                 | `1000`  | Delay between retries in ms  |

#### Returns

| Property       | Type                  | Description                                 |
| -------------- | --------------------- | ------------------------------------------- |
| `refresh`      | `() => Promise<void>` | Function to manually refresh                |
| `stopPolling`  | `() => void`          | Function to stop polling                    |
| `startPolling` | `() => void`          | Function to start polling                   |
| `isPolling`    | `() => boolean`       | Function that returns current polling state |

#### Example

```jsx
function NotificationContainer() {
  const { notifications } = useNotifications()
  const { stopPolling, startPolling, isPolling } = useNotificationPolling({
    interval: 30000, // Check every 30 seconds
    onError: (err) => console.error('Polling error:', err),
  })

  return (
    <div>
      <button onClick={isPolling() ? stopPolling : startPolling}>
        {isPolling() ? 'Pause Updates' : 'Enable Updates'}
      </button>
      <NotificationList notifications={notifications} />
    </div>
  )
}
```

### useNotificationStorage

Persist notifications to localStorage or sessionStorage.

#### Options

| Option              | Type      | Default           | Description                                           |
| ------------------- | --------- | ----------------- | ----------------------------------------------------- |
| `storageKey`        | `string`  | `'notifications'` | Key to use in storage                                 |
| `useSessionStorage` | `boolean` | `false`           | Whether to use sessionStorage instead of localStorage |

#### Returns

| Property       | Type         | Description               |
| -------------- | ------------ | ------------------------- |
| `clearStorage` | `() => void` | Function to clear storage |

#### Example

```jsx
function NotificationSettings() {
  const { clearStorage } = useNotificationStorage({
    storageKey: 'user-notifications',
  })

  return (
    <div>
      <h3>Notification Settings</h3>
      <button onClick={clearStorage}>Clear Notification History</button>
    </div>
  )
}
```

### useNotificationFilters

Filter notifications based on various criteria.

#### Returns

| Property                | Type                               | Description                             |
| ----------------------- | ---------------------------------- | --------------------------------------- |
| `filteredNotifications` | `Notification[]`                   | Array of filtered notifications         |
| `filterByReadStatus`    | `(read: boolean) => void`          | Function to filter by read status       |
| `filterByType`          | `(type: string) => void`           | Function to filter by type              |
| `filterBySearch`        | `(term: string) => void`           | Function to filter by search term       |
| `filterByDateRange`     | `(start: Date, end: Date) => void` | Function to filter by date range        |
| `resetFilters`          | `() => void`                       | Function to reset all filters           |
| `countsByType`          | `Record<string, number>`           | Object with counts by notification type |
| `totalCount`            | `number`                           | Total count of notifications            |
| `filteredCount`         | `number`                           | Count of filtered notifications         |
| `unreadCount`           | `number`                           | Count of unread notifications           |

#### Example

```jsx
function NotificationFilters() {
  const { filterByReadStatus, filterByType, resetFilters, countsByType } = useNotificationFilters()

  return (
    <div className="filters">
      <button onClick={() => filterByReadStatus(false)}>Show Unread Only</button>
      <button onClick={() => filterByReadStatus(true)}>Show Read Only</button>

      <div className="type-filters">
        {Object.entries(countsByType).map(([type, count]) => (
          <button key={type} onClick={() => filterByType(type)}>
            {type} ({count})
          </button>
        ))}
      </div>

      <button onClick={resetFilters}>Clear Filters</button>
    </div>
  )
}
```

### useNotificationGroups

Group notifications by date or custom criteria.

#### Returns

| Property                   | Type                                | Description                               |
| -------------------------- | ----------------------------------- | ----------------------------------------- |
| `groupedNotifications`     | `Record<string, Notification[]>`    | Object with grouped notifications         |
| `groups`                   | `string[]`                          | Array of group keys                       |
| `getNotificationsForGroup` | `(group: string) => Notification[]` | Function to get notifications for a group |
| `groupedByType`            | `Record<string, Notification[]>`    | Object with notifications grouped by type |

#### Example

```jsx
function GroupedNotifications() {
  const { groupedNotifications, groups } = useNotificationGroups()

  return (
    <div>
      {groups.map((group) => (
        <div key={group}>
          <h3>{group}</h3>
          <ul>
            {groupedNotifications[group].map((notification) => (
              <li key={notification.id}>{notification.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
```

## 🛠️ API Reference

### Utility Functions

The library provides several utility functions for working with notifications:

#### fetchWithRetry

```tsx
function fetchWithRetry<T>(
  fn: () => Promise<T>,
  options?: {
    retryCount?: number
    retryDelay?: number
    timeout?: number
  }
): Promise<T>
```

Executes an async function with retry capability on failure.

#### formatTimestamp

```tsx
function formatTimestamp(timestamp: Date | string | number, format?: string): string
```

Formats a timestamp into a human-readable string.

#### groupNotificationsByDate

```tsx
function groupNotificationsByDate(
  notifications: Notification[],
  options?: {
    format?: string
    groupingFn?: (date: Date) => string
  }
): Record<string, Notification[]>
```

Groups notifications by date with customizable formatting.

#### filterNotifications

```tsx
function filterNotifications(
  notifications: Notification[],
  filters: {
    read?: boolean
    type?: string
    search?: string
    dateRange?: { start: Date; end: Date }
  }
): Notification[]
```

Filters notifications based on specified criteria.

## 📝 TypeScript Support

This library is built with TypeScript and provides full type definitions:

```tsx
// Base notification type
interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  timestamp: string | number | Date
  type?: string
  [key: string]: any // Additional custom properties
}

// Provider context type
interface NotificationContextType {
  state: NotificationState
  dispatch: React.Dispatch<NotificationAction>
  api: {
    fetchNotifications: () => Promise<Notification[]>
    markAsRead?: (id: string) => Promise<void>
    markAllAsRead?: () => Promise<void>
    deleteNotification?: (id: string) => Promise<void>
  }
  fetchOptions: FetchOptions
}

// Notification state
interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  error: Error | null
  lastUpdated: Date | null
}

// Fetch options for API calls
interface FetchOptions {
  retryCount?: number
  retryDelay?: number
  timeout?: number
}

// Polling hook options
interface UseNotificationPollingOptions {
  enabled?: boolean
  interval?: number
  onError?: (error: Error) => void
  retryCount?: number
  retryDelay?: number
}
```

### Custom Type Extensions

You can extend the base `Notification` interface for custom notification types:

```tsx
import { Notification } from 'react-notification-core'

// Extend with your custom properties
interface TaskNotification extends Notification {
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  assignedTo: string
  project: string
}
```

## ⚠️ Error Handling

The library includes built-in error handling with retry capability:

```jsx
// Example with custom error handling
function NotificationsErrorHandler() {
  const { error, isLoading, refreshNotifications } = useNotifications()

  useEffect(() => {
    if (error) {
      // Show toast notification
      toast.error(`Failed to load notifications: ${error.message}`)
    }
  }, [error])

  if (isLoading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="error-container">
        <p>Could not load notifications</p>
        <button onClick={() => refreshNotifications()}>Try Again</button>
      </div>
    )
  }

  return <NotificationList />
}
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
  const handleAction = (action: string, id: string) => {
    // Handle different action types
    switch (action) {
      case 'approve':
        approveRequest(id)
        break
      case 'reject':
        rejectRequest(id)
        break
      default:
        console.log(`Action ${action} for notification ${id}`)
    }
  }

  return (
    <ul className="notification-list">
      {notifications.map((notification) => {
        // Cast to custom type
        const customNotification = notification as CustomNotification

        return (
          <li
            key={notification.id}
            className={`
              notification-item 
              priority-${customNotification.priority}
              category-${customNotification.category.toLowerCase()}
              ${notification.read ? 'read' : 'unread'}
            `}
          >
            <h3>{customNotification.title}</h3>
            <p>{customNotification.message}</p>
            <span className="category">{customNotification.category}</span>

            <div className="actions">
              {customNotification.actions?.map((action) => (
                <button
                  key={action.action}
                  onClick={() => handleAction(action.action, notification.id)}
                  className={`action-btn ${action.action}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
```

### Integration with External Notification Services

```tsx
import { NotificationProvider } from 'react-notification-core'
import { initializeFirebase, getFirebaseMessaging } from './firebaseConfig'

function App() {
  // Initialize Firebase for push notifications
  useEffect(() => {
    initializeFirebase()

    // Request permission and get token
    const messaging = getFirebaseMessaging()
    messaging
      .requestPermission()
      .then(() => {
        return messaging.getToken()
      })
      .then((token) => {
        // Send token to your server
        registerDeviceToken(token)
      })

    // Handle incoming notifications
    messaging.onMessage((payload) => {
      // You can add the notification to your local state
      addNotification({
        id: payload.messageId,
        title: payload.notification.title,
        message: payload.notification.body,
        read: false,
        timestamp: new Date(),
        type: payload.data?.type || 'default',
        // Add any custom data from payload.data
        ...payload.data,
      })
    })
  }, [])

  // API handlers
  const fetchNotifications = async () => {
    const response = await fetch('/api/notifications')
    return response.json()
  }

  // Other handlers...

  return (
    <NotificationProvider
      fetchNotifications={fetchNotifications}
      // Other props...
    >
      <YourApp />
    </NotificationProvider>
  )
}
```

### Real-time Notifications with WebSockets

```tsx
import { useEffect } from 'react'
import { NotificationProvider, useNotifications } from 'react-notification-core'

function WebSocketNotificationHandler() {
  const { addNotification } = useNotifications()

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket('wss://your-api.com/notifications')

    // Connection opened
    socket.addEventListener('open', (event) => {
      console.log('Connected to notification server')
    })

    // Listen for messages
    socket.addEventListener('message', (event) => {
      const notification = JSON.parse(event.data)
      addNotification({
        ...notification,
        read: false,
        timestamp: notification.timestamp || new Date(),
      })
    })

    // Handle errors
    socket.addEventListener('error', (event) => {
      console.error('WebSocket error:', event)
    })

    // Clean up on unmount
    return () => {
      socket.close()
    }
  }, [addNotification])

  return null // This component doesn't render anything
}

function App() {
  // API functions
  const fetchNotifications = async () => {
    // Your implementation
  }

  return (
    <NotificationProvider fetchNotifications={fetchNotifications}>
      <WebSocketNotificationHandler />
      <YourApp />
    </NotificationProvider>
  )
}
```

## 🤝 Contributing

Contributions are welcome! Please see our [contributing guidelines](https://github.com/Benjtalkshow/react-notification-core/blob/main/CONTRIBUTING.md) for more details.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT

---

Built with ❤️ by [Benjtalkshow](https://github.com/Benjtalkshow)
