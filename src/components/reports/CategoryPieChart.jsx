import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function CategoryPieChart({ data }) {
  return (
    <div className="card" style={{ height: '400px' }}>
      <div className="card-header">
        <h2 className="card-title">Category Wise Sales</h2>
      </div>
      <div style={{ width: '100%', height: '320px', minWidth: 0 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
