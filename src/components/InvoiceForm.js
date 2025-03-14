import React, { useState } from 'react';
import PropTypes from 'prop-types';  // Add this import

function InvoiceForm({ initialData, onSubmit, onClose }) {  // agregamos onSubmit a los props
  const [formData, setFormData] = useState({
    type: initialData?.type || 'received',
    reference: initialData?.reference || '',
    amount: initialData?.amount || '',
    currency: initialData?.currency || 'ARS',
    date: initialData?.date || '',
    mainPdf: initialData?.mainPdf || null,
    paymentStatus: initialData?.paymentStatus || 'pending',
    taxProofs: initialData?.taxProofs || [],
    observations: initialData?.observations || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const id = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
    
    const finalData = {
      ...formData,
      id: id
    };
    
    onSubmit(finalData);  // llamamos a onSubmit en lugar de solo console.log
    onClose();
  };

  const handleFileDelete = (fileType, index = null) => {
    if (fileType === 'mainPdf') {
      setFormData({ ...formData, mainPdf: null });
    } else if (fileType === 'taxProofs' && index !== null) {
      const newTaxProofs = [...formData.taxProofs];
      newTaxProofs.splice(index, 1);
      setFormData({ ...formData, taxProofs: newTaxProofs });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Editar Factura' : 'Nueva Factura'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group type-selector">
            <label>Tipo de Factura</label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  value="received"
                  checked={formData.type === 'received'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                />
                Recibida (Proveedores)
              </label>
              <label>
                <input
                  type="radio"
                  value="emitted"
                  checked={formData.type === 'emitted'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                />
                Emitida (Clientes)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Referencia</label>
            <input
              type="text"
              placeholder={formData.type === 'received' 
                ? "Ej: Servicios de Desarrollo Modulo EAI" 
                : "Ej: Factura Cliente XYZ"}
              value={formData.reference}
              onChange={(e) => setFormData({...formData, reference: e.target.value})}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Monto</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Moneda</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              >
                <option value="ARS">ARS</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{formData.type === 'received' ? 'Factura del Proveedor' : 'Factura ARCA'}</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setFormData({...formData, mainPdf: e.target.files[0]})}
              required={!formData.mainPdf}
            />
            {formData.mainPdf && (
              <div className="file-preview">
                <span>{formData.mainPdf.name}</span>
                <button 
                  type="button" 
                  className="delete-file" 
                  onClick={() => handleFileDelete('mainPdf')}
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>Comprobantes Adicionales</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              multiple
              onChange={(e) => setFormData({...formData, taxProofs: [...formData.taxProofs, ...Array.from(e.target.files)]})}
            />
            {formData.taxProofs.length > 0 && (
              <div className="files-list">
                {formData.taxProofs.map((file, index) => (
                  <div key={index} className="file-preview">
                    <span>{file.name}</span>
                    <button 
                      type="button" 
                      className="delete-file" 
                      onClick={() => handleFileDelete('taxProofs', index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <small className="help-text">
              {formData.type === 'emitted' 
                ? 'Comprobantes de transferencia, retenciones, IVA, etc.'
                : 'Comprobante de pago, impuesto débito/crédito, etc.'}
            </small>
          </div>

          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              placeholder={formData.type === 'received' 
                ? "Ej: Pasa el lunes a buscar los dólares"
                : "Ej: Pendiente retención de IIBB"}
            />
          </div>

          <div className="form-actions">
            <button type="submit">Guardar</button>
            <button 
              type="button" 
              onClick={() => {
                console.log('Cancel button clicked'); // Debugging
                if (typeof onClose === 'function') {
                  console.log('Calling onClose'); // Debugging
                  onClose();
                } else {
                  console.error('onClose is not a function:', onClose); // Debugging
                }
              }}
              className="cancel-btn"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

InvoiceForm.defaultProps = {
  onClose: () => {
    console.warn('onClose function not provided');
  }
};

InvoiceForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default InvoiceForm;