import { useState } from 'react'
import { Search, Download, Eye, Trash2 } from 'lucide-react'
import PageHeader from '../../../components/ui/PageHeader'
import StatusBadge from '../../../components/ui/StatusBadge'
import DataTable from '../../../components/ui/DataTable'

const SUBMISSIONS = [
  { id: 'SUB-09234', module: 'T-Shirt QC',       form: 'Full Inspection Form',  cycle: 'CYC-0847', status: 'accepted',   aiDecision: 'PASS · 97.2%', ts: '2026-03-02 11:21', inspector: 'M. Reza' },
  { id: 'SUB-09233', module: 'T-Shirt QC',       form: 'Full Inspection Form',  cycle: 'CYC-0847', status: 'rejected',   aiDecision: 'FAIL · 31.5%', ts: '2026-03-02 11:18', inspector: 'M. Reza' },
  { id: 'SUB-09232', module: 'T-Shirt QC',       form: 'Full Inspection Form',  cycle: 'CYC-0847', status: 'accepted',   aiDecision: 'PASS · 94.8%', ts: '2026-03-02 11:16', inspector: 'K. Ahmadi' },
  { id: 'SUB-09231', module: 'Jacket Seam Scan', form: 'Seam Integrity Check',  cycle: 'CYC-0846', status: 'accepted',   aiDecision: 'PASS · 92.1%', ts: '2026-03-01 16:41', inspector: 'S. Tavakoli' },
  { id: 'SUB-09230', module: 'Jacket Seam Scan', form: 'Seam Integrity Check',  cycle: 'CYC-0846', status: 'rejected',   aiDecision: 'FAIL · 44.3%', ts: '2026-03-01 16:38', inspector: 'S. Tavakoli' },
  { id: 'SUB-09229', module: 'Fabric Audit',     form: 'Texture Scan Form',     cycle: 'CYC-0845', status: 'processing', aiDecision: 'Pending...',   ts: '2026-03-02 10:58', inspector: 'M. Reza' },
  { id: 'SUB-09228', module: 'Fabric Audit',     form: 'Texture Scan Form',     cycle: 'CYC-0845', status: 'processing', aiDecision: 'Pending...',   ts: '2026-03-02 10:55', inspector: 'K. Ahmadi' },
  { id: 'SUB-09227', module: 'Label QC',         form: 'Label Position Check',  cycle: 'CYC-0843', status: 'accepted',   aiDecision: 'PASS · 99.1%', ts: '2026-02-27 14:18', inspector: 'L. Hosseini' },
  { id: 'SUB-09226', module: 'Thread Density',   form: 'Thread Density Form',   cycle: 'CYC-0844', status: 'rejected',   aiDecision: 'FAIL · 28.7%', ts: '2026-02-28 10:06', inspector: 'S. Tavakoli' },
  { id: 'SUB-09225', module: 'Thread Density',   form: 'Thread Density Form',   cycle: 'CYC-0844', status: 'accepted',   aiDecision: 'PASS · 88.4%', ts: '2026-02-28 10:02', inspector: 'S. Tavakoli' },
]

const COLUMNS = [
  { key: '_index',     label: '#',           align: 'right',  width: 52  },
  { key: 'id',         label: 'ID',          align: 'left'               },
  { key: 'module',     label: 'Module',      align: 'left'               },
  { key: 'form',       label: 'Form',        align: 'left'               },
  { key: 'cycle',      label: 'Cycle',       align: 'left'               },
  { key: 'status',     label: 'Status',      align: 'center'             },
  { key: 'aiDecision', label: 'AI Decision', align: 'center'             },
  { key: 'inspector',  label: 'Inspector',   align: 'left'               },
  { key: 'ts',         label: 'Timestamp',   align: 'left'               },
  { key: 'actions',    label: 'Actions',     align: 'center', width: 90  },
]

const PER_PAGE = 5

export default function SubmissionsPage() {
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage]               = useState(1)

  const filtered = SUBMISSIONS.filter(s => {
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q || s.id.toLowerCase().includes(q) || s.module.toLowerCase().includes(q) || s.cycle.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const pageRows = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleFilter = (key, val) => {
    if (key === 'status') setStatusFilter(val)
    setPage(1)
  }

  const renderCell = (key, row, rowIndex) => {
    const globalIndex = (page - 1) * PER_PAGE + rowIndex + 1
    switch (key) {
      case '_index':
        return <span className="text-[0.82rem] font-semibold text-text-muted">#{globalIndex}</span>

      case 'id':
        return <span className="font-orbitron text-[0.68rem] text-cyan tracking-[0.04em]">{row.id}</span>

      case 'module':
        return <span className="text-[0.82rem] text-text-primary whitespace-nowrap">{row.module}</span>

      case 'form':
        return <span className="text-[0.78rem] text-steel whitespace-nowrap">{row.form}</span>

      case 'cycle':
        return <span className="font-orbitron text-[0.65rem] text-copper tracking-[0.04em]">{row.cycle}</span>

      case 'status':
        return <StatusBadge status={row.status} />

      case 'aiDecision':
        return (
          <span className={`text-[0.7rem] font-bold tracking-[0.04em] font-orbitron ${
            row.aiDecision.startsWith('PASS') ? 'text-cyan'
            : row.aiDecision.startsWith('FAIL') ? 'text-copper'
            : 'text-steel font-normal'
          }`}>
            {row.aiDecision}
          </span>
        )

      case 'inspector':
        return <span className="text-[0.78rem] text-steel">{row.inspector}</span>

      case 'ts':
        return <span className="text-[0.72rem] text-text-muted whitespace-nowrap">{row.ts}</span>

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

  return (
    <div>
      <PageHeader
        title="Submissions"
        subtitle="All inspection submissions with AI decision scores and timestamps"
        badge={`${SUBMISSIONS.length} Records`}
        actions={
          <button className="btn-ghost text-[0.72rem] py-[9px] px-[18px]">
            <Download size={13} strokeWidth={2} />
            Export CSV
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <Search size={13} stroke="#3d4f63" strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="input-glass w-[220px] text-[0.8rem] py-2 pl-[34px] pr-3"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {['all', 'accepted', 'rejected', 'processing'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilter('status', f)}
              className={`px-3.5 py-1.5 rounded-full transition-all capitalize text-[0.75rem] ${
                statusFilter === f
                  ? 'bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] text-cyan font-semibold'
                  : 'bg-white/[0.03] border border-[rgba(143,163,184,0.12)] text-steel font-normal'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="ml-auto text-[0.72rem] text-text-muted">
          {filtered.length} of {SUBMISSIONS.length} records
        </span>
      </div>

      <DataTable
        columns={COLUMNS}
        rows={pageRows}
        renderCell={renderCell}
        total={filtered.length}
        page={page}
        perPage={PER_PAGE}
        onPageChange={setPage}
        entityLabel="submissions"
        emptyMessage="No submissions match the current filters."
      />
    </div>
  )
}
