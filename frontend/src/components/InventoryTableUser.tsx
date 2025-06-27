// src/components/InventoryTableUser.tsx
import React, { useState } from 'react';
import { FaTag } from 'react-icons/fa';
import { InventoryItem } from '../types/InventoryItem';
import imagenPredeterminada from '../Images/ImagenPredeterminadaInventario.png';
import './InventoryTable.css'; 

interface Props {
  items: InventoryItem[];
  onView: (id: number) => void;
}

const InventoryTableUser: React.FC<Props> = ({ items, onView }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <div className="inventory-table-background">
      <table className="inventory-table">
        <thead>
          <tr>
            <th />
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Estado</th>
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
              {/* Imagen */}
              <td>
                <img
                  src={item.imageUrl || imagenPredeterminada}
                  alt={item.name}
                  className="inventory-item-image"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModalImage(item.imageUrl || imagenPredeterminada);
                  }}
                  style={{ cursor: 'pointer' }}
                />
              </td>

              {/* Detalles */}
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td>{item.location}</td>
              <td>${item.price.toLocaleString('es-CL')}</td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
<td className="cell-with-icon">
  {new Date(item.createdAt).toLocaleDateString('es-CL')}

  {item.attributes && item.attributes.length > 0 && (
    <FaTag className="custom-attr-icon-top" title="Tiene atributos adicionales" />
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para imagen */}
      {modalImage && (
        <div className="inventory-modal-overlay" onClick={() => setModalImage(null)}>
          <div className="inventory-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Vista ampliada" />
            <button
              className="inventory-modal-close-button"
              onClick={() => setModalImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTableUser;
