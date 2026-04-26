import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import './CustomDropdown.css'

export default function CustomDropdown({ 
  value, 
  options, 
  onChange, 
  placeholder = "Select Option",
  labelKey = null, 
  valueKey = null, 
  openUpwards = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({})
  const ref = useRef()

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current && isOpen) {
        const rect = ref.current.getBoundingClientRect()
        setCoords({
          left: rect.left,
          width: rect.width,
          ...(openUpwards 
               ? { bottom: window.innerHeight - rect.top + 6 } 
               : { top: rect.bottom + 6 })
        })
      }
    }

    const handleClickOutside = (e) => { 
      if (e.target.closest('.custom-dropdown-menu')) return;
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) 
    }

    document.addEventListener('mousedown', handleClickOutside)
    if (isOpen) {
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, openUpwards])

  const handleOpen = () => {
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setCoords({
        left: rect.left,
        width: rect.width,
        ...(openUpwards 
             ? { bottom: window.innerHeight - rect.top + 6 } 
             : { top: rect.bottom + 6 })
      })
    }
    setIsOpen(!isOpen)
  }

  const handleSelect = (opt) => {
    const val = (valueKey && typeof opt === 'object') ? opt[valueKey] : opt
    onChange(val)
    setIsOpen(false)
  }

  const getDisplayLabel = () => {
    const selected = options.find(opt => {
      const val = (valueKey && typeof opt === 'object') ? opt[valueKey] : opt
      return val === value
    })
    
    if (!selected && selected !== 0) return placeholder
    return (labelKey && typeof selected === 'object') ? selected[labelKey] : selected
  }

  const menu = isOpen ? (
    <div 
      className={`custom-dropdown-menu animate-fadeInUp ${openUpwards ? 'open-up' : ''}`}
      style={{
        position: 'fixed',
        left: coords.left,
        width: coords.width,
        zIndex: 100000,
        ...(openUpwards ? { bottom: coords.bottom, top: 'auto' } : { top: coords.top, bottom: 'auto' })
      }}
    >
      {options.map((opt, idx) => {
        const val = (valueKey && typeof opt === 'object') ? opt[valueKey] : opt
        const label = (labelKey && typeof opt === 'object') ? opt[labelKey] : opt
        return (
          <div 
            key={idx} 
            className={`custom-dropdown-item ${value === val ? 'active' : ''}`} 
            onClick={() => handleSelect(opt)}
          >
            {label}
          </div>
        )
      })}
    </div>
  ) : null

  return (
    <div className={`custom-dropdown-container ${className} ${isOpen ? 'is-open' : ''}`} ref={ref}>
      <button 
        type="button" 
        className={`custom-dropdown-trigger ${isOpen ? 'active' : ''}`} 
        onClick={handleOpen}
      >
        <span className="dropdown-value">{getDisplayLabel()}</span>
        <ChevronDown size={16} className={`dropdown-chevron ${isOpen ? 'rotate' : ''}`} />
      </button>

      {isOpen && createPortal(menu, document.body)}
    </div>
  )
}
