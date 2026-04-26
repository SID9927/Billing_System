import { Search } from 'lucide-react'

export default function ProductSelector({ search, setSearch, products, onSelect }) {
  return (
    <div className="billing-products">
      <div className="billing-search-wrap">
        <Search size={16} className="billing-search-icon" />
        <input
          className="form-input billing-search"
          placeholder="Search products by name or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="product-grid">
        {products.map(product => (
          <button key={product.id} className="product-card" onClick={() => onSelect(product)}>
            <div className="product-card-category">{product.category}</div>
            <div className="product-card-name">{product.name}</div>
            <div className="product-card-footer">
              <span className="product-card-price">₹{product.price}</span>
              <span className="badge badge-primary">{product.gst}% GST</span>
            </div>
          </button>
        ))}
        {products.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1/-1', padding: 'var(--space-8)' }}>
            <p>No products found</p>
          </div>
        )}
      </div>
    </div>
  )
}
