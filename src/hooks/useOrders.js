import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'

const INITIAL_ORDERS = [
  { 
    id: 'ORD-041', 
    customer_name: 'Priya Sharma', 
    customer_phone: '9876543210',
    item: 'Black Forest Cake', 
    weight: '2 kg', 
    flavor: 'Chocolate',
    message: 'Happy Birthday Raj!',
    delivery_date: '2026-04-26',
    delivery_time: '06:00 PM',
    total_amount: 1400,
    advance_paid: 500,
    status: 'in_production' 
  },
  { 
    id: 'ORD-042', 
    customer_name: 'Raj Mehta', 
    customer_phone: '9988776655',
    item: 'Choco Truffle Cake', 
    weight: '1 kg', 
    flavor: 'Dark Chocolate',
    message: 'Congrats!',
    delivery_date: '2026-04-26',
    delivery_time: '08:00 PM',
    total_amount: 850,
    advance_paid: 850,
    status: 'ready' 
  },
]

export function useOrders() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return orders
    return orders.filter(o => o.status === filterStatus)
  }, [orders, filterStatus])

  const addOrder = (order) => {
    const newId = `ORD-${(orders.length + 41).toString().padStart(3, '0')}`
    setOrders(prev => [{ ...order, id: newId }, ...prev])
    toast.success('Custom order booked!')
  }

  const updateStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    toast.success(`Order ${status.replace('_', ' ')}`)
  }

  const updateOrder = (id, updates) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o))
  }

  return { orders, filtered, filterStatus, setFilterStatus, addOrder, updateStatus, updateOrder }
}
