import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Loader2, AlertTriangle, ArrowLeft, Plus, Pencil, Trash2,
  FileText, Calendar, User, ImageIcon, Eye, ArrowUpDown,
} from 'lucide-react'
import PageHeader from '../../../components/ui/PageHeader'
import Modal      from '../../../components/ui/Modal'
import DataTable  from '../../../components/ui/DataTable'
import { useModule } from '../apiHooks'
import { useForms, useDeleteForm } from '../../forms/apiHooks'

const COLUMNS = [
  { key: 'name',        label: 'Form Name'  },
  { key: 'description', label: 'Description' },
  { key: 'sections',    label: 'Sections',  align: 'center', width: '110px' },
  { key: 'createdBy',   label: 'Created By', width: '150px' },
  { key: 'createdAt',   label: 'Date',       width: '120px' },
  { key: 'actions',     label: 'Actions',   align: 'right',  width: '130px' },
]

const PER_PAGE = 10

export default function ModuleDetailPage() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [page, setPage] = useState(1)

  const { data: module, isLoading: moduleLoading, isError: moduleError } = useModule(id)
  const { data: formsData, isLoading: formsLoading } = useForms({ moduleId: id, page, limit: PER_PAGE, sortBy: 'order', sortOrder: 'asc' })
  const { mutateAsync: deleteForm, isPending: deleting } = useDeleteForm()

  const forms = formsData?.forms ?? []
  const total = formsData?.pagination?.total ?? 0

  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleDelete = async () => {
    await deleteForm(deleteTarget._id)
    setDeleteTarget(null)
  }

  const renderCell = (key, form) => {
    switch (key) {
      case 'name':
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(0,212,255,0.06)] border border-[rgba(0,212,255,0.1)] flex items-center justify-center shrink-0">
              <FileText size={14} className="text-cyan" />
            </div>
            <span className="text-[0.82rem] font-semibold text-text-primary">{form.name}</span>
          </div>
        )
      case 'description':
        return (
          <span className="text-[0.78rem] text-steel line-clamp-1 max-w-[200px] block">
            {form.description || '—'}
          </span>
        )
      case 'sections':
        return (
          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded text-[0.68rem] font-bold bg-[rgba(0,212,255,0.08)] text-cyan border border-[rgba(0,212,255,0.15)]">
            {form.sections?.length ?? 0}
          </span>
        )
      case 'createdBy':
        return <span className="text-[0.78rem] text-steel">{form.createdBy?.name ?? '—'}</span>
      case 'createdAt':
        return (
          <span className="text-[0.75rem] text-text-muted">
            {new Date(form.createdAt).toLocaleDateString()}
          </span>
        )
      case 'actions':
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => window.open(`/form-preview/${form._id}`, '_blank')}
              title="Preview form"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-steel border border-[rgba(143,163,184,0.15)] hover:border-[rgba(0,212,255,0.35)] hover:text-cyan transition-all"
            >
              <Eye size={13} />
            </button>
            <button
              onClick={() => navigate(`/dashboard/modules/${id}/forms/${form._id}/edit`)}
              title="Edit form"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-steel border border-[rgba(143,163,184,0.15)] hover:border-[rgba(0,212,255,0.35)] hover:text-cyan transition-all"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => setDeleteTarget(form)}
              title="Delete form"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-copper border border-[rgba(200,121,65,0.2)] hover:border-[rgba(200,121,65,0.5)] hover:bg-[rgba(200,121,65,0.08)] transition-all"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )
      default:
        return null
    }
  }

  if (moduleLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-cyan" />
    </div>
  )

  if (moduleError || !module) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3 text-copper">
      <AlertTriangle size={32} />
      <p className="text-[0.85rem]">Module not found or failed to load.</p>
      <button className="btn-ghost text-[0.72rem]" onClick={() => navigate('/dashboard/modules')}>
        <ArrowLeft size={13} /> Back to Modules
      </button>
    </div>
  )

  return (
    <div>
      <PageHeader
        title={module.title}
        subtitle={module.description || 'No description provided'}
        badge="Module"
        actions={
          <div className="flex gap-2">
            <button className="btn-ghost text-[0.72rem] py-[9px] px-[18px]" onClick={() => navigate('/dashboard/modules')}>
              <ArrowLeft size={13} /> Back
            </button>
            <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]" onClick={() => navigate(`/dashboard/modules/${id}/forms/create`)}>
              <Plus size={13} /> New Form
            </button>
          </div>
        }
      />

      {/* Module info card */}
      <div className="rounded-xl bg-bg-glass backdrop-blur-lg border border-[rgba(0,212,255,0.08)] p-5 mb-8 flex gap-5 items-start">
        {module.image ? (
          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-[rgba(0,212,255,0.12)]">
            <img src={module.image} alt={module.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg shrink-0 flex items-center justify-center bg-[rgba(0,212,255,0.04)] border border-[rgba(0,212,255,0.1)]">
            <ImageIcon size={28} className="text-[rgba(0,212,255,0.2)]" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="font-orbitron text-[1.05rem] font-bold text-text-primary leading-tight">{module.title}</h2>
          <p className="text-[0.82rem] text-steel mt-1 leading-[1.6]">{module.description || 'No description provided.'}</p>
          <div className="flex flex-wrap gap-5 mt-3">
            <div className="flex items-center gap-1.5 text-[0.72rem] text-text-muted">
              <User size={11} /><span>{module.creatorId?.name ?? '—'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.72rem] text-text-muted">
              <Calendar size={11} /><span>{new Date(module.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[0.72rem] text-cyan">
              <FileText size={11} /><span>{total} form{total !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forms header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-orbitron text-[0.88rem] font-bold text-text-primary tracking-[0.05em]">
          Forms
          <span className="ml-2 font-sans font-normal text-[0.72rem] text-text-muted">{total} total</span>
        </h2>
        <div className="flex gap-2">
          <button
            className="btn-ghost text-[0.72rem] py-[8px] px-[16px]"
            onClick={() => navigate(`/dashboard/modules/${id}/forms/order`)}
          >
            <ArrowUpDown size={13} /> Order
          </button>
          <button
            className="btn-primary text-[0.72rem] py-[8px] px-[16px]"
            onClick={() => navigate(`/dashboard/modules/${id}/forms/create`)}
          >
            <Plus size={13} /> New Form
          </button>
        </div>
      </div>

      {/* Table */}
      {formsLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 size={24} className="animate-spin text-cyan" />
        </div>
      ) : (
        <DataTable
          columns={COLUMNS}
          rows={forms}
          renderCell={renderCell}
          total={total}
          page={page}
          perPage={PER_PAGE}
          onPageChange={setPage}
          emptyMessage="No forms yet. Create your first one!"
          entityLabel="forms"
        />
      )}

      {/* Delete Modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Form" size="sm">
        <div className="space-y-4">
          <p className="text-[0.85rem] text-steel leading-[1.6]">
            Are you sure you want to delete{' '}
            <span className="text-text-primary font-semibold">{deleteTarget?.name}</span>?
            The form will be soft-deleted and hidden from the list.
          </p>
          <div className="flex gap-3 pt-1">
            <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 flex items-center justify-center gap-2 py-[11px] px-6 rounded bg-[rgba(200,121,65,0.12)] border border-[rgba(200,121,65,0.4)] text-copper font-orbitron text-xs font-bold tracking-[0.08em] uppercase transition-all hover:bg-[rgba(200,121,65,0.2)] disabled:opacity-50"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              {deleting ? 'Deleting…' : 'Delete Form'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
