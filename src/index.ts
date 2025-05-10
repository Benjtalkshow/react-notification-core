// Main exports
export { NotificationProvider, useNotifications } from "./context/NotificationContext"

// Hooks
export { useNotificationPolling } from "./hooks/useNotificationPolling"
export { useNotificationStorage } from "./hooks/useNotificationStorage"
export { useNotificationFilters } from "./hooks/useNotificationFilters"
export { useNotificationGroups } from "./hooks/useNotificationGroups"

// Utilities
export {
    fetchWithRetry,
    formatTimestamp,
    groupNotificationsByDate,
    filterNotifications,
} from "./utils/fetchUtils"

// Types
export type {
    Notification,
    NotificationState,
    NotificationAction,
    NotificationContextType,
    FetchOptions,
    NotificationProviderProps,
    UseNotificationPollingOptions,
    UseNotificationStorageOptions,
} from "./types"
