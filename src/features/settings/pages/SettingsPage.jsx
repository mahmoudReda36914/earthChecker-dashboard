import { useState } from 'react'
import PageHeader from '../../../components/ui/PageHeader'

function Section({ title, children }) {
  return (
    <div className="rounded-xl p-6 mb-5 bg-bg-glass backdrop-blur-lg border border-cyan-muted">
      <h3 className="font-orbitron text-[0.75rem] font-bold text-text-primary tracking-[0.1em] uppercase mb-5">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 py-4 border-b border-b-[rgba(143,163,184,0.06)]">
      <div className="sm:w-64 shrink-0">
        <p className="text-[0.85rem] font-medium text-text-primary">{label}</p>
        {hint && <p className="text-[0.72rem] text-text-muted mt-0.5">{hint}</p>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div
        className={`relative w-11 h-6 rounded-full transition-all border ${
          checked
            ? 'bg-[rgba(0,212,255,0.3)] border-[rgba(0,212,255,0.5)]'
            : 'bg-[rgba(143,163,184,0.15)] border-[rgba(143,163,184,0.2)]'
        }`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${
            checked
              ? 'left-[calc(100%-22px)] bg-cyan shadow-[0_0_8px_rgba(0,212,255,0.6)]'
              : 'left-[2px] bg-steel'
          }`}
        />
      </div>
      {label && <span className="text-[0.82rem] text-steel">{label}</span>}
    </label>
  )
}

export default function SettingsPage() {
  const [notifs, setNotifs] = useState({ email: true, rejection: true, cycleEnd: true, weeklyReport: false })
  const [ai, setAi] = useState({ autoReject: true, confidenceThreshold: 85, reviewQueue: true })

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Organization, API, AI thresholds, and notification preferences"
        actions={
          <button className="btn-primary text-[0.72rem] py-[9px] px-[18px]">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
            </svg>
            Save Changes
          </button>
        }
      />

      {/* Organization */}
      <Section title="Organization">
        <Field label="Company Name" hint="Shown on reports and invoices">
          <input type="text" defaultValue="Apex Textile Group" className="input-glass max-w-sm" />
        </Field>
        <Field label="Industry" hint="Used to fine-tune AI recommendations">
          <select className="input-glass max-w-sm" defaultValue="apparel">
            <option value="apparel">Apparel Manufacturing</option>
            <option value="textile">Textile / Fabric</option>
            <option value="footwear">Footwear</option>
            <option value="accessory">Accessories</option>
          </select>
        </Field>
        <Field label="Primary Contact" hint="Used for critical alerts">
          <input type="email" defaultValue="ahmad@apexgroup.com" className="input-glass max-w-sm" />
        </Field>
        <Field label="Time Zone">
          <select className="input-glass max-w-sm" defaultValue="utc+3.5">
            <option value="utc+3.5">UTC+3:30 — Tehran</option>
            <option value="utc+0">UTC+0 — London</option>
            <option value="utc+1">UTC+1 — Paris</option>
            <option value="utc-5">UTC-5 — New York</option>
          </select>
        </Field>
      </Section>

      {/* AI Thresholds */}
      <Section title="AI Decision Engine">
        <Field
          label="Auto-reject below threshold"
          hint="Submissions scoring below this value are auto-rejected"
        >
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={50} max={99} step={1}
              value={ai.confidenceThreshold}
              onChange={(e) => setAi({ ...ai, confidenceThreshold: +e.target.value })}
              className="w-40 accent-cyan"
            />
            <span className="font-orbitron text-base font-extrabold text-cyan tracking-[-0.02em]">
              {ai.confidenceThreshold}%
            </span>
          </div>
        </Field>
        <Field label="Auto-reject submissions" hint="Automatically mark as rejected when below threshold">
          <Toggle checked={ai.autoReject} onChange={(v) => setAi({ ...ai, autoReject: v })} label={ai.autoReject ? 'Enabled' : 'Disabled'} />
        </Field>
        <Field label="Manual review queue" hint="Route borderline scores to inspector queue (70–85%)">
          <Toggle checked={ai.reviewQueue} onChange={(v) => setAi({ ...ai, reviewQueue: v })} label={ai.reviewQueue ? 'Enabled' : 'Disabled'} />
        </Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Field label="Email notifications" hint="Receive operational updates via email">
          <Toggle checked={notifs.email} onChange={(v) => setNotifs({ ...notifs, email: v })} />
        </Field>
        <Field label="Rejection alerts" hint="Notify immediately when batches fail">
          <Toggle checked={notifs.rejection} onChange={(v) => setNotifs({ ...notifs, rejection: v })} />
        </Field>
        <Field label="Cycle completion" hint="Alert when a cycle finishes processing">
          <Toggle checked={notifs.cycleEnd} onChange={(v) => setNotifs({ ...notifs, cycleEnd: v })} />
        </Field>
        <Field label="Weekly summary report" hint="Monday morning digest to admin email">
          <Toggle checked={notifs.weeklyReport} onChange={(v) => setNotifs({ ...notifs, weeklyReport: v })} />
        </Field>
      </Section>

      {/* API Keys */}
      <Section title="API Keys">
        <Field label="Production API Key" hint="Use this in your production environment">
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="password"
              defaultValue="sk_prod_x92vLmQpR4nKwJtA8cB"
              className="input-glass flex-1"
              readOnly
            />
            <button className="btn-ghost px-3 py-2.5 text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </Field>
        <Field label="Webhook URL" hint="POST callback for inspection events">
          <input
            type="url"
            placeholder="https://yourapp.com/webhook/feedbrush"
            className="input-glass max-w-md"
          />
        </Field>
        <div className="pt-2">
          <button className="btn-copper text-[0.72rem] py-[9px] px-[18px]">
            Rotate API Key
          </button>
        </div>
      </Section>

      {/* Danger Zone */}
      <div className="rounded-xl p-6 bg-bg-glass backdrop-blur-lg border border-copper-border">
        <h3 className="font-orbitron text-[0.75rem] font-bold text-copper tracking-[0.1em] uppercase mb-4">
          Danger Zone
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 border-b border-b-[rgba(200,121,65,0.08)]">
          <div>
            <p className="text-[0.85rem] font-medium text-text-primary">Delete all data</p>
            <p className="text-[0.72rem] text-text-muted mt-0.5">
              Permanently remove all submissions, cycles, and modules
            </p>
          </div>
          <button className="shrink-0 px-4 py-2 rounded-lg font-semibold transition-all bg-[rgba(200,121,65,0.08)] border border-[rgba(200,121,65,0.3)] text-copper text-[0.78rem]">
            Delete Data
          </button>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
          <div>
            <p className="text-[0.85rem] font-medium text-text-primary">Close account</p>
            <p className="text-[0.72rem] text-text-muted mt-0.5">
              Permanently close your Feedbrush organization
            </p>
          </div>
          <button className="shrink-0 px-4 py-2 rounded-lg font-semibold transition-all bg-[rgba(200,121,65,0.08)] border border-[rgba(200,121,65,0.3)] text-copper text-[0.78rem]">
            Close Account
          </button>
        </div>
      </div>
    </div>
  )
}
