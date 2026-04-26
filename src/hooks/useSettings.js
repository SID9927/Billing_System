import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const INITIAL_SETTINGS = {
  shop_name: 'Sweet Bakes Patisserie',
  gstin: '27AABCS1234L1Z1',
  phone: '+91 98765 43210',
  email: 'hello@sweetbakes.com',
  address: '123 Bakery Street, Cake Plaza, Mumbai 400001',
  bill_footer: 'Thank you for choosing Sweet Bakes! Follow us on Instagram @sweetbakes',
  currency: 'INR',
  auto_print: false,
  tax_enabled: true
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('kharchaa_settings')
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS
  })

  useEffect(() => {
    localStorage.setItem('kharchaa_settings', JSON.stringify(settings))
  }, [settings])

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    toast.success('Settings saved successfully!')
  }

  return { settings, updateSettings }
}
