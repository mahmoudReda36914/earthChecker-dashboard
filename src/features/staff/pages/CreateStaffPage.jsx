import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Loader2, ArrowLeft, UserPlus, Save,
  Eye, EyeOff, User, Mail, Lock, ShieldCheck,
  UserCheck, UserX, Camera, X,
} from 'lucide-react'
import PageHeader from '../../../components/ui/PageHeader'
import { useMe }  from '../../auth/apiHooks'
import { useStaffMember, useCreateStaff, useUpdateStaff } from '../apiHooks'
import { uploadStaffImageService } from '../services'

/* ── Constants ────────────────────────────────────────────── */
const ROLE_RANK = { ceo: 3, supervisor: 2, worker: 1 }

const ROLES = [
  {
    value: 'ceo',
    label: 'CEO',
    description: 'Full company access',
    rank: 3,
    accent: 'rgba(0,212,255,1)',
    border: 'rgba(0,212,255,0.35)',
    bg: 'rgba(0,212,255,0.06)',
    bgActive: 'rgba(0,212,255,0.12)',
    text: '#00d4ff',
  },
  {
    value: 'supervisor',
    label: 'Supervisor',
    description: 'Manage teams & workers',
    rank: 2,
    accent: 'rgba(200,121,65,1)',
    border: 'rgba(200,121,65,0.35)',
    bg: 'rgba(200,121,65,0.06)',
    bgActive: 'rgba(200,121,65,0.12)',
    text: '#c87941',
  },
  {
    value: 'worker',
    label: 'Worker',
    description: 'Standard member access',
    rank: 1,
    accent: 'rgba(143,163,184,1)',
    border: 'rgba(143,163,184,0.25)',
    bg: 'rgba(143,163,184,0.04)',
    bgActive: 'rgba(143,163,184,0.1)',
    text: '#8fa3b8',
  },
]

