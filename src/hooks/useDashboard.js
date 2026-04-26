import { TrendingUp, IndianRupee, ShoppingBag, ClipboardList } from 'lucide-react'

export function useDashboard() {
  const stats = [
    { id: 'revenue', label: "Today's Revenue", value: '₹12,480', change: '+18% from yesterday', trend: 'up', icon: IndianRupee, color: 'var(--primary)', ghost: 'var(--primary-ghost)' },
    { id: 'profit', label: "Today's Profit", value: '₹4,320', change: '+12% from yesterday', trend: 'up', icon: TrendingUp, color: 'var(--success)', ghost: 'var(--success-ghost)' },
    { id: 'orders', label: 'Bills Generated', value: '47', change: '+5 from yesterday', trend: 'up', icon: ShoppingBag, color: 'var(--info)', ghost: 'var(--info-ghost)' },
    { id: 'custom_orders', label: 'Custom Orders', value: '8', change: '3 pending delivery', trend: 'neutral', icon: ClipboardList, color: 'var(--secondary)', ghost: 'var(--secondary-ghost)' },
  ]

  const topProducts = [
    { name: 'Black Forest Cake (1kg)', sold: 24, revenue: '₹5,760', badge: '🏆' },
    { name: 'Butter Croissant',       sold: 68, revenue: '₹3,400', badge: '🥈' },
    { name: 'Chocolate Truffle Cake', sold: 15, revenue: '₹3,375', badge: '🥉' },
    { name: 'Blueberry Cheesecake',   sold: 12, revenue: '₹2,880', badge: '' },
    { name: 'Fresh Bread Loaf',       sold: 42, revenue: '₹2,100', badge: '' },
  ]

  const lowStock = [
    { name: 'Butter (500g)',    stock: 2,  unit: 'packs',  threshold: 5 },
    { name: 'Whipping Cream',  stock: 1,  unit: 'litre',  threshold: 3 },
  ]

  const pendingOrders = [
    { id: 'ORD-041', customer: 'Priya Sharma', item: 'Black Forest 2kg', due: 'Today 6PM',  status: 'in_production' },
    { id: 'ORD-042', customer: 'Raj Mehta',    item: 'Choco Truffle 1kg', due: 'Today 8PM',  status: 'ready' },
  ]

  const aiInsight = {
    text: "Butter Croissants are your best seller today (68 units)! You're low on Butter (2 packs left). Stock up before the evening rush to avoid losing ₹2,500 in potential sales.",
    icon: "🤖",
    target: "/inventory",
    buttonLabel: "Manage Stock"
  }

  return { stats, topProducts, lowStock, pendingOrders, aiInsight }
}
