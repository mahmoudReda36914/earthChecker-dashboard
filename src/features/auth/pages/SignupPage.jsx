import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useRegister } from '../apiHooks'

export default function SignupPage() {
  const navigate = useNavigate()
  const { mutate: register, isPending } = useRegister()

  const [form, setForm] = useState({ companyName: '', fullName: '', email: '', password: '' })
  const [agreed, setAgreed] = useState(false)
  const [serverError, setServerError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setServerError(null)
    setSuccessMsg(null)

    register(
      {
        name:     form.fullName,
        email:    form.email,
        password: form.password,
        company:  { name: form.companyName },
      },
      {
        onSuccess: (data) => {
          setSuccessMsg(data?.message || 'Account created! Please check your email to verify your account.')
        },
        onError: (err) => {
          setServerError(err?.response?.data?.message || 'Registration failed. Please try again.')
        },
      }
    )
  }

  const FIELDS = [
    { name: 'companyName', label: 'Company Name', type: 'text',     placeholder: 'Apex Textile Group' },
    { name: 'fullName',    label: 'Full Name',    type: 'text',     placeholder: 'Ahmad Karimi' },
    { name: 'email',       label: 'Work Email',   type: 'email',    placeholder: 'you@company.com' },
    { name: 'password',    label: 'Password',     type: 'password', placeholder: 'Min. 8 characters' },
  ]

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
          background:
            'radial-gradient(ellipse 65% 50% at 50% 45%, rgba(200,121,65,0.04) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 40% 35% at 80% 20%, rgba(0,212,255,0.04) 0%, transparent 55%)',
        }}
      />

      <div style={{ position: 'fixed', top: '24px', left: '24px', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M0 20V4a4 4 0 0 1 4-4h16" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5"/>
        </svg>
      </div>
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', pointerEvents: 'none', zIndex: 1 }}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M28 8V24a4 4 0 0 1-4 4H8" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5"/>
        </svg>
      </div>
      <div className="scan-line" style={{ zIndex: 1 }} />

      <div
        style={{
          position: 'relative', zIndex: 2,
          width: '100%', maxWidth: '440px',
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
            Start your free 14-day trial
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
            boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(0,212,255,0.03)',
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
              Create Account
            </h1>
            <p style={{ color: '#8fa3b8', fontSize: '0.82rem', marginTop: '5px' }}>
              Set up your inspection workspace
            </p>
          </div>

          {/* Success banner */}
          {successMsg && (
            <div style={{
              marginBottom: '16px', padding: '12px 14px',
              background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: '8px', fontSize: '0.82rem', color: '#a0cfdf', lineHeight: 1.5,
            }}>
              ✓ {successMsg}
              <div style={{ marginTop: '10px' }}>
                <Link to="/login" style={{ color: '#00d4ff', fontWeight: 600, textDecoration: 'none' }}>
                  Go to Login →
                </Link>
              </div>
            </div>
          )}

          {/* Error banner */}
          {serverError && (
            <div style={{
              marginBottom: '16px', padding: '10px 14px',
              background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)',
              borderRadius: '8px', fontSize: '0.8rem', color: '#ff8080',
            }}>
              {serverError}
            </div>
          )}

          {!successMsg && (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {FIELDS.map(({ name, label, type, placeholder }) => (
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

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', marginTop: '4px' }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  style={{ accentColor: '#00d4ff', width: '13px', height: '13px', marginTop: '2px', flexShrink: 0 }}
                />
                <span style={{ fontSize: '0.75rem', color: '#8fa3b8', lineHeight: 1.5 }}>
                  I agree to the{' '}
                  <span style={{ color: '#00d4ff', cursor: 'pointer' }}>Terms of Service</span>
                  {' '}and{' '}
                  <span style={{ color: '#00d4ff', cursor: 'pointer' }}>Privacy Policy</span>
                </span>
              </label>

              <button
                type="submit"
                className="btn-primary"
                disabled={isPending || !agreed}
                style={{ opacity: (isPending || !agreed) ? 0.55 : 1, marginTop: '4px' }}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Creating workspace…
                  </>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Create Account
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(143,163,184,0.1)' }} />
            <span style={{ fontSize: '0.7rem', color: '#3d4f63' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(143,163,184,0.1)' }} />
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#8fa3b8' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
              Sign in →
            </Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.68rem', color: '#3d4f63', letterSpacing: '0.03em' }}>
          No credit card required · Cancel anytime · GDPR compliant
        </p>
      </div>
    </div>
  )
}
