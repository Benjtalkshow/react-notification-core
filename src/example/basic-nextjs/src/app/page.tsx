"use client"
import NotificationDemo from "@/components/NotificationDemo"
import { NotificationProvider } from "react-notification-core"
import { mockFetchNotifications, mockMarkAsRead, mockMarkAllAsRead, mockDeleteNotification } from "@/lib/mockApi"

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Basic Notification Example</h1>

        <NotificationProvider
          fetchNotifications={mockFetchNotifications}
          onMarkAsRead={mockMarkAsRead}
          onMarkAllAsRead={mockMarkAllAsRead}
          onDeleteNotification={mockDeleteNotification}
          fetchOptions={{
            retryCount: 2,
            retryDelay: 1000,
            timeout: 5000,
          }}
        >
          <NotificationDemo />
        </NotificationProvider>
      </div>
    </main>
  )
}
