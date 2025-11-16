export default function AlertsList({ alerts, saved = false, meta, onPageChange, onAcknowledge }) {
  const badge = (sev) => {
    const map = { low: 'bg-green-100 text-green-700', medium: 'bg-yellow-100 text-yellow-700', high: 'bg-red-100 text-red-700', critical: 'bg-purple-100 text-purple-700' }
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${map[sev] || 'bg-gray-100 text-gray-700'}`}>{sev}</span>
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">{saved ? 'Saved Alerts' : 'Alerts (Transient Run)'}</h3>
        {saved && meta && (
          <div className="text-xs text-gray-500">{(meta.page - 1) * meta.page_size + 1} - {Math.min(meta.page * meta.page_size, meta.total)} of {meta.total}</div>
        )}
      </div>
      <div className="space-y-3">
        {alerts && alerts.length > 0 ? alerts.map((a, idx) => (
          <div key={a._id || idx} className="border rounded p-3">
            <div className="flex items-center justify-between">
              <div className="font-medium">{a.title}</div>
              {badge(a.severity)}
            </div>
            <div className="text-sm text-gray-600">{a.description}</div>
            <div className="text-xs text-gray-500 mt-1">User: {a.user || 'unknown'} | First: {new Date(a.first_seen).toLocaleString()} | Last: {new Date(a.last_seen).toLocaleString()} | Count: {a.count}</div>
            {saved && (
              <div className="mt-2 flex gap-2">
                <button onClick={() => onAcknowledge([a._id])} className="px-2 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200">Acknowledge</button>
              </div>
            )}
          </div>
        )) : (
          <p className="text-gray-500 text-sm">No alerts.</p>
        )}
      </div>
      {saved && meta && meta.total > meta.page_size && (
        <div className="flex justify-between items-center mt-3">
          <button disabled={meta.page === 1} onClick={() => onPageChange(meta.page - 1)} className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
          <div className="text-sm text-gray-600">Page {meta.page}</div>
          <button disabled={meta.page * meta.page_size >= meta.total} onClick={() => onPageChange(meta.page + 1)} className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  )
}
