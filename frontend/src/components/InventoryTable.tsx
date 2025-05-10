import React from 'react';
import { InventoryItem } from '../types/InventoryItem';
import './InventoryTable.css';
import { FaEdit, FaTrash } from 'react-icons/fa';


interface Props {
  items: InventoryItem[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: React.FC<Props> = ({ items,onEdit, onDelete  }) => {
  return (
    <table className="centered-table">
      <thead>
        <tr>
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
  );
};

export default InventoryTable;
