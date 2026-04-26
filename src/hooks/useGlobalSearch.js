import { useState, useMemo } from 'react'

export function useGlobalSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  // Mock data for search results
  const allData = [
    { id: '1', title: 'Black Forest Cake', type: 'product', category: 'Cakes' },
    { id: '2', title: 'Butter Croissant', type: 'product', category: 'Breads' },
    { id: 'ORD-041', title: 'Priya Sharma (Pending)', type: 'order', category: 'Orders' },
    { id: '3', title: 'Blueberry Cheesecake', type: 'product', category: 'Cakes' },
  ]

  const results = useMemo(() => {
    if (!query) return []
    return allData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return { query, setQuery, results, isOpen, setIsOpen }
}
