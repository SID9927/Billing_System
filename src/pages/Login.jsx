import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Lock, Mail, Eye, EyeOff, ArrowRight, Users, TrendingUp, AlertCircle, ArrowLeft, User, Phone, Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import './Login.css'

export default function Login() {
  const [view, setView] = useState('login') // 'login', 'signup', 'forgot'
  const [email, setEmail] = useState('admin@kharchaa.com')
  const [password, setPassword] = useState('admin123')
  const [name, setName] = useState('')
  const [shopName, setShopName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (view === 'login' || view === 'forgot' || view === 'signup') {
      if (!email) newErrors.email = 'Email address is required'
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Please enter a valid email'
    }
    
    if (view === 'login' || view === 'signup') {
      if (!password) newErrors.password = 'Password is required'
      else if (password.length < 6) newErrors.password = 'Must be at least 6 characters'
    }

    if (view === 'signup') {
      if (!name) newErrors.name = 'Full name is required'
      if (!shopName) newErrors.shopName = 'Business name is required'
      if (!phone) newErrors.phone = 'Phone number is required'
      if (!agreed) newErrors.agreed = 'You must agree to the Terms & Conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    
    setTimeout(() => {
      if (view === 'login') {
        const success = login(email, password)
        if (success) navigate('/')
        else setErrors({ auth: 'Invalid email or password' })
      } else if (view === 'signup') {
        signup({ name, shopName, phone, email, password })
        setView('login')
      } else if (view === 'forgot') {
        toast.success('Reset link sent to your email!')
        setView('login')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div className="login-page-v2">
      <div className="login-split-container">
        {/* Left Side: Branding & Stats */}
        <div className="login-left">
          <div className="animated-bg">
            <div className="blob"></div>
            <div className="blob"></div>
            <div className="blob"></div>
          </div>
          
          <div className="login-left-content">
            <div className="brand-header">
              <div className="brand-logo-circle">
                <img src="/logo.webp" alt="Kharchaa Logo" />
              </div>
              <div className="brand-text">
                <h1>Kharchaa</h1>
                <p>Smart Business Management</p>
              </div>
            </div>

            <div className="brand-message">
              <h2>Master your business growth with intelligent data.</h2>
              <p>Streamline sales, track inventory, and manage your staff with ease.</p>
            </div>
          </div>

          <div className="login-stats-footer">
            <div className="stat-item">
              <Users size={16} />
              <span>500+ Businesses Trusted</span>
            </div>
            <div className="stat-separator" />
            <div className="stat-item">
              <TrendingUp size={16} />
              <span>10k+ Daily Invoices</span>
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="login-right">
          <div className="login-form-container animate-fadeInUp">
            
            {view !== 'login' && (
              <button className="back-btn" onClick={() => {setView('login'); setErrors({})}}>
                <ArrowLeft size={18} /> Back to Sign In
              </button>
            )}

            <div className="login-header">
              <h2>
                {view === 'login' && 'Sign In'}
                {view === 'signup' && 'Create Account'}
                {view === 'forgot' && 'Reset Password'}
              </h2>
              <p>
                {view === 'login' && 'Welcome back! Please enter your details.'}
                {view === 'signup' && 'Join 500+ businesses using Kharchaa.'}
                {view === 'forgot' && "Enter your email and we'll send you a link."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              
              {view === 'signup' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <div className={`input-with-icon ${errors.name ? 'has-error' : ''}`}>
                      <User size={18} className="input-icon" />
                      <input 
                        className="form-input" 
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => {setName(e.target.value); if (errors.name) setErrors({...errors, name: null})}}
                      />
                    </div>
                    {errors.name && <div className="error-message"><AlertCircle size={14} /> {errors.name}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Business Name</label>
                    <div className={`input-with-icon ${errors.shopName ? 'has-error' : ''}`}>
                      <Briefcase size={18} className="input-icon" />
                      <input 
                        className="form-input" 
                        placeholder="My Awesome Bakery"
                        value={shopName}
                        onChange={(e) => {setShopName(e.target.value); if (errors.shopName) setErrors({...errors, shopName: null})}}
                      />
                    </div>
                    {errors.shopName && <div className="error-message"><AlertCircle size={14} /> {errors.shopName}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <div className={`input-with-icon ${errors.phone ? 'has-error' : ''}`}>
                      <Phone size={18} className="input-icon" />
                      <input 
                        className="form-input" 
                        placeholder="+91 00000 00000"
                        value={phone}
                        onChange={(e) => {setPhone(e.target.value); if (errors.phone) setErrors({...errors, phone: null})}}
                      />
                    </div>
                    {errors.phone && <div className="error-message"><AlertCircle size={14} /> {errors.phone}</div>}
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className={`input-with-icon ${errors.email ? 'has-error' : ''}`}>
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="admin@kharchaa.com"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value); if (errors.email) setErrors({...errors, email: null})}}
                  />
                </div>
                {errors.email && <div className="error-message"><AlertCircle size={14} /> {errors.email}</div>}
              </div>

              {view !== 'forgot' && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className={`input-with-icon ${errors.password ? 'has-error' : ''}`}>
                    <Lock size={18} className="input-icon" />
                    <input 
                      type={showPass ? 'text' : 'password'} 
                      className="form-input" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {setPassword(e.target.value); if (errors.password) setErrors({...errors, password: null})}}
                    />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <div className="error-message"><AlertCircle size={14} /> {errors.password}</div>}
                </div>
              )}

              {errors.auth && (
                <div className="error-message-full"><AlertCircle size={16} /> {errors.auth}</div>
              )}

              {view === 'signup' && (
                <div className="form-group">
                  <label className="checkbox-container" style={{ fontSize: '13px' }}>
                    <input type="checkbox" checked={agreed} onChange={e => {setAgreed(e.target.checked); if (errors.agreed) setErrors({...errors, agreed: null})}} />
                    <span className="checkmark"></span>
                    I agree to the{' '}
                    <button type="button" className="btn-link">Privacy Policy</button>
                    {' '}&{' '}
                    <button type="button" className="btn-link">Terms</button>
                  </label>
                  {errors.agreed && <div className="error-message" style={{ marginTop: 'var(--space-2)' }}><AlertCircle size={14} /> {errors.agreed}</div>}
                </div>
              )}

              {view === 'login' && (
                <div className="login-meta">
                  <label className="checkbox-container">
                    <input type="checkbox" defaultChecked />
                    <span className="checkmark"></span>
                    Remember me
                  </label>
                  <button type="button" className="btn-link" onClick={() => {setView('forgot'); setErrors({})}}>Forgot password?</button>
                </div>
              )}

              <button type="submit" className="btn btn-primary btn-full login-btn" disabled={loading}>
                {loading ? <div className="spinner-sm" /> : (
                  <>
                    {view === 'login' && 'Sign In'}
                    {view === 'signup' && 'Create Account'}
                    {view === 'forgot' && 'Send Reset Link'}
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              {view === 'login' ? (
                <>
                  <p>Test Accounts:</p>
                  <div className="test-acc-chips">
                    <span onClick={() => {setEmail('admin@kharchaa.com'); setPassword('admin123'); setErrors({})}}>Admin</span>
                    <span onClick={() => {setEmail('staff@kharchaa.com'); setPassword('staff123'); setErrors({})}}>Staff</span>
                  </div>
                  <p className="support-text">Don't have an account? <button className="btn-link" onClick={() => {setView('signup'); setErrors({})}}>Sign Up</button></p>
                </>
              ) : (
                <p className="support-text">Already have an account? <button className="btn-link" onClick={() => {setView('login'); setErrors({})}}>Sign In</button></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
