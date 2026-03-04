import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/* ─── Individual field renderer ─── */
function FieldPreview({ field, answer, setAnswer }) {
  return (
    <div className="rounded-xl p-5 bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)]">
      <p className="text-[0.9rem] font-semibold text-text-primary mb-3">
        {field.label}
        {field.required && <span className="text-copper ml-1">*</span>}
      </p>

      {field.type === 'Text Input' && (
        <input
          type="text"
          value={answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer"
          className="input-glass w-full"
        />
      )}

      {field.type === 'Number' && (
        <input
          type="number"
          value={answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="0"
          className="input-glass w-40"
        />
      )}

      {field.type === 'Date' && (
        <input
          type="date"
          value={answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
          className="input-glass w-52"
        />
      )}

      {field.type === 'Dropdown' && (
        <select
          value={answer || ''}
          onChange={(e) => setAnswer(e.target.value)}
          className="input-glass"
        >
          <option value="" disabled>Select an option</option>
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      )}

      {field.type === 'Multiple Choice' && (
        <div className="space-y-2.5">
          {(field.options || []).map((opt) => (
            <label key={opt} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => setAnswer(opt)}
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                  answer === opt
                    ? 'border-cyan bg-[rgba(0,212,255,0.2)]'
                    : 'border-[rgba(143,163,184,0.3)] hover:border-[rgba(0,212,255,0.3)]'
                }`}
              >
                {answer === opt && <div className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_5px_rgba(0,212,255,0.7)]" />}
              </div>
              <span className="text-[0.85rem] text-steel group-hover:text-text-primary transition-colors">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {field.type === 'Checkbox' && (
        <div className="space-y-2.5">
          {(field.options || []).map((opt) => {
            const selected = (answer || []).includes(opt)
            return (
              <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() =>
                    setAnswer(selected
                      ? (answer || []).filter((v) => v !== opt)
                      : [...(answer || []), opt])
                  }
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                    selected
                      ? 'border-cyan bg-[rgba(0,212,255,0.2)]'
                      : 'border-[rgba(143,163,184,0.3)] hover:border-[rgba(0,212,255,0.3)]'
                  }`}
                >
                  {selected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span className="text-[0.85rem] text-steel group-hover:text-text-primary transition-colors">{opt}</span>
              </label>
            )
          })}
        </div>
      )}

      {field.type === 'Linear Scale' && (
        <div className="flex items-center gap-3 flex-wrap">
          {field.scaleMinLabel && (
            <span className="text-[0.75rem] text-text-muted shrink-0">{field.scaleMin ?? 1} — {field.scaleMinLabel}</span>
          )}
          <div className="flex items-center gap-1.5 flex-wrap">
            {Array.from(
              { length: Math.max(0, (field.scaleMax ?? 5) - (field.scaleMin ?? 1) + 1) },
              (_, i) => i + (field.scaleMin ?? 1)
            ).map((n) => (
              <button
                key={n}
                onClick={() => setAnswer(n)}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-[0.78rem] font-bold border transition-all ${
                  answer === n
                    ? 'bg-cyan border-cyan text-bg-primary shadow-[0_0_10px_rgba(0,212,255,0.5)]'
                    : 'border-[rgba(143,163,184,0.25)] text-steel hover:border-[rgba(0,212,255,0.35)] hover:text-cyan'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {field.scaleMaxLabel && (
            <span className="text-[0.75rem] text-text-muted shrink-0">{field.scaleMax ?? 5} — {field.scaleMaxLabel}</span>
          )}
        </div>
      )}

      {field.type === 'Rating' && (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setAnswer(n)} className="transition-transform hover:scale-110">
              <svg
                width="30" height="30" viewBox="0 0 24 24"
                fill={(answer ?? 0) >= n ? '#c87941' : 'none'}
                stroke={(answer ?? 0) >= n ? '#c87941' : '#3d4f63'}
                strokeWidth="1.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </button>
          ))}
        </div>
      )}

      {field.type === 'File Upload' && (
        <label className="block rounded-lg border-2 border-dashed border-[rgba(143,163,184,0.2)] p-6 text-center cursor-pointer hover:border-[rgba(0,212,255,0.3)] transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={answer ? '#00d4ff' : '#3d4f63'} strokeWidth="1.5" className="mx-auto mb-2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <p className={`text-[0.78rem] ${answer ? 'text-cyan' : 'text-steel'}`}>
            {answer ? `Selected: ${answer}` : 'Click to upload or drag & drop'}
          </p>
          <input type="file" className="hidden" onChange={(e) => setAnswer(e.target.files[0]?.name)} />
        </label>
      )}
    </div>
  )
}

