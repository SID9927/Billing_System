import { Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function TopSellers({ products }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title"><Star size={18} /> Top Sellers Today</h2>
        <Link to="/reports" className="btn btn-ghost btn-sm">View All</Link>
      </div>
      <div className="product-list">
        {products.map((p, i) => (
          <div className="product-row" key={i}>
            <span className="product-rank">{p.badge || `#${i + 1}`}</span>
            <div className="product-info">
              <p className="product-name">{p.name}</p>
              <p className="product-sold">{p.sold} units sold</p>
            </div>
            <span className="product-revenue">{p.revenue}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
