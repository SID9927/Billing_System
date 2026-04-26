import { useReports } from '../hooks/useReports'
import RevenueChart from '../components/reports/RevenueChart'
import CategoryPieChart from '../components/reports/CategoryPieChart'
import CustomDatePicker from '../components/ui/CustomDatePicker'
import { IndianRupee, TrendingUp, ShoppingBag, PieChart } from 'lucide-react'

export default function Reports() {
  const { salesData, categoryData, stats, dateRange, setDateRange } = useReports()

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats.totalRev.toLocaleString()}`, icon: IndianRupee, color: 'var(--primary)' },
    { label: 'Total Profit',  value: `₹${stats.totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'var(--success)' },
    { label: 'Total Bills',   value: stats.totalBills, icon: ShoppingBag, color: 'var(--info)' },
    { label: 'Avg Bill Value', value: `₹${stats.avgBill}`, icon: PieChart, color: 'var(--secondary)' },
  ]

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Track your bakery's growth and performance</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)', width: '320px' }}>
          <CustomDatePicker 
            value={dateRange.start} 
            onChange={val => setDateRange({...dateRange, start: val})} 
            placeholder="Start Date"
          />
          <CustomDatePicker 
            value={dateRange.end} 
            onChange={val => setDateRange({...dateRange, end: val})} 
            placeholder="End Date"
            alignRight={true}
          />
        </div>
      </div>

      <div className="inv-stats" style={{ marginBottom: 'var(--space-6)' }}>
        {statCards.map(s => (
          <div key={s.label} className="inv-stat-card" style={{ '--s-color': s.color }}>
            <s.icon size={18} />
            <span className="inv-stat-value">{s.value}</span>
            <span className="inv-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <RevenueChart data={salesData} />
        <CategoryPieChart data={categoryData} />
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Revenue by Staff</h2>
          <p className="card-subtitle">Track individual sales performance</p>
        </div>
        <div className="staff-performance-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
          {useReports().staffSales.map(staff => (
            <div key={staff.name} className="staff-perf-card" style={{ padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: staff.color, display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontWeight: 700 }}>
                  {staff.name.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{staff.name}</p>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{staff.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: 'var(--space-2)' }}>
                <div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Revenue</p>
                  <p style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{staff.revenue.toLocaleString()}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>Bills</p>
                  <p style={{ fontWeight: 700 }}>{staff.bills}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Detailed Sales Log</h2>
        </div>
        <table className="inv-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
              <th>Profit</th>
              <th>Bills</th>
              <th>Avg/Bill</th>
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((d, i) => {
              const prev = salesData[i-1]
              const growth = prev ? ((d.revenue - prev.revenue) / prev.revenue * 100).toFixed(1) : null
              return (
                <tr key={d.date}>
                  <td style={{ fontWeight: 600 }}>{new Date(d.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
                  <td>₹{d.revenue.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{d.profit.toLocaleString()}</td>
                  <td>{d.bills}</td>
                  <td>₹{(d.revenue / d.bills).toFixed(0)}</td>
                  <td>
                    {growth !== null && (
                      <span style={{ color: growth >= 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>
                        {growth >= 0 ? '+' : ''}{growth}%
                      </span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
