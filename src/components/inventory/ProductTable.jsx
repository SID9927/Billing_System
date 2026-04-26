import { Scale, Tag, Plus, Edit2, Trash2, Clock, Percent } from 'lucide-react'
import { CATEGORIES } from '../../hooks/useInventory'

export default function ProductTable({ products, onEdit, onDelete, onAddStock, onToggleActive }) {
  const getCatMeta = (name) => CATEGORIES.find(c => c.name === name) || CATEGORIES[7]

  const stockStatus = (p) => {
    if (p.stock_qty === 0) return { label: 'Out of Stock', cls: 'badge-danger' }
    if (p.stock_qty <= p.low_stock_threshold) return { label: 'Low Stock', cls: 'badge-warning' }
    return { label: 'In Stock', cls: 'badge-success' }
  }

  const margin = (p) => {
    if (!p.cost_price || !p.selling_price) return null
    return (((p.selling_price - p.cost_price) / p.selling_price) * 100).toFixed(1)
  }

  return (
    <div className="inv-table-wrap card">
      <table className="inv-table">
        <thead>
          <tr>
            <th style={{ width: '40%' }}>Product Details</th>
            <th>Pricing & Margin</th>
            <th>Inventory</th>
            <th>Shelf & Tax</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => {
            const cat = getCatMeta(p.category)
            const ss = stockStatus(p)
            const mgn = margin(p)
            return (
              <tr key={p.id} className={!p.is_active ? 'row-inactive' : ''}>
                <td>
                  <div className="prod-name-cell">
                    <div className="prod-info-main">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <p className="prod-name">{p.name}</p>
                        <span className="badge badge-primary" style={{ fontSize: '10px', padding: '2px 8px' }}>{p.category}</span>
                      </div>
                      <div className="prod-sub-info">
                        <span className="prod-hsn">HSN: {p.hsn}</span>
                        <span className={`type-tag ${p.type}`}>
                          {p.type === 'weight' ? <Scale size={10} /> : <Tag size={10} />}
                          {p.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="pricing-cell">
                    <p className="price-main">₹{p.selling_price}<span className="price-unit">/{p.unit}</span></p>
                    <div className="pricing-meta">
                      <span className="price-cost">Cost: ₹{p.cost_price || '—'}</span>
                      {mgn && <span className="margin-tag" style={{ background: mgn > 30 ? 'var(--success-ghost)' : 'var(--warning-ghost)', color: mgn > 30 ? 'var(--success)' : 'var(--warning)' }}>{mgn}%</span>}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="stock-cell-compact">
                    <div className="stock-header">
                      <span className={`stock-qty ${p.stock_qty <= p.low_stock_threshold ? 'low' : ''}`}>
                        {p.stock_qty} {p.unit}
                      </span>
                      <button className="btn-add-stock-mini" onClick={() => onAddStock(p)}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="stock-bar-wrap">
                      <div className="stock-bar" style={{
                        width: `${Math.min(100, (p.stock_qty / (p.low_stock_threshold * 3)) * 100)}%`,
                        background: p.stock_qty === 0 ? 'var(--danger)' : p.stock_qty <= p.low_stock_threshold ? 'var(--warning)' : 'var(--success)',
                      }} />
                    </div>
                  </div>
                </td>
                <td>
                  <div className="details-cell-compact">
                    <span className="detail-item"><Clock size={12} /> {p.shelf_life_days}d</span>
                    <span className="detail-item"><Percent size={12} /> {p.gst_rate}%</span>
                  </div>
                </td>
                <td>
                  <div className="status-col-compact">
                    <span className={`badge-dot ${ss.cls}`}>{ss.label}</span>
                    <span className={`status-label ${p.is_active ? 'active' : 'inactive'}`}>
                      {p.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </td>
                <td>
                  <div className="action-btns-compact">
                    <button className="btn-icon-mini" onClick={() => onEdit(p)} title="Edit"><Edit2 size={14} /></button>
                    <button className="btn-icon-mini delete" onClick={() => onDelete(p.id)} title="Delete"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
