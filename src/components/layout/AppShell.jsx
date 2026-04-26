import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import './AppShell.css'

export default function AppShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className={`app-main ${collapsed ? 'sidebar-collapsed' : ''}`}>
        <Header
          onToggleSidebar={() => setCollapsed(c => !c)}
          onMobileMenu={() => setMobileOpen(true)}
        />
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
