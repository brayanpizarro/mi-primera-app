import { useEffect, useState } from 'react';
import InventoryTable from '../components/InventoryTable';
import { InventoryItem } from '../types/InventoryItem';
import {
  getInventory,
  updateInventoryItem,
  createInventoryItem,
  deleteInventoryItem
} from '../services/inventoryService';
import EditModal from '../components/EditModal';
import AddModal from '../components/AddModal';
import './InventoryPage.css';
import ViewModal from '../components/ViewModal';

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedLocation, setSelectedLocation] = useState('');
  const locations = Array.from(new Set(items.map(item => item.location).filter(Boolean)));
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    getInventory()
      .then(res => {
        setItems(res.data);
      })
      .catch(err => console.error('Error al cargar inventario:', err))
      .finally(() => setLoading(false));
  }, []);

  // Edit handlers
  const onEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) setEditingItem(item);
  };



const handleEditChange = (field: keyof InventoryItem, value: string | number | File) => {
  
  setEditingItem(prev =>
    prev ? { ...prev, [field]: value } : prev
  );
};

const handleImageChange = async (file: File) => {
  try {
   
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'InventarioECIN'); // ajusta aquí

    const res = await fetch('https://api.cloudinary.com/v1_1/dxoxpcpyt/image/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (data.secure_url) {
      handleEditChange('imageUrl', data.secure_url); // Actualiza la URL en el estado
    }
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    alert('No se pudo subir la imagen.');
  }
};

const handleSaveEdit = async () => {
  if (!editingItem) return;

  const { id, createdAt, ...updateData } = editingItem;

  try {
    
    const res = await updateInventoryItem(id, updateData);
    setItems(prev =>
      prev.map(p => (p.id === id ? res.data : p))
    );
    setEditingItem(null);
    setMessage(`El objeto "${res.data.name}" ha sido actualizado correctamente`);
    setTimeout(() => setMessage(''), 3000);
  } catch (err) {
    console.error('Error al editar:', err);
    alert('No se pudo actualizar el producto.');
  }
};

const onView = (id: number) => {
  const item = items.find(i => i.id === id);
  if (item) setViewingItem(item);
};

  // Delete handler con confirmación de cantidad si es > 1
const onDelete = async (id: number, amount: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    let cantidadNum: number;

    cantidadNum = amount;
    

    if (isNaN(cantidadNum) || cantidadNum <= 0 || cantidadNum > item.quantity) {
      alert('Cantidad inválida.');
      return;
    }

    /* ---------- igual que antes ---------- */
    try {
      if (cantidadNum === item.quantity) {
        await deleteInventoryItem(id);
        setItems(prev => prev.filter(p => p.id !== id));
        setMessage(`"${item.name}" eliminado completamente`);
      } else {
        const nuevaCantidad = item.quantity - cantidadNum;
        await updateInventoryItem(id, { quantity: nuevaCantidad });
        setItems(prev => prev.map(p =>
          p.id === id ? { ...p, quantity: nuevaCantidad } : p
        ));
        setMessage(`Se eliminaron ${cantidadNum} unidades de "${item.name}". Quedan ${nuevaCantidad}`);
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error al eliminar/actualizar:', err);
      alert('No se pudo completar la operación.');
    }
  };


  // Filtro y búsqueda
    const filteredItems = items
      .filter(item =>
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())))
        &&
        (selectedLocation === '' || item.location === selectedLocation)
      )

    .sort((a, b) => {
      const factor = sortDirection === 'asc' ? 1 : -1;
      switch (filter) {
        case 'price':
          return (a.price - b.price) * factor;
        case 'quantity':
          return (a.quantity - b.quantity) * factor;
        case 'createdAt':
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * factor;
        default:
          return 0;
      }
    });

  return (
    <div className="inventory-container">
      <h1>Inventario</h1>
      {message && <div className="success-message">{message}</div>}

      <div className="controls">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las ubicaciones</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">Ordenar por...</option>
          <option value="price">Precio</option>
          <option value="quantity">Cantidad</option>
          <option value="createdAt">Fecha de ingreso</option>
        </select>

        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
          className="filter-select"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>

        <button className="add-button" onClick={() => setAddingItem(true)}>
          + Agregar Producto
        </button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <>
          <InventoryTable items={filteredItems} onEdit={onEdit} onDelete={onDelete} onView={onView} />

          {/* Modal para editar */}
          {editingItem && (
            <EditModal
              item={editingItem}
              onChange={handleEditChange}
              onSave={handleSaveEdit}
              onCancel={() => setEditingItem(null)}
            />
          )}

          {/* Modal para agregar nuevo ítem usando AddModal */}
          {addingItem && (
            <AddModal
              onAdd={async (newItem) => {
                try {
                  const res = await createInventoryItem(newItem);
                  setItems(prev => [...prev, res.data]);
                  setAddingItem(false);
                  setMessage(`"${newItem.name}" agregado correctamente`);
                  setTimeout(() => setMessage(''), 3000);
                } catch (err) {
                  console.error('Error al agregar:', err);
                  alert('No se pudo agregar el producto.');
                }
              }}
              onCancel={() => setAddingItem(false)}
            />
          )}
          {viewingItem && (
            <ViewModal item={viewingItem} onClose={() => setViewingItem(null)} />
          )}
        </>
      )}
    </div>
  );
};

export default InventoryPage;
