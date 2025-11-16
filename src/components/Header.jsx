import { useMemo } from 'react'

export default function Header() {
  const title = useMemo(() => 'Insider Threat Detection', [])
  return (
    <header className="w-full py-6 border-b bg-white/70 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg" />
          <div>
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-sm text-gray-500">Ingest logs, analyze behavior, surface risky activity</p>
          </div>
        </div>
        <a href="/test" className="text-sm text-blue-600 hover:text-blue-700">Connection test</a>
      </div>
    </header>
  )
}
