import { useState } from 'react'
import { useBilling } from '../hooks/useBilling'
import ProductSelector from '../components/billing/ProductSelector'
import BillPanel from '../components/billing/BillPanel'
import PrintPreview from '../components/billing/PrintPreview'
import toast from 'react-hot-toast'
import './Billing.css'

export default function Billing() {
  const {
    search, setSearch, filteredProducts, cart, addToCart, updateQty,
    discount, setDiscount, discountType, setDiscountType, discountAmount,
    payment, setPayment, customer, setCustomer,
    subtotal, gstAmount, total, resetBill
  } = useBilling()

  const [showPreview, setShowPreview] = useState(false)
  const [lastBill, setLastBill] = useState(null)

  const handleSaveBill = () => {
    if (cart.length === 0) return toast.error('Add items first')
    
    const billData = {
      id: `B-${Math.floor(1000 + Math.random() * 9000)}`,
      items: cart,
      customer, // Pass the customer state here
      subtotal,
      gst_rate: 5, // Default for demo
      gst_amount: gstAmount,
      discount: discountAmount,
      total: total
    }
    
    setLastBill(billData)
    setShowPreview(true)
  }

  const handleClosePreview = () => {
    setShowPreview(false)
    resetBill()
    toast.success('Bill completed!')
  }

  return (
    <div className="billing-page animate-fadeInUp">
      <ProductSelector
        search={search}
        setSearch={setSearch}
        products={filteredProducts}
        onSelect={addToCart}
      />

      <BillPanel
        cart={cart}
        updateQty={updateQty}
        customer={customer}
        setCustomer={setCustomer}
        discount={discount}
        setDiscount={setDiscount}
        discountType={discountType}
        setDiscountType={setDiscountType}
        subtotal={subtotal}
        gstAmount={gstAmount}
        discountAmount={discountAmount}
        total={total}
        payment={payment}
        setPayment={setPayment}
        onSave={handleSaveBill}
      />

      {showPreview && (
        <PrintPreview 
          bill={lastBill} 
          onClose={handleClosePreview} 
        />
      )}
    </div>
  )
}
