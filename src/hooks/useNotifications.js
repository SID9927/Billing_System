import { useState } from 'react'

const MOCK_NOTIFS = [
  { id: 1, title: 'Low Stock Alert', desc: 'Butter (500g) is below threshold (2 left)', time: '10m ago', type: 'alert' },
  { id: 2, title: 'Order Ready', desc: 'Order ORD-042 is ready for delivery', time: '1h ago', type: 'info' },
  { id: 3, title: 'New Booking', desc: 'Sunita Patel booked a 1kg Choco Cake', time: '3h ago', type: 'success' },
]

export function useNotifications() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)
  const [isOpen, setIsOpen] = useState(false)

  const clearNotif = (id) => {
    setNotifs(prev => prev.filter(n => n.id !== id))
  }

  return { notifs, clearNotif, isOpen, setIsOpen }
}
