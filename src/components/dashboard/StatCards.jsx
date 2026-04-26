import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCards({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map((stat, i) => (
        <div key={stat.id} className="stat-card" style={{ '--stat-color': stat.color, '--stat-ghost': stat.ghost, animationDelay: `${i * 60}ms` }}>
          <div className="stat-card-inner">
            <div>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
              <p className={`stat-change ${stat.trend === 'up' ? 'up' : stat.trend === 'down' ? 'down' : ''}`}>
                {stat.trend === 'up' && <TrendingUp size={12} />}
                {stat.trend === 'down' && <TrendingDown size={12} />}
                {stat.change}
              </p>
            </div>
            <div className="stat-icon" style={{ background: stat.ghost, color: stat.color }}><stat.icon size={22} /></div>
          </div>
        </div>
      ))}
    </div>
  )
}
