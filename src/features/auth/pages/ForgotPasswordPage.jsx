import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForgotPassword } from '../apiHooks'

export default function ForgotPasswordPage() {
  const { mutate: forgot, isPending } = useForgotPassword()
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    forgot({ email }, {
      // API always returns 200 — show success state regardless
      onSuccess: () => setSubmitted(true),
      onError:   () => setSubmitted(true), // also show success (anti-enumeration)
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

          {submitted ? (
            /* ── Success state ── */
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', textAlign: 'center' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 800, color: '#eef2f7' }}>
                Check Your Email
              </h1>
              <p style={{ fontSize: '0.83rem', color: '#8fa3b8', lineHeight: 1.6, maxWidth: '300px' }}>
                If <span style={{ color: '#00d4ff' }}>{email}</span> is registered, a password reset link has been sent. It expires in <strong>15 minutes</strong>.
              </p>
              <p style={{ fontSize: '0.75rem', color: '#3d4f63', marginTop: '4px' }}>
                Didn't receive it?{' '}
                <button
                  onClick={() => setSubmitted(false)}
                  style={{ color: '#00d4ff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1rem', fontWeight: 800, color: '#eef2f7', letterSpacing: '0.04em' }}>
                  Forgot Password
                </h1>
                <p style={{ color: '#8fa3b8', fontSize: '0.82rem', marginTop: '5px' }}>
                  Enter your email and we'll send a reset link.
                </p>
              </div>

              <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <label style={{
                    display: 'block', marginBottom: '6px',
                    fontSize: '0.72rem', fontWeight: 600,
                    color: '#8fa3b8', letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="input-glass"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isPending}
                  style={{ opacity: isPending ? 0.7 : 1 }}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Sending…
                    </>
                  ) : (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                      Send Reset Link
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(143,163,184,0.1)' }} />
            <span style={{ fontSize: '0.7rem', color: '#3d4f63' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(143,163,184,0.1)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#8fa3b8', marginTop: '16px' }}>
            Remember it?{' '}
            <Link to="/login" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
              Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
