import React, { useState, useMemo } from 'react';
import './App.css';
import InvoiceForm from './components/InvoiceForm';

function App() {
  const [activeTab, setActiveTab] = useState('received');
  const [showModal, setShowModal] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Move demo data to useMemo
  const demoInvoices = useMemo(() => [
    {
      id: '15-1-2024_14-30',
      reference: 'Servicios de Desarrollo',
      amount: 5000,
      currency: 'USD',
      status: 'Pendiente',
      date: '2024-01-15',
      type: 'received'
    },
    { id: '2', number: 'A-002', amount: 1500, currency: 'USD', status: 'Pagada', date: '2024-01-10', type: 'received' },
    { id: '3', number: 'B-001', amount: 8000, currency: 'ARS', status: 'Pendiente', date: '2024-01-05', type: 'received' }
  ], []);

  const filteredInvoices = useMemo(() => {
    return demoInvoices.filter(invoice => {
      const invoiceDate = new Date(invoice.date);
      const start = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
      const end = dateFilter.endDate ? new Date(dateFilter.endDate) : null;

      // Filtro por tipo
      if (invoice.type !== activeTab) return false;
      // Filtro por fecha
      if (start && invoiceDate < start) return false;
      if (end && invoiceDate > end) return false;
      // Filtro por referencia
      if (searchTerm && !invoice.reference.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      return true;
    });
  }, [demoInvoices, dateFilter, activeTab, searchTerm]);

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
            <p>15</p>
          </div>
          <div className="stat-card">
            <h3>Por Cobrar</h3>
            <div className="amount-container">
              <p>ARS $45,000</p>
              <p>USD $1,500</p>
            </div>
          </div>
          <div className="stat-card">
            <h3>Por Pagar</h3>
            <div className="amount-container">
              <p>ARS $32,000</p>
              <p>USD $800</p>
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
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-details">
                  <h4>Factura #{invoice.number}</h4>
                  <p className="invoice-amount">
                    {invoice.currency} ${invoice.amount.toLocaleString()}
                  </p>
                  <p className="invoice-status">{invoice.status}</p>
                  <p className="invoice-date">{invoice.date}</p>
                </div>
                <div className="invoice-actions">
                  <button>Ver</button>
                  <button>Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showModal && <InvoiceForm onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default App;
