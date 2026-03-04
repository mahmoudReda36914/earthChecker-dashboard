import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, ImagePlus, X, Plus, Trash2, Pencil, AlertTriangle } from 'lucide-react'
import PageHeader   from '../../../components/ui/PageHeader'
import Modal        from '../../../components/ui/Modal'
import { useModules, useCreateModule, useUpdateModule, useDeleteModule } from '../apiHooks'
import { uploadImage } from '../../../utils/uploadImage'

/* ─── Image picker ─────────────────────────────────────────── */
function ImagePicker({ value, onChange }) {
  const ref        = useRef(null)
  const [prev, setPrev] = useState(value || '')
  const [uploading, setUploading] = useState(false)
  const [progress,  setProgress]  = useState(0)
  const [error,     setError]     = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    setProgress(0)
    try {
      const url = await uploadImage(file, setProgress, 'modules')
      setPrev(url)
      onChange(url)
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const clear = () => { setPrev(''); onChange('') }

  return (
    <div className="space-y-2">
      <label className="block text-[0.75rem] font-semibold text-steel">Module Image</label>

      {prev ? (
        <div className="relative rounded-lg overflow-hidden h-[140px]">
          <img src={prev} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[rgba(0,0,0,0.6)] flex items-center justify-center text-white hover:bg-[rgba(200,121,65,0.8)] transition-all"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={uploading}
          className="w-full h-[140px] rounded-lg border border-dashed border-[rgba(0,212,255,0.2)] bg-[rgba(0,212,255,0.02)] flex flex-col items-center justify-center gap-2 text-text-muted hover:border-[rgba(0,212,255,0.4)] hover:text-cyan transition-all disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-cyan" />
              <span className="text-[0.72rem]">Uploading {progress}%</span>
            </>
          ) : (
            <>
              <ImagePlus size={22} />
              <span className="text-[0.72rem]">Click to upload image</span>
              <span className="text-[0.65rem] text-text-muted">JPEG · PNG · WEBP · max 5 MB</span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-[0.72rem] text-copper">{error}</p>}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}

/* ─── Module card ──────────────────────────────────────────── */
function ModuleCard({ mod, onEdit, onDelete }) {
  return (
    <div className="rounded-xl overflow-hidden bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-muted hover:shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
      {/* Image */}
      <div className="relative h-[180px] overflow-hidden bg-[rgba(0,212,255,0.03)]">
        {mod.image ? (
          <img src={mod.image} alt={mod.title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlus size={32} className="text-[rgba(0,212,255,0.2)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,16,0.7)] via-transparent to-transparent" />
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-4">
        <div>
          <h3 className="font-orbitron text-[1.0rem] font-bold text-text-primary leading-tight">{mod.title}</h3>
          {mod.description && (
            <p className="text-[0.78rem] text-steel leading-[1.6] mt-1.5 line-clamp-2">{mod.description}</p>
          )}
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-[0.65rem] text-text-muted">
          <span>By {mod.creatorId?.name ?? '—'}</span>
          <span>·</span>
          <span>{new Date(mod.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1 border-t border-t-[rgba(143,163,184,0.08)]">
          <button
            onClick={() => onEdit(mod)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[0.75rem] font-semibold text-steel border border-[rgba(143,163,184,0.18)] bg-transparent transition-all hover:border-[rgba(0,212,255,0.3)] hover:text-cyan hover:bg-cyan-muted"
          >
            <Pencil size={12} /> Update
          </button>
          <button
            onClick={() => onDelete(mod)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[0.75rem] font-semibold text-copper border border-[rgba(200,121,65,0.25)] bg-[rgba(200,121,65,0.06)] transition-all hover:border-[rgba(200,121,65,0.5)] hover:bg-[rgba(200,121,65,0.12)]"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ */
export default function ModulesPage() {
  const navigate = useNavigate()

  /* ── API hooks ── */
  const { data, isLoading, isError } = useModules()
  const { mutateAsync: createModule, isPending: creating } = useCreateModule()
  const { mutateAsync: updateModule, isPending: updating } = useUpdateModule()
  const { mutateAsync: deleteModule, isPending: deleting } = useDeleteModule()

  const modules = data?.modules ?? []

  /* ── Modal states ── */
  const [createOpen,   setCreateOpen]   = useState(false)
  const [editTarget,   setEditTarget]   = useState(null)   // module object
  const [deleteTarget, setDeleteTarget] = useState(null)   // module object

  /* ── Create form ── */
  const [form, setForm] = useState({ title: '', description: '', image: '' })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    await createModule({ title: form.title, description: form.description, image: form.image })
    setForm({ title: '', description: '', image: '' })
    setCreateOpen(false)
  }

  /* ── Edit form ── */
  const [editForm, setEditForm] = useState({ title: '', description: '', image: '' })
  const openEdit = (mod) => {
    setEditForm({ title: mod.title, description: mod.description || '', image: mod.image || '' })
    setEditTarget(mod)
  }
  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editForm.title.trim()) return
    await updateModule({ id: editTarget._id, ...editForm })
    setEditTarget(null)
  }

  /* ── Delete ── */
  const handleDelete = async () => {
    await deleteModule(deleteTarget._id)
    setDeleteTarget(null)
  }

  /* ── UI states ── */
  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-cyan" />
    </div>
  )

  if (isError) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-copper">
      <AlertTriangle size={32} />
      <p className="text-[0.85rem]">Failed to load modules. Please try again.</p>
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Modules"
        subtitle={`${modules.length} module${modules.length !== 1 ? 's' : ''} · ${data?.pagination?.total ?? 0} total`}
        actions={
          <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]" onClick={() => setCreateOpen(true)}>
            <Plus size={13} /> New Module
          </button>
        }
      />

      {/* Grid */}
      {modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-text-muted">
          <ImagePlus size={40} className="text-[rgba(0,212,255,0.15)]" />
          <p className="text-[0.85rem]">No modules yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {modules.map((mod) => (
            <ModuleCard key={mod._id} mod={mod} onEdit={openEdit} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {/* ── Create Modal ── */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Module">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Module Title *</label>
            <input
              type="text"
              placeholder="e.g. T-Shirt Quality Check"
              className="input-glass"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the inspection purpose..."
              className="input-glass resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <ImagePicker value={form.image} onChange={(url) => setForm({ ...form, image: url })} />

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1 justify-center" onClick={() => setCreateOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={creating || !form.title.trim()}>
              {creating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              {creating ? 'Creating…' : 'Create Module'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Modal ── */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title={`Update — ${editTarget?.title}`}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Module Title *</label>
            <input
              type="text"
              className="input-glass"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Description</label>
            <textarea
              rows={3}
              className="input-glass resize-none"
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
            />
          </div>

          <ImagePicker value={editForm.image} onChange={(url) => setEditForm({ ...editForm, image: url })} />

          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-ghost flex-1 justify-center" onClick={() => setEditTarget(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 justify-center" disabled={updating || !editForm.title.trim()}>
              {updating ? <Loader2 size={14} className="animate-spin" /> : <Pencil size={14} />}
              {updating ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Module" size="sm">
        <div className="space-y-4">
          <p className="text-[0.85rem] text-steel leading-[1.6]">
            Are you sure you want to delete{' '}
            <span className="text-text-primary font-semibold">{deleteTarget?.title}</span>?
            The module will be soft-deleted and hidden from the list.
          </p>
          <div className="flex gap-3 pt-1">
            <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteTarget(null)}>
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 py-[11px] px-6 rounded bg-[rgba(200,121,65,0.12)] border border-[rgba(200,121,65,0.4)] text-copper font-orbitron text-xs font-bold tracking-[0.08em] uppercase transition-all hover:bg-[rgba(200,121,65,0.2)] disabled:opacity-50"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              {deleting ? 'Deleting…' : 'Delete Module'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
