import { useState } from 'react'
import { Plus, Search, UserPlus, X, Check } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import CustomerTable from '../components/customers/CustomerTable'

export default function Customers() {
  const { filtered, search, setSearch, saveCustomer, deleteCustomer } = useCustomers()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCust, setEditingCust] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '' })

  const handleOpenModal = (cust = null) => {
    if (cust) {
      setEditingCust(cust)
      setForm({ name: cust.name, phone: cust.phone, email: cust.email || '' })
    } else {
      setEditingCust(null)
      setForm({ name: '', phone: '', email: '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.phone) return 
    saveCustomer(form, editingCust?.id)
    setIsModalOpen(false)
  }

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">Manage your customer database and loyalty</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <UserPlus size={18} /> Add Customer
        </button>
      </div>

      <div className="inv-filters" style={{ marginBottom: 'var(--space-5)' }}>
        <div className="inv-search-wrap">
          <Search size={15} className="inv-search-icon" />
          <input
            className="form-input inv-search"
            placeholder="Search by name or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state card">
          <UserPlus size={48} />
          <h3>No customers found</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>Add Your First Customer</button>
        </div>
      ) : (
        <CustomerTable 
          customers={filtered} 
          onEdit={handleOpenModal} 
          onDelete={deleteCustomer} 
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box animate-fadeInUp" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingCust ? 'Edit Customer' : 'New Customer'}</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Priya Sharma" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="10-digit mobile" maxLength={10} />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Optional" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><Check size={16} /> Save Customer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
