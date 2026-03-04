import {
  Search,
  CheckCircle,
  AlertTriangle,
  Bot,
  Plus,
  LayoutGrid,
  Clock,
  ChevronRight,
} from 'lucide-react'
import KPICard from '../../../components/ui/KPICard'
import PageHeader from '../../../components/ui/PageHeader'
import StatusBadge from '../../../components/ui/StatusBadge'
import DataTable from '../../../components/ui/DataTable'

/* ─── KPI data ──────────────────────────────────────────────────────────── */
const KPI_DATA = [
  {
    label: 'Total Inspections',
    value: '12,480',
    delta: '8.4%',
    deltaDir: 'up',
    accentColor: 'cyan',
    sublabel: 'Last 30 days',
    image: 'https://picsum.photos/seed/factory-line/400/200',
    icon: <Search size={18} strokeWidth={1.8} />,
  },
  {
    label: 'AI Acceptance Rate',
    value: '94.2%',
    delta: '1.3%',
    deltaDir: 'up',
    accentColor: 'cyan',
    sublabel: 'vs last month',
    image: 'https://picsum.photos/seed/ai-circuit/400/200',
    icon: <CheckCircle size={18} strokeWidth={1.8} />,
  },
  {
    label: 'Rejection Flags',
    value: '723',
    delta: '2.1%',
    deltaDir: 'down',
    accentColor: 'copper',
    sublabel: 'Requires review',
    image: 'https://picsum.photos/seed/quality-check/400/200',
    icon: <AlertTriangle size={18} strokeWidth={1.8} />,
  },
  {
    label: 'Active AI Agents',
    value: '3',
    accentColor: 'cyan',
    sublabel: '1 processing now',
    image: 'https://picsum.photos/seed/robot-lab/400/200',
    icon: <Bot size={18} strokeWidth={1.8} />,
  },
]

/* ─── Table data ─────────────────────────────────────────────────────────── */
const RECENT_CYCLES = [
  { id: 'CYC-0847', module: 'T-Shirt Quality Check', batches: 240, accepted: 226, status: 'complete'   },
  { id: 'CYC-0846', module: 'Jacket Seam Scan',       batches: 180, accepted: 164, status: 'complete'   },
  { id: 'CYC-0845', module: 'Fabric Texture Audit',   batches: 320, accepted: 308, status: 'processing' },
  { id: 'CYC-0844', module: 'Thread Density Check',   batches: 96,  accepted: 89,  status: 'complete'   },
  { id: 'CYC-0843', module: 'Label Placement QC',     batches: 150, accepted: 140, status: 'complete'   },
]

const AI_FEED = [
  { time: '2 min ago',  agent: 'VisionCore-v2', event: 'Completed batch #0847-B — 23 items scanned', type: 'success' },
  { time: '8 min ago',  agent: 'ThreadScan-AI', event: 'Flagged 3 items for seam irregularities',   type: 'warning' },
  { time: '14 min ago', agent: 'LabelBot-3',    event: 'Started new inspection cycle CYC-0845',      type: 'info'    },
  { time: '22 min ago', agent: 'VisionCore-v2', event: 'Model updated — accuracy improved to 96.1%', type: 'success' },
  { time: '1 hr ago',   agent: 'ThreadScan-AI', event: 'Batch CYC-0844 finalized — 89/96 passed',    type: 'success' },
]

const CYCLE_COLS = [
  { key: 'id',       label: 'Cycle ID', align: 'left'               },
  { key: 'module',   label: 'Module',   align: 'left'               },
  { key: 'batches',  label: 'Batches',  align: 'center', width: 90  },
  { key: 'accepted', label: 'Accepted', align: 'center', width: 100 },
  { key: 'status',   label: 'Status',   align: 'center', width: 120 },
]

function renderCycleCell(key, row) {
  switch (key) {
    case 'id':
      return <span className="font-orbitron text-[0.72rem] text-cyan tracking-[0.05em]">{row.id}</span>
    case 'module':
      return <span className="text-[0.82rem] text-text-primary">{row.module}</span>
    case 'batches':
      return <span className="text-[0.82rem] text-steel">{row.batches}</span>
    case 'accepted':
      return <span className="text-[0.82rem] text-steel"><span className="text-cyan font-semibold">{row.accepted}</span>/{row.batches}</span>
    case 'status':
      return <StatusBadge status={row.status} />
    default:
      return null
  }
}

