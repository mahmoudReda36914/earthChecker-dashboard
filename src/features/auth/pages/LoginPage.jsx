import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLogin } from '../apiHooks'

export default function LoginPage() {
  const navigate = useNavigate()
  const { mutate: login, isPending, error } = useLogin()

  const [form, setForm] = useState({ email: '', password: '' })
  const [serverMsg, setServerMsg] = useState(null)
  const [serverError, setServerError] = useState(null)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setServerMsg(null)
    setServerError(null)
    login(form, {
      onSuccess: () => navigate('/dashboard/overview', { replace: true }),
      onError: (err) => {
        const msg = err?.response?.data?.message || 'Login failed. Please try again.'
        const code = err?.response?.data?.code
        if (code === 'EMAIL_NOT_VERIFIED') {
          setServerMsg('Your email is not verified yet. Check your inbox or resend the link.')
        } else {
          setServerError(msg)
        }
      },
    })
  }

  return (
    <div
      className="grid-overlay"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,212,255,0.06) 0%, transparent 65%)',
        }}
      />

      <div style={{ position: 'fixed', top: '24px', left: '24px', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M0 20V4a4 4 0 0 1 4-4h16" stroke="rgba(0,212,255,0.35)" strokeWidth="1.5"/>
        </svg>
      </div>
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M28 8V24a4 4 0 0 1-4 4H8" stroke="rgba(0,212,255,0.35)" strokeWidth="1.5"/>
        </svg>
      </div>

      <div className="scan-line" style={{ zIndex: 1 }} />

      <div
        style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: '420px',
          animation: 'fadeInUp 0.5s ease both',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '8px' }}>
            <img
              src="/logo.svg"
              alt="Feedbrush"
              style={{ height: '44px', width: 'auto', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.4))' }}
            />
          </div>
          <p style={{ fontSize: '0.78rem', color: '#8fa3b8', letterSpacing: '0.04em' }}>
            AI Quality Inspection Platform
          </p>
        </div>

        {/* Glass card */}
        <div
          style={{
            background: 'rgba(8,12,20,0.82)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '16px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(0,212,255,0.04)',
            padding: '36px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)',
          }} />

          <div style={{ marginBottom: '24px' }}>
            <h1
              style={{
                fontFamily: 'Orbitron, monospace',
                fontSize: '1.05rem', fontWeight: 800,
                color: '#eef2f7', letterSpacing: '0.04em',
              }}
            >
              Sign In
            </h1>
            <p style={{ color: '#8fa3b8', fontSize: '0.82rem', marginTop: '5px' }}>
              Access your inspection dashboard
            </p>
          </div>

          {/* Error / info banners */}
          {serverError && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px',
              background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)',
              borderRadius: '8px', fontSize: '0.8rem', color: '#ff8080',
            }}>
              {serverError}
            </div>
          )}
          {serverMsg && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px',
              background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '8px', fontSize: '0.8rem', color: '#8fa3b8',
            }}>
              {serverMsg}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {[
              { name: 'email',    label: 'Email Address', type: 'email',    placeholder: 'you@company.com' },
              { name: 'password', label: 'Password',      type: 'password', placeholder: '••••••••' },
            ].map(({ name, label, type, placeholder }) => (
              <div key={name}>
                <label
                  style={{
                    display: 'block', marginBottom: '6px',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: '#8fa3b8', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}
                >
                  {label}
                </label>
                <input
                  type={type} name={name}
                  value={form[name]} onChange={handle}
                  placeholder={placeholder}
                  className="input-glass"
                  required
                />
              </div>
            ))}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.78rem', color: '#00d4ff', textDecoration: 'none' }}
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isPending}
              style={{ opacity: isPending ? 0.7 : 1, marginTop: '4px' }}
            >
              {isPending ? (
                <>
                  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Authenticating…
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  Sign In
                </>
              )}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(143,163,184,0.1)' }} />
            <span style={{ fontSize: '0.7rem', color: '#3d4f63' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(143,163,184,0.1)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#8fa3b8' }}>
            New to Feedbrush?{' '}
            <Link to="/signup" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
              Create account →
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.68rem', color: '#3d4f63', letterSpacing: '0.03em' }}>
          End-to-end encrypted · ISO 27001 compliant
        </p>
      </div>
    </div>
  )
}
