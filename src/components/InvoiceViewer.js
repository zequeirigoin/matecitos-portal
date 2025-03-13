import React from 'react';

function InvoiceViewer({ invoice, onClose }) {
  const downloadFile = (file, filename) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Detalles de Factura</h2>
        
        <div className="invoice-viewer">
          <div className="detail-section">
            <div className="detail-row">
              <span>Referencia:</span>
              <span>{invoice.reference}</span>
            </div>
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
          </div>

          <div className="files-section">
            <h3>Archivos</h3>
            {invoice.mainPdf && (
              <button 
                className="file-btn"
                onClick={() => downloadFile(invoice.mainPdf, invoice.mainPdf.name)}
              >
                Descargar Factura Principal
              </button>
            )}
            
            {invoice.taxProofs && invoice.taxProofs.length > 0 && (
              <div className="additional-files">
                <h4>Comprobantes Adicionales</h4>
                {invoice.taxProofs.map((file, index) => (
                  <button
                    key={index}
                    className="file-btn"
                    onClick={() => downloadFile(file, file.name)}
                  >
                    {file.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {invoice.observations && (
            <div className="observations-section">
              <h3>Observaciones</h3>
              <p>{invoice.observations}</p>
            </div>
          )}

          <div className="viewer-actions">
            <button onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceViewer;