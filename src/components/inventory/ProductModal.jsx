import { useState, useEffect } from 'react'
import { X, Check, Tag, Scale } from 'lucide-react'
import { CATEGORIES } from '../../hooks/useInventory'
import CustomDropdown from '../ui/CustomDropdown'

const GST_SLABS = [0, 5, 12, 18, 28]
const UNITS     = ['piece', 'kg', 'g', 'litre', 'ml', 'box', 'dozen', 'pack']

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }) {
  const [form, setForm] = useState({
    name: '', category: 'Cakes', type: 'fixed', unit: 'piece',
    mrp: '', selling_price: '', cost_price: '',
    gst_rate: 5, hsn: '1905', stock_qty: '', low_stock_threshold: '', shelf_life_days: '',
    is_active: true,
  })

  useEffect(() => {
    if (editingProduct) setForm({ ...editingProduct })
    else setForm({
      name: '', category: 'Cakes', type: 'fixed', unit: 'piece',
      mrp: '', selling_price: '', cost_price: '',
      gst_rate: 5, hsn: '1905', stock_qty: '', low_stock_threshold: '', shelf_life_days: '',
      is_active: true,
    })
  }, [editingProduct, isOpen])

  const handleCategoryChange = (cat) => {
    const meta = CATEGORIES.find(c => c.name === cat) || CATEGORIES[7]
    setForm(f => ({ ...f, category: cat, gst_rate: meta.gst, hsn: meta.hsn }))
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay animate-fadeIn" onClick={onClose}>
      <div className="modal-box animate-fadeInUp" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="modal-row-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <CustomDropdown
                value={form.category}
                options={CATEGORIES.map(c => c.name)}
                onChange={handleCategoryChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Pricing Type *</label>
              <div className="type-toggle">
                <button className={`type-toggle-btn ${form.type === 'fixed' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'fixed' }))}>
                  <Tag size={14} /> Fixed
                </button>
                <button className={`type-toggle-btn ${form.type === 'weight' ? 'active' : ''}`} onClick={() => setForm(f => ({ ...f, type: 'weight' }))}>
                  <Scale size={14} /> Weight
                </button>
              </div>
            </div>
          </div>
          <div className="modal-row-3">
            <div className="form-group"><label className="form-label">MRP</label><input className="form-input" type="number" value={form.mrp} onChange={e => setForm(f => ({ ...f, mrp: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Selling *</label><input className="form-input" type="number" value={form.selling_price} onChange={e => setForm(f => ({ ...f, selling_price: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Cost</label><input className="form-input" type="number" value={form.cost_price} onChange={e => setForm(f => ({ ...f, cost_price: e.target.value }))} /></div>
          </div>
          <div className="modal-row-3">
            <div className="form-group">
              <label className="form-label">GST %</label>
              <CustomDropdown
                value={form.gst_rate}
                options={GST_SLABS.map(g => ({ label: `${g}%`, value: g }))}
                onChange={val => setForm(f => ({ ...f, gst_rate: val }))}
                labelKey="label"
                valueKey="value"
                openUpwards={true}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <CustomDropdown
                value={form.unit}
                options={UNITS}
                onChange={val => setForm(f => ({ ...f, unit: val }))}
                openUpwards={true}
              />
            </div>
            <div className="form-group"><label className="form-label">HSN</label><input className="form-input" value={form.hsn} onChange={e => setForm(f => ({ ...f, hsn: e.target.value }))} /></div>
          </div>
          <div className="modal-row-3">
            <div className="form-group"><label className="form-label">Stock *</label><input className="form-input" type="number" value={form.stock_qty} onChange={e => setForm(f => ({ ...f, stock_qty: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Low Stock *</label><input className="form-input" type="number" value={form.low_stock_threshold} onChange={e => setForm(f => ({ ...f, low_stock_threshold: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Shelf Life</label><input className="form-input" type="number" value={form.shelf_life_days} onChange={e => setForm(f => ({ ...f, shelf_life_days: e.target.value }))} /></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => onSave(form)}><Check size={16} /> Save</button>
        </div>
      </div>
    </div>
  )
}
