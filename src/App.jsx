import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Controls from './components/Controls'
import EventsTable from './components/EventsTable'
import AlertsList from './components/AlertsList'

function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [error, setError] = useState('')

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${baseUrl}/api/events?since_minutes=1440&limit=200`)
      const data = await res.json()
      setEvents(data.items || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const runDetections = async ({ windowMinutes, thresholdFailed, thresholdMB }) => {
    try {
      setError('')
      const url = `${baseUrl}/api/alerts/run?window_minutes=${windowMinutes}&threshold_failed_logins=${thresholdFailed}&threshold_large_downloads_mb=${thresholdMB}`
      const res = await fetch(url)
      const data = await res.json()
      setAlerts(data)
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
        <Controls onRunDetections={runDetections} onRefresh={fetchEvents} />

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
            <AlertsList alerts={alerts} />
          </div>
        </div>

        <section className="text-sm text-gray-500">
          <h3 className="font-semibold text-gray-700 mb-1">How to ingest</h3>
          <pre className="bg-white rounded p-3 overflow-x-auto">
            {`POST ${baseUrl}/api/events/ingest\nBody (JSON):\n[\n  {\n    "timestamp": "2025-01-01T12:00:00Z",\n    "user": "alice",\n    "action": "login",\n    "status": "failed",\n    "resource": "console",\n    "source": "okta",\n    "ip": "203.0.113.10",\n    "metadata": {"ua": "Mozilla"}\n  }\n]`}
          </pre>
        </section>
      </main>
    </div>
  )
}

export default App
