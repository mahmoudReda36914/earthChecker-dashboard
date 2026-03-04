import { useState } from 'react'
import { Plus, ChevronDown, Calendar, Eye, Pencil, Trash2 } from 'lucide-react'
import PageHeader from '../../../components/ui/PageHeader'
import Modal from '../../../components/ui/Modal'
import DataTable from '../../../components/ui/DataTable'

/* ─── Data ─── */
const CYCLES = [
  {
    id: 'CYC-1284',
    name: 'Shirt Visual Inspection',
    datetime: '2026/02/28 · 10:30 AM',
    pipeline: 'Shirts Module',
    supervisor: { name: 'Ahmed Hassan',     initials: 'AH', color: '#00d4ff' },
    status: 'passed',
    aiScore: 98,
  },
  {
    id: 'CYC-1283',
    name: 'Fabric Texture Audit',
    datetime: '2026/02/27 · 02:15 PM',
    pipeline: 'Jackets Module',
    supervisor: { name: 'Fatima Al-Rashid', initials: 'FA', color: '#f59e0b' },
    status: 'in_progress',
    aiScore: 82,
  },
  {
    id: 'CYC-1282',
    name: 'Thread Density Check',
    datetime: '2026/02/26 · 08:45 AM',
    pipeline: 'Pants Module',
    supervisor: { name: 'Omar Khalil',      initials: 'OK', color: '#ef4444' },
    status: 'failed',
    aiScore: 45,
  },
  {
    id: 'CYC-1281',
    name: 'Seam Strength Test',
    datetime: '2026/02/25 · 11:00 AM',
    pipeline: 'Sweaters Module',
    supervisor: { name: 'Layla Mansour',    initials: 'LM', color: '#10b981' },
    status: 'passed',
    aiScore: 94,
  },
  {
    id: 'CYC-1280',
    name: 'Label Placement QC',
    datetime: '2026/02/25 · 09:00 AM',
    pipeline: 'Accessories Module',
    supervisor: { name: 'Ahmed Hassan',     initials: 'AH', color: '#00d4ff' },
    status: 'pending',
    aiScore: null,
  },
  {
    id: 'CYC-1279',
    name: 'Footwear Stitching Audit',
    datetime: '2026/02/24 · 02:00 PM',
    pipeline: 'Footwear Module',
    supervisor: { name: 'Omar Khalil',      initials: 'OK', color: '#ef4444' },
    status: 'passed',
    aiScore: 91,
  },
  {
    id: 'CYC-1278',
    name: 'Collar Shape Check',
    datetime: '2026/02/24 · 09:30 AM',
    pipeline: 'Shirts Module',
    supervisor: { name: 'Layla Mansour',    initials: 'LM', color: '#10b981' },
    status: 'failed',
    aiScore: 38,
  },
  {
    id: 'CYC-1277',
    name: 'Zipper Function Test',
    datetime: '2026/02/23 · 11:15 AM',
    pipeline: 'Jackets Module',
    supervisor: { name: 'Fatima Al-Rashid', initials: 'FA', color: '#f59e0b' },
    status: 'passed',
    aiScore: 96,
  },
  {
    id: 'CYC-1276',
    name: 'Denim Wash Quality',
    datetime: '2026/02/22 · 08:00 AM',
    pipeline: 'Pants Module',
    supervisor: { name: 'Ahmed Hassan',     initials: 'AH', color: '#00d4ff' },
    status: 'in_progress',
    aiScore: 77,
  },
  {
    id: 'CYC-1275',
    name: 'Accessory Metal Finish',
    datetime: '2026/02/21 · 03:30 PM',
    pipeline: 'Accessories Module',
    supervisor: { name: 'Layla Mansour',    initials: 'LM', color: '#10b981' },
    status: 'pending',
    aiScore: null,
  },
]

/* ─── Status badge config ─── */
const STATUS_CFG = {
  passed:      { label: 'PASSED',      color: '#00d4ff', border: 'rgba(0,212,255,0.45)',   bg: 'rgba(0,212,255,0.06)'   },
  in_progress: { label: 'IN PROGRESS', color: '#f59e0b', border: 'rgba(245,158,11,0.45)',  bg: 'rgba(245,158,11,0.06)'  },
  failed:      { label: 'FAILED',      color: '#ef4444', border: 'rgba(239,68,68,0.45)',   bg: 'rgba(239,68,68,0.06)'   },
  pending:     { label: 'PENDING',     color: '#8fa3b8', border: 'rgba(143,163,184,0.3)',  bg: 'rgba(143,163,184,0.05)' },
}

function CycleStatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded font-orbitron text-[0.58rem] font-bold tracking-[0.1em] uppercase whitespace-nowrap"
      style={{ color: cfg.color, borderColor: cfg.border, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
    >
      {cfg.label}
    </span>
  )
}

function AiScoreBadge({ score }) {
  const isNull = score === null || score === undefined
  const color  = isNull ? '#3d4f63'
    : score >= 85 ? '#00d4ff'
    : score >= 65 ? '#f59e0b'
    : '#ef4444'
  return (
    <div
      className="w-10 h-10 rounded-full border-2 flex items-center justify-center mx-auto font-orbitron font-extrabold text-[0.72rem]"
      style={{ borderColor: color, color }}
    >
      {isNull ? '—' : score}
    </div>
  )
}

function SupervisorCell({ supervisor }) {
  return (
    <div className="flex items-center gap-2.5 min-w-0">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-orbitron text-[0.6rem] font-black text-bg-primary"
        style={{ background: supervisor.color, boxShadow: `0 0 10px ${supervisor.color}40` }}
      >
        {supervisor.initials}
      </div>
      <span className="text-[0.82rem] font-medium text-text-primary whitespace-nowrap">{supervisor.name}</span>
    </div>
  )
}

/* ─── Table columns ─── */
const COLUMNS = [
  { key: '_index',     label: '#',           align: 'right',  width: 52  },
  { key: 'id',         label: 'Cycle ID',    align: 'left'               },
  { key: 'name',       label: 'Cycle Name',  align: 'left'               },
  { key: 'pipeline',   label: 'Pipeline',    align: 'left'               },
  { key: 'supervisor', label: 'Supervisor',  align: 'left'               },
  { key: 'status',     label: 'Status',      align: 'center'             },
  { key: 'aiScore',    label: 'AI Score',    align: 'center', width: 100 },
  { key: 'actions',    label: 'Actions',     align: 'center', width: 130 },
]

const PER_PAGE = 5

