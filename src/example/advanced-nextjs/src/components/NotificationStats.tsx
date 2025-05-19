interface NotificationStatsProps {
    totalCount: number
    unreadCount: number
    filteredCount: number
    countsByType: Record<string, number>
    lastUpdated: string
    isPolling: boolean
  }
  
  export default function NotificationStats({
    totalCount,
    unreadCount,
    filteredCount,
    countsByType,
    lastUpdated,
    isPolling,
  }: NotificationStatsProps) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-3">Notification Stats</h3>
  
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Total</div>
            <div className="text-xl font-semibold">{totalCount}</div>
          </div>
  
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Unread</div>
            <div className="text-xl font-semibold text-blue-600">{unreadCount}</div>
          </div>
  
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Filtered</div>
            <div className="text-xl font-semibold">{filteredCount}</div>
          </div>
  
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Status</div>
            <div className="text-sm font-medium">
              <span className={`inline-flex items-center ${isPolling ? "text-green-600" : "text-gray-600"}`}>
                {isPolling ? (
                  <>
                    <span className="relative flex h-3 w-3 mr-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Polling Active
                  </>
                ) : (
                  "Polling Inactive"
                )}
              </span>
            </div>
          </div>
        </div>
  
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Info</div>
            <div className="text-xl font-semibold text-blue-600">{countsByType["info"] || 0}</div>
          </div>
  
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Success</div>
            <div className="text-xl font-semibold text-green-600">{countsByType["success"] || 0}</div>
          </div>
  
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Warning</div>
            <div className="text-xl font-semibold text-yellow-600">{countsByType["warning"] || 0}</div>
          </div>
  
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="text-sm text-gray-500">Error</div>
            <div className="text-xl font-semibold text-red-600">{countsByType["error"] || 0}</div>
          </div>
        </div>
  
        <div className="mt-4 text-sm text-gray-500">Last updated: {lastUpdated}</div>
      </div>
    )
  }
  