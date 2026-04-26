import { Package, Check, AlertTriangle, X } from 'lucide-react'

export default function InventoryStats({ stats }) {
  const items = [
    { label: 'Total Products', value: stats.total,  color: 'var(--primary)',  icon: Package },
    { label: 'Active',         value: stats.active, color: 'var(--success)',  icon: Check },
    { label: 'Low Stock',      value: stats.low,    color: 'var(--warning)',  icon: AlertTriangle },
    { label: 'Out of Stock',   value: stats.out,    color: 'var(--danger)',   icon: X },
  ]

  return (
    <div className="inv-stats">
      {items.map(s => (
        <div className="inv-stat-card" key={s.label} style={{ '--s-color': s.color }}>
          <s.icon size={18} />
          <span className="inv-stat-value">{s.value}</span>
          <span className="inv-stat-label">{s.label}</span>
        </div>
      ))}
    </div>
  )
}
