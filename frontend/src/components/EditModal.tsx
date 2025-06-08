import React from 'react';
import './EditModal.css';
import { InventoryItem } from '../types/InventoryItem';

interface Props {
  item: InventoryItem;
  onChange: (field: keyof InventoryItem, value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditModal: React.FC<Props> = ({ item, onChange, onSave, onCancel }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Editar producto</h2>

        <label>
          Nombre:
          <input
            type="text"
            value={item.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </label>

        <label>
          Descripción:
          <input
            type="text"
            value={item.description}
            onChange={(e) => onChange('description', e.target.value)}
          />
        </label>

        <label>
          Ubicación:
          <input
            type="text"
            value={item.location}
            onChange={(e) => onChange('location', e.target.value)}
          />
        </label>

        <label>
          Precio:
          <input
            type="number"
            value={item.price}
            onChange={(e) => onChange('price', Number(e.target.value))}
          />
        </label>

        <label>
          Cantidad:
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => onChange('quantity', Number(e.target.value))}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={onSave}>Guardar</button>
          <button className="cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
