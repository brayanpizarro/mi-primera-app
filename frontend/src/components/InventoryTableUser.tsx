import React, { useState } from 'react';
import { FaTag } from 'react-icons/fa';
import { InventoryItem } from '../types/InventoryItem';
import './InventoryTableUser.css';
import imagenPredeterminada from '../Images/ImagenPredeterminadaInventario.png';

interface Props {
  items: InventoryItem[];
  onView: (id: number) => void;
}

const InventoryTableUser: React.FC<Props> = ({ items, onView }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
      <table className="centered-table">
        <thead>
          <tr>
            <th></th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Fecha de ingreso</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr
              key={item.id}
              className="clickable-row"
              onClick={() => onView(item.id)}
            >
              <td>
                <img
                  src={item.imageUrl || imagenPredeterminada}
                  alt={item.name}
                  className="inventory-image"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    openModal(item.imageUrl || imagenPredeterminada);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </td>
              <td style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                {item.name}
              </td>
              <td>{item.description || '-'}</td>
              <td>{item.location}</td>
              <td>${item.price.toLocaleString('es-CL')}</td>
              <td>{item.quantity}</td>
              <td>{new Date(item.createdAt).toLocaleDateString('es-CL')}
                
                  {item.customAttributes && Object.keys(item.customAttributes).length > 0 && (
                  <FaTag className="custom-attr-icon-user" title="Tiene atributos personalizados" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="inventory-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Vista ampliada" />
            <button className="modal-close-button" onClick={closeModal}>×</button>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTableUser;