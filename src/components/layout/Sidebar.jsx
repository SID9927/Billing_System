import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Receipt, Package, ClipboardList,
  BarChart3, Users, Tag, Settings, ChevronLeft, Ticket, LogOut
} from 'lucide-react'
import { useSettings } from '../../hooks/useSettings'
import { useAuth } from '../../hooks/useAuth'
import './Sidebar.css'

const NAV_ITEMS = [
  { name: 'Dashboard',     icon: LayoutDashboard, path: '/',          feature: 'dashboard' },
  { name: 'New Bill',      icon: Receipt,         path: '/billing',   feature: 'billing' },
  { name: 'Custom Orders', icon: ClipboardList,   path: '/orders',    feature: 'orders' },
  { name: 'Inventory',     icon: Package,         path: '/inventory', feature: 'inventory' },
  { name: 'Customers',     icon: Users,           path: '/customers', feature: 'customers' },
  { name: 'Vouchers',      icon: Ticket,          path: '/vouchers',  feature: 'vouchers' },
  { name: 'Reports',       icon: BarChart3,       path: '/reports',   feature: 'reports' },
  { name: 'Settings',      icon: Settings,        path: '/settings',  feature: 'settings' },
]

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }) {
  const { settings } = useSettings()
  const { user, logout } = useAuth()

  // Filter items based on what the seller has enabled for this owner
  const filteredItems = NAV_ITEMS.filter(item => 
    !user?.features || user.features.includes(item.feature) || item.feature === 'dashboard'
  )

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src="/logo.webp" alt="Kharchaa Logo" style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
        </div>
        {!collapsed && (
          <div className="sidebar-logo-text">
            <span className="sidebar-brand">Kharchaa</span>
            <span className="sidebar-tagline">Smart Billing</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {filteredItems.map(({ path, icon: Icon, name }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={onMobileClose}
            title={collapsed ? name : undefined}
          >
            <Icon size={20} className="sidebar-link-icon" />
            {!collapsed && <span className="sidebar-link-label">{name}</span>}
            {collapsed && <span className="sidebar-tooltip">{name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer / User Info */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.name[0]}</div>
          {!collapsed && (
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.name}</p>
              <p className="sidebar-user-role">{user?.role}</p>
            </div>
          )}
          {!collapsed && (
            <button className="btn-logout" onClick={logout} title="Logout">
              <LogOut size={16} />
            </button>
          )}
        </div>
        
        {!collapsed && (
          <div className="sidebar-shop-mini">
            <p>{settings.shop_name} • Pro</p>
          </div>
        )}
      </div>
    </aside>
  )
}
