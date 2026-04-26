import { useState, useContext, createContext } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kharchaa_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (email, password) => {
    // 1. Check hardcoded mock accounts
    if (email === 'admin@kharchaa.com' && password === 'admin123') {
      const mockUser = { 
        id: 1, 
        name: 'Super Admin', 
        email, 
        role: 'Full Access',
        plan: 'Pro',
        features: ['dashboard', 'billing', 'inventory', 'customers', 'vouchers', 'reports', 'settings']
      }
      setUser(mockUser)
      localStorage.setItem('kharchaa_user', JSON.stringify(mockUser))
      toast.success('Login Successful!')
      return true
    } else if (email === 'staff@kharchaa.com' && password === 'staff123') {
      const mockUser = { 
        id: 2, 
        name: 'Staff Member', 
        email, 
        role: 'Cashier',
        plan: 'Basic',
        features: ['dashboard', 'billing', 'customers']
      }
      setUser(mockUser)
      localStorage.setItem('kharchaa_user', JSON.stringify(mockUser))
      toast.success('Login Successful!')
      return true
    } 
    
    // 2. Check custom owner created via signup
    const customUser = localStorage.getItem('kharchaa_custom_user')
    if (customUser) {
      const u = JSON.parse(customUser)
      if (u.email === email && u.password === password) {
        const ownerUser = {
          ...u,
          plan: 'Pro',
          features: ['dashboard', 'billing', 'inventory', 'customers', 'vouchers', 'reports', 'settings']
        }
        setUser(ownerUser)
        localStorage.setItem('kharchaa_user', JSON.stringify(ownerUser))
        toast.success('Login Successful!')
        return true
      }
    }

    // 3. Check staff list from settings
    const staffList = JSON.parse(localStorage.getItem('kharchaa_staff_list') || '[]')
    const staffMember = staffList.find(s => s.email === email && s.password === password)
    if (staffMember) {
      const u = { ...staffMember, id: staffMember.id, name: staffMember.name, role: staffMember.role }
      setUser(u)
      localStorage.setItem('kharchaa_user', JSON.stringify(u))
      toast.success(`Welcome back, ${u.name}!`)
      return true
    }

    toast.error('Invalid email or password')
    return false
  }

  const signup = (userData) => {
    const newUser = { ...userData, id: Date.now(), role: 'Owner' }
    localStorage.setItem('kharchaa_custom_user', JSON.stringify(newUser))
    
    // Save initial settings based on signup info
    const initialSettings = {
      shop_name: userData.shopName,
      phone: userData.phone,
      email: userData.email,
      address: 'Enter your address in Settings',
      gstin: 'Enter GSTIN',
      bill_footer: `Thank you for visiting ${userData.shopName}!`,
      currency: 'INR',
      auto_print: false,
      tax_enabled: true
    }
    localStorage.setItem('kharchaa_settings', JSON.stringify(initialSettings))
    
    toast.success('Account created! Please login.')
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('kharchaa_user')
    toast.success('Logged out')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
