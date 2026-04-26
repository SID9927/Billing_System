import { AlertTriangle, ClipboardList } from 'lucide-react'
import { Link } from 'react-router-dom'

const STATUS_LABELS = {
  pending:       { label: 'Pending',       cls: 'badge-warning' },
  in_production: { label: 'In Production', cls: 'badge-info' },
  ready:         { label: 'Ready',         cls: 'badge-success' },
}

export default function DashboardAlerts({ lowStock, pendingOrders }) {
  return (
    <div className="dashboard-right-col">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><AlertTriangle size={18} style={{ color: 'var(--warning)' }} /> Low Stock</h2>
          <Link to="/inventory" className="btn btn-ghost btn-sm">Manage</Link>
        </div>
        {lowStock.map((item, i) => (
          <div className="alert-row" key={i}>
            <div><p className="alert-name">{item.name}</p><p className="alert-stock">{item.stock} {item.unit} left</p></div>
            <span className="badge badge-danger">Low</span>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><ClipboardList size={18} /> Pending Orders</h2>
          <Link to="/orders" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {pendingOrders.map((order) => {
          const s = STATUS_LABELS[order.status]
          return (
            <div className="order-row" key={order.id}>
              <div><p className="order-id">{order.id} — {order.customer}</p><p className="order-item">{order.item} · {order.due}</p></div>
              <span className={`badge ${s.cls}`}>{s.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
