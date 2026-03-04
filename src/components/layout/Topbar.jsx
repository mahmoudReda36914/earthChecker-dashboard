import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, ChevronDown, User, Settings, KeyRound, LogOut, Loader2 } from 'lucide-react'
import { useMe, useLogout } from '../../features/auth/apiHooks'

const GRID_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Cpath d='M 32 0 L 0 0 0 32' fill='none' stroke='rgba(0,212,255,0.048)' stroke-width='0.5'/%3E%3C/svg%3E")`

function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('')
}

function RoleBadge({ role }) {
  if (!role) return null
  return (
    <span style={{ background: 'rgba(200,121,65,0.08)', border: '1px solid rgba(200,121,65,0.28)', color: '#c87941', padding: '1.5px 6px', borderRadius: '3px', fontFamily: 'Orbitron, monospace', fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
      {role}
    </span>
  )
}

export default function Topbar({ sidebarWidth }) {
  const [open, setOpen] = useState(false)
  const wrapRef  = useRef(null)
  const navigate = useNavigate()

  const { data: user, isLoading } = useMe()
  const { mutate: logout, isPending: loggingOut } = useLogout()

  const initials = getInitials(user?.name)
  const company  = typeof user?.company === 'object' ? user.company : null

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleLogout = () => {
    setOpen(false)
    logout(undefined, { onSettled: () => navigate('/login', { replace: true }) })
  }

  return (
    <header
      className="fixed top-0 right-0 h-16 z-[30] flex items-center px-6"
      style={{ left: sidebarWidth, backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', transition: 'left 300ms cubic-bezier(0.16,1,0.3,1)' }}
    >
      {/* Background layers */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(7,9,28,0.96) 0%, rgba(6,8,14,0.96) 100%)' }} />
      <div className="absolute inset-0" style={{ backgroundImage: GRID_BG, backgroundSize: '32px 32px' }} />
      <div className="absolute left-0 top-0 bottom-0 w-[340px] pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 100% at 20% 50%, rgba(0,212,255,0.055) 0%, transparent 70%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.32) 50%, transparent)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: 'linear-gradient(90deg, transparent 30%, rgba(0,212,255,0.55) 50%, transparent 70%)', animation: 'shimmer 5s linear infinite', backgroundSize: '200% 100%', boxShadow: '0 0 7px rgba(0,212,255,0.3)' }} />

      {/* Content */}
      <div className="relative z-10 w-full flex items-center gap-4">

        {/* Left: company */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-[3px] h-[28px] rounded-sm" style={{ background: 'linear-gradient(180deg, transparent, #00d4ff, transparent)', boxShadow: '0 0 8px rgba(0,212,255,0.6)' }} />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron text-[0.72rem] font-bold tracking-[0.12em] uppercase text-text-primary">
                {company?.name ?? 'EarthChecker'}
              </span>
              <span className="badge-copper text-[0.55rem] py-[2px] px-[8px]">Pro</span>
            </div>
            <p className="text-[0.68rem] text-text-muted mt-[2px]">Quality Inspection Platform</p>
          </div>
        </div>

        {/* Center: search */}
        <div className="flex-1 max-w-[300px] mx-auto hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" size={13} stroke="#3d4f63" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search modules, cycles, agents…"
              className="w-full pl-9 pr-4 py-[9px] text-[0.8rem] text-text-primary placeholder-text-muted rounded-lg outline-none transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(143,163,184,0.11)' }}
              onFocus={e => { e.target.style.border = '1px solid rgba(0,212,255,0.28)'; e.target.style.background = 'rgba(0,212,255,0.04)' }}
              onBlur={e  => { e.target.style.border = '1px solid rgba(143,163,184,0.11)'; e.target.style.background = 'rgba(255,255,255,0.04)' }}
            />
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">

          {/* Bell */}
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#526070] hover:text-cyan transition-all" style={{ border: '1px solid rgba(143,163,184,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            <Bell size={15} strokeWidth={1.8} />
            <span className="absolute top-[8px] right-[8px] w-[7px] h-[7px] rounded-full" style={{ background: '#00d4ff', boxShadow: '0 0 6px rgba(0,212,255,0.9)', border: '1.5px solid rgba(6,8,14,0.9)' }} />
          </button>

          <div className="w-px h-6" style={{ background: 'rgba(143,163,184,0.1)' }} />

          {/* User button + dropdown */}
          <div className="relative" ref={wrapRef}>

            {/* Trigger button */}
            <button
              type="button"
              onClick={() => setOpen(v => !v)}
              className="flex items-center gap-2.5 pl-2 pr-3 py-[7px] rounded-lg transition-all duration-200 hover:bg-[rgba(0,212,255,0.05)]"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(143,163,184,0.11)' }}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full flex items-center justify-center font-orbitron text-[0.6rem] font-black shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(0,100,180,0.35))', border: '1.5px solid rgba(0,212,255,0.35)', color: '#00d4ff' }}>
                {isLoading ? <Loader2 size={11} className="animate-spin" /> : (initials || '?')}
              </div>

              {/* Name + role */}
              <div className="hidden sm:flex flex-col items-start gap-[3px]">
                <span className="text-[0.78rem] font-semibold text-text-primary leading-none">
                  {isLoading ? '…' : (user?.name?.split(' ')[0] ?? 'User')}
                </span>
                <RoleBadge role={user?.role} />
              </div>

              <ChevronDown size={10} strokeWidth={2.5} stroke="#8fa3b8" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute right-0 top-[calc(100%+8px)] w-[230px] rounded-xl z-[9999] overflow-hidden"
                style={{
                  background: 'linear-gradient(160deg, rgba(7,9,28,0.98) 0%, rgba(6,8,14,0.98) 100%)',
                  border: '1px solid rgba(0,212,255,0.15)',
                  boxShadow: '0 24px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,212,255,0.04)',
                  backdropFilter: 'blur(24px)',
                }}
              >
                {/* Top glow line */}
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />

                {/* User info header */}
                <div className="px-4 py-3.5 flex items-center gap-3" style={{ background: 'rgba(0,212,255,0.03)', borderBottom: '1px solid rgba(0,212,255,0.07)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-orbitron text-[0.65rem] font-black shrink-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.18), rgba(0,100,180,0.3))', border: '1.5px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                    {initials || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.84rem] font-semibold text-text-primary truncate">{user?.name ?? '—'}</p>
                    <div className="mt-[3px]"><RoleBadge role={user?.role} /></div>
                    <p className="text-[0.65rem] text-steel truncate mt-[3px]">{user?.email ?? ''}</p>
                  </div>
                </div>

                {/* Nav items */}
                <div className="py-1">
                  {[
                    { label: 'Profile',  Icon: User,     to: '/dashboard/settings' },
                    { label: 'Settings', Icon: Settings, to: '/dashboard/settings' },
                    { label: 'API Keys', Icon: KeyRound, to: '/dashboard/settings' },
                  ].map(({ label, Icon, to }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => { navigate(to); setOpen(false) }}
                      className="w-full flex items-center gap-3 px-4 py-[10px] text-[0.82rem] text-steel text-left hover:bg-[rgba(0,212,255,0.05)] hover:text-text-primary transition-colors"
                    >
                      <Icon size={13} strokeWidth={1.8} className="shrink-0 text-text-muted" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Divider */}
                <div className="h-px mx-4" style={{ background: 'rgba(143,163,184,0.08)' }} />

                {/* Sign out */}
                <div className="py-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-[10px] text-[0.82rem] text-copper text-left hover:bg-[rgba(200,121,65,0.07)] transition-colors disabled:opacity-50"
                  >
                    {loggingOut
                      ? <Loader2 size={13} strokeWidth={1.8} className="animate-spin shrink-0" />
                      : <LogOut  size={13} strokeWidth={1.8} className="shrink-0" />
                    }
                    {loggingOut ? 'Signing out…' : 'Sign Out'}
                  </button>
                </div>

                {/* Bottom glow */}
                <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.12), transparent)' }} />
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  )
}
