// src/components/ViewModal.tsx
import React from 'react';
import { InventoryItem } from '../types/InventoryItem';
import './ViewModal.css';

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

const ViewModal: React.FC<Props> = ({ item, onClose }) => (
  <div className="view-modal-overlay" onClick={onClose}>
    <div className="view-modal-content" onClick={e => e.stopPropagation()}>
      <button className="view-close-btn" onClick={onClose}>×</button>

      <h2>{item.name}</h2>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.name} className="view-image" />
      )}

      <p><strong>Descripción:</strong> {item.description || 'Sin descripción'}</p>
      <p><strong>Ubicación:</strong> {item.location}</p>
      <p><strong>Precio:</strong> ${item.price}</p>
      <p><strong>Cantidad:</strong> {item.quantity}</p>
      <p><strong>Estado:</strong> {item.status || '—'}</p>
      <p><strong>Fecha de ingreso:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>

        {item.customAttributes && Object.keys(item.customAttributes).length > 0 && (
            <>
                {Object.entries(item.customAttributes).map(([k, v]) => (
                <p key={k}><strong>{k}:</strong> {String(v)}</p>
                ))}
            </>
            )}
    </div>
  </div>
);

export default ViewModal;
