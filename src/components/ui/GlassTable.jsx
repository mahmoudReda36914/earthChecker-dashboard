export default function GlassTable({ columns, rows, emptyMessage = 'No data available' }) {
  return (
    <div className="rounded-xl overflow-hidden bg-bg-glass backdrop-blur-lg border border-cyan-muted shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-b-cyan-muted">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 font-orbitron text-[0.6rem] font-bold tracking-[0.14em] uppercase text-text-muted whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-text-muted text-[0.85rem]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, ri) => (
                <tr
                  key={ri}
                  className="transition-colors hover:bg-white/[0.02] border-b border-b-[rgba(143,163,184,0.05)]"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-5 py-4 text-[0.82rem] text-steel align-middle"
                    >
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
