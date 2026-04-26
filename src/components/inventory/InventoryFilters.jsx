import { Search } from 'lucide-react'
import { CATEGORIES } from '../../hooks/useInventory'
import CustomDropdown from '../ui/CustomDropdown'

export default function InventoryFilters({ search, setSearch, filterCat, setFilterCat, filterStock, setFilterStock }) {
  return (
    <div className="inv-filters">
      <div className="inv-search-wrap">
        <Search size={15} className="inv-search-icon" />
        <input
          className="form-input inv-search"
          placeholder="Search by product name or category…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="inv-filter-row">
        <div className="cat-pills">
          {['All', ...CATEGORIES.map(c => c.name)].map(cat => {
            const meta = CATEGORIES.find(c => c.name === cat)
            return (
              <button
                key={cat}
                className={`cat-pill ${filterCat === cat ? 'active' : ''}`}
                onClick={() => setFilterCat(cat)}
              >
                {meta?.icon} {cat}
              </button>
            )
          })}
        </div>

        <CustomDropdown 
          value={filterStock}
          options={[
            { label: 'All Stock', value: 'All' },
            { label: 'Low Stock', value: 'Low' },
            { label: 'Out of Stock', value: 'Out' }
          ]}
          onChange={setFilterStock}
          labelKey="label"
          valueKey="value"
          className="stock-filter-dropdown"
          openUpwards={true}
        />
      </div>
    </div>
  )
}
