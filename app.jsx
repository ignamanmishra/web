import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AdminPanel from './components/AdminPanel'
import DelegationForm from './components/DelegationForm'
import ComplaintForm from './components/ComplaintForm'
import ChecklistForm from './components/ChecklistForm'
import './styles.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('sbhUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('sbhUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('sbhUser')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <div className="app">
        <header className="header">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-2">
                <img 
                  src="https://media.licdn.com/dms/image/v2/C4D0BAQHsfzb9YepzFQ/company-logo_200_200/company-logo_200_200/0/1630580004025?e=2147483647&v=beta&t=u77jkth5sdkVfrCfLpk8HI02MZRVgTTeT6bY4hIfnL8" 
                  alt="SBH Group Of Hospital" 
                  className="logo"
                />
              </div>
              <div className="col-md-8">
                <h1>SBH Group Of Hospital</h1>
                <p>Internal Employee Portal</p>
              </div>
              <div className="col-md-2 text-end">
                {user && (
                  <button onClick={handleLogout} className="btn btn-primary">
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={user?.isAdmin ? <AdminPanel user={user} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/delegations" 
              element={user ? <DelegationForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/complaints" 
              element={user ? <ComplaintForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/checklists" 
              element={user ? <ChecklistForm user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
            />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>&copy; 2023 SBH Group Of Hospital. All rights reserved.</p>
            <p>Best Eye and Women's Care Treatments</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App