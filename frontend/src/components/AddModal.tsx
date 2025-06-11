// AddModal.tsx
import React, { useEffect, useState } from 'react';
import './AddModal.css';
import { InventoryItem } from '../types/InventoryItem';

interface Props {
  onAdd: (item: Omit<InventoryItem, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dxoxpcpyt/image/upload';
const UPLOAD_PRESET   = 'InventarioECIN';

const AddModal: React.FC<Props> = ({ onAdd, onCancel }) => {
  /* ---------------- estado principal ---------------- */
  const [name,        setName]        = useState('');
  const [description, setDescription] = useState('');
  const [location,    setLocation]    = useState('');
  const [price,       setPrice]       = useState<number | ''>('');
  const [quantity,    setQuantity]    = useState<number | ''>('');
  const [status,      setStatus]       = useState('');
  const [image,       setImage]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading,   setUploading]   = useState(false);
  const [show,        setShow]        = useState(false);

  /* ---------------- ubicaciones ---------------- */
  const [locations,   setLocations]   = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('locations') || '[]')
  );
  const [newLocation,           setNewLocation]           = useState('');
  const [showNewLocationInput,  setShowNewLocationInput]  = useState(false);
  const [showDeleteSelect,      setShowDeleteSelect]      = useState(false);

  /* ---------------- estados ---------------- */
  const [statuses,             setStatuses]             = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('statuses') || '[]')
  );
  const [newStatus,           setNewStatus]             = useState('');
  const [showNewStatusInput,  setShowNewStatusInput]    = useState(false);
  const [showDeleteStatus,    setShowDeleteStatus]      = useState(false);

  /* ---------------- atributos extra ---------------- */
  const [attrs, setAttrs] = useState<{ key: string; value: string }[]>([]);
  const addAttrField      = () => setAttrs(prev => [...prev, { key: '', value: '' }]);
  const rmAttrField       = (i: number) => setAttrs(prev => prev.filter((_, idx) => idx !== i));

  /* ---------------- efectos ---------------- */
  useEffect(() => setShow(true), []);
  useEffect(() => localStorage.setItem('locations', JSON.stringify(locations)), [locations]);
  useEffect(() => localStorage.setItem('statuses', JSON.stringify(statuses)), [statuses]);

  /* ---------------- handlers ---------------- */
  const handleAddLocation = () => {
    const trimmed = newLocation.trim();
    if (!trimmed) return;
    if (locations.includes(trimmed)) { alert('La ubicación ya existe.'); return; }
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
    if (statuses.includes(trimmed)) { alert('El estado ya existe.'); return; }
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

    /* convertir attrs a objeto */
    const customAttributes: Record<string,string> = {};
    attrs.forEach(({ key, value }) => {
      if (key.trim()) customAttributes[key.trim()] = value;
    });

    onAdd({
      name:        name.trim(),
      description: description.trim(),
      location:    location.trim(),
      price:       Number(price),
      quantity:    Number(quantity),
      status:      status.trim(),
      imageUrl,
      customAttributes: Object.keys(customAttributes).length ? customAttributes : undefined,
    });

    /* limpiar */
    setName(''); setDescription(''); setLocation('');
    setPrice(''); setQuantity(''); setImage(null);
    setStatus('');setImagePreview(''); setAttrs([]);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onCancel, 300);
  };

 
  return (
    <div className={`modal-backdrop ${show ? 'show' : 'hide'}`}>
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


                {/* ---- atributos extra ---- */}
        <label className="form-label" style={{ marginTop: '1rem' }}>Atributos extra:</label>
        {attrs.map((attr, idx) => (
          <div key={idx} className="attr-row">
            <input
              className="attr-input" placeholder="Atributo"
              value={attr.key}
              onChange={e => {
                const v = e.target.value;
                setAttrs(prev => prev.map((a, i) => i === idx ? { ...a, key: v } : a));
              }}
            />
            <input
              className="attr-input" placeholder="Valor"
              value={attr.value}
              onChange={e => {
                const v = e.target.value;
                setAttrs(prev => prev.map((a, i) => i === idx ? { ...a, value: v } : a));
              }}
            />
            <button className="small-btn cancel" onClick={() => rmAttrField(idx)}>×</button>
          </div>
        ))}
        <button type="button" className="small-btn add" onClick={addAttrField}>+</button>

        <label>Imagen:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>

        {imagePreview && <div className="image-preview"><img src={imagePreview} /></div>}
        {uploading && <p>Subiendo imagen...</p>}

        <div className="modal-buttons">
          <button onClick={handleAdd}>Agregar</button>
          <button className="cancel" onClick={handleClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default AddModal;
