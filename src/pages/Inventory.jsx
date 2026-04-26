import { useState, useEffect } from 'react'
import { Plus, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { useInventory } from '../hooks/useInventory'
import InventoryStats from '../components/inventory/InventoryStats'
import InventoryFilters from '../components/inventory/InventoryFilters'
import ProductTable from '../components/inventory/ProductTable'
import ProductModal from '../components/inventory/ProductModal'
import StockModal from '../components/inventory/StockModal'
import './Inventory.css'

export default function Inventory() {
  const {
    filtered, stats, search, setSearch, filterCat, setFilterCat,
    filterStock, setFilterStock, saveProduct, deleteProduct, addStock, toggleActive
  } = useInventory()

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filterCat, filterStock])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [stockProduct, setStockProduct] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filtered.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSave = (form) => {
    saveProduct(form, editingProduct?.id)
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="inventory-page animate-fadeInUp">
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">Manage products, stock levels and pricing</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add Product
        </button>
      </div>

      <InventoryStats stats={stats} />

      <div style={{ position: 'relative', zIndex: 1000 }}>
        <InventoryFilters
          search={search} setSearch={setSearch}
          filterCat={filterCat} setFilterCat={setFilterCat}
          filterStock={filterStock} setFilterStock={setFilterStock}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Package size={48} />
          <h3>No products found</h3>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Add First Product</button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
          <ProductTable
            products={paginatedProducts}
            onEdit={(p) => { setEditingProduct(p); setIsModalOpen(true) }}
            onDelete={setDeleteId}
            onAddStock={setStockProduct}
            onToggleActive={toggleActive}
          />
          
          {totalPages > 1 && (
            <div className="pagination-wrap">
              <span className="pagination-info">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} products
              </span>
              <div className="pagination-controls">
                <button 
                  className="pg-btn" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`pg-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  className="pg-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <ProductModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingProduct(null) }}
        onSave={handleSave}
        editingProduct={editingProduct}
      />

      <StockModal
        product={stockProduct}
        onClose={() => setStockProduct(null)}
        onConfirm={(qty) => { addStock(stockProduct.id, qty); setStockProduct(null) }}
      />

      {deleteId && (
        <div className="modal-overlay animate-fadeIn" onClick={() => setDeleteId(null)}>
          <div className="confirm-box">
            <h3>Delete Product?</h3>
            <p>This action cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { deleteProduct(deleteId); setDeleteId(null) }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