/* ─── Reusable glass panel wrapper ─────────────────────────────────────────*/
function GlassPanel({ children, image, accentColor = 'cyan', className = '' }) {
  const rgb = accentColor === 'copper' ? '200,121,65' : '0,212,255'
  return (
    <div className={`relative rounded-xl overflow-hidden flex flex-col ${className}`}>
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.13] pointer-events-none select-none"
        />
      )}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(135deg,
            rgba(6,8,16,0.97) 0%,
            rgba(6,8,16,0.88) 55%,
            rgba(${rgb},0.07) 100%)`,
        }}
      />
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          border:    `1px solid rgba(${rgb},0.18)`,
          boxShadow: `0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03), 0 0 40px rgba(${rgb},0.06)`,
        }}
      />
      <div className="relative z-10 flex flex-col h-full">
        {children}
      </div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function OverviewPage() {
  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Real-time AI inspection intelligence across all active modules"
        badge="Live · 3 agents"
        actions={
          <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]">
            <Plus size={13} strokeWidth={2} />
            New Cycle
          </button>
        }
      />

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {KPI_DATA.map((kpi, i) => (
          <KPICard key={i} {...kpi} />
        ))}
      </div>

      {/* ── Lower sections ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Recent Cycles */}
        <GlassPanel
          image="https://picsum.photos/seed/industrial-table/800/400"
          accentColor="cyan"
          className="lg:col-span-3"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-b-[rgba(0,212,255,0.1)]"
            style={{ background: 'linear-gradient(180deg,rgba(0,212,255,0.05) 0%,transparent 100%)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.2)]">
                <LayoutGrid size={13} stroke="#00d4ff" strokeWidth={2} />
              </div>
              <h3 className="font-orbitron text-[0.78rem] font-bold text-text-primary tracking-[0.08em]">
                Recent Cycles
              </h3>
            </div>
            <button className="flex items-center gap-1 text-[0.72rem] text-cyan hover:text-white transition-colors">
              View all
              <ChevronRight size={11} strokeWidth={2.5} />
            </button>
          </div>
          <DataTable
            columns={CYCLE_COLS}
            rows={RECENT_CYCLES}
            renderCell={renderCycleCell}
            total={RECENT_CYCLES.length}
            page={1}
            perPage={RECENT_CYCLES.length}
            hideFooter
            transparent
          />
          <div className="h-[2px] mx-5 mb-4 rounded-full"
            style={{ background: 'linear-gradient(90deg,rgba(0,212,255,0.6) 0%,rgba(0,212,255,0.1) 60%,transparent 100%)' }}
          />
        </GlassPanel>

        {/* AI Activity Feed */}
        <GlassPanel
          image="https://picsum.photos/seed/data-stream/400/600"
          accentColor="copper"
          className="lg:col-span-2"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-b-[rgba(200,121,65,0.1)]"
            style={{ background: 'linear-gradient(180deg,rgba(200,121,65,0.05) 0%,transparent 100%)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[rgba(200,121,65,0.1)] border border-[rgba(200,121,65,0.2)]">
                <Clock size={13} stroke="#c87941" strokeWidth={2} />
              </div>
              <h3 className="font-orbitron text-[0.78rem] font-bold text-text-primary tracking-[0.08em]">
                AI Activity Feed
              </h3>
            </div>
            <span className="badge-cyan animate-dot-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan" />
              Live
            </span>
          </div>

          <div className="flex-1 divide-y divide-[rgba(143,163,184,0.06)]">
            {AI_FEED.map((item, i) => (
              <div key={i} className="px-5 py-3.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="mt-[5px] shrink-0 flex flex-col items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      item.type === 'success' ? 'bg-cyan shadow-[0_0_6px_rgba(0,212,255,0.8)]'
                      : item.type === 'warning' ? 'bg-copper shadow-[0_0_6px_rgba(200,121,65,0.7)]'
                      : 'bg-steel'
                    }`} />
                    {i < AI_FEED.length - 1 && (
                      <div className="w-px flex-1 min-h-[20px] bg-[rgba(143,163,184,0.1)]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-orbitron text-[0.68rem] font-bold text-copper tracking-[0.04em] truncate">
                        {item.agent}
                      </p>
                      <p className="text-[0.62rem] text-text-muted whitespace-nowrap shrink-0">
                        {item.time}
                      </p>
                    </div>
                    <p className="text-[0.77rem] text-steel mt-0.5 leading-[1.45]">
                      {item.event}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[2px] mx-5 mb-4 mt-2 rounded-full"
            style={{ background: 'linear-gradient(90deg,rgba(200,121,65,0.6) 0%,rgba(200,121,65,0.1) 60%,transparent 100%)' }}
          />
        </GlassPanel>

      </div>
    </div>
  )
}
