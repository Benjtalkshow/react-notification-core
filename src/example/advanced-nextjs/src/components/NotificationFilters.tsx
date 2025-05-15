"use client"

interface NotificationFiltersProps {
  filterByType: (type?: string) => void
  filterByReadStatus: (read?: boolean) => void
  resetFilters: () => void
  countsByType: Record<string, number>
  currentFilters: {
    read?: boolean
    type?: string
    search?: string
  }
}

export default function NotificationFilters({
  filterByType,
  filterByReadStatus,
  resetFilters,
  countsByType,
  currentFilters,
}: NotificationFiltersProps) {
  return (
    <div className="flex gap-2">
      <select
        value={currentFilters.type || ""}
        onChange={(e) => filterByType(e.target.value || undefined)}
        className="px-3 py-2 border rounded text-sm"
      >
        <option value="">All Types</option>
        <option value="info">Info ({countsByType["info"] || 0})</option>
        <option value="success">Success ({countsByType["success"] || 0})</option>
        <option value="warning">Warning ({countsByType["warning"] || 0})</option>
        <option value="error">Error ({countsByType["error"] || 0})</option>
      </select>

      <select
        value={currentFilters.read === undefined ? "" : currentFilters.read ? "read" : "unread"}
        onChange={(e) => {
          if (e.target.value === "read") filterByReadStatus(true)
          else if (e.target.value === "unread") filterByReadStatus(false)
          else filterByReadStatus(undefined)
        }}
        className="px-3 py-2 border rounded text-sm"
      >
        <option value="">All Status</option>
        <option value="read">Read</option>
        <option value="unread">Unread</option>
      </select>

      <button onClick={resetFilters} className="px-3 py-2 border rounded text-sm hover:bg-gray-100">
        Reset
      </button>
    </div>
  )
}
