import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'

export const CATEGORIES = [
  { id: 1, name: 'Cakes',      gst: 5,  hsn: '1905' },
  { id: 2, name: 'Pastries',   gst: 5,  hsn: '1905' },
  { id: 3, name: 'Breads',     gst: 0,  hsn: '1905' },
  { id: 4, name: 'Cookies',    gst: 18, hsn: '1905' },
  { id: 5, name: 'Chocolates', gst: 18, hsn: '1704' },
  { id: 6, name: 'Beverages',  gst: 12, hsn: '2202' },
  { id: 7, name: 'Toppings',   gst: 5,  hsn: '0813' },
  { id: 8, name: 'Other',      gst: 5,  hsn: '1905' },
]

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Black Forest Cake (1kg)', category: 'Cakes',    type: 'fixed',  unit: 'piece', mrp: 700,  selling_price: 650, cost_price: 380, gst_rate: 5,  hsn: '1905', stock_qty: 8,  low_stock_threshold: 5,  shelf_life_days: 2, is_active: true },
  { id: 2, name: 'Butter Croissant',        category: 'Pastries', type: 'fixed',  unit: 'piece', mrp: 60,   selling_price: 50,  cost_price: 28,  gst_rate: 5,  hsn: '1905', stock_qty: 32, low_stock_threshold: 10, shelf_life_days: 1, is_active: true },
  { id: 3, name: 'Fresh Bread Loaf',        category: 'Breads',   type: 'fixed',  unit: 'piece', mrp: 50,   selling_price: 45,  cost_price: 22,  gst_rate: 0,  hsn: '1905', stock_qty: 18, low_stock_threshold: 8,  shelf_life_days: 3, is_active: true },
  { id: 4, name: 'Chocolate Truffle (1kg)', category: 'Cakes',    type: 'fixed',  unit: 'piece', mrp: 800,  selling_price: 750, cost_price: 440, gst_rate: 5,  hsn: '1905', stock_qty: 5,  low_stock_threshold: 3,  shelf_life_days: 3, is_active: true },
  { id: 5, name: 'Blueberry Cheesecake',   category: 'Pastries', type: 'fixed',  unit: 'piece', mrp: 280,  selling_price: 240, cost_price: 140, gst_rate: 5,  hsn: '1905', stock_qty: 6,  low_stock_threshold: 5,  shelf_life_days: 2, is_active: true },
  { id: 6, name: 'Cold Coffee',            category: 'Beverages', type: 'fixed',  unit: 'piece', mrp: 90,   selling_price: 80,  cost_price: 35,  gst_rate: 12, hsn: '2202', stock_qty: 20, low_stock_threshold: 5,  shelf_life_days: 1, is_active: true },
  { id: 7, name: 'Cookie Box (12 pcs)',    category: 'Cookies',  type: 'fixed',  unit: 'box',   mrp: 380,  selling_price: 350, cost_price: 180, gst_rate: 18, hsn: '1905', stock_qty: 3,  low_stock_threshold: 4,  shelf_life_days: 7, is_active: true },
  { id: 8, name: 'Dry Cake (per kg)',      category: 'Other',    type: 'weight', unit: 'kg',    mrp: 500,  selling_price: 450, cost_price: 260, gst_rate: 5,  hsn: '1905', stock_qty: 4,  low_stock_threshold: 2,  shelf_life_days: 14, is_active: true },
]

export function useInventory() {
  const [products, setProducts]       = useState(INITIAL_PRODUCTS)
  const [search, setSearch]           = useState('')
  const [filterCat, setFilterCat]     = useState('All')
  const [filterStock, setFilterStock] = useState('All')

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.category.toLowerCase().includes(search.toLowerCase())
      const matchCat    = filterCat === 'All' || p.category === filterCat
      const matchStock  = filterStock === 'All'
                            ? true
                            : filterStock === 'Low'
                              ? p.stock_qty > 0 && p.stock_qty <= p.low_stock_threshold
                              : p.stock_qty === 0
      return matchSearch && matchCat && matchStock
    })
  }, [products, search, filterCat, filterStock])

  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.is_active).length,
    low: products.filter(p => p.stock_qty > 0 && p.stock_qty <= p.low_stock_threshold).length,
    out: products.filter(p => p.stock_qty === 0).length,
  }), [products])

  const saveProduct = (form, id = null) => {
    if (id) {
      setProducts(prev => prev.map(p => p.id === id ? { ...form, id } : p))
      toast.success('Product updated!')
    } else {
      const newId = Math.max(0, ...products.map(p => p.id)) + 1
      setProducts(prev => [...prev, { ...form, id: newId }])
      toast.success('Product added!')
    }
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
    toast.success('Product deleted')
  }

  const addStock = (id, qty) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock_qty: p.stock_qty + qty } : p))
    toast.success(`+${qty} units added to stock`)
  }

  const toggleActive = (id) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
  }

  return {
    products, filtered, stats,
    search, setSearch,
    filterCat, setFilterCat,
    filterStock, setFilterStock,
    saveProduct, deleteProduct, addStock, toggleActive
  }
}
