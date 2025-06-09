import React, { useState, useEffect } from 'react';
import './EditModal.css';
import { InventoryItem } from '../types/InventoryItem';

interface Props {
  item: InventoryItem;
  onChange: (field: keyof InventoryItem, value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxoxpcpyt/image/upload';
const UPLOAD_PRESET = 'InventarioECIN';

const EditModal: React.FC<Props> = ({ item, onChange, onSave, onCancel }) => {
  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string>(item.imageUrl || '');
  const [localFile, setLocalFile] = useState<File | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    if (!localFile) {
      setLocalImage(item.imageUrl || '');
    }
  }, [item.imageUrl, localFile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalFile(file);
    setLocalImage(URL.createObjectURL(file)); // Preview inmediato

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        onChange('imageUrl', data.secure_url);
        setLocalImage(data.secure_url);
        setLocalFile(null);
      } else {
        throw new Error('No se recibió URL de imagen');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al subir la imagen');
      setLocalImage(item.imageUrl || '');
      setLocalFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setShow(false);
    setLocalFile(null);
    setLocalImage(item.imageUrl || '');
    setTimeout(() => onCancel(), 300); // Espera animación para cerrar modal
  };

  return (
    <div className={`modal-backdrop ${show ? 'show' : 'hide'}`}>
      <div className={`modal-content ${show ? 'show' : 'hide'}`}>
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
            value={item.description || ''}
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

        <label>
          Imagen:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {uploading && <p>Subiendo imagen...</p>}
        </label>

        {localImage && (
          <div className="image-preview">
            <img src={localImage} alt="Vista previa" />
          </div>
        )}

        <div className="modal-buttons">
          <button onClick={onSave} disabled={uploading}>
            Guardar
          </button>
          <button className="cancel" onClick={handleClose} disabled={uploading}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
