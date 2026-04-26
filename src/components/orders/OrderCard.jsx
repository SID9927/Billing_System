import { Calendar, Clock, User, Phone, IndianRupee, MessageSquare, ChevronRight } from 'lucide-react'

const STATUS_MAP = {
  pending:       { label: 'Pending',       cls: 'badge-warning', next: 'in_production' },
  in_production: { label: 'In Production', cls: 'badge-info',    next: 'ready' },
  ready:         { label: 'Ready',         cls: 'badge-success', next: 'delivered' },
  delivered:     { label: 'Delivered',     cls: 'badge-primary', next: null },
}

export default function OrderCard({ order, onStatusUpdate, onShowReceipt }) {
  const s = STATUS_MAP[order.status]
  const balance = order.total_amount - order.advance_paid

  return (
    <div className="card order-card animate-fadeIn">
      <div className="order-card-header">
        <div>
          <span className="order-card-id">{order.id}</span>
          <h3 className="order-card-title">{order.item} ({order.weight})</h3>
        </div>
        <span className={`badge ${s.cls}`}>{s.label}</span>
      </div>

      <div className="order-card-body">
        <div className="order-info-item">
          <User size={14} /> <span>{order.customer_name}</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          <Phone size={14} /> <span>{order.customer_phone}</span>
        </div>
        
        <div className="order-info-item">
          <Calendar size={14} /> <span>{order.delivery_date}</span>
          <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span>
          <Clock size={14} /> <span>{order.delivery_time || 'Anytime'}</span>
        </div>

        <div className="order-message">
          <MessageSquare size={14} />
          <p>"{order.message}"</p>
        </div>

        <div className="order-payment-strip">
          <div className="payment-item">
            <span className="label">Total</span>
            <span className="value">₹{order.total_amount}</span>
          </div>
          <div className="payment-item">
            <span className="label">Paid</span>
            <span className="value success">₹{order.advance_paid}</span>
          </div>
          {balance > 0 && (
            <div className="payment-item">
              <span className="label">Due</span>
              <span className="value danger">₹{balance}</span>
            </div>
          )}
        </div>
      </div>

      <div className="order-card-footer" style={{ display: 'flex', gap: '8px' }}>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={onShowReceipt}
          style={{ flex: 1 }}
        >
          Receipt
        </button>
        {s.next && (
          <button 
            className="btn btn-primary btn-sm" 
            style={{ flex: 2 }}
            onClick={() => onStatusUpdate(order.id, s.next)}
          >
            Mark as {s.next.replace('_', ' ')} <ChevronRight size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
