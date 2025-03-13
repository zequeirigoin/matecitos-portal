import React, { useState, useMemo } from 'react';
import './App.css';
import InvoiceForm from './components/InvoiceForm';
import InvoiceViewer from './components/InvoiceViewer';

function App() {
  const [activeTab, setActiveTab] = useState('received');
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
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

  const handleDeleteInvoice = (invoice) => {
    setDeleteConfirmation(invoice);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setInvoices(prevInvoices => 
        prevInvoices.filter(inv => inv.id !== deleteConfirmation.id)
      );
      setDeleteConfirmation(null);
    }
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      if (invoice.type !== activeTab) return false;
      if (start && invoiceDate < start) return false;
      if (end && invoiceDate > end) return false;
      if (searchTerm && !invoice.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      return true;
    });
  }, [invoices, dateFilter, activeTab, searchTerm]);

  const handleSubmit = (formData) => {
    if (editingInvoice) {
      // Actualizar factura existente
      setInvoices(prevInvoices => 
        prevInvoices.map(invoice => 
          invoice.id === editingInvoice.id ? { ...invoice, ...formData } : invoice
        )
      );
      setEditingInvoice(null);
    } else {
      // Crear nueva factura
      setInvoices(prevInvoices => [...prevInvoices, formData]);
    }
    setShowModal(false);
  };

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

  return (
    <div className="app">
      <header className="app-header">
        <h1>Portal Matecitos</h1>
        <button className="add-invoice-btn" onClick={() => setShowModal(true)}>
          Nueva Factura
        </button>
      </header>
      
      <main className="dashboard">
        <div className="stats-container">
          <div className="stat-card">
            <h3>Facturas Pendientes</h3>
            <p>{stats.pendingCount}</p>
          </div>
          <div className="stat-card">
            <h3>Por Cobrar</h3>
            <div className="amount-container">
              {Object.entries(stats.toCollect).map(([currency, amount]) => (
                <p key={currency}>{currency} ${amount.toLocaleString()}</p>
              ))}
            </div>
          </div>
          <div className="stat-card">
            <h3>Por Pagar</h3>
            <div className="amount-container">
              {Object.entries(stats.toPay).map(([currency, amount]) => (
                <p key={currency}>{currency} ${amount.toLocaleString()}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="invoices-section">
          <h2>Facturas</h2>
          
          <div className="filters-section">
            <div className="search-filter">
              <input
                type="text"
                placeholder="Buscar por referencia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="date-filters">
              <div className="filter-group">
                <label>Desde:</label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter({...dateFilter, startDate: e.target.value})}
                />
              </div>
              <div className="filter-group">
                <label>Hasta:</label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter({...dateFilter, endDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="invoice-filters">
            <button 
              className={activeTab === 'received' ? 'active' : ''} 
              onClick={() => setActiveTab('received')}
            >
              Recibidas
            </button>
            <button 
              className={activeTab === 'emitted' ? 'active' : ''} 
              onClick={() => setActiveTab('emitted')}
            >
              Emitidas
            </button>
          </div>

          <div className="invoice-list">
            {filteredInvoices.map(invoice => (
              <div key={invoice.id} className="invoice-card">
                <div className="invoice-header">
                  <h3>{invoice.reference}</h3>
                  <span className={`status-badge ${invoice.paymentStatus}`}>
                    {invoice.paymentStatus === 'pending' ? 'Pendiente' : 
                     invoice.paymentStatus === 'partial' ? 'Cobro Parcial' : 'Pagado'}
                  </span>
                </div>
                <div className="invoice-details">
                  <div className="detail-row">
                    <span>Tipo:</span>
                    <span>{invoice.type === 'received' ? 'Recibida' : 'Emitida'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Monto:</span>
                    <span>{invoice.currency} ${Number(invoice.amount).toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <span>Fecha:</span>
                    <span>{invoice.date}</span>
                  </div>
                </div>
                <div className="invoice-actions">
                  <button className="action-btn" onClick={() => setSelectedInvoice(invoice)}>Ver</button>
                  <button 
                    className="action-btn" 
                    onClick={() => {
                      setEditingInvoice(invoice);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    className="action-btn delete" 
                    onClick={() => handleDeleteInvoice(invoice)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Agregar el InvoiceViewer */}
          {selectedInvoice && (
            <InvoiceViewer 
              invoice={selectedInvoice}
              onClose={() => setSelectedInvoice(null)}
            />
          )}

          {/* Modal de creación existente */}
          {showModal && (
            <InvoiceForm 
              initialData={editingInvoice}
              onSubmit={handleSubmit}
              onClose={() => {
                setShowModal(false);
                setEditingInvoice(null);
              }} 
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
