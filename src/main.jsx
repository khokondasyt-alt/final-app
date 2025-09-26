import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';

// Initialize admin user if not exists
const users = JSON.parse(localStorage.getItem('users') || '[]');
if (!users.find(u => u.role === 'admin')) {
  users.push({
    id: 1,
    name: 'Admin',
    mobile: 'admin',
    password: 'admin123',
    gender: 'male',
    role: 'admin',
    approved: true,
    online: true
  });
  localStorage.setItem('users', JSON.stringify(users));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
