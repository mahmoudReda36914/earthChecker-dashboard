import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useResetPassword } from '../apiHooks'

export default function ResetPasswordPage() {
  const { token } = useParams()
  const { mutate: resetPassword, isPending } = useResetPassword()

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [success, setSuccess]     = useState(false)
  const [error, setError]         = useState(null)

  const mismatch   = confirm.length > 0 && password !== confirm
  const tooShort   = password.length > 0 && password.length < 8
  const canSubmit  = password.length >= 8 && password === confirm && !isPending

  const submit = (e) => {
    e.preventDefault()
    setError(null)
    resetPassword(
      { token, password },
      {
        onSuccess: () => setSuccess(true),
        onError: (err) => {
          const msg = err?.response?.data?.message || 'Reset failed. The link may have expired.'
          setError(msg)
        },
      }
    )
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
      <div aria-hidden="true" style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse 70% 55% at 50% 45%, rgba(0,212,255,0.05) 0%, transparent 65%)',
      }} />
      <div className="scan-line" style={{ zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.4s ease both' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo.svg" alt="Feedbrush" style={{ height: '40px', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.4))' }} />
          <p style={{ fontSize: '0.78rem', color: '#8fa3b8', letterSpacing: '0.04em', marginTop: '6px' }}>
            AI Quality Inspection Platform
          </p>
        </div>

        <div style={{
          background: 'rgba(8,12,20,0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(0,212,255,0.1)',
          borderRadius: '16px',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          padding: '36px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)',
          }} />

          {success ? (
            /* ── Success state ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 800, color: '#eef2f7' }}>
                Password Reset!
              </h1>
              <p style={{ fontSize: '0.83rem', color: '#8fa3b8', lineHeight: 1.6, maxWidth: '300px' }}>
                Your password has been updated. All active sessions have been signed out for security.
              </p>
              <Link
                to="/login"
                style={{
                  marginTop: '8px',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  padding: '11px 28px', borderRadius: '8px',
                  background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.35)',
                  color: '#00d4ff', fontSize: '0.7rem', fontFamily: 'Orbitron, monospace',
                  fontWeight: 700, letterSpacing: '0.08em', textDecoration: 'none',
                }}
              >
                Sign In →
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 800, color: '#eef2f7', letterSpacing: '0.04em' }}>
                  Set New Password
                </h1>
                <p style={{ color: '#8fa3b8', fontSize: '0.82rem', marginTop: '5px' }}>
                  Must be at least 8 characters. All sessions will be signed out.
                </p>
              </div>

              {/* Error banner */}
              {error && (
                <div style={{
                  marginBottom: '16px', padding: '10px 14px',
                  background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)',
                  borderRadius: '8px', fontSize: '0.8rem', color: '#ff8080',
                }}>
                  {error}
                  {' '}
                  <Link to="/forgot-password" style={{ color: '#00d4ff', fontWeight: 600 }}>
                    Request a new link
                  </Link>
                </div>
              )}

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* New password */}
                <div>
                  <label style={{
                    display: 'block', marginBottom: '6px',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: '#8fa3b8', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="input-glass"
                    required
                  />
                  {tooShort && (
                    <p style={{ marginTop: '5px', fontSize: '0.72rem', color: '#c87941' }}>
                      Password must be at least 8 characters.
                    </p>
                  )}
                </div>

                {/* Confirm */}
                <div>
                  <label style={{
                    display: 'block', marginBottom: '6px',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: '#8fa3b8', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat new password"
                    className="input-glass"
                    style={{
                      borderColor: mismatch ? 'rgba(200,121,65,0.5)' : undefined,
                    }}
                    required
                  />
                  {mismatch && (
                    <p style={{ marginTop: '5px', fontSize: '0.72rem', color: '#c87941' }}>
                      Passwords do not match.
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={!canSubmit}
                  style={{ opacity: canSubmit ? 1 : 0.5, marginTop: '4px' }}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Resetting…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.68rem', color: '#3d4f63' }}>
          End-to-end encrypted · Secure password reset
        </p>
      </div>
    </div>
  )
}
