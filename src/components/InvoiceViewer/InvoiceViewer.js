import React from 'react';
import './InvoiceViewer.css';

const InvoiceViewer = ({ invoice, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content invoice-viewer">
        <div className="viewer-header">
          <h2>{invoice.reference}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="detail-section">
          <h3>Detalles de Factura</h3>
          <div className="detail-row">
            <span>Tipo:</span>
            <span>{invoice.type === 'received' ? 'Recibida' : 'Emitida'}</span>
          </div>
          <div className="detail-row">
            <span>Monto:</span>
            <span>{invoice.currency} ${Number(invoice.amount).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <span>Estado:</span>
            <span className={`status-badge ${invoice.paymentStatus}`}>
              {invoice.paymentStatus === 'pending' ? 'Pendiente' : 
               invoice.paymentStatus === 'partial' ? 'Cobro Parcial' : 'Pagado'}
            </span>
          </div>
          <div className="detail-row">
            <span>Fecha:</span>
            <span>{invoice.date}</span>
          </div>
        </div>

        <div className="files-section">
          <h3>Documentos</h3>
          <button className="file-btn" onClick={() => window.open(URL.createObjectURL(invoice.mainPdf))}>
            Ver Factura Principal
          </button>
          
          <div className="additional-files">
            <h4>Comprobantes Fiscales</h4>
            {invoice.taxProofs.map((file, index) => (
              <button 
                key={index}
                className="file-btn"
                onClick={() => window.open(URL.createObjectURL(file))}
              >
                Ver Comprobante {index + 1}
              </button>
            ))}
          </div>
        </div>

        {invoice.observations && (
          <div className="observations-section">
            <h3>Observaciones</h3>
            <p className="invoice-observations">{invoice.observations}</p>
          </div>
        )}

        <div className="viewer-actions">
          <button onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceViewer;