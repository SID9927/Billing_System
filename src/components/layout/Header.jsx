import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Sun, Moon, Search, Plus, X, Package, ClipboardList } from 'lucide-react'
import { useGlobalSearch } from '../../hooks/useGlobalSearch'
import { useNotifications } from '../../hooks/useNotifications'
import './Header.css'

const PAGE_TITLES = {
  '/':          { title: 'Dashboard',      subtitle: 'Good morning! Here\'s your bakery overview.' },
  '/billing':   { title: 'New Bill',        subtitle: 'Create a new customer bill.' },
  '/orders':    { title: 'Custom Orders',   subtitle: 'Manage cake orders and deliveries.' },
  '/inventory': { title: 'Inventory',       subtitle: 'Track your products and stock levels.' },
  '/customers': { title: 'Customers',       subtitle: 'Manage your customer base.' },
  '/vouchers':  { title: 'Vouchers',        subtitle: 'Create discount campaigns and coupon codes.' },
  '/reports':   { title: 'Reports',         subtitle: 'Daily & monthly sales analytics.' },
  '/settings':  { title: 'Settings',        subtitle: 'Configure your shop and billing preferences.' },
}

export default function Header({ onToggleSidebar, onMobileMenu }) {
  const location = useLocation()
  const [darkMode, setDarkMode] = useState(false)
  
  // Search & Notifications logic
  const { query, setQuery, results, isOpen: isSearchOpen, setIsOpen: setIsSearchOpen } = useGlobalSearch()
  const { notifs, clearNotif, isOpen: isNotifOpen, setIsOpen: setIsNotifOpen } = useNotifications()
  
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Kharchaa', subtitle: '' }

  const toggleDark = () => {
    setDarkMode(d => !d)
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark')
  }

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="btn btn-ghost btn-icon header-toggle desktop-only" onClick={onToggleSidebar}><Menu size={20} /></button>
        <button className="btn btn-ghost btn-icon header-toggle mobile-only" onClick={onMobileMenu}><Menu size={20} /></button>

        <div className="header-page-info">
          <h1 className="header-title">{pageInfo.title}</h1>
          <p className="header-subtitle">{pageInfo.subtitle}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Search Input & Results */}
        <div className="header-search-container desktop-only">
          <div className="header-search">
            <Search size={16} className="header-search-icon" />
            <input
              type="text"
              placeholder="Search products, orders…"
              className="header-search-input"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setIsSearchOpen(true); }}
              onFocus={() => setIsSearchOpen(true)}
            />
            {query && <X size={14} className="search-clear" onClick={() => { setQuery(''); setIsSearchOpen(false); }} />}
          </div>

          {isSearchOpen && results.length > 0 && (
            <div className="search-dropdown animate-fadeInUp">
              {results.map(res => (
                <div key={res.id} className="search-item" onClick={() => setIsSearchOpen(false)}>
                  {res.type === 'product' ? <Package size={16} /> : <ClipboardList size={16} />}
                  <div>
                    <p className="search-item-title">{res.title}</p>
                    <p className="search-item-meta">{res.category} • {res.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button className="btn btn-ghost btn-icon" onClick={toggleDark}>
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Dropdown */}
        <div className="header-notif-container">
          <button className="btn btn-ghost btn-icon header-notif" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell size={18} />
            {notifs.length > 0 && <span className="notif-badge">{notifs.length}</span>}
          </button>

          {isNotifOpen && (
            <div className="notif-dropdown animate-fadeInUp">
              <div className="notif-header">
                <h3>Notifications</h3>
                <span>{notifs.length} New</span>
              </div>
              <div className="notif-list">
                {notifs.map(n => (
                  <div key={n.id} className="notif-item" onClick={() => clearNotif(n.id)}>
                    <div className={`notif-icon-circle ${n.type}`} />
                    <div className="notif-content">
                      <p className="notif-title">{n.title}</p>
                      <p className="notif-desc">{n.desc}</p>
                      <p className="notif-time">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              {notifs.length === 0 && <div className="notif-empty">All caught up! 🎉</div>}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
