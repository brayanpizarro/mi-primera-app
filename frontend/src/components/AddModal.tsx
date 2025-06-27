// src/components/AddModal.tsx
import React, { useEffect, useState } from 'react';
import './AddModal.css';
import { InventoryItem, InventoryAttribute } from '../types/InventoryItem';

interface Props {
  onAdd: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxoxpcpyt/image/upload';
const UPLOAD_PRESET = 'InventarioECIN';

const AddModal: React.FC<Props> = ({ onAdd, onCancel }) => {
  /* ---------- bloqueo de scroll del fondo ---------- */
  useEffect(() => {
    document.body.style.overflow = 'hidden';   // 🔒
    return () => { document.body.style.overflow = ''; }; // 🔓 al desmontar
  }, []);

  /* ---------------- estado principal ---------------- */
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [location,    setLocation]    = useState('');
  const [price,       setPrice]       = useState<number | ''>('');
  const [quantity,    setQuantity]    = useState<number | ''>('');
  const [status,      setStatus]      = useState('');
  const [image,       setImage]       = useState<File | null>(null);
  const [imagePreview,setImagePreview] = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [show,        setShow]        = useState(false);

  /* ---------------- ubicaciones ---------------- */
  const [locations,   setLocations]   = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('locations') || '[]')
  );
  const [newLocation,          setNewLocation]          = useState('');
  const [showNewLocationInput, setShowNewLocationInput] = useState(false);
  const [showDeleteSelect,     setShowDeleteSelect]     = useState(false);

  /* ---------------- estados ---------------- */
  const [statuses,             setStatuses]            = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('statuses') || '[]')
  );
  const [newStatus,           setNewStatus]            = useState('');
  const [showNewStatusInput,  setShowNewStatusInput]   = useState(false);
  const [showDeleteStatus,    setShowDeleteStatus]     = useState(false);

  /* ---------------- atributos extra ---------------- */
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);
  const addAttributeField = () =>
    setAttributes(prev => [...prev, { key: '', value: '' }]);
  const removeAttributeField = (i: number) =>
    setAttributes(prev => prev.filter((_, idx) => idx !== i));
  const updateAttribute = (index: number, field: 'key' | 'value', value: string) =>
    setAttributes(prev => prev.map((attr, idx) => 
      idx === index ? { ...attr, [field]: value } : attr
    ));

  /* ---------------- efectos ---------------- */
  useEffect(() => setShow(true), []);
  useEffect(() => localStorage.setItem('locations', JSON.stringify(locations)), [locations]);
  useEffect(() => localStorage.setItem('statuses', JSON.stringify(statuses)), [statuses]);

  /* ---------------- handlers ---------------- */
  const handleAddLocation = () => {
    const trimmed = newLocation.trim();
    if (!trimmed) return;
    if (locations.includes(trimmed)) return alert('La ubicación ya existe.');
    setLocations(prev => [...prev, trimmed]);
    setLocation(trimmed);
    setNewLocation('');
    setShowNewLocationInput(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddStatus = () => {
    const trimmed = newStatus.trim();
    if (!trimmed) return;
    if (statuses.includes(trimmed)) return alert('El estado ya existe.');
    setStatuses(prev => [...prev, trimmed]);
    setStatus(trimmed);
    setNewStatus('');
    setShowNewStatusInput(false);
  };

  const uploadToCloudinary = async () => {
    if (!image) return '';
    const formData = new FormData();
    formData.append('file', image);
    formData.append('upload_preset', UPLOAD_PRESET);
    setUploading(true);
    try {
      const res  = await fetch(CLOUDINARY_URL, { method: 'POST', body: formData });
      const data = await res.json();
      return data.secure_url;
    } catch {
      alert('Error al subir la imagen');
      return '';
    } finally { setUploading(false); }
  };

  const validate = () => {
    if (!name.trim())                          return alert('El nombre es obligatorio');
    if (price === ''   || Number(price)   < 0) return alert('El precio debe ser ≥ 0');
    if (quantity === ''|| Number(quantity)< 0) return alert('La cantidad debe ser ≥ 0');
    if (!location)                             return alert('Debe seleccionar una ubicación');
    return true;
  };

  const handleAdd = async () => {
    if (!validate()) return;
    const imageUrl = await uploadToCloudinary();

    // Filtrar atributos vacíos y crear el array de atributos
    const validAttributes = attributes
      .filter(attr => attr.key.trim() && attr.value.trim())
      .map(attr => ({
        key: attr.key.trim(),
        value: attr.value.trim()
      }));

    onAdd({
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      price: Number(price),
      quantity: Number(quantity),
      status: status.trim(),
      imageUrl,
      attributes: validAttributes
    });

    /* limpiar */
    setName(''); setDescription(''); setLocation('');
    setPrice(''); setQuantity(''); setImage(null);
    setStatus(''); setImagePreview(''); setAttributes([]);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onCancel, 300); 
  };

  return (
    <div className={`modal-backdrop  ${show ? 'show' : 'hide'}`}>
      <div className={`modal-content ${show ? 'show' : 'hide'}`}>
        <h2>Agregar nuevo producto</h2>

        <label>Nombre:
          <input value={name} onChange={e => setName(e.target.value)} />
        </label>

        <label>Descripción:
          <textarea value={description} onChange={e => setDescription(e.target.value)} />
        </label>

        {/* ---- ubicación y controles ---- */}
        <label className="form-label">Ubicación:</label>
        <select className="form-select" value={location} onChange={e => setLocation(e.target.value)}>
          <option value="">-- Seleccione una ubicación --</option>
          {locations.map(loc => <option key={loc}>{loc}</option>)}
        </select>

        <div className="location-buttons">
          <button
            type="button"
            className="small-btn"
            onClick={() => { setShowNewLocationInput(!showNewLocationInput); setShowDeleteSelect(false); }}
          >{showNewLocationInput ? 'Cancelar' : 'Agregar ubicación'}</button>

          <button
            type="button"
            className="small-btn danger"
            onClick={() => { setShowDeleteSelect(!showDeleteSelect);   setShowNewLocationInput(false); }}
          >{showDeleteSelect ? 'Cancelar' : 'Eliminar ubicación'}</button>
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
                  if (location === toDelete) setLocation('');
                }
              }}>
              <option value="">-- Seleccione para eliminar --</option>
              {locations.map(loc => <option key={loc}>{loc}</option>)}
            </select>
          </div>
        )}

        <label>Precio:
          <input type="number" min="0" value={price} onChange={e => setPrice(Number(e.target.value))} />
        </label>

        <label>Cantidad:
          <input type="number" min="0" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        </label>

        {/* ---- estado y controles ---- */}
        <label className="form-label">Estado:</label>
        <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">-- Seleccione un estado --</option>
          {statuses.map(st => <option key={st}>{st}</option>)}
        </select>

        <div className="location-buttons">
          <button
            type="button"
            className="small-btn"
            onClick={() => { setShowNewStatusInput(!showNewStatusInput); setShowDeleteStatus(false); }}
          >{showNewStatusInput ? 'Cancelar' : 'Agregar estado'}</button>

          <button
            type="button"
            className="small-btn danger"
            onClick={() => { setShowDeleteStatus(!showDeleteStatus); setShowNewStatusInput(false); }}
          >{showDeleteStatus ? 'Cancelar' : 'Eliminar estado'}</button>
        </div>

        {showNewStatusInput && (
          <div className="add-location-row">
            <input className="form-input"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddStatus())}
              placeholder="Nuevo estado"
            />
            <button className="small-btn add"    onClick={handleAddStatus}>+</button>
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
                  if (status === toDelete) setStatus('');
                }
              }}>
              <option value="">-- Seleccione para eliminar --</option>
              {statuses.map(st => <option key={st}>{st}</option>)}
            </select>
          </div>
        )}

        {/* ---- imagen ---- */}
        <label>Imagen:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
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
                onChange={e => updateAttribute(i, 'key', e.target.value)}
              />
              <input
                type="text"
                placeholder="Valor"
                value={attr.value}
                onChange={e => updateAttribute(i, 'value', e.target.value)}
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
            onClick={handleAdd}
            disabled={uploading}
          >{uploading ? 'Guardando...' : 'Guardar'}</button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
