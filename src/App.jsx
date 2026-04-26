import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import Billing from './pages/Billing'
import Inventory from './pages/Inventory'
import CustomOrders from './pages/CustomOrders'
import Customers from './pages/Customers'
import Vouchers from './pages/Vouchers'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<CustomOrders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/vouchers" element={<Vouchers />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