/* ─── Page ─── */
export default function CyclesPage() {
  const [newCycleOpen, setNewCycleOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [agentFilter,  setAgentFilter]  = useState('all')
  const [page, setPage] = useState(1)

  const filtered = CYCLES.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (agentFilter  !== 'all' && c.supervisor.name !== agentFilter) return false
    return true
  })

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleFilter = (key, val) => {
    if (key === 'status') setStatusFilter(val)
    if (key === 'agent')  setAgentFilter(val)
    setPage(1)
  }

  const renderCell = (colKey, row, rowIndex) => {
    const globalIndex = (page - 1) * PER_PAGE + rowIndex + 1

    switch (colKey) {
      case '_index':
        return <span className="text-[0.82rem] font-semibold text-text-muted">#{globalIndex}</span>

      case 'id':
        return <span className="font-orbitron text-[0.75rem] font-bold text-text-primary tracking-[0.04em]">{row.id}</span>

      case 'name':
        return (
          <div>
            <p className="text-[0.85rem] font-semibold text-text-primary leading-tight">{row.name}</p>
            <p className="text-[0.72rem] text-text-muted mt-0.5">{row.datetime}</p>
          </div>
        )

      case 'pipeline':
        return <span className="text-[0.82rem] text-steel">{row.pipeline}</span>

      case 'supervisor':
        return <SupervisorCell supervisor={row.supervisor} />

      case 'status':
        return <CycleStatusBadge status={row.status} />

      case 'aiScore':
        return <AiScoreBadge score={row.aiScore} />

      case 'actions':
        return (
          <div className="flex items-center justify-center gap-1.5">
            <button
              title="View"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(0,212,255,0.2)] text-cyan bg-[rgba(0,212,255,0.04)] hover:bg-[rgba(0,212,255,0.12)] hover:border-[rgba(0,212,255,0.45)] transition-all duration-150"
            >
              <Eye size={13} strokeWidth={2} />
            </button>
            <button
              title="Edit"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(143,163,184,0.2)] text-steel bg-transparent hover:border-[rgba(0,212,255,0.3)] hover:text-cyan hover:bg-[rgba(0,212,255,0.06)] transition-all duration-150"
            >
              <Pencil size={13} strokeWidth={2} />
            </button>
            <button
              title="Delete"
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[rgba(200,121,65,0.2)] text-copper bg-[rgba(200,121,65,0.04)] hover:bg-[rgba(200,121,65,0.12)] hover:border-[rgba(200,121,65,0.45)] transition-all duration-150"
            >
              <Trash2 size={13} strokeWidth={2} />
            </button>
          </div>
        )

      default:
        return null
    }
  }

  const supervisors = [...new Set(CYCLES.map(c => c.supervisor.name))]

  return (
    <div>
      <PageHeader
        title="Cycles"
        subtitle="Track and manage quality control cycles"
        actions={
          <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]" onClick={() => setNewCycleOpen(true)}>
            <Plus size={13} strokeWidth={2} />
            New Cycle
          </button>
        }
      />

      {/* ── Filter bar ── */}
      <div className="flex items-center gap-2.5 mb-5 flex-wrap">

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => handleFilter('status', e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-[0.78rem] font-medium text-steel border border-[rgba(143,163,184,0.18)] bg-[rgba(255,255,255,0.03)] cursor-pointer transition-all hover:border-[rgba(0,212,255,0.25)] hover:text-text-primary outline-none focus:border-[rgba(0,212,255,0.3)]"
          >
            <option value="all">Status: All</option>
            <option value="passed">Passed</option>
            <option value="in_progress">In Progress</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          <ChevronDown size={11} strokeWidth={2.5} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>

        {/* Date range pill */}
        <div className="flex items-center gap-1.5 pl-3.5 pr-4 py-1.5 rounded-full text-[0.78rem] font-medium text-steel border border-[rgba(143,163,184,0.18)] bg-[rgba(255,255,255,0.03)]">
          <Calendar size={12} strokeWidth={1.8} />
          Last 30 Days
        </div>

        {/* Agent filter */}
        <div className="relative">
          <select
            value={agentFilter}
            onChange={(e) => handleFilter('agent', e.target.value)}
            className="appearance-none pl-3.5 pr-8 py-1.5 rounded-full text-[0.78rem] font-medium text-steel border border-[rgba(143,163,184,0.18)] bg-[rgba(255,255,255,0.03)] cursor-pointer transition-all hover:border-[rgba(0,212,255,0.25)] hover:text-text-primary outline-none focus:border-[rgba(0,212,255,0.3)]"
          >
            <option value="all">Supervisor: All</option>
            {supervisors.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronDown size={11} strokeWidth={2.5} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* ── Table ── */}
      <DataTable
        columns={COLUMNS}
        rows={pageRows}
        renderCell={renderCell}
        total={filtered.length}
        page={page}
        perPage={PER_PAGE}
        onPageChange={setPage}
        emptyMessage="No cycles match the current filters."
      />

      {/* ── New Cycle Modal ── */}
      <Modal open={newCycleOpen} onClose={() => setNewCycleOpen(false)} title="Start New Cycle">
        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Module</label>
            <select className="input-glass" defaultValue="">
              <option value="" disabled>Select module...</option>
              <option>Shirts Module</option>
              <option>Pants Module</option>
              <option>Jackets Module</option>
              <option>Sweaters Module</option>
              <option>Accessories Module</option>
              <option>Footwear Module</option>
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Cycle Name</label>
            <input type="text" placeholder="e.g. Visual Inspection Run #3" className="input-glass" />
          </div>
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Assign Supervisor</label>
            <select className="input-glass" defaultValue="">
              <option value="" disabled>Select supervisor...</option>
              <option>Ahmed Hassan</option>
              <option>Fatima Al-Rashid</option>
              <option>Omar Khalil</option>
              <option>Layla Mansour</option>
            </select>
          </div>
          <div>
            <label className="block mb-1.5 text-[0.75rem] font-semibold text-steel">Notes</label>
            <textarea rows={2} placeholder="Optional production notes..." className="input-glass resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button className="btn-ghost flex-1 justify-center" onClick={() => setNewCycleOpen(false)}>Cancel</button>
            <button className="btn-primary flex-1 justify-center">Start Cycle</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
