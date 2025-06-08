import React, { useState } from 'react';
import './AddModal.css';
import { InventoryItem } from '../types/InventoryItem';

interface Props {
  onAdd: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const AddModal: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');

  const validate = () => {
    if (!name.trim()) {
      alert('El nombre es obligatorio');
      return false;
    }
    if (price === '' || price < 0) {
      alert('El precio debe ser un número igual o mayor a 0');
      return false;
    }
    if (quantity === '' || quantity < 0) {
      alert('La cantidad debe ser un número igual o mayor a 0');
      return false;
    }
    return true;
  };

  const handleAdd = () => {
    if (!validate()) return;

    onAdd({
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      price: Number(price),
      quantity: Number(quantity),
    });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Agregar nuevo producto</h2>

        <label>
          Nombre:
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </label>

        <label>
          Descripción:
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
          />
        </label>

        <label>
          Ubicación:
          <input
            type="text"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
        </label>

        <label>
          Precio:
          <input
            type="number"
            min="0"
            value={price}
            onChange={e => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>

        <label>
          Cantidad:
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </label>

        <div className="modal-buttons">
          <button onClick={handleAdd}>Agregar</button>
          <button className="cancel" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
