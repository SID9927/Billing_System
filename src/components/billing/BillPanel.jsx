import { Receipt, Trash2, MessageCircle, Printer, IndianRupee } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSettings } from '../../hooks/useSettings'
import CustomDropdown from '../ui/CustomDropdown'

export default function BillPanel({ 
  cart, updateQty, customer, setCustomer, 
  discount, setDiscount, discountType, setDiscountType, 
  subtotal, gstAmount, discountAmount, total,
  payment, setPayment, onSave
}) {
  const PAYMENT_MODES = ['Cash', 'UPI', 'Card', 'Split']
  const { settings } = useSettings()

  const handleWhatsApp = () => {
    if (!customer.phone) return toast.error('Enter customer phone number')
    if (cart.length === 0) return toast.error('Add items first')
      
    const divider = '━━━━━━━━━━━━━━━━'
    const itemsText = cart.map(i => `*${i.name}*\n${i.qty} qty × ₹${i.price} = *₹${(i.price * i.qty).toFixed(2)}*`).join('\n\n')
    
    const message = 
`*${settings.shop_name.toUpperCase()}*
${settings.address}
*GSTIN:* ${settings.gstin}

${divider}
*INVOICE:* #DRAFT
*DATE:* ${new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
${divider}

*CUSTOMER:* ${customer.name || 'Valued Guest'}
*MOBILE:* ${customer.phone}

${divider}
*ITEMS:*

${itemsText}

${divider}
*BILL SUMMARY:*
Subtotal: ₹${subtotal.toFixed(2)}
CGST: ₹${(gstAmount / 2).toFixed(2)}
SGST: ₹${(gstAmount / 2).toFixed(2)}

*GRAND TOTAL: ₹${total.toFixed(2)}*
${divider}

${settings.bill_footer}
_Powered by Kharchaa_`

    const encodedMsg = encodeURIComponent(message)
    const recipientPhone = customer.phone.replace(/[^0-9]/g, '')
    const finalPhone = recipientPhone.length === 10 ? `91${recipientPhone}` : recipientPhone
    
    window.open(`https://wa.me/${finalPhone}?text=${encodedMsg}`, '_blank')
  }

  return (
    <div className="bill-panel card">
      {/* Customer */}
      <div className="bill-section">
        <h3 className="bill-section-title">Customer Info</h3>
        <div className="bill-customer-row">
          <input className="form-input" placeholder="Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
          <input className="form-input" placeholder="Phone" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} maxLength={10} />
        </div>
      </div>

      <div className="divider" />

      {/* Cart */}
      <div className="bill-section bill-cart">
        <h3 className="bill-section-title">
          <Receipt size={16} /> Bill Items
          {cart.length > 0 && <span className="badge badge-primary">{cart.length}</span>}
        </h3>
        {cart.length === 0 ? (
          <div className="cart-empty"><Receipt size={40} strokeWidth={1} /><p>Cart is empty</p></div>
        ) : (
          <div className="cart-list">
            {cart.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item-info"><p className="cart-item-name">{item.name}</p><p className="cart-item-gst">GST {item.gst}%</p></div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                  <span className="qty-value">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                </div>
                <span className="cart-item-total">₹{(item.price * item.qty).toFixed(0)}</span>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateQty(item.id, 0)}><Trash2 size={14} style={{ color: 'var(--danger)' }} /></button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Totals */}
      <div className="bill-totals">
        <div className="bill-total-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="bill-total-row"><span>GST</span><span>₹{gstAmount.toFixed(2)}</span></div>
        <div className="discount-input-row" style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
          <div style={{ width: '100px', flexShrink: 0 }}>
            <CustomDropdown
              value={discountType}
              onChange={setDiscountType}
              options={[{ l: '%', v: 'percent' }, { l: '₹', v: 'flat' }]}
              labelKey="l"
              valueKey="v"
            />
          </div>
          <input className="form-input" type="number" placeholder="Discount" value={discount} onChange={e => setDiscount(e.target.value)} />
        </div>
        <div className="bill-total-row grand" style={{ marginTop: 'var(--space-3)' }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
      </div>

      <div className="divider" />

      {/* Payment */}
      <div className="bill-section">
        <div className="payment-modes">
          {PAYMENT_MODES.map(mode => (
            <button key={mode} className={`payment-mode-btn ${payment === mode ? 'active' : ''}`} onClick={() => setPayment(mode)}>{mode}</button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bill-actions">
        <button className="btn btn-secondary" onClick={handleWhatsApp}><MessageCircle size={16} /> WhatsApp</button>
        <button className="btn btn-secondary" onClick={() => {
          if (cart.length === 0) return toast.error('Add items first')
          onSave()
        }}><Printer size={16} /> Print</button>
        <button className="btn btn-primary" style={{ flex: 1 }} onClick={onSave}>
          <IndianRupee size={16} /> Save — ₹{total.toFixed(2)}
        </button>
      </div>
    </div>
  )
}
