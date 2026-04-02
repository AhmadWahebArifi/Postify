import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../api'
import Swal from 'sweetalert2'
import './Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || (isRegistering && (!username || !confirmPassword))) return

    if (isRegistering && password !== confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure your password and confirm password fields are identical.',
        confirmButtonColor: '#6366f1'
      })
      return
    }

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

        await Swal.fire({
          icon: 'success',
          title: 'Account Created!',
          text: 'Welcome to Postify, ' + res.data.username + '!',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        // Login existing user
        const res = await axios.post(`${API}/login`, { email, password })
        
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify({ 
          id: res.data.userId, 
          username: res.data.username,
          email 
        }))

        await Swal.fire({
          icon: 'success',
          title: 'Welcome Back!',
          text: 'You have successfully logged in.',
          timer: 1500,
          showConfirmButton: false
        })
      }
      
      setIsLoading(false)
      navigate('/')
    } catch (error: any) {
      console.error('Auth failed:', error)
      
      const errorMessage = error?.response?.data?.message || 
                          error?.response?.data || 
                          'Something went wrong. Please try again.'

      await Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: errorMessage,
        confirmButtonColor: '#6366f1'
      })

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

            {isRegistering && (
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  placeholder="Confirm your password"
                  required={isRegistering}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !email || !password || (isRegistering && (!username || !confirmPassword))}
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
