import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function RevenueChart({ data }) {
  return (
    <div className="card" style={{ height: '400px' }}>
      <div className="card-header">
        <h2 className="card-title">Revenue Trend</h2>
      </div>
      <div style={{ width: '100%', height: '320px', marginTop: 'var(--space-4)', minWidth: 0 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              tickFormatter={(str) => new Date(str).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              tickFormatter={(val) => `₹${val/1000}k`}
            />
            <Tooltip 
              contentStyle={{ borderRadius: 'var(--radius-md)', border: 'none', boxShadow: 'var(--shadow-lg)' }}
              formatter={(val) => [`₹${val}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="var(--primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRev)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
