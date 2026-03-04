import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

/* ─── Module data ─── */
const MODULES_DATA = {
  'MOD-001': { id: 'MOD-001', name: 'Shirts',      description: 'Quality control for dress shirts, polo shirts, and casual shirts.',           image: 'https://picsum.photos/seed/shirts-fabric/600/240' },
  'MOD-002': { id: 'MOD-002', name: 'Pants',       description: 'Quality inspection for denim jeans, trousers, and formal pants manufacturing.', image: 'https://picsum.photos/seed/pants-denim/600/240'   },
  'MOD-003': { id: 'MOD-003', name: 'Jackets',     description: 'Quality assurance for winter jackets, blazers, and outerwear production.',      image: 'https://picsum.photos/seed/jackets-coat/600/240'  },
  'MOD-004': { id: 'MOD-004', name: 'Sweaters',    description: 'Knitted garments quality inspection for pullovers, cardigans, and hosiery.',    image: 'https://picsum.photos/seed/sweater-knit/600/240'  },
  'MOD-005': { id: 'MOD-005', name: 'Accessories', description: 'Inspection module for ties, scarves, belts, and other fashion accessories.',    image: 'https://picsum.photos/seed/accessories-ties/600/240' },
  'MOD-006': { id: 'MOD-006', name: 'Footwear',    description: 'Quality control for shoes, boots, and sandals across all production stages.',   image: 'https://picsum.photos/seed/footwear-shoes/600/240' },
}

const SAMPLE_FORMS = [
  { id: 'F1', name: 'Visual Inspection', fields: 5, color: 'cyan'   },
  { id: 'F2', name: 'Measurement Check', fields: 3, color: 'steel'  },
  { id: 'F3', name: 'Final QC Review',   fields: 4, color: 'copper' },
]

const FIELD_TYPES = [
  'Dropdown', 'Multiple Choice', 'Checkbox',
  'Linear Scale', 'Rating',
  'Text Input', 'Number', 'Date', 'File Upload',
]

const DEFAULT_OPTIONS_TYPES = ['Dropdown', 'Multiple Choice', 'Checkbox']

const INITIAL_FIELDS = [
  { id: 1, label: 'Fabric Type',              type: 'Dropdown',     required: true,  options: ['Cotton', 'Polyester', 'Silk'] },
  { id: 2, label: 'Color Consistency Rating', type: 'Linear Scale', required: false, scaleMin: 1, scaleMax: 5, scaleMinLabel: 'Poor', scaleMaxLabel: 'Excellent' },
  { id: 3, label: 'Defect Photo',             type: 'File Upload',  required: true  },
]

/* ─── Toggle ─── */
function Toggle({ checked, onChange }) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full cursor-pointer transition-all border shrink-0 ${
        checked
          ? 'bg-[rgba(0,212,255,0.3)] border-[rgba(0,212,255,0.5)]'
          : 'bg-[rgba(143,163,184,0.15)] border-[rgba(143,163,184,0.2)]'
      }`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
        checked
          ? 'left-[calc(100%-18px)] bg-cyan shadow-[0_0_6px_rgba(0,212,255,0.6)]'
          : 'left-[2px] bg-steel'
      }`} />
    </div>
  )
}

