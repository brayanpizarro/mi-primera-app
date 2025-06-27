import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InventoryItem } from '../types/InventoryItem';
import {
  getInventory,
  getInventoryLocations,
  getInventoryStatuses
} from '../services/inventoryService';
import InventoryTableUser from '../components/InventoryTableUser';
import './InventoryPageUser.css';
import ViewModal from '../components/ViewModal';

const itemsPerPage = 10;

const InventoryPageUser = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'price' | 'quantity' | 'createdAt'>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [viewingItem, setViewingItem] = useState<InventoryItem | null>(null);



  useEffect(() => {
    fetchInventory();
  }, [currentPage, searchQuery, filter, sortDirection, selectedLocation, selectedStatus]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, sortDirection, selectedLocation, selectedStatus]);

  useEffect(() => {
    getInventoryLocations()
      .then(res => setLocations(res.data))
      .catch(err => console.error('Error al cargar ubicaciones:', err));

    getInventoryStatuses()
      .then(res => setStatuses(res.data.filter((status: string) => status.trim() !== '')))
      .catch(err => console.error('Error al cargar estados:', err));
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getInventory(
        currentPage,
        itemsPerPage,
        searchQuery,
        selectedLocation,
        selectedStatus === '' ? undefined : selectedStatus,
        filter,
        sortDirection.toUpperCase() as 'ASC' | 'DESC'
      );
      setItems(res.data.data);
      setTotalItems(res.data.total);
    } catch (err) {
      console.error('Error al cargar inventario:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleViewItem = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) setViewingItem(item);
  };

  const handleCloseViewModal = () => {
    setViewingItem(null);
  };


  return (
  <div className="inventory-page-background">
    <div className="inventory-container">
      <div className="header-container">
        <h1>Inventario</h1>
        
      </div>

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
          {locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="filter-select"
        >
          <option value="">Todos los estados</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'price' | 'quantity' | 'createdAt')}
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
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <InventoryTableUser items={items} onView={handleViewItem} />

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

          {viewingItem && (
            <ViewModal
              item={viewingItem}
              onClose={handleCloseViewModal}
            />
          )}

        </>
      )}
    </div>
    </div>
  );
};

export default InventoryPageUser;