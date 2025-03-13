import React, { useState, useEffect } from 'react';
import './InvoiceForm.css';

const InvoiceForm = ({ initialData, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    reference: '',
    amount: '',
    currency: 'USD',
    paymentStatus: 'pending',
    date: '',
    type: 'received',
    mainPdf: null,
    taxProofs: [],
    observations: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = initialData?.id || `${Date.now()}`;
    onSubmit({ ...formData, id });
  };

  const handleFileChange = (e, field) => {
    if (field === 'mainPdf') {
      setFormData({ ...formData, mainPdf: e.target.files[0] });
    } else {
      setFormData({ ...formData, taxProofs: Array.from(e.target.files) });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{initialData ? 'Editar Factura' : 'Nueva Factura'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Referencia</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({...formData, reference: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Monto</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Moneda</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({...formData, currency: e.target.value})}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="ARS">ARS</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estado</label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
              >
                <option value="pending">Pendiente</option>
                <option value="partial">Cobro Parcial</option>
                <option value="paid">Pagado</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Tipo</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="received"
                    checked={formData.type === 'received'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  />
                  Recibida
                </label>
                <label>
                  <input
                    type="radio"
                    value="emitted"
                    checked={formData.type === 'emitted'}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  />
                  Emitida
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Factura PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, 'mainPdf')}
              required={!initialData}
            />
            <span className="help-text">Archivo principal de la factura</span>
          </div>

          <div className="form-group">
            <label>Comprobantes Fiscales</label>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={(e) => handleFileChange(e, 'taxProofs')}
            />
            <span className="help-text">Puede seleccionar múltiples archivos</span>
          </div>

          <div className="form-group">
            <label>Observaciones</label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit">
              {initialData ? 'Guardar Cambios' : 'Crear Factura'}
            </button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;