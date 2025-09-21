import { useState, useEffect } from 'react';
import { api } from '../api';

const DelegationForm = ({ user }) => {
  const [delegations, setDelegations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    assignedTo: '',
    dueDate: '',
    description: ''
  });

  useEffect(() => {
    fetchDelegations();
  }, []);

  const fetchDelegations = async () => {
    try {
      const result = await api.getSheetData('delegation');
      
      if (result.success) {
        setDelegations(result.data);
      } else {
        console.error('Error fetching delegations:', result.message);
        alert('Failed to fetch delegations: ' + result.message);
      }
    } catch (error) {
      console.error('Error fetching delegations:', error);
      alert('An error occurred while fetching delegations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const delegationData = {
        ...formData,
        assignedBy: user.name,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString()
      };

      const result = await api.appendToSheet('delegation', delegationData);
      
      if (result.success) {
        alert('Delegation created successfully!');
        setFormData({ title: '', assignedTo: '', dueDate: '', description: '' });
        fetchDelegations();
      } else {
        alert('Failed to create delegation: ' + result.message);
      }
    } catch (error) {
      console.error('Error creating delegation:', error);
      alert('An error occurred while creating delegation');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCompleteDelegation = async (delegationId) => {
    try {
      const result = await api.updateInSheet(
        'delegation', 
        delegationId, 
        { status: 'Completed', completedAt: new Date().toISOString() }
      );
      
      if (result.success) {
        alert('Delegation marked as completed!');
        fetchDelegations();
      } else {
        alert('Failed to update delegation: ' + result.message);
      }
    } catch (error) {
      console.error('Error completing delegation:', error);
      alert('An error occurred while completing delegation');
    }
  };

  const handleViewDelegation = (delegation) => {
    alert(`Delegation Details:\n
Title: ${delegation.title}
Assigned To: ${delegation.assignedTo}
Assigned By: ${delegation.assignedBy}
Due Date: ${delegation.dueDate}
Status: ${delegation.status}
Description: ${delegation.description}
Created: ${delegation.date}`);
  };

  if (loading) {
    return <div className="loading">Loading delegations...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3 sidebar">
          <div className="user-info">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
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
                <i className="fas fa-handshake"></i> Delegations
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/complaints">
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
            <h2>Create New Delegation</h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      placeholder="Enter delegation title"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Assign To</label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Admin">Admin</option>
                      <option value="IT">IT</option>
                      <option value="HR">HR</option>
                      <option value="Nursing">Nursing</option>
                      <option value="Managers">Managers</option>
                      <option value="Finance">Finance</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Due Date</label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Assigned By</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.name}
                      disabled
                    />
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
                  placeholder="Provide detailed instructions for this delegation"
                ></textarea>
              </div>
              
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-plus-circle me-2"></i>Create Delegation
              </button>
            </form>
          </div>
          
          <div className="table-container">
            <h2>Delegation List</h2>
            {delegations.length === 0 ? (
              <div className="alert alert-info">
                No delegations found. Create your first delegation above.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Assigned To</th>
                      <th>Assigned By</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delegations.map((delegation, index) => (
                      <tr key={index}>
                        <td>{delegation.title || 'No Title'}</td>
                        <td>{delegation.assignedTo || 'Unassigned'}</td>
                        <td>{delegation.assignedBy || user.name}</td>
                        <td>{delegation.dueDate || 'No due date'}</td>
                        <td>
                          <span className={`badge ${
                            delegation.status === 'Completed' ? 'bg-success' : 
                            delegation.status === 'In Progress' ? 'bg-info' : 
                            'bg-warning'
                          }`}>
                            {delegation.status || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-info me-1"
                            onClick={() => handleViewDelegation(delegation)}
                          >
                            <i className="fas fa-eye me-1"></i>View
                          </button>
                          {delegation.status !== 'Completed' && (
                            <button 
                              className="btn btn-sm btn-success"
                              onClick={() => handleCompleteDelegation(delegation.id || index)}
                            >
                              <i className="fas fa-check me-1"></i>Complete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DelegationForm;