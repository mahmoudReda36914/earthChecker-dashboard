import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

/**
 * Reusable Dropdown component — matches the project's glassmorphism design.
 *
 * Props
 *   value       — currently selected value (string)
 *   onChange    — (value: string) => void
 *   options     — Array<{ value: string, label: string, icon?: ReactNode }>
 *   placeholder — text shown when nothing is selected
 *   disabled    — disables the trigger button
 *   className   — extra classes applied to the root wrapper
 */
export default function Dropdown({
  value,
  onChange,
  options = [],
  placeholder = 'Select…',
  disabled = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const ref             = useRef(null)

  const selected = options.find((o) => o.value === value)

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center justify-between gap-2
          px-3 py-2.5 rounded-lg
          border border-[rgba(143,163,184,0.2)]
          bg-[rgba(255,255,255,0.03)]
          text-[0.82rem] text-left
          transition-all
          hover:border-[rgba(0,212,255,0.35)]
          focus:outline-none focus:border-[rgba(0,212,255,0.4)]
          disabled:opacity-50 disabled:cursor-not-allowed
          ${open ? 'border-[rgba(0,212,255,0.35)]' : ''}
        `}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
          {selected?.icon && (
            <span className="shrink-0 text-cyan flex items-center">{selected.icon}</span>
          )}
          <span className={`truncate ${selected ? 'text-text-primary' : 'text-[rgba(143,163,184,0.45)]'}`}>
            {selected ? selected.label : placeholder}
          </span>
        </span>

        <ChevronDown
          size={14}
          className={`shrink-0 text-steel transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ── Panel ── */}
      {open && (
        <div className="
          absolute left-0 right-0 top-full mt-1 z-[9999]
          rounded-xl overflow-hidden
          bg-[rgba(8,12,20,0.98)]
          border border-[rgba(0,212,255,0.18)]
          shadow-[0_16px_48px_rgba(0,0,0,0.65)]
          overflow-y-auto
        " style={{ maxHeight: 'calc(3 * 42px)' }}>
          {options.length === 0 ? (
            <div className="px-4 py-3 text-[0.8rem] text-text-muted">
              No options available
            </div>
          ) : (
            options.map((opt) => {
              const isSelected = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false) }}
                  className={`
                    w-full flex items-center gap-3
                    px-4 py-2.5 text-left text-[0.82rem]
                    transition-colors
                    ${isSelected
                      ? 'bg-[rgba(0,212,255,0.1)] text-cyan'
                      : 'text-steel hover:bg-white/[0.04] hover:text-text-primary'
                    }
                  `}
                >
                  {opt.icon && (
                    <span className={`shrink-0 flex items-center ${isSelected ? 'text-cyan' : 'text-steel'}`}>
                      {opt.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {isSelected && <Check size={13} className="shrink-0 text-cyan" />}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
