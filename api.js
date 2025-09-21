const API_KEY = "AIzaSyBnNrZ77C2ZoyBAJjI1w-OWFximgOZv7gA";
const SPREADSHEET_ID = '1wmNK0h8H2I40C-Jw0KcLljRwKOl0XRv-F8H3RHMu07w';
const SHEET_IDS = {
  user: 30175565,
  delegation: 558920241,
  complaint: 729742065,
  departments: 1728489780,
  checklist: 1260661687,
  master: 0
};

// For development without Apps Script, we'll use a mock API
const isDev = true;

// Mock data for development
const mockData = {
  user: [
    { id: 1, username: 'admin', password: 'admin123', name: 'System Administrator', department: 'admin', isAdmin: true },
    { id: 2, username: 'it.user', password: 'it123', name: 'IT Manager', department: 'it', isAdmin: false },
    { id: 3, username: 'hr.user', password: 'hr123', name: 'HR Manager', department: 'hr', isAdmin: false },
    { id: 4, username: 'nursing.user', password: 'nursing123', name: 'Nursing Head', department: 'nursing', isAdmin: false },
    { id: 5, username: 'manager.user', password: 'manager123', name: 'Department Manager', department: 'managers', isAdmin: false },
  ],
  master: [
    { id: 1, name: 'Dr. Raj Sharma', designation: 'Senior Ophthalmologist', department: 'Ophthalmology', phone: '9876543210', email: 'raj.sharma@sbhhospital.com' },
    { id: 2, name: 'Dr. Priya Singh', designation: 'Gynecologist', department: 'Women Care', phone: '9876543211', email: 'priya.singh@sbhhospital.com' },
    { id: 3, name: 'Mr. Verma', designation: 'Admin Head', department: 'Admin', phone: '9876543212', email: 'verma@sbhhospital.com' },
  ],
  delegation: [
    { id: 1, title: 'Weekend Duty Schedule', assignedTo: 'Nursing Staff', assignedBy: 'Admin', dueDate: '2023-08-15', status: 'Pending', description: 'Create weekend duty roster for nursing staff' },
    { id: 2, title: 'IT Maintenance', assignedTo: 'IT Department', assignedBy: 'Admin', dueDate: '2023-08-10', status: 'Completed', description: 'Perform monthly maintenance on all computers' },
  ],
  complaint: [
    { id: 1, category: 'Facility', description: 'AC not working in reception', reportedBy: 'Reception Staff', date: '2023-08-05', status: 'In Progress' },
    { id: 2, category: 'IT', description: 'Printer not working in admin office', reportedBy: 'Admin Staff', date: '2023-08-08', status: 'Open' },
  ],
  checklist: [
    { id: 1, title: 'Daily Equipment Check', department: 'Ophthalmology', completedBy: 'Technician', date: '2023-08-09', status: 'Completed' },
    { id: 2, title: 'Sanitization Checklist', department: 'All', completedBy: 'Housekeeping', date: '2023-08-09', status: 'Pending' },
  ],
  departments: [
    { id: 1, name: 'Ophthalmology', head: 'Dr. Raj Sharma', employeeCount: 15 },
    { id: 2, name: 'Women Care', head: 'Dr. Priya Singh', employeeCount: 12 },
    { id: 3, name: 'Admin', head: 'Mr. Verma', employeeCount: 8 },
    { id: 4, name: 'IT', head: 'IT Manager', employeeCount: 5 },
    { id: 5, name: 'Nursing', head: 'Nursing Head', employeeCount: 25 },
  ]
};

// Google Sheets API URL for reading data
const getSheetsApiUrl = (sheetName) => {
  const sheetId = SHEET_IDS[sheetName] || 0;
  return `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheetName}?key=${API_KEY}`;
};

// API functions
export const api = {
  // Login authentication
  login: async (username, password) => {
    if (isDev) {
      // Mock authentication
      const user = mockData.user.find(u => u.username === username && u.password === password);
      if (user) {
        // Remove password from returned user object
        const { password: _, ...userWithoutPassword } = user;
        return { success: true, user: userWithoutPassword };
      }
      return { success: false, message: 'Invalid credentials' };
    } else {
      // Real implementation using Google Sheets API
      try {
        const response = await fetch(getSheetsApiUrl('user'));
        const data = await response.json();
        
        if (data.values) {
          const users = data.values.slice(1).map(row => ({
            id: row[0],
            username: row[1],
            password: row[2],
            name: row[3],
            department: row[4],
            isAdmin: row[5] === 'true'
          }));
          
          const user = users.find(u => u.username === username && u.password === password);
          if (user) {
            const { password: _, ...userWithoutPassword } = user;
            return { success: true, user: userWithoutPassword };
          }
        }
        
        return { success: false, message: 'Invalid credentials' };
      } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Login failed' };
      }
    }
  },

  // Get data from sheet
  getSheetData: async (sheetName) => {
    if (isDev) {
      // Return mock data
      return { success: true, data: mockData[sheetName] || [] };
    } else {
      // Real implementation using Google Sheets API
      try {
        const response = await fetch(getSheetsApiUrl(sheetName));
        const data = await response.json();
        
        if (data.values) {
          // Convert sheet data to array of objects
          const headers = data.values[0];
          const rows = data.values.slice(1);
          
          const result = rows.map(row => {
            const obj = {};
            headers.forEach((header, i) => {
              obj[header] = row[i] || '';
            });
            return obj;
          });
          
          return { success: true, data: result };
        } else {
          return { success: true, data: [] };
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        return { success: false, message: 'Failed to fetch data' };
      }
    }
  },

  // Append data to sheet
  appendToSheet: async (sheetName, data) => {
    if (isDev) {
      // Mock append operation
      const newId = Math.max(...(mockData[sheetName] || []).map(item => item.id || 0), 0) + 1;
      const newData = { id: newId, ...data };
      
      if (!mockData[sheetName]) {
        mockData[sheetName] = [];
      }
      
      mockData[sheetName].push(newData);
      return { success: true, data: newData };
    } else {
      // Real implementation would require Google Apps Script
      try {
        // This would require a Google Apps Script web app for write operations
        const response = await fetch('YOUR_APPS_SCRIPT_WEB_APP_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'append',
            sheetName,
            data
          })
        });
        
        return await response.json();
      } catch (error) {
        console.error('Error appending data:', error);
        return { success: false, message: 'Failed to save data' };
      }
    }
  },

  // Update data in sheet
  updateInSheet: async (sheetName, rowId, updates) => {
    if (isDev) {
      // Mock update operation
      if (mockData[sheetName]) {
        const itemIndex = mockData[sheetName].findIndex(item => item.id == rowId);
        if (itemIndex !== -1) {
          mockData[sheetName][itemIndex] = { ...mockData[sheetName][itemIndex], ...updates };
          return { success: true };
        }
      }
      return { success: false, message: 'Update failed' };
    } else {
      // Real implementation would require Google Apps Script
      try {
        const response = await fetch('YOUR_APPS_SCRIPT_WEB_APP_URL', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'update',
            sheetName,
            rowId,
            updates
          })
        });
        
        return await response.json();
      } catch (error) {
        console.error('Error updating data:', error);
        return { success: false, message: 'Failed to update data' };
      }
    }
  }
};

export default api;