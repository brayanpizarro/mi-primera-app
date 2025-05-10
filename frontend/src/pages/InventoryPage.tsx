import { useEffect, useState } from 'react';
import InventoryTable from '../components/InventoryTable';
import { InventoryItem } from '../types/InventoryItem';
import { getInventory, deleteInventoryItem, updateInventoryQuantity } from '../services/inventoryService';
import { updateInventoryItem } from '../services/inventoryService'; 
import EditModal from '../components/EditModal';

const InventoryPage = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');


  useEffect(() => {
    getInventory()
      .then(res => {
        console.log('Datos recibidos:', res.data); 
        setItems(res.data);
      })
      .catch(err => console.error('Error al cargar inventario:', err))
      .finally(() => setLoading(false));
  }, []);

   const onEdit = (id: number) => {
    const item = items.find(i => i.id === id);
    if (item) setEditingItem(item);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      await updateInventoryItem(editingItem.id, editingItem);
      setItems(prev =>
        prev.map(p => (p.id === editingItem.id ? editingItem : p))
      );
      setEditingItem(null); // cerrar el "modo edición"
    } catch (err) {
      console.error('Error al editar:', err);
      alert('No se pudo actualizar el producto.');
    }
  };

  const handleEditChange = (field: keyof InventoryItem, value: string | number) => {
    setEditingItem(prev =>
      prev ? { ...prev, [field]: value } : prev
    );
  };


const onDelete = async (id: number) => {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (item.quantity <= 1) {
    const confirmDelete = window.confirm(`¿Eliminar "${item.name}" del inventario?`);
    if (!confirmDelete) return;

    try {
      await deleteInventoryItem(id);
      setItems(items.filter(i => i.id !== id));
      setMessage(` "${item.name}" fue eliminado correctamente. ✅`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Hubo un error al eliminar el producto.');
    }
  } else {
    const input = window.prompt(`"${item.name}" tiene ${item.quantity} unidades. ¿Cuántas deseas eliminar?`, '1');
    const cantidadEliminar = parseInt(input || '');

    if (isNaN(cantidadEliminar) || cantidadEliminar < 1) {
      alert('Cantidad inválida.');
      return;
    }

    if (cantidadEliminar >= item.quantity) {
      const confirmDelete = window.confirm(`Estás intentando eliminar todas las unidades. ¿Eliminar el producto completo?`);
      if (!confirmDelete) return;

      try {
        await deleteInventoryItem(id);
        setItems(items.filter(i => i.id !== id));
        setMessage(`"${item.name}" fue eliminado completamente.✅`);
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Hubo un error al eliminar el producto.');
      }
    } else {
      try {
        const nuevaCantidad = item.quantity - cantidadEliminar;
        await updateInventoryQuantity(id, nuevaCantidad);

        setItems(prev =>
          prev.map(p => (p.id === id ? { ...p, quantity: nuevaCantidad } : p))
        );

        setMessage(`Se eliminaron ${cantidadEliminar} unidades de "${item.name}". ✅`);
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        console.error('Error al actualizar cantidad:', err);
        alert('No se pudo actualizar la cantidad.');
      }
    }
  }
};


 return (
    <div style={{ padding: '2rem' }}>
      <h1>Inventario</h1>
          {message && (
            <div style={{
                marginBottom: '1rem',
                padding: '0.75rem',
                backgroundColor: '#d4edda',
                color: '#155724',
                border: '1px solid #c3e6cb',
                borderRadius: '5px',
            }}>
                {message}
            </div>
            )}
      {loading ? <p>Cargando...</p> : (
        <>
          <InventoryTable items={items} onEdit={onEdit} onDelete={onDelete} />
          
         {editingItem && (
            <EditModal
                item={editingItem}
                onChange={handleEditChange}
                onSave={handleSaveEdit}
                onCancel={() => setEditingItem(null)}
            />
            )}
        </>
      )}
    </div>
  );
};

export default InventoryPage;
