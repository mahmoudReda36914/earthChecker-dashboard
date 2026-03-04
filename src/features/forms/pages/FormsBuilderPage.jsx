import { useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'

const FIELD_TYPES = [
  { type: 'text',     label: 'Text Input',    icon: '📝', desc: 'Short text answer' },
  { type: 'number',   label: 'Number',        icon: '🔢', desc: 'Numeric value' },
  { type: 'select',   label: 'Dropdown',      icon: '▽',  desc: 'Select from list' },
  { type: 'checkbox', label: 'Checkbox',      icon: '☑',  desc: 'Boolean yes/no' },
  { type: 'image',    label: 'Image Capture', icon: '📷', desc: 'Camera / upload + AI scan' },
  { type: 'rating',   label: 'Rating Scale',  icon: '⭐', desc: '1–5 quality rating' },
  { type: 'date',     label: 'Date / Time',   icon: '📅', desc: 'Timestamp entry' },
  { type: 'note',     label: 'Inspector Note',icon: '💬', desc: 'Free-form comment' },
]

const AI_AGENTS = [
  { id: 'none',         label: 'No AI — manual review' },
  { id: 'visioncore',   label: 'VisionCore-v2 — defect detection' },
  { id: 'threadscan',   label: 'ThreadScan-AI — seam analysis' },
  { id: 'labelbot',     label: 'LabelBot-3 — label verification' },
]

const initFields = [
  { id: 1, type: 'text',  label: 'Product SKU',        required: true,  agent: 'none' },
  { id: 2, type: 'image', label: 'Front View Photo',   required: true,  agent: 'visioncore' },
  { id: 3, type: 'image', label: 'Seam Close-up',      required: true,  agent: 'threadscan' },
  { id: 4, type: 'rating',label: 'Overall Quality',    required: false, agent: 'none' },
  { id: 5, type: 'note',  label: 'Inspector Comments', required: false, agent: 'none' },
]

export default function FormsBuilderPage() {
  const [fields, setFields] = useState(initFields)
  const [selected, setSelected] = useState(null)
  const [dragging, setDragging] = useState(null)

  const addField = (type) => {
    const info = FIELD_TYPES.find((f) => f.type === type)
    const newField = {
      id: Date.now(),
      type,
      label: info.label,
      required: false,
      agent: 'none',
    }
    setFields([...fields, newField])
    setSelected(newField.id)
  }

  const removeField = (id) => {
    setFields(fields.filter((f) => f.id !== id))
    if (selected === id) setSelected(null)
  }

  const updateField = (id, key, value) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)))
  }

  const selectedField = fields.find((f) => f.id === selected)

  return (
    <div>
      <PageHeader
        title="Forms Builder"
        subtitle="Drag fields to build inspection forms and assign AI agents to image fields"
        badge="T-Shirt QC Form"
        actions={
          <div className="flex gap-2">
            <button className="btn-ghost text-[0.72rem] py-[9px] px-[18px]">Preview</button>
            <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save Form
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Left: Field Type Panel */}
        <div className="xl:col-span-3">
          <div className="rounded-xl p-4 bg-bg-glass backdrop-blur-lg border border-cyan-muted">
            <p className="section-label mb-4">Field Types</p>
            <div className="space-y-1.5">
              {FIELD_TYPES.map((ft) => (
                <button
                  key={ft.type}
                  onClick={() => addField(ft.type)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-white/5 text-left group border border-transparent"
                  draggable
                >
                  <span className="text-base shrink-0">{ft.icon}</span>
                  <div className="min-w-0">
                    <p className="text-[0.8rem] font-semibold text-text-primary">{ft.label}</p>
                    <p className="text-[0.68rem] text-text-muted">{ft.desc}</p>
                  </div>
                  <svg
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2"
                  >
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Canvas */}
        <div className="xl:col-span-6">
          <div className="rounded-xl p-4 bg-bg-glass backdrop-blur-lg border border-cyan-muted min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <p className="section-label">Canvas</p>
              <span className="text-[0.7rem] text-text-muted">{fields.length} fields</span>
            </div>

            {fields.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center gap-3 rounded-xl min-h-[320px] border-2 border-dashed border-[rgba(0,212,255,0.12)] text-text-muted"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <polyline points="8 6 2 12 8 18"/><polyline points="16 6 22 12 16 18"/>
                </svg>
                <p className="text-[0.82rem]">Drag or click fields from the left panel</p>
              </div>
            ) : (
              <div className="space-y-2">
                {fields.map((field) => {
                  const ft = FIELD_TYPES.find((f) => f.type === field.type)
                  const isSelected = selected === field.id
                  return (
                    <div
                      key={field.id}
                      onClick={() => setSelected(field.id)}
                      className={`rounded-lg px-4 py-3 cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-[rgba(0,212,255,0.06)] border-[rgba(0,212,255,0.25)] shadow-[0_0_15px_rgba(0,212,255,0.08)]'
                          : 'bg-white/[0.02] border-[rgba(143,163,184,0.08)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3d4f63" strokeWidth="2" className="shrink-0 cursor-grab">
                          <circle cx="9" cy="5" r="1" fill="#3d4f63"/><circle cx="9" cy="12" r="1" fill="#3d4f63"/><circle cx="9" cy="19" r="1" fill="#3d4f63"/>
                          <circle cx="15" cy="5" r="1" fill="#3d4f63"/><circle cx="15" cy="12" r="1" fill="#3d4f63"/><circle cx="15" cy="19" r="1" fill="#3d4f63"/>
                        </svg>
                        <span className="shrink-0 text-[0.9rem]">{ft?.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[0.82rem] font-semibold text-text-primary">{field.label}</p>
                          <p className="text-[0.68rem] text-text-muted">
                            {ft?.label}
                            {field.required && ' · Required'}
                            {field.agent !== 'none' && ` · AI: ${AI_AGENTS.find(a=>a.id===field.agent)?.label.split('—')[0].trim()}`}
                          </p>
                        </div>
                        {field.type === 'image' && field.agent !== 'none' && (
                          <span className="badge-copper shrink-0">AI</span>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeField(field.id) }}
                          className="ml-1 opacity-40 hover:opacity-100 transition-opacity text-copper"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Field Settings */}
        <div className="xl:col-span-3">
          <div className="rounded-xl p-4 bg-bg-glass backdrop-blur-lg border border-cyan-muted min-h-[300px]">
            <p className="section-label mb-4">Field Settings</p>
            {!selectedField ? (
              <p className="text-[0.78rem] text-text-muted leading-[1.6]">
                Select a field from the canvas to configure its properties.
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-[0.72rem] text-steel font-semibold">Label</label>
                  <input
                    type="text"
                    value={selectedField.label}
                    onChange={(e) => updateField(selectedField.id, 'label', e.target.value)}
                    className="input-glass text-[0.82rem]"
                  />
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedField.required}
                    onChange={(e) => updateField(selectedField.id, 'required', e.target.checked)}
                    className="w-[14px] h-[14px] accent-cyan"
                  />
                  <span className="text-[0.78rem] text-steel">Required field</span>
                </label>

                {selectedField.type === 'image' && (
                  <div>
                    <label className="block mb-1.5 text-[0.72rem] text-steel font-semibold">
                      AI Agent
                    </label>
                    <select
                      value={selectedField.agent}
                      onChange={(e) => updateField(selectedField.id, 'agent', e.target.value)}
                      className="input-glass text-[0.82rem]"
                    >
                      {AI_AGENTS.map((a) => (
                        <option key={a.id} value={a.id}>{a.label}</option>
                      ))}
                    </select>
                    {selectedField.agent !== 'none' && (
                      <div className="mt-2 rounded-lg p-2.5 bg-[rgba(200,121,65,0.06)] border border-[rgba(200,121,65,0.15)]">
                        <p className="text-[0.7rem] text-copper">
                          AI agent will auto-analyze this image and return a decision score.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {selectedField.type === 'select' && (
                  <div>
                    <label className="block mb-1.5 text-[0.72rem] text-steel font-semibold">
                      Options (one per line)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Option A&#10;Option B&#10;Option C"
                      className="input-glass resize-none text-[0.82rem]"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
