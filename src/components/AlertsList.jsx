export default function AlertsList({ alerts }) {
  const badge = (sev) => {
    const map = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700', critical: 'bg-purple-100 text-purple-700' }
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[sev] || 'bg-gray-100 text-gray-700'}`}>{sev}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-3">Alerts</h3>
      <div className="space-y-3">
        {alerts && alerts.length > 0 ? alerts.map((a, idx) => (
          <div key={idx} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{a.title}</div>
              {badge(a.severity)}
            </div>
            <div className="text-sm text-gray-600">{a.description}</div>
            <div className="text-xs text-gray-500 mt-1">User: {a.user || 'unknown'} | First: {new Date(a.first_seen).toLocaleString()} | Last: {new Date(a.last_seen).toLocaleString()} | Count: {a.count}</div>
          </div>
        )) : (
          <p className="text-gray-500 text-sm">No alerts yet. Run detections after ingesting events.</p>
        )}
      </div>
    </div>
  )
}
