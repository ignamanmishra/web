import { useState } from 'react'
import { api } from '../api'

const ForgotPassword = ({ onBackToLogin }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!username || !email || !employeeId) {
      setError('Please fill all fields')
      setLoading(false)
      return
    }

    try {
      const result = await api.getSheetData('user')
      
      if (result.success) {
        const user = result.data.find(u => 
          u.username === username && 
          u.email === email && 
          u.employeeId === employeeId
        )

        if (user) {
          setSuccess(`Password reset instructions have been sent to ${email}`)
        } else {
          setError('No account found with the provided information')
        }
      } else {
        setError('Failed to verify account information')
      }
    } catch (err) {
      setError('An error occurred while processing your request')
      console.error('Forgot password error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <h2>Reset Password</h2>
          <p className="text-muted">Enter your account details to reset your password</p>
        </div>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your registered email"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="employeeId">Employee ID:</label>
          <input
            type="text"
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            required
            placeholder="Enter your employee ID"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary w-100"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
        
        <div className="text-center mt-3">
          <button 
            type="button" 
            className="btn btn-link text-decoration-none"
            onClick={onBackToLogin}
          >
            ← Back to Login
          </button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword