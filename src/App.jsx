import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Controls from './components/Controls'
import EventsTable from './components/EventsTable'
import AlertsList from './components/AlertsList'

function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const apiKey = useMemo(() => import.meta.env.VITE_API_KEY || '', [])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState([]) // transient run results
  const [savedAlerts, setSavedAlerts] = useState([])
  const [savedMeta, setSavedMeta] = useState({ page: 1, total: 0, page_size: 50 })
  const [error, setError] = useState('')
  const [viewSaved, setViewSaved] = useState(false)

  const authHeaders = () => (apiKey ? { 'x-api-key': apiKey } : {})

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${baseUrl}/api/events?since_minutes=1440&page=1&page_size=200`, { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error(`Events error: ${res.status}`)
      const data = await res.json()
      setEvents(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const runDetections = async ({ windowMinutes, thresholdFailed, thresholdMB, persist = false }) => {
    try {
      setError('')
      const url = `${baseUrl}/api/alerts/run?window_minutes=${windowMinutes}&threshold_failed_logins=${thresholdFailed}&threshold_large_downloads_mb=${thresholdMB}&persist=${persist}`
      const res = await fetch(url, { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error(`Detections error: ${res.status}`)
      const data = await res.json()
      setAlerts(data)
      if (persist) {
        // refresh saved alerts view
        await loadSavedAlerts(1)
        setViewSaved(true)
      }
    } catch (e) {
      setError(e.message)
    }
  }

  const loadSavedAlerts = async (page = 1) => {
    try {
      setError('')
      const res = await fetch(`${baseUrl}/api/alerts?page=${page}&page_size=${savedMeta.page_size}`, { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error(`Saved alerts error: ${res.status}`)
      const data = await res.json()
      setSavedAlerts(data.items || [])
      setSavedMeta({ page: data.page, total: data.total, page_size: data.page_size })
    } catch (e) {
      setError(e.message)
    }
  }

  const acknowledgeAlerts = async (ids) => {
    try {
      setError('')
      const res = await fetch(`${baseUrl}/api/alerts/ack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ ids })
      })
      if (!res.ok) throw new Error(`Acknowledge error: ${res.status}`)
      await loadSavedAlerts(savedMeta.page)
    } catch (e) {
      setError(e.message)
    }
  }

  const exportCsv = async () => {
    try {
      setError('')
      const res = await fetch(`${baseUrl}/api/export/events.csv?since_minutes=1440`, { headers: { ...authHeaders() } })
      if (!res.ok) throw new Error(`Export error: ${res.status}`)
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'events.csv'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <Controls onRunDetections={runDetections} onRefresh={fetchEvents} onExportCsv={exportCsv} onViewSaved={() => { setViewSaved(true); loadSavedAlerts(1) }} onViewTransient={() => setViewSaved(false)} />

        {error && <div className="bg-red-50 text-red-700 p-3 rounded">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-semibold">Events</h2>
            {loading ? (
              <div className="bg-white rounded-lg shadow p-4 text-gray-500">Loading events...</div>
            ) : (
              <EventsTable items={events} />
            )}
          </div>

          <div className="lg:col-span-1 space-y-3">
            {viewSaved ? (
              <AlertsList alerts={savedAlerts} saved meta={savedMeta} onPageChange={(p) => loadSavedAlerts(p)} onAcknowledge={acknowledgeAlerts} />
            ) : (
              <AlertsList alerts={alerts} />
            )}
          </div>
        </div>

        <section className="text-sm text-gray-500">
          <h3 className="font-semibold text-gray-700 mb-1">How to ingest</h3>
          <pre className="bg-white rounded p-3 overflow-x-auto">
            {`POST ${baseUrl}/api/events/ingest\nHeaders: ${apiKey ? 'x-api-key: ' + apiKey : '(set x-api-key if configured)'}\nBody (JSON):\n[\n  {\n    "timestamp": "2025-01-01T12:00:00Z",\n    "user": "alice",\n    "action": "login",\n    "status": "failed",\n    "resource": "console",\n    "source": "okta",\n    "ip": "203.0.113.10",\n    "metadata": {"ua": "Mozilla"}\n  }\n]`}
          </pre>
        </section>
      </main>
    </div>
  )
}

export default App
