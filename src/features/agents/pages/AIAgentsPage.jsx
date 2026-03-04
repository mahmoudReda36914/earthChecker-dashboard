import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, ThumbsUp, ThumbsDown, Pencil, Trash2,
  ChevronLeft, ChevronRight, Loader2, ImagePlus, AlertTriangle, X,
} from 'lucide-react'
import { useAgents, useDeleteAgent, useLikeAgent, useDislikeAgent } from '../apiHooks'

/* ─── SVG Ring ─────────────────────────────────────────────── */
function Ring({ value, max = 100, size = 56, strokeW = 4, color, bg }) {
  const r    = (size - strokeW * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = circ - (Math.min(value, max) / max) * circ
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg}    strokeWidth={strokeW} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeW}
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }} />
      </svg>
      <span className="absolute font-bold text-[0.78rem] leading-none" style={{ color }}>{value}%</span>
    </div>
  )
}

/* ─── Agent Card ─────────────────────────────────────────────── */
function AgentCard({ agent, onEdit, onDelete, onLike, onDislike }) {
  return (
    <div className="rounded-xl overflow-hidden flex flex-col bg-bg-glass backdrop-blur-lg border border-[rgba(143,163,184,0.1)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-muted hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
      <div className="relative h-[160px] overflow-hidden shrink-0 bg-[rgba(0,0,0,0.3)]">
        {agent.image ? (
          <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImagePlus size={32} className="text-[rgba(0,212,255,0.15)]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,8,16,0.85)] via-[rgba(6,8,16,0.2)] to-transparent" />
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <h3 className="font-orbitron text-[0.85rem] font-bold text-text-primary leading-snug">{agent.name}</h3>
        {agent.description && (
          <p className="text-[0.72rem] text-steel leading-[1.6] line-clamp-2">{agent.description}</p>
        )}

        <div className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[rgba(0,0,0,0.25)] border border-[rgba(143,163,184,0.07)]">
          <Ring value={agent.tolerance ?? 0} size={52} strokeW={4} color="#22c55e" bg="rgba(34,197,94,0.12)" />
          <div className="w-px h-8 bg-[rgba(143,163,184,0.1)]" />
          <div>
            <p className="text-[0.58rem] text-text-muted uppercase tracking-[0.08em] font-medium mb-0.5">Confidence</p>
            <p className="text-[0.95rem] font-bold text-text-primary leading-none">{agent.tolerance ?? 0}%</p>
          </div>
        </div>

        <div className="flex items-center gap-5 px-1">
          <button onClick={() => onLike(agent._id)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <ThumbsUp size={14} strokeWidth={1.8} stroke="#22c55e" />
            <span className="text-[0.75rem] font-semibold text-text-primary">{agent.like ?? 0}</span>
          </button>
          <button onClick={() => onDislike(agent._id)} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            <ThumbsDown size={14} strokeWidth={1.8} stroke="#f97316" />
            <span className="text-[0.75rem] font-semibold text-text-primary">{agent.dislike ?? 0}</span>
          </button>
        </div>

        <div className="h-px bg-[rgba(143,163,184,0.08)]" />
        <div className="flex gap-2 mt-auto">
          <button onClick={() => onEdit(agent._id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-[9px] rounded-lg text-[0.73rem] font-semibold text-cyan border border-[rgba(0,212,255,0.25)] bg-[rgba(0,212,255,0.04)] hover:bg-[rgba(0,212,255,0.1)] hover:border-[rgba(0,212,255,0.45)] transition-all">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onDelete(agent)}
            className="flex-1 flex items-center justify-center gap-1.5 py-[9px] rounded-lg text-[0.73rem] font-semibold text-copper border border-[rgba(200,121,65,0.25)] bg-[rgba(200,121,65,0.04)] hover:bg-[rgba(200,121,65,0.1)] hover:border-[rgba(200,121,65,0.45)] transition-all">
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Pagination ─────────────────────────────────────────────── */
function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.totalPages <= 1) return null
  const { page, totalPages } = pagination
  return (
    <div className="flex items-center justify-center gap-1.5 mt-10">
      <button onClick={() => onPage(page - 1)} disabled={!pagination.hasPrev}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-steel border border-[rgba(143,163,184,0.15)] bg-bg-glass hover:border-cyan-muted hover:text-cyan disabled:opacity-30 transition-all">
        <ChevronLeft size={13} />
      </button>
      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-[0.78rem] font-semibold transition-all ${
            page === p ? 'bg-cyan text-[#060810] shadow-[0_0_16px_rgba(0,212,255,0.45)]'
              : 'border border-[rgba(143,163,184,0.15)] bg-bg-glass text-steel hover:border-cyan-muted hover:text-cyan'
          }`}>{p}</button>
      ))}
      <button onClick={() => onPage(page + 1)} disabled={!pagination.hasNext}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-steel border border-[rgba(143,163,184,0.15)] bg-bg-glass hover:border-cyan-muted hover:text-cyan disabled:opacity-30 transition-all">
        <ChevronRight size={13} />
      </button>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════ */
export default function AIAgentsPage() {
  const navigate = useNavigate()
  const [pageParams, setPageParams]   = useState({ page: 1, limit: 9 })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const { data, isLoading, isError } = useAgents(pageParams)
  const { mutateAsync: deleteAgent, isPending: deleting } = useDeleteAgent()
  const { mutateAsync: likeAgent }    = useLikeAgent()
  const { mutateAsync: dislikeAgent } = useDislikeAgent()

  const agents     = data?.agents     ?? []
  const pagination = data?.pagination ?? null

  const handleDelete = async () => {
    await deleteAgent(deleteTarget._id)
    setDeleteTarget(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-7">
        <div>
          <h1 className="font-orbitron text-[1.45rem] font-bold text-text-primary tracking-tight">AI Agents</h1>
          <p className="text-[0.78rem] text-steel mt-1">
            {pagination ? `${pagination.total} agent${pagination.total !== 1 ? 's' : ''}` : 'Manage your AI-powered quality inspection agents'}
          </p>
        </div>
        <button onClick={() => navigate('/dashboard/agents/create')} className="btn-primary text-[0.73rem] py-[10px] px-5 shrink-0">
          <Plus size={13} strokeWidth={2.5} /> Create Agent
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-cyan" />
        </div>
      )}
      {isError && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-copper">
          <AlertTriangle size={32} />
          <p className="text-[0.85rem]">Failed to load agents. Please try again.</p>
        </div>
      )}
      {!isLoading && !isError && agents.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-text-muted">
          <ImagePlus size={40} className="text-[rgba(0,212,255,0.15)]" />
          <p className="text-[0.85rem]">No agents yet. Create your first one!</p>
        </div>
      )}
      {!isLoading && agents.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {agents.map(agent => (
              <AgentCard key={agent._id} agent={agent}
                onEdit={(id) => navigate(`/dashboard/agents/${id}/update`)}
                onDelete={setDeleteTarget}
                onLike={likeAgent} onDislike={dislikeAgent} />
            ))}
          </div>
          <Pagination pagination={pagination} onPage={(p) => setPageParams(pp => ({ ...pp, page: p }))} />
        </>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(6,8,16,0.75)] backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-bg-glass border border-[rgba(143,163,184,0.12)] p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between">
              <h3 className="font-orbitron text-[1rem] font-bold text-text-primary">Delete Agent</h3>
              <button onClick={() => setDeleteTarget(null)} className="text-steel hover:text-text-primary">
                <X size={16} />
              </button>
            </div>
            <p className="text-[0.83rem] text-steel leading-[1.7]">
              Are you sure you want to delete{' '}
              <span className="text-text-primary font-semibold">{deleteTarget.name}</span>?
            </p>
            <div className="flex gap-3 pt-1">
              <button className="btn-ghost flex-1 justify-center" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button disabled={deleting} onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 py-[11px] px-6 rounded bg-[rgba(200,121,65,0.12)] border border-[rgba(200,121,65,0.4)] text-copper font-orbitron text-xs font-bold tracking-[0.08em] uppercase transition-all hover:bg-[rgba(200,121,65,0.2)] disabled:opacity-50">
                {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
