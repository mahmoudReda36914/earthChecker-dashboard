const STATUS_MAP = {
  accepted:   { label: 'Accepted',   cls: 'badge-success',  dotCls: 'bg-cyan shadow-[0_0_5px_#00d4ff]', pulse: false },
  rejected:   { label: 'Rejected',   cls: 'badge-warning',  dotCls: 'bg-copper shadow-[0_0_5px_#c87941]', pulse: false },
  pending:    { label: 'Pending',    cls: 'badge-steel',    dotCls: 'bg-steel shadow-[0_0_4px_#8fa3b8]', pulse: false },
  processing: { label: 'Processing', cls: 'badge-cyan',     dotCls: 'bg-cyan shadow-[0_0_5px_#00d4ff]', pulse: true },
  complete:   { label: 'Complete',   cls: 'badge-success',  dotCls: 'bg-cyan shadow-[0_0_5px_#00d4ff]', pulse: false },
  draft:      { label: 'Draft',      cls: 'badge-muted',    dotCls: 'bg-text-muted shadow-[0_0_4px_#3d4f63]', pulse: false },
  active:     { label: 'Active',     cls: 'badge-cyan',     dotCls: 'bg-cyan shadow-[0_0_5px_#00d4ff]', pulse: true },
  inactive:   { label: 'Inactive',   cls: 'badge-muted',    dotCls: 'bg-text-muted shadow-[0_0_4px_#3d4f63]', pulse: false },
}

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status?.toLowerCase()] || STATUS_MAP.pending
  return (
    <span className={s.cls}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dotCls} ${s.pulse ? 'animate-processing' : ''}`} />
      {s.label}
    </span>
  )
}