/* ─── FormFieldCard ─── */
function FormFieldCard({ field, isActive, onActivate, onUpdate, onDuplicate, onDelete, onMoveUp, onMoveDown }) {
  const [typeOpen, setTypeOpen] = useState(false)

  const update = (changes) => onUpdate({ ...field, ...changes })

  const addOption = () => {
    const opts = [...(field.options || []), `Option ${(field.options?.length || 0) + 1}`]
    update({ options: opts })
  }
  const removeOption = (idx) => update({ options: field.options.filter((_, i) => i !== idx) })
  const editOption   = (idx, val) => {
    const opts = [...field.options]; opts[idx] = val; update({ options: opts })
  }

  /* ── Collapsed ── */
  if (!isActive) {
    return (
      <div
        onClick={onActivate}
        className="rounded-lg border border-[rgba(143,163,184,0.1)] bg-[rgba(255,255,255,0.02)] px-3 py-2.5 flex items-center gap-2 cursor-pointer hover:border-[rgba(0,212,255,0.2)] hover:bg-[rgba(0,212,255,0.02)] transition-all group"
      >
        {/* drag handle */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-text-muted shrink-0 opacity-40 group-hover:opacity-70">
          <circle cx="9" cy="5" r="1.2"/><circle cx="9" cy="12" r="1.2"/><circle cx="9" cy="19" r="1.2"/>
          <circle cx="15" cy="5" r="1.2"/><circle cx="15" cy="12" r="1.2"/><circle cx="15" cy="19" r="1.2"/>
        </svg>
        <span className="flex-1 text-[0.82rem] font-semibold text-text-primary truncate">{field.label}</span>
        {field.required && <span className="text-copper text-[0.8rem] font-bold shrink-0">*</span>}
        <span className="text-[0.62rem] text-steel bg-[rgba(143,163,184,0.08)] border border-[rgba(143,163,184,0.12)] rounded-full px-2 py-0.5 shrink-0">
          {field.type}
        </span>
      </div>
    )
  }

  /* ── Expanded / Active ── */
  return (
    <div
      className="rounded-lg border border-[rgba(0,212,255,0.3)] bg-[rgba(0,212,255,0.025)] overflow-visible shadow-[0_0_20px_rgba(0,212,255,0.07)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Label + Type selector */}
      <div className="px-3 pt-3 pb-2.5 space-y-2 border-b border-b-[rgba(143,163,184,0.06)]">
        <input
          type="text"
          value={field.label}
          onChange={(e) => update({ label: e.target.value })}
          placeholder="Question"
          className="input-glass text-[0.9rem] font-semibold w-full"
        />

        {/* Type dropdown */}
        <div className="relative inline-block">
          <button
            onClick={() => setTypeOpen(!typeOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[rgba(0,212,255,0.22)] bg-[rgba(0,212,255,0.07)] text-[0.72rem] text-cyan font-semibold transition-all hover:border-[rgba(0,212,255,0.4)]"
          >
            {field.type}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points={typeOpen ? '18 15 12 9 6 15' : '6 9 12 15 18 9'} />
            </svg>
          </button>

          {typeOpen && (
            <div className="absolute top-full left-0 mt-1 z-20 rounded-lg border border-[rgba(0,212,255,0.15)] bg-[rgba(8,12,20,0.98)] shadow-[0_8px_32px_rgba(0,0,0,0.7)] p-2 grid grid-cols-2 gap-1 w-52">
              {FIELD_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    const extras = DEFAULT_OPTIONS_TYPES.includes(t) && !DEFAULT_OPTIONS_TYPES.includes(field.type)
                      ? { options: ['Option 1', 'Option 2'] }
                      : {}
                    update({ type: t, ...extras })
                    setTypeOpen(false)
                  }}
                  className={`px-2.5 py-1.5 rounded text-left text-[0.72rem] transition-all ${
                    field.type === t
                      ? 'bg-cyan-muted border border-[rgba(0,212,255,0.2)] text-cyan'
                      : 'text-steel border border-transparent hover:border-[rgba(0,212,255,0.15)] hover:text-cyan hover:bg-cyan-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Type-specific editing area */}
      <div className="px-3 py-3">

        {/* Dropdown / Multiple Choice / Checkbox */}
        {DEFAULT_OPTIONS_TYPES.includes(field.type) && (
          <div className="space-y-1.5">
            {(field.options || []).map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {field.type === 'Checkbox'
                  ? <div className="w-3.5 h-3.5 rounded border border-[rgba(143,163,184,0.3)] shrink-0" />
                  : field.type === 'Multiple Choice'
                  ? <div className="w-3.5 h-3.5 rounded-full border border-[rgba(143,163,184,0.3)] shrink-0" />
                  : <span className="text-[0.65rem] text-text-muted shrink-0 w-4 text-right">{idx + 1}.</span>
                }
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => editOption(idx, e.target.value)}
                  className="flex-1 bg-transparent border-b border-b-[rgba(143,163,184,0.15)] text-[0.8rem] text-text-primary outline-none py-0.5 focus:border-b-[rgba(0,212,255,0.35)] transition-colors placeholder:text-text-muted"
                  placeholder={`Option ${idx + 1}`}
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="text-text-muted hover:text-copper transition-colors w-5 h-5 flex items-center justify-center shrink-0"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              className="flex items-center gap-1.5 text-[0.72rem] text-cyan mt-2 hover:opacity-75 transition-opacity"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add option
            </button>
          </div>
        )}

        {/* Linear Scale */}
        {field.type === 'Linear Scale' && (
          <div className="space-y-3">
            <div className="flex items-end gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[0.62rem] text-text-muted font-semibold tracking-[0.06em] uppercase">Min</label>
                <input
                  type="number" min={0} max={(field.scaleMax ?? 5) - 1}
                  value={field.scaleMin ?? 1}
                  onChange={(e) => update({ scaleMin: +e.target.value })}
                  className="input-glass w-16 text-[0.82rem] text-center"
                />
              </div>
              <span className="text-text-muted text-[0.9rem] pb-2">—</span>
              <div className="flex flex-col gap-1">
                <label className="text-[0.62rem] text-text-muted font-semibold tracking-[0.06em] uppercase">Max</label>
                <input
                  type="number" min={(field.scaleMin ?? 1) + 1} max={10}
                  value={field.scaleMax ?? 5}
                  onChange={(e) => update({ scaleMax: +e.target.value })}
                  className="input-glass w-16 text-[0.82rem] text-center"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={field.scaleMinLabel ?? ''}
                onChange={(e) => update({ scaleMinLabel: e.target.value })}
                placeholder="Min label (e.g. Poor)"
                className="input-glass flex-1 text-[0.75rem]"
              />
              <input
                type="text"
                value={field.scaleMaxLabel ?? ''}
                onChange={(e) => update({ scaleMaxLabel: e.target.value })}
                placeholder="Max label (e.g. Excellent)"
                className="input-glass flex-1 text-[0.75rem]"
              />
            </div>
            {/* Preview dots */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {Array.from(
                { length: Math.max(0, (field.scaleMax ?? 5) - (field.scaleMin ?? 1) + 1) },
                (_, i) => i + (field.scaleMin ?? 1)
              ).map((n) => (
                <div key={n} className="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold border border-[rgba(143,163,184,0.2)] text-steel">
                  {n}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        {field.type === 'Rating' && (
          <div className="flex items-center gap-1.5">
            {[1,2,3,4,5].map((n) => (
              <svg key={n} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3d4f63" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span className="text-[0.68rem] text-text-muted ml-1">Preview only</span>
          </div>
        )}

        {/* Text Input */}
        {field.type === 'Text Input' && (
          <input type="text" disabled placeholder="Short answer text" className="input-glass text-[0.8rem] text-text-muted w-full opacity-60" />
        )}

        {/* Number */}
        {field.type === 'Number' && (
          <input type="number" disabled placeholder="0" className="input-glass text-[0.8rem] text-text-muted w-32 opacity-60" />
        )}

        {/* Date */}
        {field.type === 'Date' && (
          <input type="date" disabled className="input-glass text-[0.8rem] text-text-muted opacity-60" />
        )}

        {/* File Upload */}
        {field.type === 'File Upload' && (
          <div className="rounded border-2 border-dashed border-[rgba(143,163,184,0.15)] p-4 text-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3d4f63" strokeWidth="1.5" className="mx-auto mb-1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <p className="text-[0.72rem] text-text-muted">Click to upload or drag & drop</p>
          </div>
        )}
      </div>

      {/* Footer: actions + required toggle */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-t-[rgba(143,163,184,0.06)] bg-[rgba(255,255,255,0.01)]">
        <div className="flex items-center gap-1">
          <button onClick={onMoveUp}    title="Move up"    className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-steel transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button onClick={onMoveDown}  title="Move down"  className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-steel transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <div className="w-px h-3.5 bg-[rgba(143,163,184,0.12)] mx-0.5" />
          <button onClick={onDuplicate} title="Duplicate"  className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-steel transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
          <button onClick={onDelete}    title="Delete"     className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-copper transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
              <path d="M10 11v6"/><path d="M14 11v6"/>
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[0.68rem] text-text-muted">Required</span>
          <Toggle checked={!!field.required} onChange={(v) => update({ required: v })} />
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function UpdateModulePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const mod = MODULES_DATA[id] || MODULES_DATA['MOD-001']

  const [title, setTitle]             = useState(mod.name)
  const [description, setDescription] = useState(mod.description)
  const [panelOpen, setPanelOpen]     = useState(true)
  const [formName, setFormName]       = useState('Fabric Quality Check')
  const [formDesc, setFormDesc]       = useState('')
  const [fields, setFields]           = useState(INITIAL_FIELDS)
  const [activeFieldId, setActiveFieldId] = useState(null)
  const [addFieldOpen, setAddFieldOpen]   = useState(false)

  /* ── Field handlers ── */
  const updateField = (updated) => setFields(fields.map(f => f.id === updated.id ? updated : f))

  const duplicateField = (fieldId) => {
    const idx = fields.findIndex(f => f.id === fieldId)
    const dup = { ...fields[idx], id: Date.now() }
    const next = [...fields]
    next.splice(idx + 1, 0, dup)
    setFields(next)
    setActiveFieldId(dup.id)
  }

  const deleteField = (fieldId) => {
    setFields(fields.filter(f => f.id !== fieldId))
    if (activeFieldId === fieldId) setActiveFieldId(null)
  }

  const moveField = (fieldId, dir) => {
    const idx = fields.findIndex(f => f.id === fieldId)
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= fields.length) return
    const next = [...fields]
    const [removed] = next.splice(idx, 1)
    next.splice(newIdx, 0, removed)
    setFields(next)
  }

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      label: type,
      type,
      required: false,
      ...(DEFAULT_OPTIONS_TYPES.includes(type) ? { options: ['Option 1', 'Option 2'] } : {}),
      ...(type === 'Linear Scale' ? { scaleMin: 1, scaleMax: 5, scaleMinLabel: '', scaleMaxLabel: '' } : {}),
    }
    setFields([...fields, newField])
    setActiveFieldId(newField.id)
    setAddFieldOpen(false)
  }

  const openPreview = () => {
    navigate('/form-preview', { state: { formName, formDesc, fields } })
  }

  return (
    <div className="flex flex-col h-full">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-orbitron font-extrabold text-text-primary tracking-[-0.01em] leading-[1.2] text-[1.5rem]">
            Update Module
          </h1>
          <p className="text-[0.88rem] text-steel mt-1.5">Edit module details and manage inspection forms</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/dashboard/modules')}
            className="px-5 py-2.5 rounded text-[0.75rem] font-semibold text-steel border border-[rgba(143,163,184,0.2)] bg-transparent transition-all hover:border-[rgba(0,212,255,0.25)] hover:text-text-primary"
          >
            Back
          </button>
          <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      {/* ── Two-panel body ── */}
      <div className="flex gap-5 items-start">

        {/* ── Left panel ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Module Details */}
          <div className="rounded-xl p-5 bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)]">
            <p className="font-orbitron text-[0.65rem] font-bold tracking-[0.14em] uppercase text-text-muted mb-4">
              Module Details
            </p>
            <div className="flex items-start gap-5">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-[rgba(143,163,184,0.12)] group cursor-pointer">
                <img src={mod.image} alt={mod.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[rgba(6,8,16,0.65)] flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <span className="font-orbitron text-[0.55rem] font-bold tracking-[0.1em] uppercase text-cyan">Change</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-3">
                <div>
                  <label className="block text-[0.68rem] text-text-muted mb-1.5 font-semibold tracking-[0.06em] uppercase">Title</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="input-glass text-[0.88rem]" />
                </div>
                <div>
                  <label className="block text-[0.68rem] text-text-muted mb-1.5 font-semibold tracking-[0.06em] uppercase">Description</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input-glass text-[0.82rem]" />
                </div>
              </div>
            </div>
          </div>

          {/* Inspection Forms */}
          <div className="rounded-xl bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-b-[rgba(143,163,184,0.08)]">
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="font-orbitron text-[0.72rem] font-bold text-text-primary tracking-[0.06em]">Inspection Forms</span>
                <span className="w-5 h-5 rounded-full bg-cyan-muted border border-[rgba(0,212,255,0.2)] flex items-center justify-center text-[0.6rem] font-bold text-cyan">
                  {SAMPLE_FORMS.length}
                </span>
              </div>
              <button
                onClick={() => setPanelOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded bg-cyan border-none cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] text-bg-primary font-orbitron text-[0.65rem] font-bold tracking-[0.08em] uppercase"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Create Form
              </button>
            </div>

            <div className="px-5 py-6">
              <div className="flex justify-center mb-4">
                <div className="w-px h-6 bg-[rgba(0,212,255,0.25)]" />
              </div>
              <div className="flex items-stretch gap-0">
                {SAMPLE_FORMS.map((form, idx) => {
                  const colors = {
                    cyan:   { border: 'border-[rgba(0,212,255,0.35)]',   bg: 'bg-cyan-muted',   text: 'text-cyan',   icon: '#00d4ff' },
                    steel:  { border: 'border-[rgba(143,163,184,0.25)]', bg: 'bg-steel-dim',   text: 'text-steel',  icon: '#8fa3b8' },
                    copper: { border: 'border-[rgba(200,121,65,0.35)]',  bg: 'bg-copper-dim',  text: 'text-copper', icon: '#c87941' },
                  }[form.color]

                  return (
                    <div key={form.id} className="flex items-center flex-1">
                      {idx > 0 && <div className="h-px flex-1 bg-[rgba(0,212,255,0.2)]" />}
                      <div
                        className={`rounded-lg border ${colors.border} bg-[rgba(255,255,255,0.02)] px-4 py-3 cursor-pointer transition-all hover:bg-[rgba(255,255,255,0.04)] group`}
                        style={{ minWidth: 160 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-7 h-7 rounded flex items-center justify-center ${colors.bg}`}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="1.8">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                          </div>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3d4f63" strokeWidth="2" className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <circle cx="9" cy="5" r="1" fill="#3d4f63"/><circle cx="9" cy="12" r="1" fill="#3d4f63"/><circle cx="9" cy="19" r="1" fill="#3d4f63"/>
                            <circle cx="15" cy="5" r="1" fill="#3d4f63"/><circle cx="15" cy="12" r="1" fill="#3d4f63"/><circle cx="15" cy="19" r="1" fill="#3d4f63"/>
                          </svg>
                        </div>
                        <p className={`text-[0.78rem] font-semibold ${colors.text}`}>{form.name}</p>
                        <p className="text-[0.65rem] text-text-muted mt-0.5">{form.fields} fields</p>
                      </div>
                      {idx < SAMPLE_FORMS.length - 1 && <div className="h-px flex-1 bg-[rgba(0,212,255,0.2)]" />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right: Form Builder Panel ── */}
        {panelOpen && (
          <div
            className="w-[340px] xl:w-[360px] shrink-0 rounded-xl bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.12)] overflow-hidden flex flex-col"
            onClick={() => setActiveFieldId(null)}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-b-[rgba(143,163,184,0.08)] shrink-0">
              <span className="font-orbitron text-[0.7rem] font-bold text-text-primary tracking-[0.06em]">Create New Form</span>
              <div className="flex items-center gap-2">
                {/* Preview button */}
                <button
                  onClick={(e) => { e.stopPropagation(); openPreview() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.07)] text-[0.68rem] font-semibold text-cyan transition-all hover:border-[rgba(0,212,255,0.4)] hover:bg-[rgba(0,212,255,0.12)]"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Preview
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setPanelOpen(false) }}
                  className="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:text-text-primary transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Form name + description */}
            <div className="px-4 pt-4 pb-3 space-y-2.5 border-b border-b-[rgba(143,163,184,0.08)] shrink-0" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Form name"
                className="input-glass text-[0.88rem] font-semibold"
              />
              <input
                type="text"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Form description (optional)"
                className="input-glass text-[0.8rem]"
              />
            </div>

            {/* Fields list */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 [scrollbar-width:none]">
              {fields.map((field) => (
                <FormFieldCard
                  key={field.id}
                  field={field}
                  isActive={activeFieldId === field.id}
                  onActivate={(e) => { setActiveFieldId(field.id) }}
                  onUpdate={updateField}
                  onDuplicate={() => duplicateField(field.id)}
                  onDelete={() => deleteField(field.id)}
                  onMoveUp={() => moveField(field.id, -1)}
                  onMoveDown={() => moveField(field.id, 1)}
                />
              ))}

              {/* Add Field button */}
              <button
                onClick={(e) => { e.stopPropagation(); setAddFieldOpen(!addFieldOpen) }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[0.75rem] font-semibold text-text-muted border border-dashed border-[rgba(143,163,184,0.18)] bg-transparent transition-all hover:border-[rgba(0,212,255,0.28)] hover:text-cyan"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Field
              </button>

              {/* Field type picker */}
              {addFieldOpen && (
                <div
                  className="rounded-lg border border-[rgba(0,212,255,0.15)] bg-[rgba(0,212,255,0.04)] p-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="text-[0.62rem] font-bold text-text-muted uppercase tracking-[0.1em] mb-2.5">Select field type</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {FIELD_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => addField(type)}
                        className="px-2.5 py-1.5 rounded text-[0.72rem] text-steel text-left border border-[rgba(143,163,184,0.1)] bg-[rgba(255,255,255,0.02)] transition-all hover:border-[rgba(0,212,255,0.25)] hover:text-cyan hover:bg-cyan-muted"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Panel footer */}
            <div className="px-4 py-3.5 border-t border-t-[rgba(143,163,184,0.08)] flex gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setPanelOpen(false)}
                className="flex-1 py-2 rounded text-[0.72rem] font-semibold text-steel border border-[rgba(143,163,184,0.18)] bg-transparent transition-all hover:border-[rgba(0,212,255,0.2)] hover:text-text-primary"
              >
                Cancel
              </button>
              <button className="flex-1 py-2 rounded bg-cyan text-bg-primary font-orbitron text-[0.65rem] font-bold tracking-[0.08em] uppercase transition-all hover:shadow-[0_0_15px_rgba(0,212,255,0.4)]">
                Save Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
