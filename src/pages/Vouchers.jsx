import { useState } from 'react'
import { Plus, Search, Ticket, X, Check, Calendar, TrendingUp } from 'lucide-react'
import { useVouchers } from '../hooks/useVouchers'
import CustomDatePicker from '../components/ui/CustomDatePicker'
import CustomDropdown from '../components/ui/CustomDropdown'

export default function Vouchers() {
  const { filtered, search, setSearch, saveVoucher, toggleVoucher } = useVouchers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percent', value: '', min_order: '', max_uses: '', campaign: '', valid_until: '', is_active: true })

  const handleSave = () => {
    if (!form.code || !form.value) return 
    saveVoucher(form)
    setIsModalOpen(false)
    setForm({ code: '', type: 'percent', value: '', min_order: '', max_uses: '', campaign: '', valid_until: '', is_active: true })
  }

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Vouchers & Campaigns</h1>
          <p className="page-subtitle">Create discount codes for festivals and special events</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Ticket size={18} /> Create Voucher
        </button>
      </div>

      <div className="inv-filters" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="inv-search-wrap">
          <Search size={15} className="inv-search-icon" />
          <input
            className="form-input inv-search"
            placeholder="Search by code or campaign name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="orders-grid">
        {filtered.map(v => (
          <div key={v.id} className={`card order-card ${!v.is_active ? 'row-inactive' : ''}`}>
            <div className="order-card-header" style={{ background: 'var(--primary-ghost)' }}>
              <div>
                <span className="order-card-id">{v.campaign}</span>
                <h3 className="order-card-title">{v.code}</h3>
              </div>
              <span className={`badge ${v.is_active ? 'badge-success' : 'badge-danger'}`}>
                {v.is_active ? 'Active' : 'Expired'}
              </span>
            </div>
            <div className="order-card-body">
              <div className="order-payment-strip" style={{ background: 'var(--surface)' }}>
                <div className="payment-item">
                  <span className="label">Value</span>
                  <span className="value" style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                    {v.type === 'percent' ? `${v.value}% OFF` : `₹${v.value} OFF`}
                  </span>
                </div>
                <div className="payment-item">
                  <span className="label">Min. Order</span>
                  <span className="value">₹{v.min_order}</span>
                </div>
              </div>

              <div className="order-info-item" style={{ marginTop: 'var(--space-2)' }}>
                <Calendar size={14} /> <span>Valid until: {v.valid_until}</span>
              </div>
              
              <div style={{ marginTop: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span>Usage</span>
                  <span>{v.used} / {v.max_uses}</span>
                </div>
                <div className="stock-bar-wrap" style={{ width: '100%', height: '6px' }}>
                  <div className="stock-bar" style={{ width: `${(v.used / v.max_uses) * 100}%`, background: 'var(--secondary)' }} />
                </div>
              </div>
            </div>
            <div className="order-card-footer">
              <button className={`btn btn-sm btn-full ${v.is_active ? 'btn-secondary' : 'btn-primary'}`} onClick={() => toggleVoucher(v.id)}>
                {v.is_active ? 'Deactivate' : 'Reactivate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box animate-fadeInUp" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Campaign Voucher</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Campaign Name</label>
                <input className="form-input" placeholder="e.g. Christmas 2026 Special" value={form.campaign} onChange={e => setForm({...form, campaign: e.target.value})} />
              </div>
              <div className="modal-row-2">
                <div className="form-group">
                  <label className="form-label">Voucher Code</label>
                  <input className="form-input" placeholder="e.g. XMAS30" value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Type</label>
                    <CustomDropdown 
                      value={form.type}
                      options={[
                        { label: 'Percent %', value: 'percent' },
                        { label: 'Flat ₹', value: 'flat' }
                      ]}
                      onChange={val => setForm({...form, type: val})}
                      labelKey="label"
                      valueKey="value"
                    />
                </div>
              </div>
              <div className="modal-row-2">
                <div className="form-group">
                  <label className="form-label">Discount Value</label>
                  <input className="form-input" type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Min. Order (₹)</label>
                  <input className="form-input" type="number" value={form.min_order} onChange={e => setForm({...form, min_order: e.target.value})} />
                </div>
              </div>
              <div className="modal-row-2">
                <div className="form-group">
                  <label className="form-label">Max Uses</label>
                  <input className="form-input" type="number" value={form.max_uses} onChange={e => setForm({...form, max_uses: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Valid Until</label>
                  <CustomDatePicker 
                    value={form.valid_until} 
                    onChange={val => setForm({...form, valid_until: val})} 
                    openUpwards={true} 
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><Check size={16} /> Launch Campaign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
