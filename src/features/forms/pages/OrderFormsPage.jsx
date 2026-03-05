import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Loader2, AlertTriangle, ArrowLeft, GripVertical,
  Check, FileText, Layout,
} from 'lucide-react'
import { useForms, useReorderForms } from '../apiHooks'
import { useModule } from '../../modules/apiHooks'
import PageHeader from '../../../components/ui/PageHeader'

export default function OrderFormsPage() {
  const { id: moduleId } = useParams()
  const navigate         = useNavigate()

  const { data: module }                              = useModule(moduleId)
  const { data: formsData, isLoading }                = useForms({ moduleId, limit: 1000, sortBy: 'order', sortOrder: 'asc' })
  const { mutateAsync: reorder, isPending: saving }   = useReorderForms()

  const [forms,      setForms]      = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const [saved,      setSaved]      = useState(false)

  useEffect(() => {
    if (formsData?.forms) setForms(formsData.forms)
  }, [formsData])

  /* ── Drag & drop ── */
  const dragIdx        = useRef(null)
  const [overIdx, setOverIdx] = useState(null)

  const onDragStart = (e, idx) => {
    dragIdx.current = idx
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (e, idx) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (overIdx !== idx) setOverIdx(idx)
  }
  const onDrop = (e, idx) => {
    e.preventDefault()
    const from = dragIdx.current
    if (from === null || from === idx) { setOverIdx(null); return }
    const next = [...forms]
    const [moved] = next.splice(from, 1)
    next.splice(idx, 0, moved)
    setForms(next)
    setHasChanges(true)
    setSaved(false)
    dragIdx.current = null
    setOverIdx(null)
  }
  const onDragEnd = () => { dragIdx.current = null; setOverIdx(null) }

  const handleSave = async () => {
    await reorder({ moduleId, orderedIds: forms.map((f) => f._id) })
    setHasChanges(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  /* ── States ── */
  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Loader2 size={28} className="animate-spin text-cyan" />
      <span className="font-orbitron text-[0.58rem] font-bold tracking-[0.18em] uppercase text-text-muted">Loading forms…</span>
    </div>
  )

  if (!isLoading && forms.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-14 h-14 rounded-2xl bg-[rgba(200,121,65,0.07)] border border-[rgba(200,121,65,0.18)] flex items-center justify-center">
        <AlertTriangle size={22} className="text-copper" />
      </div>
      <p className="text-[0.82rem] text-steel">No forms found in this module.</p>
      <button onClick={() => navigate(`/dashboard/modules/${moduleId}`)} className="btn-ghost text-[0.72rem] py-[8px] px-[16px]">
        <ArrowLeft size={13} /> Back
      </button>
    </div>
  )

  return (
    <div className="pb-28">
      <PageHeader
        title="Order Forms"
        subtitle={module ? `${module.title} · ${forms.length} form${forms.length !== 1 ? 's' : ''}` : ''}
        badge="Drag to reorder"
        actions={
          <div className="flex items-center gap-3">
            <button
              className="btn-ghost text-[0.72rem] py-[9px] px-[18px]"
              onClick={() => navigate(`/dashboard/modules/${moduleId}`)}
            >
              <ArrowLeft size={13} /> Back
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="btn-primary text-[0.72rem] py-[9px] px-[22px] min-w-[130px] justify-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving
                ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                : saved
                ? <><Check size={13} /> Saved!</>
                : <><Check size={13} /> Save Order</>
              }
            </button>
          </div>
        }
      />

      {/* Hint */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <GripVertical size={13} className="text-text-muted shrink-0" />
        <p className="text-[0.75rem] text-text-muted">
          Drag cards to rearrange the display order, then click <span className="text-text-primary font-medium">Save Order</span>.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {forms.map((form, idx) => {
          const isOver     = overIdx === idx
          const isDragging = dragIdx.current === idx

          return (
            <div
              key={form._id}
              draggable
              onDragStart={(e) => onDragStart(e, idx)}
              onDragOver={(e)  => onDragOver(e, idx)}
              onDrop={(e)      => onDrop(e, idx)}
              onDragEnd={onDragEnd}
              className={`
                rounded-xl border bg-bg-glass backdrop-blur-xl
                transition-all duration-150 select-none
                cursor-grab active:cursor-grabbing
                ${isOver
                  ? 'border-[rgba(0,212,255,0.45)] shadow-[0_0_0_2px_rgba(0,212,255,0.12),0_8px_32px_rgba(0,0,0,0.5)] translate-y-[-2px]'
                  : isDragging
                  ? 'opacity-40 border-[rgba(0,212,255,0.15)] scale-[0.99]'
                  : 'border-[rgba(143,163,184,0.12)] hover:border-[rgba(0,212,255,0.2)] shadow-glass hover:shadow-glass-hover'
                }
              `}
            >
              {/* ── Gradient header strip ── */}
              <div className="h-1.5 bg-gradient-to-r from-cyan via-[rgba(0,180,255,0.5)] to-transparent" />

              <div className="p-5 flex flex-col gap-4">

                {/* Row 1: order badge + drag handle */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgba(0,212,255,0.08)] border border-[rgba(0,212,255,0.18)] font-orbitron text-[0.58rem] font-bold text-cyan tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <GripVertical size={16} className="text-[rgba(143,163,184,0.28)]" />
                </div>

                {/* Row 2: icon + title */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(0,212,255,0.07)] border border-[rgba(0,212,255,0.14)] flex items-center justify-center shrink-0">
                    <FileText size={17} className="text-cyan" />
                  </div>
                  <h3 className="font-orbitron text-[0.84rem] font-bold text-text-primary leading-[1.35] line-clamp-2 mt-0.5">
                    {form.name}
                  </h3>
                </div>

                {/* Row 3: description */}
                <p className="text-[0.76rem] text-steel leading-[1.65] line-clamp-2 min-h-[2.5em]">
                  {form.description || <span className="italic text-text-muted">No description provided.</span>}
                </p>

                {/* Row 4: sections count */}
                <div className="pt-3 border-t border-[rgba(143,163,184,0.07)] flex items-center gap-2">
                  <Layout size={12} className="text-cyan shrink-0" />
                  <span className="text-[0.72rem] text-steel">
                    <span className="font-semibold text-text-primary">{form.sections?.length ?? 0}</span>
                    {' '}{(form.sections?.length ?? 0) === 1 ? 'section' : 'sections'}
                  </span>
                </div>

              </div>

              {/* Drop indicator bar */}
              {isOver && (
                <div className="h-[2px] bg-gradient-to-r from-cyan via-[rgba(0,180,255,0.7)] to-transparent rounded-b-xl" />
              )}
            </div>
          )
        })}
      </div>

      {/* Sticky save bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-fade-in-up">
          <div className="flex items-center gap-4 px-6 py-3.5 rounded-xl bg-[rgba(6,8,16,0.97)] backdrop-blur-xl border border-[rgba(0,212,255,0.22)] shadow-[0_8px_40px_rgba(0,0,0,0.65),0_0_0_1px_rgba(0,212,255,0.06)]">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan animate-dot-pulse" />
              <span className="text-[0.78rem] text-steel">You have unsaved changes</span>
            </div>
            <div className="w-px h-4 bg-[rgba(143,163,184,0.15)]" />
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary text-[0.72rem] py-[8px] px-[20px] min-w-[120px] justify-center"
            >
              {saving
                ? <><Loader2 size={13} className="animate-spin" /> Saving…</>
                : <><Check size={13} /> Save Order</>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
