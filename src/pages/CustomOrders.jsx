import { useState, useRef, useEffect } from 'react'
import { Plus, Filter, Calendar as CalendarIcon, LayoutGrid, X, Check, FileText, ChevronDown } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { useSettings } from '../hooks/useSettings'
import OrderCard from '../components/orders/OrderCard'
import PrintPreview from '../components/billing/PrintPreview'
import CustomDatePicker from '../components/ui/CustomDatePicker'
import toast from 'react-hot-toast'
import './CustomOrders.css'

import CustomDropdown from '../components/ui/CustomDropdown'

export default function CustomOrders() {
  const { orders, filtered, filterStatus, setFilterStatus, addOrder, updateStatus, updateOrder } = useOrders()
  const { settings } = useSettings()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [previewBill, setPreviewBill] = useState(null)
  const [paymentPromptOrder, setPaymentPromptOrder] = useState(null)
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '', item: '', weight: '1 kg', 
    flavor: '', message: '', delivery_date: '', delivery_time: '', 
    total_amount: '', advance_paid: ''
  })

  const handleSave = () => {
    const newOrder = { ...form, status: 'pending' }
    addOrder(newOrder)
    setIsModalOpen(false)
    setForm({
      customer_name: '', customer_phone: '', item: '', weight: '1 kg', 
      flavor: '', message: '', delivery_date: '', delivery_time: '', 
      total_amount: '', advance_paid: ''
    })
  }

  const generateOrderBill = (order) => {
    const totalAmount = Number(order.total_amount)
    const gstRate = settings.gst || 5 // Get global GST setting
    
    // Inclusive GST calculation so the final total matches what the user entered
    const subtotal = totalAmount / (1 + (gstRate / 100))
    const gstAmount = totalAmount - subtotal

    return {
      id: order.id,
      customer: { name: order.customer_name, phone: order.customer_phone },
      items: [{ name: `${order.item} (${order.weight})`, qty: 1, price: subtotal }],
      subtotal: subtotal,
      gst_rate: gstRate,
      gst_amount: gstAmount,
      discount: 0,
      total: totalAmount,
      advance_paid: Number(order.advance_paid),
    }
  }

  const handleStatusUpdate = (orderId, nextStatus) => {
    const order = orders.find(o => o.id === orderId)
    const balance = order.total_amount - order.advance_paid

    if (nextStatus === 'delivered' && balance > 0) {
      setPaymentPromptOrder(order)
    } else {
      updateStatus(orderId, nextStatus)
    }
  }

  const handleConfirmPayment = () => {
    if (!paymentPromptOrder) return
    // Update advance_paid to full amount, and set to delivered
    updateOrder(paymentPromptOrder.id, { 
      advance_paid: paymentPromptOrder.total_amount, 
      status: 'delivered' 
    })
    toast.success('Payment collected and order delivered!')
    
    // Auto-generate the final bill (balance will be 0)
    setPreviewBill(generateOrderBill({ 
      ...paymentPromptOrder, 
      advance_paid: paymentPromptOrder.total_amount 
    }))
    
    setPaymentPromptOrder(null)
  }

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Custom Orders</h1>
          <p className="page-subtitle">Track custom cake bookings and production</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> New Booking
        </button>
      </div>

      <div className="order-controls">
        <div className="cat-pills">
          {['all', 'pending', 'in_production', 'ready', 'delivered'].map(s => (
            <button 
              key={s} 
              className={`cat-pill ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === 'all' ? 'All Orders' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="orders-grid">
        {filtered.map(order => (
          <OrderCard 
            key={order.id} 
            order={order} 
            onStatusUpdate={handleStatusUpdate} 
            onShowReceipt={() => setPreviewBill(generateOrderBill(order))} 
          />
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setIsModalOpen(false)}>
          <div className="modal-box animate-fadeInUp" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Cake Booking</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="modal-row-2">
                <div className="form-group"><label className="form-label">Customer Name</label><input className="form-input" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.customer_phone} onChange={e => setForm({...form, customer_phone: e.target.value})} maxLength={10} /></div>
              </div>
              <div className="form-group"><label className="form-label">Cake Description (Type & Flavor)</label><input className="form-input" placeholder="e.g. Red Velvet with Cream Cheese" value={form.item} onChange={e => setForm({...form, item: e.target.value})} /></div>
              <div className="modal-row-2">
                <div className="form-group"><label className="form-label">Weight</label><input className="form-input" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Message on Cake</label><input className="form-input" value={form.message} onChange={e => setForm({...form, message: e.target.value})} /></div>
              </div>
              <div className="modal-row-2">
                <div className="form-group">
                  <label className="form-label">Delivery Date</label>
                  <CustomDatePicker 
                    value={form.delivery_date} 
                    onChange={val => setForm({...form, delivery_date: val})} 
                    openUpwards={true} 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Delivery Time</label>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <CustomDropdown 
                      value={form.delivery_time ? form.delivery_time.split(':')[0] : '12'}
                      options={['01','02','03','04','05','06','07','08','09','10','11','12']}
                      onChange={val => {
                        const m = form.delivery_time ? form.delivery_time.split(':')[1].split(' ')[0] : '00'
                        const a = form.delivery_time ? form.delivery_time.split(' ')[1] : 'PM'
                        setForm({...form, delivery_time: `${val}:${m} ${a}`})
                      }}
                      openUpwards={true}
                    />
                    <span style={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>:</span>
                    <CustomDropdown 
                      value={form.delivery_time ? form.delivery_time.split(':')[1].split(' ')[0] : '00'}
                      options={['00','15','30','45']}
                      onChange={val => {
                        const h = form.delivery_time ? form.delivery_time.split(':')[0] : '12'
                        const a = form.delivery_time ? form.delivery_time.split(' ')[1] : 'PM'
                        setForm({...form, delivery_time: `${h}:${val} ${a}`})
                      }}
                      openUpwards={true}
                    />
                    <CustomDropdown 
                      value={form.delivery_time ? form.delivery_time.split(' ')[1] : 'PM'}
                      options={['AM', 'PM']}
                      onChange={val => {
                        const h = form.delivery_time ? form.delivery_time.split(':')[0] : '12'
                        const m = form.delivery_time ? form.delivery_time.split(':')[1].split(' ')[0] : '00'
                        setForm({...form, delivery_time: `${h}:${m} ${val}`})
                      }}
                      openUpwards={true}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-row-2">
                <div className="form-group"><label className="form-label">Total Amount (₹)</label><input className="form-input" type="number" value={form.total_amount} onChange={e => setForm({...form, total_amount: e.target.value})} /></div>
                <div className="form-group"><label className="form-label">Advance Paid (₹)</label><input className="form-input" type="number" value={form.advance_paid} onChange={e => setForm({...form, advance_paid: e.target.value})} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}><Check size={16} /> Book Order</button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Collection Prompt */}
      {paymentPromptOrder && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setPaymentPromptOrder(null)}>
          <div className="modal-box animate-fadeInUp" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title-sm">Collect Balance</h2>
              <button className="btn-close-sm" onClick={() => setPaymentPromptOrder(null)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ textAlign: 'center', padding: 'var(--space-4) 0' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-light)', marginBottom: 'var(--space-2)' }}>
                Pending Balance for <strong>{paymentPromptOrder.customer_name}</strong>
              </p>
              <h1 style={{ fontSize: '32px', color: 'var(--danger)', marginBottom: 'var(--space-4)' }}>
                ₹{(paymentPromptOrder.total_amount - paymentPromptOrder.advance_paid).toFixed(2)}
              </h1>
              <p style={{ fontSize: '13px', background: 'var(--bg-secondary)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)' }}>
                Marking this order as delivered will record the full payment collection.
              </p>
            </div>
            <div className="modal-footer" style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setPaymentPromptOrder(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--success)' }} onClick={handleConfirmPayment}>
                Collect & Deliver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official Print Preview */}
      {previewBill && (
        <PrintPreview bill={previewBill} onClose={() => setPreviewBill(null)} />
      )}
    </div>
  )
}
