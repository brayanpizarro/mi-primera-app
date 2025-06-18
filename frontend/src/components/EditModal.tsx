import React, { useState, useEffect } from 'react';
import './EditModal.css';
import { InventoryItem, InventoryAttribute } from '../types/InventoryItem';

interface Props {
  item: InventoryItem;
  onChange: (field: keyof InventoryItem, value: any) => void;
  onSave: () => void;
  onCancel: () => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxoxpcpyt/image/upload';
const UPLOAD_PRESET  = 'InventarioECIN';

const EditModal: React.FC<Props> = ({ item, onChange, onSave, onCancel }) => {
  /* ---------- bloqueo de scroll del fondo ---------- */
  useEffect(() => {
    document.body.style.overflow = 'hidden';   // 🔒
    return () => { document.body.style.overflow = ''; }; // 🔓 al desmontar
  }, []);

  const [uploading, setUploading] = useState(false);
  const [localImage, setLocalImage] = useState<string>(item.imageUrl || '');
  const [localFile,  setLocalFile]  = useState<File | null>(null);
  const [show, setShow] = useState(false);

  /* ---- ubicaciones / estados / attrs (igual que antes) ---- */
  const [locations, setLocations] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('locations') || '[]')
  );
  const [newLocation,          setNewLocation]          = useState('');
  const [showNewLocationInput, setShowNewLocationInput] = useState(false);
  const [showDeleteSelect,     setShowDeleteSelect]     = useState(false);

  const [statuses, setStatuses] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('statuses') || '[]')
  );
  const [newStatus,           setNewStatus]           = useState('');
  const [showNewStatusInput,  setShowNewStatusInput]  = useState(false);
  const [showDeleteStatus,    setShowDeleteStatus]    = useState(false);

  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    setShow(true);
    setAttributes(item.attributes.map(attr => ({ key: attr.key, value: attr.value })));
  }, []);

  useEffect(() => localStorage.setItem('locations', JSON.stringify(locations)), [locations]);
  useEffect(() => localStorage.setItem('statuses', JSON.stringify(statuses)), [statuses]);
  useEffect(() => { if (!localFile) setLocalImage(item.imageUrl || ''); }, [item.imageUrl, localFile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalFile(file);
    setLocalImage(URL.createObjectURL(file));

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
      } else throw new Error('No se recibió URL de imagen');
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Hubo un error al subir la imagen');
      setLocalImage(item.imageUrl || '');
      setLocalFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleAddLocation = () => {
    const trimmed = newLocation.trim();
    if (!trimmed) return;
    if (locations.includes(trimmed)) return alert('La ubicación ya existe');
    setLocations(prev => [...prev, trimmed]);
    onChange('location', trimmed);
    setNewLocation('');
    setShowNewLocationInput(false);
  };

  const handleAttributeChange = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
    
    // Convertir a formato EAV
    const validAttributes = updated
      .filter(attr => attr.key.trim() && attr.value.trim())
      .map(attr => ({
        key: attr.key.trim(),
        value: attr.value.trim()
      }));
    
    onChange('attributes', validAttributes);
  };

  const handleAddStatus = () => {
    const trimmed = newStatus.trim();
    if (!trimmed) return;
    if (statuses.includes(trimmed)) {
      alert('El estado ya existe');
      return;
    }
    setStatuses(prev => [...prev, trimmed]);
    onChange('status', trimmed);
    setNewStatus('');
    setShowNewStatusInput(false);
  };

  const addAttributeField = () => setAttributes(prev => [...prev, { key: '', value: '' }]);
  
  const removeAttributeField = (i: number) => {
    const updated = attributes.filter((_, idx) => idx !== i);
    setAttributes(updated);
    
    // Convertir a formato EAV
    const validAttributes = updated
      .filter(attr => attr.key.trim() && attr.value.trim())
      .map(attr => ({
        key: attr.key.trim(),
        value: attr.value.trim()
      }));
    
    onChange('attributes', validAttributes);
  };

  const handleClose = () => {
    setShow(false);
    setLocalFile(null);
    setLocalImage(item.imageUrl || '');
    setTimeout(() => onCancel(), 300);
  };

  return (
    <div className={`modal-backdrop ${show ? 'show' : 'hide'}`}>
      <div className={`modal-content ${show ? 'show' : 'hide'}`}>
        <h2>Editar producto</h2>

        <label>Nombre:
          <input type="text" value={item.name} onChange={e => onChange('name', e.target.value)} />
        </label>

        <label>Descripción:
          <textarea value={item.description || ''} onChange={e => onChange('description', e.target.value)} />
        </label>

        <label className="form-label">Ubicación:</label>
        <select className="form-select" value={item.location} onChange={e => onChange('location', e.target.value)}>
          <option value="">-- Seleccione una ubicación --</option>
          {locations.map(loc => <option key={loc}>{loc}</option>)}
        </select>

        <div className="location-buttons">
          <button type="button" className="small-btn" onClick={() => {
            setShowNewLocationInput(!showNewLocationInput);
            setShowDeleteSelect(false);
          }}>{showNewLocationInput ? 'Cancelar' : 'Agregar ubicación'}</button>

          <button type="button" className="small-btn danger" onClick={() => {
            setShowDeleteSelect(!showDeleteSelect);
            setShowNewLocationInput(false);
          }}>{showDeleteSelect ? 'Cancelar' : 'Eliminar ubicación'}</button>
        </div>

        {showNewLocationInput && (
          <div className="add-location-row">
            <input className="form-input"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
              placeholder="Nueva ubicación"
            />
            <button className="small-btn add"    onClick={handleAddLocation}>+</button>
            <button className="small-btn cancel" onClick={() => setShowNewLocationInput(false)}>×</button>
          </div>
        )}

        {showDeleteSelect && !!locations.length && (
          <div className="delete-location-row">
            <select className="form-select" defaultValue=""
              onChange={e => {
                const toDelete = e.target.value;
                if (toDelete && window.confirm(`¿Eliminar la ubicación "${toDelete}"?`)) {
                  setLocations(prev => prev.filter(l => l !== toDelete));
                  if (item.location === toDelete) onChange('location', '');
                }
              }}>
              <option value="">-- Seleccione para eliminar --</option>
              {locations.map(loc => <option key={loc}>{loc}</option>)}
            </select>
          </div>
        )}

        <label>Precio:
          <input type="number" min="0" value={item.price} onChange={e => onChange('price', Number(e.target.value))} />
        </label>

        <label>Cantidad:
          <input type="number" min="0" value={item.quantity} onChange={e => onChange('quantity', Number(e.target.value))} />
        </label>

        <label className="form-label">Estado:</label>
          <select className="form-select" value={item.status} onChange={e => onChange('status', e.target.value)}>
            <option value="">-- Seleccione un estado --</option>
            {statuses.map(status => <option key={status}>{status}</option>)}
          </select>

          <div className="location-buttons">
            <button type="button" className="small-btn" onClick={() => {
              setShowNewStatusInput(!showNewStatusInput);
              setShowDeleteStatus(false);
            }}>{showNewStatusInput ? 'Cancelar' : 'Agregar estado'}</button>

            <button type="button" className="small-btn danger" onClick={() => {
              setShowDeleteStatus(!showDeleteStatus);
              setShowNewStatusInput(false);
            }}>{showDeleteStatus ? 'Cancelar' : 'Eliminar estado'}</button>
          </div>

          {showNewStatusInput && (
            <div className="add-location-row">
              <input className="form-input"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddStatus())}
                placeholder="Nuevo estado"
              />
              <button className="small-btn add" onClick={handleAddStatus}>+</button>
              <button className="small-btn cancel" onClick={() => setShowNewStatusInput(false)}>×</button>
            </div>
          )}

          {showDeleteStatus && !!statuses.length && (
            <div className="delete-location-row">
              <select className="form-select" defaultValue=""
                onChange={e => {
                  const toDelete = e.target.value;
                  if (toDelete && window.confirm(`¿Eliminar el estado "${toDelete}"?`)) {
                    setStatuses(prev => prev.filter(s => s !== toDelete));
                    if (item.status === toDelete) onChange('status', '');
                  }
                }}>
                <option value="">-- Seleccione para eliminar --</option>
                {statuses.map(status => <option key={status}>{status}</option>)}
              </select>
            </div>
          )}

        <label>Imagen:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>
        {localImage && (
          <div className="image-preview">
            <img src={localImage} alt="Preview" />
          </div>
        )}

        {/* ---- atributos extra ---- */}
        <div className="attributes-section">
          <h3>Atributos adicionales</h3>
          {attributes.map((attr, i) => (
            <div key={i} className="attribute-row">
              <input
                type="text"
                placeholder="Clave"
                value={attr.key}
                onChange={e => handleAttributeChange(i, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Valor"
                value={attr.value}
                onChange={e => handleAttributeChange(i, 'value', e.target.value)}
              />
              <button
                type="button"
                className="small-btn danger"
                onClick={() => removeAttributeField(i)}
              >×</button>
            </div>
          ))}
          <button
            type="button"
            className="small-btn"
            onClick={addAttributeField}
          >+ Agregar atributo</button>
        </div>

        {/* ---- botones de acción ---- */}
        <div className="modal-actions">
          <button
            type="button"
            className="btn cancel"
            onClick={handleClose}
            disabled={uploading}
          >Cancelar</button>
          <button
            type="button"
            className="btn save"
            onClick={onSave}
            disabled={uploading}
          >{uploading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
