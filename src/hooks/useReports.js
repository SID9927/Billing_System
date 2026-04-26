import { useState, useMemo } from 'react'

const SALES_DATA = [
  { date: '2026-04-20', revenue: 8400, profit: 3200, bills: 32 },
  { date: '2026-04-21', revenue: 9200, profit: 3600, bills: 35 },
  { date: '2026-04-22', revenue: 7800, profit: 2900, bills: 28 },
  { date: '2026-04-23', revenue: 11500, profit: 4800, bills: 42 },
  { date: '2026-04-24', revenue: 12480, profit: 5100, bills: 47 },
  { date: '2026-04-25', revenue: 15600, profit: 6400, bills: 58 },
  { date: '2026-04-26', revenue: 14200, profit: 5800, bills: 52 },
]

const CATEGORY_DATA = [
  { name: 'Cakes', value: 45, color: 'var(--primary)' },
  { name: 'Pastries', value: 25, color: 'var(--secondary)' },
  { name: 'Breads', value: 15, color: 'var(--info)' },
  { name: 'Other', value: 15, color: 'var(--accent)' },
]

const STAFF_SALES = [
  { name: 'Super Admin', role: 'Owner', revenue: 24500, bills: 85, color: 'var(--primary)' },
  { name: 'Rohan Sharma', role: 'Cashier', revenue: 18200, bills: 112, color: 'var(--secondary)' },
  { name: 'Anjali Gupta', role: 'Cashier', revenue: 12400, bills: 74, color: 'var(--info)' },
  { name: 'Vikram Singh', role: 'Manager', revenue: 9800, bills: 24, color: 'var(--success)' },
]

export function useReports() {
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  const stats = useMemo(() => {
    const totalRev = SALES_DATA.reduce((sum, d) => sum + d.revenue, 0)
    const totalProfit = SALES_DATA.reduce((sum, d) => sum + d.profit, 0)
    const totalBills = SALES_DATA.reduce((sum, d) => sum + d.bills, 0)
    return { totalRev, totalProfit, totalBills, avgBill: (totalRev / totalBills).toFixed(0) }
  }, [])

  return { salesData: SALES_DATA, categoryData: CATEGORY_DATA, staffSales: STAFF_SALES, stats, dateRange, setDateRange }
}
