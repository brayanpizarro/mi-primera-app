import { useEffect, useState } from 'react';
import InventoryTableUser from '../components/InventoryTableUser';
import { InventoryItem } from '../types/InventoryItem';
import { getInventory } from '../services/inventoryService';
import './InventoryPageUser.css';

const InventoryPageUser = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedLocation, setSelectedLocation] = useState('');
  const locations = Array.from(new Set(items.map(item => item.location).filter(Boolean)));

  useEffect(() => {
    getInventory()
      .then(res => {
        setItems(res.data);
      })
      .catch(err => console.error('Error al cargar inventario:', err))
      .finally(() => setLoading(false));
  }, []);

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
      <h1>INVENTARIO</h1>
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
      </div>

      {loading ? <p>Cargando...</p> : (
        <InventoryTableUser items={filteredItems} />
      )}
    </div>
  );
};

export default InventoryPageUser;