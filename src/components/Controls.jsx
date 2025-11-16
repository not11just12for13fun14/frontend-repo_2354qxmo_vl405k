import { useState } from 'react'

export default function Controls({ onRunDetections, onRefresh, onExportCsv, onViewSaved, onViewTransient }) {
  const [windowMinutes, setWindowMinutes] = useState(1440)
  const [thresholdFailed, setThresholdFailed] = useState(5)
  const [thresholdMB, setThresholdMB] = useState(500)

  return (
    <div className="w-full bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-6 gap-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Window (minutes)</label>
        <input type="number" value={windowMinutes} onChange={e=>setWindowMinutes(Number(e.target.value))} className="w-full border rounded px-2 py-1" min={5} max={10080} />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Failed Login Threshold</label>
        <input type="number" value={thresholdFailed} onChange={e=>setThresholdFailed(Number(e.target.value))} className="w-full border rounded px-2 py-1" min={2} max={50} />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Large Transfer Threshold (MB)</label>
        <input type="number" value={thresholdMB} onChange={e=>setThresholdMB(Number(e.target.value))} className="w-full border rounded px-2 py-1" min={100} max={50000} />
      </div>
      <div className="flex items-end gap-2">
        <button onClick={()=>onRunDetections({windowMinutes, thresholdFailed, thresholdMB, persist: false})} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded">Run (Preview)</button>
        <button onClick={()=>onRunDetections({windowMinutes, thresholdFailed, thresholdMB, persist: true})} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded">Run & Save</button>
      </div>
      <div className="flex items-end gap-2">
        <button onClick={onRefresh} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded">Refresh Events</button>
        <button onClick={onExportCsv} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded">Export CSV</button>
      </div>
      <div className="flex items-end gap-2">
        <button onClick={onViewTransient} className="bg-white border px-3 py-2 rounded">View Run Results</button>
        <button onClick={onViewSaved} className="bg-white border px-3 py-2 rounded">View Saved Alerts</button>
      </div>
    </div>
  )
}
