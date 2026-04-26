import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'

const INITIAL_VOUCHERS = [
  { id: 1, code: 'DIWALI20', type: 'percent', value: 20, min_order: 1000, max_uses: 100, used: 45, campaign: 'Diwali Special', valid_until: '2026-11-05', is_active: true },
  { id: 2, code: 'CAKE100',  type: 'flat',    value: 100, min_order: 800,  max_uses: 50,  used: 12, campaign: 'Birthday Promo', valid_until: '2026-12-31', is_active: true },
  { id: 3, code: 'WELCOME50', type: 'flat',    value: 50,  min_order: 300,  max_uses: 500, used: 412, campaign: 'New Customer',  valid_until: '2027-01-01', is_active: true },
]

export function useVouchers() {
  const [vouchers, setVouchers] = useState(INITIAL_VOUCHERS)
  const [search, setSearch]     = useState('')

  const filtered = useMemo(() => {
    return vouchers.filter(v => 
      v.code.toLowerCase().includes(search.toLowerCase()) || 
      v.campaign.toLowerCase().includes(search.toLowerCase())
    )
  }, [vouchers, search])

  const saveVoucher = (form, id = null) => {
    if (id) {
      setVouchers(prev => prev.map(v => v.id === id ? { ...form, id } : v))
      toast.success('Voucher updated!')
    } else {
      const newId = Math.max(0, ...vouchers.map(v => v.id)) + 1
      setVouchers(prev => [{ ...form, id: newId, used: 0 }, ...prev])
      toast.success('New campaign launched! 🚀')
    }
  }

  const toggleVoucher = (id) => {
    setVouchers(prev => prev.map(v => v.id === id ? { ...v, is_active: !v.is_active } : v))
  }

  return { vouchers, filtered, search, setSearch, saveVoucher, toggleVoucher }
}
