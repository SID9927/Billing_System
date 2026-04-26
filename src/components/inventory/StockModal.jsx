import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function StockModal({ product, onClose, onConfirm }) {
  const [qty, setQty] = useState('')

  if (!product) return null

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="confirm-box animate-fadeInUp" onClick={e => e.stopPropagation()}>
        <div className="confirm-icon">📦</div>
        <h3>Add Stock</h3>
        <p><strong>{product.name}</strong></p>
        <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Current: {product.stock_qty} {product.unit}</p>
        <div className="form-group" style={{ marginTop: '1rem', textAlign: 'left' }}>
          <label className="form-label">Quantity to Add</label>
          <input className="form-input" type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} autoFocus />
        </div>
        <div className="confirm-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onConfirm(parseInt(qty))}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}