/* ─── Main preview page ─── */
export default function FormPreviewPage() {
  const navigate    = useNavigate()
  const { state }   = useLocation()

  const formName = state?.formName || 'Untitled Form'
  const formDesc = state?.formDesc || ''
  const fields   = state?.fields  || []

  const [answers,   setAnswers]   = useState({})
  const [submitted, setSubmitted] = useState(false)

  const setAnswer = (fieldId, value) =>
    setAnswers((prev) => ({ ...prev, [fieldId]: value }))

  /* ── Submitted screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-cyan-muted border border-[rgba(0,212,255,0.3)] flex items-center justify-center mx-auto mb-5 shadow-[0_0_30px_rgba(0,212,255,0.15)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2 className="font-orbitron text-xl font-extrabold text-text-primary mb-2 tracking-[-0.01em]">
            Submitted!
          </h2>
          <p className="text-[0.88rem] text-steel mb-7">Your inspection form has been submitted successfully.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => { setSubmitted(false); setAnswers({}) }}
              className="px-5 py-2.5 rounded text-[0.75rem] font-semibold text-steel border border-[rgba(143,163,184,0.2)] bg-transparent transition-all hover:border-[rgba(0,212,255,0.25)] hover:text-text-primary"
            >
              Fill Again
            </button>
            <button onClick={() => navigate(-1)} className="btn-primary text-[0.75rem] py-[10px] px-5">
              Back to Editor
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Preview form ── */
  return (
    <div className="min-h-screen bg-bg-primary">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[rgba(6,8,16,0.95)] backdrop-blur-lg border-b border-b-[rgba(0,212,255,0.07)] flex items-center px-6 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[0.8rem] font-medium text-steel hover:text-text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Editor
        </button>

        <div className="flex-1 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan shadow-[0_0_6px_rgba(0,212,255,0.8)] animate-dot-pulse" />
          <span className="font-orbitron text-[0.62rem] font-bold tracking-[0.14em] uppercase text-cyan">
            Preview Mode
          </span>
        </div>

        {/* spacer to balance left button */}
        <div className="w-28" />
      </div>

      {/* Form content */}
      <div className="pt-14 pb-20 flex justify-center">
        <div className="w-full max-w-xl px-4 py-8">

          {/* Form header card — with cyan top border like Google Forms */}
          <div className="rounded-xl mb-4 bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)] overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-cyan-dark to-cyan" />
            <div className="px-6 py-5">
              <h1 className="font-orbitron text-[1.2rem] font-extrabold text-text-primary tracking-[-0.01em] leading-[1.2]">
                {formName}
              </h1>
              {formDesc && (
                <p className="text-[0.85rem] text-steel mt-2 leading-[1.6]">{formDesc}</p>
              )}
            </div>
          </div>

          {/* Fields */}
          {fields.length === 0 ? (
            <div className="rounded-xl p-10 bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)] text-center">
              <p className="text-[0.85rem] text-text-muted">No fields added yet. Go back and add some fields.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field) => (
                <FieldPreview
                  key={field.id}
                  field={field}
                  answer={answers[field.id]}
                  setAnswer={(v) => setAnswer(field.id, v)}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          {fields.length > 0 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setSubmitted(true)}
                className="btn-primary px-8 py-[11px]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Submit
              </button>
              <button
                onClick={() => setAnswers({})}
                className="text-[0.75rem] text-text-muted hover:text-steel transition-colors"
              >
                Clear form
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
