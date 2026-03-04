export default function PageHeader({ title, subtitle, actions, badge }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        {badge && (
          <span className="badge-cyan mb-2 inline-flex">{badge}</span>
        )}
        <h1
          className="font-orbitron font-extrabold text-text-primary tracking-[-0.01em] leading-[1.2]"
          style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-[0.88rem] text-steel mt-1.5">
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  )
}
