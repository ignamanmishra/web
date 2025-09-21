import { useState, useEffect } from 'react'
import { api } from '../api'

const AdminPanel = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [userForm, setUserForm] = useState({
    username: '',
    password: '',
    name: '',
    department: '',
    isAdmin: false
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersResult, deptResult] = await Promise.all([
        api.getSheetData('user'),
        api.getSheetData('departments')
      ])
      
      if (usersResult.success) setUsers(usersResult.data)
      if (deptResult.success) setDepartments(deptResult.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await api.appendToSheet('user', userForm)
      
      if (result.success) {
        alert('User created successfully!')
        setUserForm({ username: '', password: '', name: '', department: '', isAdmin: false })
        fetchData()
      } else {
        alert('Failed to create user: ' + result.message)
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('An error occurred while creating user')
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setUserForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (loading) {
    return <div className="container mt-4">Loading admin panel...</div>
  }

  return (
    <div className="container mt-4">
      <div className="row">
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
              <a className="nav-link" href="/dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="fas fa-users-cog"></i> Admin Panel
              </a>
            </li>
          </ul>
        </div>
        
        <div className="col-md-9">
          <h2>Admin Panel</h2>
          
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                User Management
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`}
                onClick={() => setActiveTab('departments')}
              >
                Departments
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                Reports
              </button>
            </li>
          </ul>
          
          <div className="tab-content mt-3">
            {activeTab === 'users' && (
              <div>
                <div className="form-container">
                  <h3>Create New User</h3>
                  <form onSubmit={handleUserSubmit}>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Username</label>
                          <input
                            type="text"
                            name="username"
                            value={userForm.username}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Password</label>
                          <input
                            type="password"
                            name="password"
                            value={userForm.password}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Full Name</label>
                          <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Department</label>
                          <select
                            name="department"
                            value={userForm.department}
                            onChange={handleInputChange}
                            className="form-control"
                            required
                          >
                            <option value="">Select Department</option>
                            <option value="admin">Admin</option>
                            <option value="it">IT</option>
                            <option value="hr">HR</option>
                            <option value="nursing">Nursing</option>
                            <option value="managers">Managers</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-group form-check">
                      <input
                        type="checkbox"
                        name="isAdmin"
                        checked={userForm.isAdmin}
                        onChange={handleInputChange}
                        className="form-check-input"
                        id="isAdmin"
                      />
                      <label className="form-check-label" htmlFor="isAdmin">
                        Administrator Privileges
                      </label>
                    </div>
                    
                    <button type="submit" className="btn btn-primary">Create User</button>
                  </form>
                </div>
                
                <div className="table-container">
                  <h3>User List</h3>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Department</th>
                          <th>Admin</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.name}</td>
                            <td>{user.department}</td>
                            <td>
                              {user.isAdmin ? (
                                <span className="badge bg-success">Yes</span>
                              ) : (
                                <span className="badge bg-secondary">No</span>
                              )}
                            </td>
                            <td>
                              <button className="btn btn-sm btn-info me-1">Edit</button>
                              <button className="btn btn-sm btn-danger">Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'departments' && (
              <div className="table-container">
                <h3>Departments</h3>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Head</th>
                        <th>Employees</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => (
                        <tr key={dept.id}>
                          <td>{dept.name}</td>
                          <td>{dept.head}</td>
                          <td>{dept.employeeCount}</td>
                          <td>
                            <button className="btn btn-sm btn-info me-1">View</button>
                            <button className="btn btn-sm btn-warning">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div>
                <h3>Reports</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{users.length}</h3>
                      <p>Total Users</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{departments.length}</h3>
                      <p>Departments</p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="stat-card">
                      <h3>{departments.reduce((acc, dept) => acc + dept.employeeCount, 0)}</h3>
                      <p>Total Employees</p>
                    </div>
                  </div>
                </div>
                
                <div className="table-container mt-4">
                  <h4>Recent Activity</h4>
                  <p>Reports and analytics will be displayed here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel