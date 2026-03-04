export default function KPICard({
  label,
  value,
  delta,
  deltaDir = 'up',
  icon,
  accentColor = 'cyan',
  sublabel,
  image,
}) {
  const isUp   = deltaDir === 'up'
  const isCyan = accentColor !== 'copper'
  const rgb    = isCyan ? '0,212,255' : '200,121,65'
  const hex    = isCyan ? '#00d4ff'   : '#c87941'

  return (
    <div
      className="relative rounded-xl overflow-hidden min-h-[168px] flex flex-col transition-all duration-300 hover:-translate-y-1 group cursor-default"
      style={{
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >

      {/* ── Background image ── */}
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.14] group-hover:opacity-[0.20] transition-opacity duration-500 select-none pointer-events-none"
        />
      )}

      {/* ── Gradient overlay (darkens edges, lets accent bleed bottom-right) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg,
            rgba(6,8,16,0.97) 0%,
            rgba(6,8,16,0.86) 55%,
            rgba(${rgb},0.09) 100%)`
        }}
      />

      {/* ── Glass border + glow + inner shadow ── */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border:     `1px solid rgba(${rgb},0.20)`,
          boxShadow:  `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 0 24px rgba(${rgb},0.03), 0 0 28px rgba(${rgb},0.05)`,
        }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 p-5 flex flex-col gap-3 h-full">

        {/* Top row: icon + delta badge */}
        <div className="flex items-start justify-between">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: `rgba(${rgb},0.10)`,
              border:     `1px solid rgba(${rgb},0.18)`,
              color:      hex,
              boxShadow:  `0 0 10px rgba(${rgb},0.12)`,
            }}
          >
            {icon}
          </div>

          {delta !== undefined && (
            <span
              className="text-[0.67rem] font-bold px-2.5 py-[3px] rounded-full tracking-[0.04em]"
              style={{
                background:  isUp ? 'rgba(0,212,255,0.07)' : 'rgba(200,121,65,0.08)',
                border:      isUp ? '1px solid rgba(0,212,255,0.20)' : '1px solid rgba(200,121,65,0.22)',
                color:       isUp ? '#00d4ff' : '#c87941',
              }}
            >
              {isUp ? '↑' : '↓'} {delta}
            </span>
          )}
        </div>

        {/* Value + labels (push to bottom) */}
        <div className="mt-auto">
          <p
            className="font-orbitron text-[1.85rem] font-extrabold text-text-primary leading-[1.1] tracking-[-0.02em]"
            style={{ textShadow: `0 0 20px rgba(${rgb},0.28)` }}
          >
            {value}
          </p>
          <p className="text-[0.8rem] text-steel mt-1.5 font-medium leading-tight">{label}</p>
          {sublabel && (
            <p className="text-[0.67rem] text-text-muted mt-0.5">{sublabel}</p>
          )}
        </div>

        {/* Bottom accent bar */}
        <div
          className="h-[2px] rounded-full w-full mt-1"
          style={{ background: `linear-gradient(90deg, rgba(${rgb},0.6) 0%, rgba(${rgb},0.12) 60%, transparent 100%)` }}
        />
      </div>
    </div>
  )
}
