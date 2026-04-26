import { useNavigate } from 'react-router-dom'
import { useDashboard } from '../hooks/useDashboard'
import StatCards from '../components/dashboard/StatCards'
import TopSellers from '../components/dashboard/TopSellers'
import DashboardAlerts from '../components/dashboard/DashboardAlerts'
import './Dashboard.css'

export default function Dashboard() {
  const navigate = useNavigate()
  const { stats, topProducts, lowStock, pendingOrders, aiInsight } = useDashboard()

  return (
    <div className="dashboard animate-fadeInUp">
      {/* AI Suggestion Banner */}
      <div className="suggestion-banner">
        <div className="suggestion-icon">{aiInsight.icon}</div>
        <div className="suggestion-content">
          <strong>AI Insight:</strong> {aiInsight.text}
        </div>
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={() => navigate(aiInsight.target || '/reports')}
        >
          {aiInsight.buttonLabel || 'View All'}
        </button>
      </div>

      <StatCards stats={stats} />

      <div className="dashboard-grid">
        <TopSellers products={topProducts} />
        <DashboardAlerts lowStock={lowStock} pendingOrders={pendingOrders} />
      </div>
    </div>
  )
}
