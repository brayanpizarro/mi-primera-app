import React, { useEffect, useState } from 'react';
import { InventoryItem } from '../types/InventoryItem';
import './ViewModal.css';

interface Props {
  item: InventoryItem;
  onClose: () => void;
}

const ViewModal: React.FC<Props> = ({ item, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    setIsVisible(true); 

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false); 
    setTimeout(() => {
      onClose();
    }, 300); 
  };

  return (
    <div className="view-modal-overlay" onClick={handleClose}>
      <div
        className={`view-modal-content ${isVisible ? 'show' : 'hide'}`}
        onClick={e => e.stopPropagation()}
      >
        <button className="view-close-btn" onClick={handleClose}>
          ×
        </button>

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

        {item.attributes && item.attributes.length > 0 && (
          <div className="attributes-section">
            <h3>Atributos adicionales</h3>
            {item.attributes.map(attr => (
              <p key={attr.id}><strong>{attr.key}:</strong> {attr.value}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewModal;
