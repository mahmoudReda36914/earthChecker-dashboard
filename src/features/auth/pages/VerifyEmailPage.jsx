import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../../lib/axios'
import { AUTH_ENDPOINTS } from '../endpoints'

/* Possible states: idle | loading | success | already_verified | expired | error */
function useVerifyEmail(token) {
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setMessage('No token provided.'); return }

    api.get(AUTH_ENDPOINTS.VERIFY_EMAIL(token))
      .then(({ data }) => {
        if (data?.message?.includes('already')) {
          setState('already_verified')
        } else {
          setState('success')
        }
        setMessage(data?.message || '')
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || ''
        if (err?.response?.status === 400) {
          setState('expired')
        } else {
          setState('error')
        }
        setMessage(msg)
      })
  }, [token])

  return { state, message }
}

const CFG = {
  loading: {
    icon: (
      <svg className="animate-spin" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="rgba(0,212,255,0.7)" strokeWidth="1.5">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ),
    title: 'Verifying…',
    body:  'Please wait while we verify your email address.',
    accent: '0,212,255',
    action: null,
  },
  success: {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Email Verified!',
    body:  'Your account is now active. You can sign in.',
    accent: '0,212,255',
    action: { to: '/login', label: 'Sign In →' },
  },
  already_verified: {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 8 12 12 14 14"/>
      </svg>
    ),
    title: 'Already Verified',
    body:  'Your email is already confirmed. Go ahead and sign in.',
    accent: '0,212,255',
    action: { to: '/login', label: 'Sign In →' },
  },
  expired: {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c87941" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Link Expired',
    body:  'The verification link has expired or is invalid. Request a new one.',
    accent: '200,121,65',
    action: { to: '/signup', label: 'Back to Sign Up' },
  },
  error: {
    icon: (
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#c87941" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
    title: 'Verification Failed',
    body:  'Something went wrong. Please try again or contact support.',
    accent: '200,121,65',
    action: { to: '/login', label: 'Back to Login' },
  },
}

export default function VerifyEmailPage() {
  const { token } = useParams()
  const { state, message } = useVerifyEmail(token)
  const cfg = CFG[state] || CFG.error

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
          background: `radial-gradient(ellipse 70% 55% at 50% 45%, rgba(${cfg.accent},0.06) 0%, transparent 65%)`,
        }}
      />
      <div className="scan-line" style={{ zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '420px', animation: 'fadeInUp 0.4s ease both' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src="/logo.svg" alt="Feedbrush" style={{ height: '40px', filter: 'drop-shadow(0 0 10px rgba(0,212,255,0.4))' }} />
        </div>

        <div
          style={{
            background: 'rgba(8,12,20,0.85)',
            backdropFilter: 'blur(24px)',
            border: `1px solid rgba(${cfg.accent},0.15)`,
            borderRadius: '16px',
            boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(${cfg.accent},0.04)`,
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
            background: `linear-gradient(90deg, transparent, rgba(${cfg.accent},0.4), transparent)`,
          }} />

          {/* Icon */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: `rgba(${cfg.accent},0.06)`,
            border: `1px solid rgba(${cfg.accent},0.2)`,
            boxShadow: `0 0 24px rgba(${cfg.accent},0.12)`,
          }}>
            {cfg.icon}
          </div>

          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.15rem', fontWeight: 800, color: '#eef2f7', letterSpacing: '0.02em' }}>
            {cfg.title}
          </h1>

          <p style={{ fontSize: '0.85rem', color: '#8fa3b8', lineHeight: 1.6, maxWidth: '300px' }}>
            {message || cfg.body}
          </p>

          {cfg.action && (
            <Link
              to={cfg.action.to}
              style={{
                marginTop: '8px',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                padding: '11px 28px',
                borderRadius: '8px',
                background: `rgba(${cfg.accent},0.12)`,
                border: `1px solid rgba(${cfg.accent},0.35)`,
                color: state === 'expired' || state === 'error' ? '#c87941' : '#00d4ff',
                fontFamily: 'Orbitron, monospace',
                fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              {cfg.action.label}
            </Link>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.68rem', color: '#3d4f63' }}>
          End-to-end encrypted · AI Quality Platform
        </p>
      </div>
    </div>
  )
}
