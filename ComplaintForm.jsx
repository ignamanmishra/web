import { useState, useEffect } from 'react'
import { api } from '../api'

const ComplaintForm = ({ user }) => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    priority: 'Medium'
  })

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const result = await api.getSheetData('complaint')
      if (result.success) {
        setComplaints(result.data)
      }
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const result = await api.appendToSheet('complaint', {
        ...formData,
        reportedBy: user.name,
        department: user.department,
        status: 'Open',
        date: new Date().toISOString().split('T')[0]
      })
      
      if (result.success) {
        alert('Complaint registered successfully!')
        setFormData({ category: '', description: '', priority: 'Medium' })
        fetchComplaints()
      } else {
        alert('Failed to register complaint: ' + result.message)
      }
    } catch (error) {
      console.error('Error registering complaint:', error)
      alert('An error occurred while registering complaint')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <div className="container mt-4">Loading complaints...</div>
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
              <a className="nav-link" href="/delegations">
                <i className="fas fa-handshake"></i> Delegations
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="fas fa-exclamation-circle"></i> Complaints
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/checklists">
                <i className="fas fa-clipboard-check"></i> Checklists
              </a>
            </li>
          </ul>
        </div>
        
        <div className="col-md-9">
          <div className="form-container">
            <h2>Register New Complaint</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Facility">Facility</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Medical">Medical</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">Register Complaint</button>
            </form>
          </div>
          
          <div className="table-container">
            <h2>Complaint List</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(complaint => (
                    <tr key={complaint.id}>
                      <td>{complaint.category}</td>
                      <td>{complaint.description}</td>
                      <td>
                        <span className={`badge bg-${
                          complaint.priority === 'Critical' ? 'danger' : 
                          complaint.priority === 'High' ? 'warning' : 
                          complaint.priority === 'Medium' ? 'info' : 'secondary'
                        }`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`badge bg-${complaint.status === 'Resolved' ? 'success' : 'warning'}`}>
                          {complaint.status}
                        </span>
                      </td>
                      <td>{complaint.date}</td>
                      <td>
                        <button className="btn btn-sm btn-info me-1">View</button>
                        <button className="btn btn-sm btn-success">Resolve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintForm