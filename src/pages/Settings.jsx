import { useState } from 'react'
import { useSettings } from '../hooks/useSettings'
import { Store, Receipt, Shield, Users, Save, Globe, Bell, X } from 'lucide-react'
import CustomDropdown from '../components/ui/CustomDropdown'
import toast from 'react-hot-toast'
import './Settings.css'

export default function Settings() {
  const { settings, updateSettings } = useSettings()
  const [activeTab, setActiveTab] = useState('shop')
  const [form, setForm] = useState(settings)

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false)
  const [staffForm, setStaffForm] = useState({ name: '', role: 'Cashier', phone: '', email: '', password: '' })
  const [staffList, setStaffList] = useState(() => {
    const saved = localStorage.getItem('kharchaa_staff_list')
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Super Admin (You)', role: 'Full Access', isOnline: true }
    ]
  })

  const TABS = [
    { id: 'shop',     label: 'Shop Profile', icon: Store },
    { id: 'billing',  label: 'Billing & Tax', icon: Receipt },
    { id: 'staff',    label: 'Staff / Users', icon: Users },
    { id: 'security', label: 'Security',      icon: Shield },
  ]

  const handleSave = () => {
    updateSettings(form)
    toast.success('Settings saved successfully')
  }

  const handleAddStaff = () => {
    if (!staffForm.name) return toast.error('Staff name is required')
    if (!staffForm.email || !staffForm.password) return toast.error('Login credentials required')
    
    const newList = [...staffList, { ...staffForm, id: Date.now(), isOnline: false }]
    setStaffList(newList)
    localStorage.setItem('kharchaa_staff_list', JSON.stringify(newList))
    
    setIsStaffModalOpen(false)
    setStaffForm({ name: '', role: 'Cashier', phone: '', email: '', password: '' })
    toast.success('Staff member added')
  }

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your bakery profile and system preferences</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <Save size={18} /> Save Changes
        </button>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-content card">
          {activeTab === 'shop' && (
            <div className="settings-section animate-fadeIn">
              <h2 className="settings-section-title">Shop Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Shop Name</label>
                  <input className="form-input" value={form.shop_name} onChange={e => setForm({...form, shop_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">GSTIN</label>
                  <input className="form-input" value={form.gstin} onChange={e => setForm({...form, gstin: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Shop Address</label>
                  <textarea className="form-input" rows="3" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="settings-section animate-fadeIn">
              <h2 className="settings-section-title">Billing Preferences</h2>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">Bill Footer Note</label>
                  <textarea className="form-input" rows="3" value={form.bill_footer} onChange={e => setForm({...form, bill_footer: e.target.value})} />
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <h3 className="toggle-title">Enable GST Calculations</h3>
                    <p className="toggle-desc">Automatically add tax to every bill based on category rates</p>
                  </div>
                  <button 
                    className={`toggle-btn ${form.tax_enabled ? 'on' : 'off'}`}
                    onClick={() => setForm({...form, tax_enabled: !form.tax_enabled})}
                  >
                    {form.tax_enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <h3 className="toggle-title">Auto-Print Bill</h3>
                    <p className="toggle-desc">Automatically trigger print dialog after confirming a bill</p>
                  </div>
                  <button 
                    className={`toggle-btn ${form.auto_print ? 'on' : 'off'}`}
                    onClick={() => setForm({...form, auto_print: !form.auto_print})}
                  >
                    {form.auto_print ? 'ON' : 'OFF'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="settings-section animate-fadeIn">
              <h2 className="settings-section-title">Staff Management</h2>
              <div className="staff-list">
                {staffList.map(staff => (
                  <div className="staff-item" key={staff.id}>
                    <div className="staff-avatar">{staff.name.charAt(0).toUpperCase()}</div>
                    <div className="staff-info">
                      <p className="staff-name">{staff.name}</p>
                      <p className="staff-role">{staff.role}</p>
                    </div>
                    {staff.isOnline ? (
                      <span className="badge badge-success">Online</span>
                    ) : (
                      <span className="badge" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>Offline</span>
                    )}
                  </div>
                ))}
                <button className="btn btn-secondary btn-full" style={{ marginTop: '1rem' }} onClick={() => setIsStaffModalOpen(true)}>+ Add Staff Member</button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section animate-fadeIn">
              <h2 className="settings-section-title">Security Settings</h2>
              
              <div className="security-card">
                <h3 className="settings-subsection-title">Change Password</h3>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label className="form-label">Current Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}>Update Password</button>
              </div>

              <div className="settings-toggle-row" style={{ marginTop: 'var(--space-8)' }}>
                <div>
                  <h3 className="toggle-title">Two-Factor Authentication</h3>
                  <p className="toggle-desc">Add an extra layer of security to your account using an authenticator app</p>
                </div>
                <button className="toggle-btn off">Disabled</button>
              </div>

              <div className="security-activity" style={{ marginTop: 'var(--space-8)' }}>
                <h3 className="settings-subsection-title">Recent Login Activity</h3>
                <div className="activity-list">
                  {[
                    { device: 'Windows PC • Mumbai', time: 'Today, 10:24 AM', status: 'Current Session' },
                    { device: 'iPhone 13 • Delhi', time: 'Yesterday, 08:15 PM', status: 'Logged Out' },
                    { device: 'Chrome on MacOS • Bangalore', time: '24 Apr, 11:40 AM', status: 'Logged Out' },
                  ].map((act, i) => (
                    <div key={i} className="activity-item" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-3) 0', borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{act.device}</p>
                        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{act.time}</p>
                      </div>
                      <span className={`badge ${act.status === 'Current Session' ? 'badge-success' : ''}`} style={{ fontSize: '10px' }}>{act.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isStaffModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStaffModalOpen(false)}>
          <div className="modal-box animate-scaleIn" onClick={e => e.stopPropagation()} style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>Add New Staff</h2>
              <button className="btn-close" onClick={() => setIsStaffModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body form-grid">
              <div className="form-group full-width">
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={staffForm.name} onChange={e => setStaffForm({...staffForm, name: e.target.value})} placeholder="e.g. John Doe" />
              </div>
              <div className="form-group">
                <label className="form-label">Email / Login ID *</label>
                <input className="form-input" value={staffForm.email} onChange={e => setStaffForm({...staffForm, email: e.target.value})} placeholder="staff@business.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Login Password *</label>
                <input className="form-input" type="password" value={staffForm.password} onChange={e => setStaffForm({...staffForm, password: e.target.value})} placeholder="••••••••" />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <CustomDropdown 
                  value={staffForm.role}
                  onChange={val => setStaffForm({...staffForm, role: val})}
                  options={['Cashier', 'Manager', 'Chef', 'Delivery']}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input className="form-input" value={staffForm.phone} onChange={e => setStaffForm({...staffForm, phone: e.target.value})} placeholder="Mobile Number" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsStaffModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddStaff}>Add Staff</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
