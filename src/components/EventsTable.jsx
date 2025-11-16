export default function EventsTable({ items }) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-2">Time</th>
            <th className="text-left p-2">User</th>
            <th className="text-left p-2">Action</th>
            <th className="text-left p-2">Status</th>
            <th className="text-left p-2">Resource</th>
            <th className="text-left p-2">Source</th>
            <th className="text-left p-2">IP</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? items.map((e) => (
            <tr key={e._id} className="border-t">
              <td className="p-2 whitespace-nowrap">{new Date(e.timestamp).toLocaleString()}</td>
              <td className="p-2">{e.user || '-'}</td>
              <td className="p-2">{e.action || '-'}</td>
              <td className="p-2">{e.status || '-'}</td>
              <td className="p-2">{e.resource || '-'}</td>
              <td className="p-2">{e.source || '-'}</td>
              <td className="p-2">{e.ip || '-'}</td>
            </tr>
          )) : (
            <tr><td className="p-4 text-center text-gray-500" colSpan={7}>No events found. Ingest from your log sources via the API.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
