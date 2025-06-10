import React, { useState } from 'react';
import { InventoryItem } from '../types/InventoryItem';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './InventoryTable.css';
import imagenPredeterminada from '../Images/ImagenPredeterminadaInventario.png';
import { isAdmin } from '../services/authService';

interface Props {
  items: InventoryItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: React.FC<Props> = ({ items, onEdit, onDelete }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);
  const userIsAdmin = isAdmin();

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Fecha de Creación</th>
            {userIsAdmin && <th>Acciones</th>}
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
              {userIsAdmin && (
                <td>
                  <button onClick={() => onEdit(item.id)} className="icon-button">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="icon-button">
                    <FaTrash />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {modalImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content">
            <img src={modalImage} alt="Vista ampliada" />
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
