import { useEffect, useState } from 'react';
import InventoryTable from '../components/InventoryTable';
import { InventoryItem } from '../types/InventoryItem';
import {
  getInventoryLocations,
  getInventory,
  updateInventoryItem,
  createInventoryItem,
  deleteInventoryItem,
  getInventoryStatuses
} from '../services/inventoryService';
import EditModal from '../components/EditModal';
import AddModal from '../components/AddModal';
import ViewModal from '../components/ViewModal';
import './InventoryPage.css';

const itemsPerPage = 10;

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [addingItem, setAddingItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'price' | 'createdAt' | 'quantity'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    getInventory(
      currentPage,
      itemsPerPage,
      searchQuery,
      selectedLocation,
      selectedStatus === '' ? undefined : selectedStatus,
      sortField,
      sortDirection.toUpperCase() as 'ASC' | 'DESC'
    )
      .then(res => {
        setItems(res.data.data);
        setTotalItems(res.data.total);
      })
      .catch(err => console.error('Error al cargar inventario:', err))
      .finally(() => setLoading(false));
  }, [currentPage, searchQuery, sortField, sortDirection, selectedLocation, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortDirection, selectedLocation]);


  useEffect(() => {
  getInventoryLocations()
    .then(res => setLocations(res.data))
    .catch(err => console.error('Error al cargar ubicaciones:', err));
  }, []);

  useEffect(() => {
    getInventoryStatuses()
      .then((res) => {
        setStatuses(res.data); 
      })
      .catch((err) => console.error('Error al cargar estados:', err));
  }, []);

  const onEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) setEditingItem(item);
  };

  const handleEditChange = (field: keyof InventoryItem, value: string | number | File) => {
    setEditingItem(prev => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    const { id, createdAt, ...updateData } = editingItem;

    try {
      const res = await updateInventoryItem(id, updateData);
      setItems(prev => prev.map(p => (p.id === id ? res.data : p)));
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

  const onDelete = async (id: number, amount: number) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    let cantidadNum: number = amount;

    if (isNaN(cantidadNum) || cantidadNum <= 0 || cantidadNum > item.quantity) {
      alert('Cantidad inválida.');
      return;
    }

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

  const reloadInventory = () => {
    setLoading(true);
    return getInventory(
      currentPage,
      itemsPerPage,
      searchQuery,
      selectedLocation,
      selectedStatus === '' ? undefined : selectedStatus,
      sortField,
      sortDirection.toUpperCase() as 'ASC' | 'DESC'
    )
      .then(res => {
        setItems(res.data.data);
        setTotalItems(res.data.total);
      })
      .catch(err => console.error('Error al recargar inventario:', err))
      .finally(() => setLoading(false));
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

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
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          {statuses
            .filter((status) => status.trim() !== '') 
            .map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))
          }
        </select>

        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value as 'price' | 'createdAt' | 'quantity')}
          className="filter-select"
        >
          <option value="createdAt">Ordenar por fecha</option>
          <option value="price">Ordenar por precio</option>
          <option value="quantity">Ordenar por cantidad</option>
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

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <InventoryTable items={items} onEdit={onEdit} onDelete={onDelete} onView={onView} />

          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>

            {(() => {
              const maxVisiblePages = 5;
              const half = Math.floor(maxVisiblePages / 2);
              let startPage = Math.max(1, currentPage - half);
              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
              if (endPage - startPage < maxVisiblePages - 1) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
              }

              const pages = [];
              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    className={i === currentPage ? 'active-page' : ''}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i}
                  </button>
                );
              }
              return pages;
            })()}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>

          {addingItem && (
            <AddModal
              onAdd={async (newItem) => {
                try {
                  await createInventoryItem(newItem);
                  setAddingItem(false);
                  setMessage(`"${newItem.name}" agregado correctamente`);
                  await reloadInventory();
                  setTimeout(() => setMessage(''), 3000);
                } catch (err) {
                  console.error('Error al agregar:', err);
                  alert('No se pudo agregar el producto.');
                }
              }}
              onCancel={() => setAddingItem(false)}
            />
          )}

          {editingItem && (
            <EditModal
              item={editingItem}
              onChange={handleEditChange}
              onSave={handleSaveEdit}
              onCancel={() => setEditingItem(null)}
            />
          )}

          {viewingItem && (
            <ViewModal
              item={viewingItem}
              onClose={() => setViewingItem(null)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default InventoryPage;
