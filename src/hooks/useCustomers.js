import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'

const INITIAL_CUSTOMERS = [
  { id: 1, name: 'Priya Sharma', phone: '9876543210', email: 'priya@example.com', total_orders: 5, spent: 4500, points: 450 },
  { id: 2, name: 'Raj Mehta',    phone: '9988776655', email: 'raj@example.com',   total_orders: 2, spent: 1200, points: 120 },
  { id: 3, name: 'Sunita Patel', phone: '9123456789', email: 'sunita@example.com', total_orders: 8, spent: 8200, points: 820 },
]

export function useCustomers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [search, setSearch]       = useState('')

  const filtered = useMemo(() => {
    return customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.phone.includes(search)
    )
  }, [customers, search])

  const saveCustomer = (form, id = null) => {
    if (id) {
      setCustomers(prev => prev.map(c => c.id === id ? { ...form, id } : c))
      toast.success('Customer updated!')
    } else {
      const newId = Math.max(0, ...customers.map(c => c.id)) + 1
      const newCustomer = { ...form, id: newId, total_orders: 0, spent: 0, points: 0 }
      setCustomers(prev => [newCustomer, ...prev])
      toast.success('Customer added!')
    }
  }

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id))
    toast.success('Customer removed')
  }

  return { customers, filtered, search, setSearch, saveCustomer, deleteCustomer }
}
