import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import './CustomDatePicker.css'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function CustomDatePicker({ value, onChange, placeholder = "Select Date", openUpwards = false, alignRight = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date())
  const [mode, setMode] = useState('days') // 'days', 'months', 'years'
  const ref = useRef()

  useEffect(() => {
    const handleClickOutside = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Sync internal calendar month when value changes
  useEffect(() => {
    if (value && !isNaN(new Date(value).getTime())) setCurrentDate(new Date(value))
  }, [value])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate()
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay()

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  // Generate Year Array (Current year - 5 to Current year + 6 = 12 years)
  const startYear = new Date().getFullYear() - 5
  const years = Array.from({ length: 12 }, (_, i) => startYear + i)

  const handlePrevMonth = (e) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, month - 1, 1))
  }
  const handleNextMonth = (e) => {
    e.stopPropagation()
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const handleSelectDate = (d) => {
    const newDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    onChange(newDateStr)
    setIsOpen(false)
    setMode('days')
  }

  const handleMonthSelect = (mIdx) => {
    setCurrentDate(new Date(year, mIdx, 1))
    setMode('days')
  }

  const handleYearSelect = (y) => {
    setCurrentDate(new Date(y, month, 1))
    setMode('months')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange('')
    setIsOpen(false)
    setMode('days')
  }

  const handleToday = (e) => {
    e.stopPropagation()
    const today = new Date()
    const newDateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    onChange(newDateStr)
    setCurrentDate(today)
    setIsOpen(false)
    setMode('days')
  }

  const getDisplayValue = () => {
    if (!value) return ''
    const d = new Date(value)
    if (isNaN(d.getTime())) return ''
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
  }

  const displayVal = getDisplayValue()
  const todayDateObj = new Date()

  return (
    <div className="custom-datepicker-container" ref={ref}>
      <div 
        className={`custom-datepicker-input ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        {displayVal ? (
          <span style={{ fontWeight: 600 }}>{displayVal}</span>
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <Calendar size={16} style={{ color: 'var(--text-muted)' }} />
      </div>

      {isOpen && (
        <div className={`custom-datepicker-popup animate-fadeInUp ${openUpwards ? 'open-up' : ''} ${alignRight ? 'align-right' : ''}`}>
          <div className="datepicker-header">
            <button type="button" className="datepicker-nav-btn" onClick={handlePrevMonth}><ChevronLeft size={16}/></button>
            <div className="datepicker-month-year" style={{ display: 'flex', gap: '8px' }}>
              <span 
                style={{ cursor: 'pointer', transition: 'color 0.2s' }} 
                className={mode === 'months' ? 'active-mode' : ''}
                onClick={() => setMode('months')}
              >
                {MONTHS[month]}
              </span>
              <span 
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
                className={mode === 'years' ? 'active-mode' : ''}
                onClick={() => setMode('years')}
              >
                {year}
              </span>
            </div>
            <button type="button" className="datepicker-nav-btn" onClick={handleNextMonth}><ChevronRight size={16}/></button>
          </div>

          {mode === 'days' && (
            <div className="datepicker-grid">
              {DAYS.map(d => <div key={d} className="datepicker-day-name">{d}</div>)}
              {days.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="datepicker-day empty"></div>
                
                const isSelected = value && 
                  new Date(value).getDate() === d && 
                  new Date(value).getMonth() === month && 
                  new Date(value).getFullYear() === year
                  
                const isToday = 
                  todayDateObj.getDate() === d && 
                  todayDateObj.getMonth() === month && 
                  todayDateObj.getFullYear() === year

                return (
                  <div 
                    key={i} 
                    className={`datepicker-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleSelectDate(d)}
                  >
                    {d}
                  </div>
                )
              })}
            </div>
          )}

          {mode === 'months' && (
            <div className="datepicker-grid-alt">
              {MONTHS.map((m, i) => (
                <div 
                  key={m} 
                  className={`datepicker-alt-btn ${month === i ? 'selected' : ''}`}
                  onClick={() => handleMonthSelect(i)}
                >
                  {m}
                </div>
              ))}
            </div>
          )}

          {mode === 'years' && (
            <div className="datepicker-grid-alt">
              {years.map(y => (
                <div 
                  key={y} 
                  className={`datepicker-alt-btn ${year === y ? 'selected' : ''}`}
                  onClick={() => handleYearSelect(y)}
                >
                  {y}
                </div>
              ))}
            </div>
          )}

          <div className="datepicker-footer">
            {mode !== 'days' ? (
              <button type="button" className="datepicker-footer-btn" onClick={() => setMode('days')}>Back</button>
            ) : (
              <button type="button" className="datepicker-footer-btn" onClick={handleClear}>Clear</button>
            )}
            <button type="button" className="datepicker-footer-btn" onClick={handleToday}>Today</button>
          </div>
        </div>
      )}
    </div>
  )
}
