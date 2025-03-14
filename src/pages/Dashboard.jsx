import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.svg';
import InvoiceForm from '../components/InvoiceForm';
import InvoiceViewer from '../components/InvoiceViewer';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  // Add handleSubmit function
  const handleSubmit = (formData) => {
    if (editingInvoice) {
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === editingInvoice.id ? { ...invoice, ...formData } : invoice
        )
      );
    } else {
      const newInvoice = {
        ...formData,
        id: `${new Date().toISOString()}_${Math.random().toString(36).substr(2, 9)}`
      };
      setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
    }
    setShowModal(false);
    setEditingInvoice(null);
  };

  // Add this function definition
  const handleNewInvoice = () => {
    setEditingInvoice(null);  // Reset editing state
    setShowModal(true);       // Show the modal
  };
  const [activeTab, setActiveTab] = useState('received');
  // Remove the duplicate showModal declaration here
  // Initialize dateFilter state with empty strings instead of null
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  // Remove the duplicate editingInvoice declaration here
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  // Fix the invoices state initialization
  const [invoices, setInvoices] = useState([
    {
      id: '15-1-2024_14-30',
      reference: 'Servicios de Desarrollo',
      amount: 5000,
      currency: 'USD',
      paymentStatus: 'pending',
      date: '2024-01-15',
      type: 'received',
      mainPdf: new File([new Blob()], 'factura-desarrollo.pdf', { type: 'application/pdf' }),
      taxProofs: [
        new File([new Blob()], 'comprobante-pago.pdf', { type: 'application/pdf' }),
        new File([new Blob()], 'comprobante-transferencia.pdf', { type: 'application/pdf' })
      ],
      observations: 'Pago programado para el 30/01/2024'
    },
  ]);

  // Add all the missing state management functions from App.js
  const handleDeleteInvoice = (invoice) => {
    setDeleteConfirmation(invoice);
  };

  const confirmDelete = () => {
    if (deleteConfirmation && deleteConfirmationText.toLowerCase() === 'eliminar') {
      setInvoices(prevInvoices => 
        prevInvoices.filter(inv => inv.id !== deleteConfirmation.id)
      );
      setDeleteConfirmation(null);
      setDeleteConfirmationText('');
    }
  };

  // Add the stats calculation
  const stats = useMemo(() => {
    const pending = invoices.filter(inv => inv.paymentStatus === 'pending');
    
    const totals = invoices.reduce((acc, inv) => {
      if (inv.paymentStatus === 'pending') {
        if (inv.type === 'emitted') {
          acc.toCollect[inv.currency] = (acc.toCollect[inv.currency] || 0) + Number(inv.amount);
        } else {
          acc.toPay[inv.currency] = (acc.toPay[inv.currency] || 0) + Number(inv.amount);
        }
      }
      return acc;
    }, { toCollect: {}, toPay: {} });

    return {
      pendingCount: pending.length,
      toCollect: totals.toCollect,
      toPay: totals.toPay
    };
  }, [invoices]);

  // Add the filtered invoices calculation
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;
      
      // Original filtering logic
      if (invoice.type !== activeTab) return false;
      if (start && invoiceDate < start) return false;
      if (end && invoiceDate > end) return false;
      if (searchTerm && !invoice.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      return true;
    });
  }, [invoices, dateFilter, activeTab, searchTerm]);

  // Add payment status update handler
  const handlePaymentStatusUpdate = (invoiceId, newStatus) => {
    setInvoices(prevInvoices => 
      prevInvoices.map(invoice => 
        invoice.id === invoiceId ? {...invoice, paymentStatus: newStatus} : invoice
      )
    );
  };

  // Add handleDateChange function
  const handleDateChange = (type, value) => {
    setDateFilter(prev => {
      let newDateFilter = {...prev, [type]: value};
      
      // If we're setting the start date and there's already an end date
      if (type === 'startDate' && newDateFilter.endDate) {
        const startDate = new Date(value);
        const endDate = new Date(newDateFilter.endDate);
        
        // If new start date is after end date, adjust end date
        if (startDate > endDate) {
          newDateFilter.endDate = value;
        }
      }
      
      // If we're setting the end date and there's already a start date
      if (type === 'endDate' && newDateFilter.startDate) {
        const startDate = new Date(newDateFilter.startDate);
        const endDate = new Date(value);
        
        // If new end date is before start date, adjust start date
        if (endDate < startDate) {
          newDateFilter.startDate = value;
        }
      }
      
      return newDateFilter;
    });
  };

  return (
    <div className="app">
      {/* Header section */}
      <header className="app-header" style={{ backgroundColor: '#16202C' }}>
        <div className="header-left">
          <img src={logo} alt="Matecitos Logo" className="app-logo" />
          <h1 style={{ color: 'white' }}>Sistema de Administración de Matecitos</h1>
        </div>
        <div className="header-right">
          <button className="btn-primary" onClick={handleNewInvoice}>
            Nueva Factura
          </button>
          <button onClick={logout} className="logout-btn">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard">
        <h1>Bienvenido {user?.email}</h1>
        
        {/* Stats Container */}
        <div className="stats-container">
          <div className="stat-card">
            <h3>Pendientes</h3>
            <p>{stats.pendingCount}</p>
          </div>
          <div className="stat-card">
            <h3>Por Cobrar</h3>
            {Object.entries(stats.toCollect).map(([currency, amount]) => (
              <p key={currency}>{currency} ${amount}</p>
            ))}
          </div>
          <div className="stat-card">
            <h3>Por Pagar</h3>
            {Object.entries(stats.toPay).map(([currency, amount]) => (
              <p key={currency}>{currency} ${amount}</p>
            ))}
          </div>
        </div>

        {/* Sección de Filtros */}
        <div className="invoice-filters">
          <div className="date-filter">
            <div className="date-range">
              <label>Desde:</label>
              <input
                type="date"
                className="date-input"
                value={dateFilter.startDate || ''}
                onChange={e => handleDateChange('startDate', e.target.value)}
              />
            </div>
            <div className="date-range">
              <label>Hasta:</label>
              <input
                type="date"
                className="date-input"
                value={dateFilter.endDate || ''}
                onChange={e => handleDateChange('endDate', e.target.value)}
                min={dateFilter.startDate || ''}
              />
            </div>
          </div>
          <div className="search-filter">
            <input
              type="text"
              placeholder="Buscar por referencia..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Tabs y Lista de Facturas */}
        <div className="invoice-tabs">
          <button 
            className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
            onClick={() => setActiveTab('received')}
          >
            Facturas Recibidas
          </button>
          <button 
            className={`tab-button ${activeTab === 'emitted' ? 'active' : ''}`}
            onClick={() => setActiveTab('emitted')}
          >
            Facturas Emitidas
          </button>
        </div>

        <div className="invoice-list">
          {filteredInvoices.map(invoice => (
            <div key={invoice.id} className="invoice-item">
              <div className="invoice-info">
                <span><strong>Referencia:</strong> {invoice.reference}</span>
                <span><strong>Monto:</strong> {invoice.amount} {invoice.currency}</span>
                <span><strong>Fecha:</strong> {invoice.date}</span>
              </div>
              <div className="invoice-actions">
                <button onClick={() => setSelectedInvoice(invoice)}>Ver</button>
                <button onClick={() => {
                  setEditingInvoice(invoice);
                  setShowModal(true);
                }}>Editar</button>
                {user?.email !== 'administracion@matecitos.ar' && (
                  <button onClick={() => handleDeleteInvoice(invoice)}>Eliminar</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Modal rendering */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InvoiceForm 
              initialData={editingInvoice}
              onSubmit={handleSubmit}
              onClose={() => {
                setShowModal(false);
                setEditingInvoice(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Invoice Viewer Modal */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-content">
            <InvoiceViewer 
              invoice={selectedInvoice}
              onClose={() => setSelectedInvoice(null)}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="delete-confirmation">
              <h3>Confirmar Eliminación</h3>
              <p>¿Estás seguro que deseas eliminar la factura {deleteConfirmation.reference}?</p>
              <p>Escribe "ELIMINAR" para confirmar:</p>
              <input
                type="text"
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
              />
              <div className="confirmation-buttons">
                <button 
                  onClick={confirmDelete}
                  disabled={deleteConfirmationText.toLowerCase() !== 'eliminar'}
                >
                  Eliminar
                </button>
                <button onClick={() => {
                  setDeleteConfirmation(null);
                  setDeleteConfirmationText('');
                }}>
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;