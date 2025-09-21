import { useState, useEffect } from 'react'
import { api } from '../api'

const ChecklistForm = ({ user }) => {
  const [checklists, setChecklists] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    items: [{ task: '', completed: false }]
  })

  useEffect(() => {
    fetchChecklists()
  }, [])

  const fetchChecklists = async () => {
    try {
      const result = await api.getSheetData('checklist')
      if (result.success) {
        setChecklists(result.data)
      }
    } catch (error) {
      console.error('Error fetching checklists:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const completedItems = formData.items.filter(item => item.completed).length
      const totalItems = formData.items.length
      
      const result = await api.appendToSheet('checklist', {
        title: formData.title,
        department: formData.department,
        completedBy: user.name,
        completionRate: `${completedItems}/${totalItems}`,
        status: completedItems === totalItems ? 'Completed' : 'In Progress',
        date: new Date().toISOString().split('T')[0]
      })
      
      if (result.success) {
        alert('Checklist saved successfully!')
        setFormData({ title: '', department: '', items: [{ task: '', completed: false }] })
        fetchChecklists()
      } else {
        alert('Failed to save checklist: ' + result.message)
      }
    } catch (error) {
      console.error('Error saving checklist:', error)
      alert('An error occurred while saving checklist')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTaskChange = (index, value) => {
    const newItems = [...formData.items]
    newItems[index].task = value
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const handleCheckboxChange = (index) => {
    const newItems = [...formData.items]
    newItems[index].completed = !newItems[index].completed
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addNewItem = () => {
    setFormData(prev => ({ 
      ...prev, 
      items: [...prev.items, { task: '', completed: false }] 
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, items: newItems }))
    }
  }

  if (loading) {
    return <div className="container mt-4">Loading checklists...</div>
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
              <a className="nav-link" href="/complaints">
                <i className="fas fa-exclamation-circle"></i> Complaints
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">
                <i className="fas fa-clipboard-check"></i> Checklists
              </a>
            </li>
          </ul>
        </div>
        
        <div className="col-md-9">
          <div className="form-container">
            <h2>Daily Checklist</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Checklist Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
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
                      value={formData.department}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Ophthalmology">Ophthalmology</option>
                      <option value="Women Care">Women Care</option>
                      <option value="Admin">Admin</option>
                      <option value="IT">IT</option>
                      <option value="Nursing">Nursing</option>
                      <option value="All">All Departments</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-group">
                <label>Checklist Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleCheckboxChange(index)}
                      className="me-2"
                    />
                    <input
                      type="text"
                      value={item.task}
                      onChange={(e) => handleTaskChange(index, e.target.value)}
                      className="form-control"
                      placeholder="Task description"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => removeItem(index)}
                      className="btn btn-sm btn-danger ms-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addNewItem}
                  className="btn btn-sm btn-secondary mt-2"
                >
                  Add Item
                </button>
              </div>
              
              <button type="submit" className="btn btn-primary">Save Checklist</button>
            </form>
          </div>
          
          <div className="table-container">
            <h2>Checklist History</h2>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Department</th>
                    <th>Completed By</th>
                    <th>Completion</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {checklists.map(checklist => (
                    <tr key={checklist.id}>
                      <td>{checklist.title}</td>
                      <td>{checklist.department}</td>
                      <td>{checklist.completedBy}</td>
                      <td>{checklist.completionRate}</td>
                      <td>
                        <span className={`badge bg-${checklist.status === 'Completed' ? 'success' : 'info'}`}>
                          {checklist.status}
                        </span>
                      </td>
                      <td>{checklist.date}</td>
                      <td>
                        <button className="btn btn-sm btn-info">View</button>
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

export default ChecklistForm