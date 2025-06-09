import React, { useState, useEffect } from 'react';
import './AddModal.css';
import { InventoryItem } from '../types/InventoryItem';

interface Props {
  onAdd: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxoxpcpyt/image/upload';
const UPLOAD_PRESET = 'InventarioECIN';

const AddModal: React.FC<Props> = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [show, setShow] = useState(false);

  // Animación fade-in al montar
  useEffect(() => {
    setShow(true);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const validate = () => {
    if (!name.trim()) return alert('El nombre es obligatorio'), false;
    if (price === '' || price < 0) return alert('El precio debe ser ≥ 0'), false;
    if (quantity === '' || quantity < 0) return alert('La cantidad debe ser ≥ 0'), false;
    return true;
  };

  const uploadToCloudinary = async () => {
    if (!image) return '';
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', UPLOAD_PRESET);
    setUploading(true);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.secure_url;
    } catch (error) {
      alert('Error al subir la imagen');
      return '';
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = async () => {
    if (!validate()) return;

    const imageUrl = await uploadToCloudinary();

    onAdd({
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      price: Number(price),
      quantity: Number(quantity),
      imageUrl,
    });

    // Limpiar campos al agregar
    setName('');
    setDescription('');
    setLocation('');
    setPrice('');
    setQuantity('');
    setImage(null);
    setImagePreview('');
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onCancel(), 300); // Espera animación antes de cerrar modal
  };

  return (
    <div className={`modal-backdrop ${show ? 'show' : 'hide'}`}>
      <div className={`modal-content ${show ? 'show' : 'hide'}`}>
        <h2>Agregar nuevo producto</h2>

        <label>
          Nombre:
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label>
          Descripción:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>

        <label>
          Ubicación:
          <input value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>

        <label>
          Precio:
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>

        <label>
          Cantidad:
          <input
            type="number"
            min="0"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <label>
          Imagen:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Vista previa" />
          </div>
        )}

        {uploading && <p>Subiendo imagen...</p>}

        <div className="modal-buttons">
          <button onClick={handleAdd}>Agregar</button>
          <button className="cancel" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
