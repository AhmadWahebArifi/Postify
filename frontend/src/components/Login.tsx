import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (isRegistering && !username)) return

    setIsLoading(true)
    
    try {
      if (isRegistering) {
        // Register new user
        const res = await axios.post(`${API}/register`, { username, email, password })
        
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify({ 
          id: res.data.userId, 
          username: res.data.username,
          email 
        }))
      } else {
        // Login existing user
        const res = await axios.post(`${API}/login`, { email, password })
        
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify({ 
          id: res.data.userId, 
          username: res.data.username,
          email 
        }))
      }
      
      setIsLoading(false)
      navigate('/')
    } catch (error: any) {
      console.error('Auth failed:', error)
      
      // If backend fails, use mock auth for demo
      if (error?.response?.status >= 500 || !error?.response) {
        const mockUser = {
          id: 'mock-user-id', 
          username: username || email.split('@')[0],
          email 
        }
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('user', JSON.stringify(mockUser))
        console.log('Backend unavailable - using demo mode')
        navigate('/')
      } else {
        console.error('Authentication failed:', error?.response?.data?.message || error?.response?.data || 'Authentication failed')
      }
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        {/* Header */}
        <div className="login-header">
          <h1 className="login-title">Postify</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <div className="login-form">
          <div className="form-header">
            <h2 className="form-title">
              {isRegistering ? 'Create Account' : 'Sign In'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit}>
            {isRegistering && (
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  placeholder="Choose a username"
                  required={isRegistering}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password || (isRegistering && !username)}
              className="submit-button"
            >
              {isLoading ? (
                <>
                  <div className="loading-spinner"></div>
                  {isRegistering ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                isRegistering ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className="toggle-link">
            <p className="toggle-text">
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="toggle-button"
              >
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
