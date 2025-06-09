import React, { useState } from 'react';
import { InventoryItem } from '../types/InventoryItem';
import './InventoryTable.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import imagenPredeterminada from '../Images/ImagenPredeterminadaInventario.png'

interface Props {
  items: InventoryItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
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
            <th>Modificar</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>
                <img
                  src={item.imageUrl || imagenPredeterminada}
                  alt={item.name}
                  className="inventory-image"
                  onClick={() => openModal(item.imageUrl || imagenPredeterminada)}
                  style={{ cursor: 'pointer' }}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td>{item.location}</td>
              <td>${item.price.toLocaleString('es-CL')}</td>
              <td>{item.quantity}</td>
              <td>{new Date(item.createdAt).toLocaleDateString('es-CL')}</td>
              <td>
                <button onClick={() => onEdit(item.id)} className="icon-button">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(item.id)} className="icon-button">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {modalImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <img src={modalImage} alt="Imagen grande" />
            <button className="modal-close-button" onClick={closeModal}>
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