/* ── Toggle ───────────────────────────────────────────────── */
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-[22px] rounded-full cursor-pointer transition-all duration-200 border shrink-0 ${
        checked
          ? 'bg-[rgba(0,212,255,0.25)] border-[rgba(0,212,255,0.5)]'
          : 'bg-[rgba(143,163,184,0.12)] border-[rgba(143,163,184,0.2)]'
      }`}
    >
      <div className={`absolute top-[3px] w-4 h-4 rounded-full transition-all duration-200 ${
        checked
          ? 'left-[calc(100%-19px)] bg-cyan shadow-[0_0_6px_rgba(0,212,255,0.7)]'
          : 'left-[3px] bg-steel'
      }`} />
    </div>
  )
}

/* ── Avatar preview (image or initials) ─────────────────── */
function AvatarPreview({ name, role, image, uploading, onPickFile, onRemove }) {
  const fileRef  = useRef(null)
  const parts    = (name || '').trim().split(' ').filter(Boolean)
  const initials = ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || '?'
  const roleData = ROLES.find((r) => r.value === role) ?? ROLES[2]

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar with click-to-change */}
      <div className="relative group">
        {/* Glow ring */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
          style={{ boxShadow: `0 0 0 2px ${roleData.border}, 0 0 20px ${roleData.bg}` }}
        >
          {image ? (
            <img
              src={image}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-2"
              style={{ borderColor: roleData.border }}
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center font-orbitron text-[1.6rem] font-black transition-colors duration-200"
              style={{ background: roleData.bgActive, color: roleData.text }}
            >
              {uploading ? <Loader2 size={24} className="animate-spin" style={{ color: roleData.text }} /> : initials}
            </div>
          )}

          {/* Role accent dot */}
          <div
            className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[#07091a] z-10"
            style={{ background: roleData.accent }}
          />
        </div>

        {/* Camera overlay (hover) */}
        {!uploading && (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 rounded-full flex flex-col items-center justify-center gap-0.5
              bg-[rgba(6,8,16,0.65)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          >
            <Camera size={16} className="text-cyan" />
            <span className="font-orbitron text-[0.5rem] font-bold tracking-[0.1em] uppercase text-cyan">
              {image ? 'Change' : 'Upload'}
            </span>
          </button>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => { if (e.target.files?.[0]) onPickFile(e.target.files[0]) }}
        />
      </div>

      {/* Remove image link */}
      {image && !uploading && (
        <button
          type="button"
          onClick={onRemove}
          className="flex items-center gap-1 text-[0.68rem] text-text-muted hover:text-copper transition-colors"
        >
          <X size={10} /> Remove photo
        </button>
      )}

      {/* Name + role badge */}
      <div className="text-center">
        <p className="font-orbitron text-[0.88rem] font-bold text-text-primary leading-tight">
          {name.trim() || 'Full Name'}
        </p>
        <span
          className="inline-flex mt-1.5 items-center px-3 py-0.5 rounded-full text-[0.67rem] font-bold border"
          style={{ color: roleData.text, borderColor: roleData.border, background: roleData.bg }}
        >
          {roleData.label}
        </span>
      </div>
    </div>
  )
}

/* ── Field wrapper ───────────────────────────────────────── */
function Field({ label, required, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-[0.72rem] font-bold text-text-muted uppercase tracking-[0.08em]">
        {label}
        {required && <span className="text-copper">*</span>}
      </label>
      {children}
      {hint && <p className="text-[0.7rem] text-text-muted leading-[1.5]">{hint}</p>}
    </div>
  )
}

/* ── Input with left icon ────────────────────────────────── */
function InputWithIcon({ icon: Icon, readOnly, className = '', ...props }) {
  return (
    <div className="relative">
      <Icon size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
      <input
        {...props}
        readOnly={readOnly}
        className={`input-glass w-full pl-9 ${readOnly ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════ */
export default function CreateStaffPage() {
  const { staffId } = useParams()
  const navigate    = useNavigate()
  const isEditMode  = !!staffId

  const { data: me }     = useMe()
  const myRank           = ROLE_RANK[me?.role] ?? 0
  const allowedRoles     = ROLES.filter((r) => r.rank <= myRank)

  const { data: existing, isLoading: loadingExisting } = useStaffMember(staffId)
  const { mutateAsync: createStaff, isPending: creating } = useCreateStaff()
  const { mutateAsync: updateStaff, isPending: updating } = useUpdateStaff()

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    role:     allowedRoles[allowedRoles.length - 1]?.value ?? 'worker',
    isActive: true,
    image:    '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error,        setError]        = useState('')
  const [uploading,    setUploading]    = useState(false)

  useEffect(() => {
    if (existing) {
      setForm((f) => ({
        ...f,
        name:     existing.name     ?? '',
        email:    existing.email    ?? '',
        role:     existing.role     ?? f.role,
        isActive: existing.isActive ?? true,
        image:    existing.image    ?? '',
      }))
    }
  }, [existing])

  const set = (key) => (val) => { setForm((f) => ({ ...f, [key]: val })); setError('') }
  const setEv = (key) => (e) => set(key)(e.target.value)

  /* Image upload */
  const handlePickFile = async (file) => {
    setUploading(true)
    setError('')
    try {
      const res = await uploadStaffImageService(file)
      set('image')(res.data.url)
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name.trim())  { setError('Full name is required.');    return }
    if (!form.email.trim()) { setError('Email address is required.'); return }
    if (!isEditMode && !form.password)           { setError('Password is required.');                    return }
    if (!isEditMode && form.password.length < 8) { setError('Password must be at least 8 characters.'); return }

    try {
      if (isEditMode) {
        await updateStaff({ id: staffId, name: form.name, role: form.role, isActive: form.isActive, image: form.image })
      } else {
        await createStaff({ name: form.name, email: form.email, password: form.password, role: form.role, image: form.image })
      }
      navigate('/dashboard/staff')
    } catch (err) {
      setError(err?.response?.data?.message ?? 'Something went wrong. Please try again.')
    }
  }

  const isPending = creating || updating

  if (isEditMode && loadingExisting) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-cyan" />
    </div>
  )

  return (
    <div>
      <PageHeader
        title={isEditMode ? 'Edit Staff Member' : 'Add Staff Member'}
        subtitle={isEditMode ? 'Update name, role, photo, or account status' : 'Create a new team member account'}
        badge="Staff"
        actions={
          <button className="btn-ghost text-[0.72rem] py-[9px] px-[18px]" onClick={() => navigate('/dashboard/staff')}>
            <ArrowLeft size={13} /> Back
          </button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Preview card ──────────────────────── */}
          <div className="hidden lg:flex w-[260px] shrink-0 flex-col gap-4">

            <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(0,212,255,0.08)] overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-cyan via-[rgba(0,180,255,0.5)] to-transparent" />
              <div className="p-6 flex flex-col items-center gap-5">
                <p className="font-orbitron text-[0.58rem] font-bold tracking-[0.18em] uppercase text-text-muted self-start">
                  Preview
                </p>

                <AvatarPreview
                  name={form.name}
                  role={form.role}
                  image={form.image}
                  uploading={uploading}
                  onPickFile={handlePickFile}
                  onRemove={() => set('image')('')}
                />

                <div className="w-full space-y-2 pt-2 border-t border-[rgba(143,163,184,0.07)]">
                  <div className="flex items-center gap-2">
                    <Mail size={11} className="text-text-muted shrink-0" />
                    <span className="text-[0.72rem] text-steel truncate">
                      {form.email || 'email@company.com'}
                    </span>
                  </div>
                  {isEditMode && (
                    <div className="flex items-center gap-2">
                      {form.isActive
                        ? <UserCheck size={11} className="text-emerald-400 shrink-0" />
                        : <UserX     size={11} className="text-copper shrink-0"      />
                      }
                      <span className={`text-[0.72rem] ${form.isActive ? 'text-emerald-400' : 'text-copper'}`}>
                        {form.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Upload hint */}
            <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(143,163,184,0.07)] p-4 space-y-1.5">
              <p className="font-orbitron text-[0.58rem] font-bold tracking-[0.14em] uppercase text-text-muted">
                Profile Photo
              </p>
              <p className="text-[0.7rem] text-text-muted leading-[1.6]">
                Hover over the avatar and click to upload.<br />
                JPG, PNG or WebP · max 5 MB.
              </p>
            </div>

            {/* Role hierarchy card */}
            <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(143,163,184,0.07)] p-4 space-y-2">
              <p className="font-orbitron text-[0.58rem] font-bold tracking-[0.14em] uppercase text-text-muted">
                Role Hierarchy
              </p>
              {ROLES.map((r) => {
                const allowed = r.rank <= myRank
                return (
                  <div key={r.value} className={`flex items-center gap-2.5 ${allowed ? '' : 'opacity-30'}`}>
                    <div className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: allowed ? r.accent : '#3d4f63' }} />
                    <span className="text-[0.72rem]" style={{ color: allowed ? r.text : '#3d4f63' }}>{r.label}</span>
                    {!allowed && <span className="ml-auto text-[0.62rem] text-text-muted">locked</span>}
                  </div>
                )
              })}
            </div>
          </div>

          {/* ── RIGHT: Form sections ──────────────────── */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">

            {/* Mobile-only image picker (above form) */}
            <div className="flex lg:hidden justify-center">
              <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(0,212,255,0.08)] overflow-hidden p-5">
                <AvatarPreview
                  name={form.name}
                  role={form.role}
                  image={form.image}
                  uploading={uploading}
                  onPickFile={handlePickFile}
                  onRemove={() => set('image')('')}
                />
              </div>
            </div>

            {/* Section: Account Info */}
            <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(0,212,255,0.08)] overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-cyan via-[rgba(0,180,255,0.5)] to-transparent" />
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.14)] flex items-center justify-center">
                    <User size={13} className="text-cyan" />
                  </div>
                  <span className="font-orbitron text-[0.72rem] font-bold text-text-primary tracking-[0.06em]">
                    Account Information
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name" required>
                    <InputWithIcon icon={User} type="text" value={form.name} onChange={setEv('name')} placeholder="e.g. Sarah K." autoComplete="off" />
                  </Field>

                  <Field label="Email Address" required hint={isEditMode ? 'Email cannot be changed after creation.' : undefined}>
                    <InputWithIcon icon={Mail} type="email" value={form.email} onChange={setEv('email')} placeholder="sarah@company.com" readOnly={isEditMode} autoComplete="off" />
                  </Field>

                  {!isEditMode && (
                    <Field label="Password" required>
                      <div className="relative">
                        <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={setEv('password')}
                          placeholder="Min. 8 characters"
                          autoComplete="new-password"
                          className="input-glass w-full pl-9 pr-10"
                        />
                        <button type="button" onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                          {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </Field>
                  )}
                </div>
              </div>
            </div>

            {/* Section: Role & Access */}
            <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(0,212,255,0.08)] overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-cyan via-[rgba(0,180,255,0.5)] to-transparent" />
              <div className="p-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.14)] flex items-center justify-center">
                    <ShieldCheck size={13} className="text-cyan" />
                  </div>
                  <span className="font-orbitron text-[0.72rem] font-bold text-text-primary tracking-[0.06em]">
                    Role &amp; Access
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {allowedRoles.map((role) => {
                    const isSelected = form.role === role.value
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => set('role')(role.value)}
                        className="relative text-left rounded-xl p-4 border transition-all duration-200"
                        style={{
                          background:  isSelected ? role.bgActive : role.bg,
                          borderColor: isSelected ? role.border   : 'rgba(143,163,184,0.1)',
                          boxShadow:   isSelected ? `0 0 0 1px ${role.border}, 0 4px 20px ${role.bg}` : 'none',
                        }}
                      >
                        {isSelected && (
                          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full"
                            style={{ background: role.accent, boxShadow: `0 0 6px ${role.accent}` }} />
                        )}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                          style={{ background: isSelected ? role.bgActive : 'rgba(143,163,184,0.06)', border: `1px solid ${isSelected ? role.border : 'rgba(143,163,184,0.1)'}` }}>
                          <ShieldCheck size={14} style={{ color: isSelected ? role.text : '#526070' }} />
                        </div>
                        <p className="font-orbitron text-[0.75rem] font-bold leading-none mb-1"
                          style={{ color: isSelected ? role.text : '#8fa3b8' }}>
                          {role.label}
                        </p>
                        <p className="text-[0.68rem] text-text-muted leading-[1.4]">{role.description}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Section: Status (edit only) */}
            {isEditMode && (
              <div className="rounded-xl bg-bg-glass backdrop-blur-xl border border-[rgba(0,212,255,0.08)] overflow-hidden">
                <div className="h-[3px] bg-gradient-to-r from-cyan via-[rgba(0,180,255,0.5)] to-transparent" />
                <div className="p-5">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-7 h-7 rounded-lg bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.14)] flex items-center justify-center">
                      <UserCheck size={13} className="text-cyan" />
                    </div>
                    <span className="font-orbitron text-[0.72rem] font-bold text-text-primary tracking-[0.06em]">
                      Account Status
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200"
                    style={{
                      background:  form.isActive ? 'rgba(0,200,100,0.05)'  : 'rgba(200,121,65,0.05)',
                      borderColor: form.isActive ? 'rgba(0,200,100,0.18)'  : 'rgba(200,121,65,0.18)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: form.isActive ? 'rgba(0,200,100,0.1)' : 'rgba(200,121,65,0.1)', border: `1px solid ${form.isActive ? 'rgba(0,200,100,0.2)' : 'rgba(200,121,65,0.2)'}` }}>
                        {form.isActive ? <UserCheck size={15} className="text-emerald-400" /> : <UserX size={15} className="text-copper" />}
                      </div>
                      <div>
                        <p className={`text-[0.82rem] font-semibold ${form.isActive ? 'text-emerald-400' : 'text-copper'}`}>
                          {form.isActive ? 'Account Active' : 'Account Inactive'}
                        </p>
                        <p className="text-[0.7rem] text-text-muted mt-0.5">
                          {form.isActive ? 'This user can log in and use the platform.' : 'This user cannot log in until reactivated.'}
                        </p>
                      </div>
                    </div>
                    <Toggle checked={form.isActive} onChange={set('isActive')} />
                  </div>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-[rgba(200,121,65,0.07)] border border-[rgba(200,121,65,0.22)]">
                <div className="w-1.5 h-1.5 rounded-full bg-copper mt-1.5 shrink-0" />
                <p className="text-[0.8rem] text-copper leading-[1.5]">{error}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button type="button" className="btn-ghost text-[0.72rem] py-[11px] px-[24px]"
                onClick={() => navigate('/dashboard/staff')}>
                Cancel
              </button>
              <button type="submit" disabled={isPending || uploading}
                className="btn-primary text-[0.72rem] py-[11px] px-[28px] flex-1 max-w-[220px] justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending
                  ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                  : isEditMode
                  ? <><Save size={13} /> Save Changes</>
                  : <><UserPlus size={13} /> Create Staff Member</>
                }
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
