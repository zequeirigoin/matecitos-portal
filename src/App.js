import React, { useState, useMemo } from 'react';
import './App.css';
import InvoiceForm from './components/InvoiceForm';
import InvoiceViewer from './components/InvoiceViewer';
import logo from './assets/logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard.jsx';  // Ensure default import
import LoginForm from './components/LoginForm';
import { useAuth } from './contexts/AuthContext';  // Add this line
import { AuthProvider } from './contexts/AuthContext'; // Add this import
// Remove this line: import InvoiceManager from './components/InvoiceManager';
import { useEffect } from 'react';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const savedInvoices = localStorage.getItem('invoices');
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  useEffect(() => {
    if (invoices.length > 0) {
      localStorage.setItem('invoices', JSON.stringify(invoices));
    }
  }, [invoices]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/nueva-factura" element={<InvoiceForm />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
