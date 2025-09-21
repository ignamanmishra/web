import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({
    tasks: 0,
    complaints: 0,
    delegations: 0,
    checklists: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStats({
          tasks: 12,
          complaints: 5,
          delegations: 8,
          checklists: 23
        })
        
        setRecentActivity([
          'New task assigned: Update patient records',
          'Complaint resolved: Network issue in Ward B',
          'New delegation: Weekend duty schedule',
          'Checklist completed: Daily equipment inspection'
        ])
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="dashboard loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 sidebar">
            <div className="user-info">
              <img 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} 
                alt="User" 
                className="user-avatar" 
              />
              <h4>{user.name}</h4>
              <p>{user.department}</p>
            </div>
            
            <ul className="nav flex-column">
              <li className="nav-item">
                <Link className="nav-link active" to="/dashboard">
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/delegations">
                  <i className="fas fa-handshake"></i> Delegations
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/complaints">
                  <i className="fas fa-exclamation-circle"></i> Complaints
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/checklists">
                  <i className="fas fa-clipboard-check"></i> Checklists
                </Link>
              </li>
              {user.isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    <i className="fas fa-users-cog"></i> Admin Panel
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link" to="#">
                  <i className="fas fa-question-circle"></i> Help
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Content Area */}
          <div className="col-md-9">
            <h2>Welcome, {user.name}</h2>
            <p>Here's what's happening in your department today.</p>
            
            {/* Stats Cards */}
            <div className="stat-cards">
              <div className="stat-card">
                <h3>{stats.tasks}</h3>
                <p>Pending Tasks</p>
              </div>
              <div className="stat-card">
                <h3>{stats.complaints}</h3>
                <p>Open Complaints</p>
              </div>
              <div className="stat-card">
                <h3>{stats.delegations}</h3>
                <p>Delegations</p>
              </div>
              <div className="stat-card">
                <h3>{stats.checklists}</h3>
                <p>Checklists</p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="dashboard-section">
              <h3>Recent Activity</h3>
              <ul className="activity-list">
                {recentActivity.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </div>
            
            {/* Quick Actions */}
            <div className="dashboard-section">
              <h3>Quick Actions</h3>
              <div className="d-grid gap-2 d-md-flex">
                <Link to="/delegations" className="btn btn-primary me-md-2">
                  <i className="fas fa-handshake me-2"></i>Manage Delegations
                </Link>
                <Link to="/complaints" className="btn btn-primary me-md-2">
                  <i className="fas fa-exclamation-circle me-2"></i>Register Complaint
                </Link>
                <Link to="/checklists" className="btn btn-primary">
                  <i className="fas fa-clipboard-check me-2"></i>Complete Checklist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard