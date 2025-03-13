import React, { useState } from 'react';

function InvoiceForm({ onClose }) {
  const [formData, setFormData] = useState({
    type: 'received', // received o emitted
    reference: '',
    amount: '',
    currency: 'ARS',
    date: '',
    mainPdf: null,
    paymentStatus: 'pending',
    paymentProof: null,
    taxProofs: [],
    observations: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const id = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}_${now.getHours()}-${now.getMinutes()}`;
    
    const finalData = {
      ...formData,
      id: id
    };
    
    console.log(finalData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Nueva Factura</h2>
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
              placeholder={formData.type === 'received' ? "Ej: Servicios de Juan" : "Ej: Factura Cliente XYZ"}
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
              required
            />
          </div>

          {formData.type === 'emitted' && (
            <div className="form-group">
              <label>Estado de Cobro</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
              >
                <option value="pending">Pendiente</option>
                <option value="paid">Cobrado</option>
                <option value="partial">Cobro Parcial</option>
              </select>
            </div>
          )}

          {formData.type === 'received' && (
            <div className="form-group">
              <label>Estado de Pago</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
              >
                <option value="pending">Pendiente</option>
                <option value="paid">Pagado</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label>Comprobantes Adicionales</label>
            <input
              type="file"
              accept=".pdf,.jpg,.png"
              multiple
              onChange={(e) => setFormData({...formData, taxProofs: Array.from(e.target.files)})}
            />
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
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InvoiceForm;