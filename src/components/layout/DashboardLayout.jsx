import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const sidebarWidth = collapsed ? 64 : 256

  return (
    <div className="relative min-h-screen grid-overlay">
      {/* Ambient cyan/copper radial glows (same as landing section glows) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 15% 40%, rgba(0,212,255,0.028) 0%, transparent 60%), ' +
            'radial-gradient(ellipse 60% 40% at 85% 20%, rgba(200,121,65,0.016) 0%, transparent 55%)',
        }}
      />

      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <Topbar sidebarWidth={sidebarWidth} />

      {/* Main content area */}
      <main
        className="relative z-[2] pt-16 min-h-screen transition-[margin-left] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ marginLeft: sidebarWidth }}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
