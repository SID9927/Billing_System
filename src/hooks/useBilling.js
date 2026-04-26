import { useState } from 'react'
import toast from 'react-hot-toast'

const PRODUCTS = [
  { id: 1, name: 'Black Forest Cake (1kg)', price: 650, gst: 5,  category: 'Cakes',      unit: 'piece' },
  { id: 2, name: 'Butter Croissant',        price: 50,  gst: 5,  category: 'Pastries',   unit: 'piece' },
  { id: 3, name: 'Chocolate Truffle (1kg)', price: 750, gst: 5,  category: 'Cakes',      unit: 'piece' },
  { id: 4, name: 'Fresh Bread Loaf',        price: 45,  gst: 0,  category: 'Breads',     unit: 'piece' },
  { id: 5, name: 'Blueberry Cheesecake',    price: 240, gst: 5,  category: 'Pastries',   unit: 'piece' },
  { id: 6, name: 'Cold Coffee',             price: 80,  gst: 12, category: 'Beverages',  unit: 'piece' },
  { id: 7, name: 'Chocolate Brownie',       price: 60,  gst: 5,  category: 'Pastries',   unit: 'piece' },
  { id: 8, name: 'Pineapple Cake (500g)',   price: 320, gst: 5,  category: 'Cakes',      unit: 'piece' },
]

export function useBilling() {
  const [search, setSearch] = useState('')
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState('')
  const [discountType, setDiscountType] = useState('percent')
  const [payment, setPayment] = useState('Cash')
  const [customer, setCustomer] = useState({ name: '', phone: '' })

  const filteredProducts = PRODUCTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    toast.success(`${product.name} added`, { duration: 1500 })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return setCart(prev => prev.filter(i => i.id !== id))
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const gstAmount = cart.reduce((sum, item) => sum + (item.price * item.qty * item.gst / 100), 0)
  const subtotalWithGst = subtotal + gstAmount

  let discountAmount = 0
  if (discount) {
    discountAmount = discountType === 'percent' ? subtotalWithGst * (parseFloat(discount) / 100) : (parseFloat(discount) || 0)
  }
  const total = Math.max(0, subtotalWithGst - discountAmount)

  const resetBill = () => {
    setCart([])
    setDiscount('')
    setCustomer({ name: '', phone: '' })
  }

  return {
    search, setSearch, filteredProducts, cart, addToCart, updateQty,
    discount, setDiscount, discountType, setDiscountType, discountAmount,
    payment, setPayment, customer, setCustomer,
    subtotal, gstAmount, total, resetBill
  }
}
