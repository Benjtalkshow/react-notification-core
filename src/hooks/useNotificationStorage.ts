import { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationContext";
import type { UseNotificationStorageOptions, Notification } from "../types";


const inMemoryStorage = (() => {
  let storage: Record<string, string> = {};
  return {
    getItem: (key: string) => storage[key] ?? null,
    setItem: (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: (key: string) => {
      delete storage[key];
    },
  };
})();

/**
 * Hook for persisting notifications to localStorage or sessionStorage
 */
export const useNotificationStorage = ({
  storageKey = "notifications",
  useSessionStorage = false,
}: UseNotificationStorageOptions = {}) => {
  const {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const [storage, setStorage] = useState<Storage | typeof inMemoryStorage>(inMemoryStorage);

  // Initialize storage after mounting
  useEffect(() => {
    if (typeof window !== "undefined") {
      const selectedStorage = useSessionStorage ? sessionStorage : localStorage;
      setStorage(selectedStorage);
    }
  }, [useSessionStorage]);

  // Load notifications from storage on mount
  useEffect(() => {
    try {
      const storedNotifications = storage.getItem(storageKey);

      if (storedNotifications) {
        const parsedNotifications = JSON.parse(storedNotifications) as Notification[];

        parsedNotifications.forEach((notification) => {
          addNotification(notification);
        });
      }
    } catch (error) {
      console.error("Error loading notifications from storage:", error);
    }
  }, [storage, storageKey, addNotification]);

  // Save notifications to storage when they change
  useEffect(() => {
    try {
      storage.setItem(storageKey, JSON.stringify(notifications));
    } catch (error) {
      console.error("Error saving notifications to storage:", error);
    }
  }, [notifications, storage, storageKey]);

  return {
    addNotification: async (notification: Notification) => {
      addNotification(notification);
    },
    markAsRead: async (id: string) => {
      await markAsRead(id);
    },
    markAllAsRead: async () => {
      await markAllAsRead();
    },
    deleteNotification: async (id: string) => {
      await deleteNotification(id);
    },
    clearAllNotifications: () => {
      clearAllNotifications();
    },
    clearStorage: () => {
      storage.removeItem(storageKey);
    },
  };
};
