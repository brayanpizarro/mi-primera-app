// src/components/InventoryTable.tsx
import React, { useState } from 'react';
import { FaEdit, FaStickyNote, FaTag, FaTrash } from 'react-icons/fa';
import { InventoryItem } from '../types/InventoryItem';
import imagenPredeterminada from '../Images/ImagenPredeterminadaInventario.png';
import './InventoryTable.css';

interface Props {
  items:     InventoryItem[];
  onEdit:   (id: number)            => void;
  onDelete: (id: number, qty: number) => void;
  onView:   (id: number)            => void;   // 👈 ¡IMPORTANTE!
}

const InventoryTable: React.FC<Props> = ({ items, onEdit, onDelete, onView }) => {
  const [modalImage, setModalImage] = useState<string | null>(null);

  // fila que está en “modo eliminar”
  const [deleteRow, setDeleteRow] = useState<number>(-1);
  const [deleteQty, setDeleteQty] = useState<number>(1);

  return (
    <>
      <table className="inventory-table">
        <thead>
          <tr>
            <th />
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Ubicación</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Estado</th>
            <th>Fecha de ingreso</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr
              key={item.id}
              className="clickable-row"
              onClick={() => onView(item.id)}           // 👈 abre el modal
            >
              {/* ───── IMAGEN ───── */}
              <td>
                <img
                  src={item.imageUrl || imagenPredeterminada}
                  alt={item.name}
                  className="inventory-item-image"
                  onClick={e => {                       // evita que abra dos modales
                    e.stopPropagation();
                    setModalImage(item.imageUrl || imagenPredeterminada);
                  }}
                />
              </td>

              {/* ───── DATOS BÁSICOS ───── */}
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td>{item.location}</td>
              <td>${item.price.toLocaleString('es-CL')}</td>
              <td>{item.quantity}</td>
              <td>{item.status}</td>
              <td>{new Date(item.createdAt).toLocaleDateString('es-CL')}</td>

              {/* ───── ACCIONES ───── */}
<td
  className="inventory-action-cell"
  onClick={e => e.stopPropagation()}
>
  {/* Icono que indica customAttributes */}
  {item.customAttributes && Object.keys(item.customAttributes).length > 0 && (
    <div className="custom-attr-icon" title="Tiene atributos personalizados">
      <FaTag />
    </div>
  )}

  {deleteRow !== item.id ? (
    <>
      <button
        className="inventory-icon-button"
        onClick={() => onEdit(item.id)}
      >
        <FaEdit />
      </button>

      <button
        className="inventory-icon-button"
        onClick={() => {
          setDeleteRow(item.id);
          setDeleteQty(1);
        }}
      >
        <FaTrash />
      </button>
    </>
  ) : (
    <div className="inventory-delete-mode">
                    <input
                      type="number"
                      min={1}
                      max={item.quantity}
                      step={1}
                      value={deleteQty}
                      className="inventory-qty-input"
                      onChange={e => {
                        const v = Number(e.target.value);
                        if (!Number.isNaN(v))
                          setDeleteQty(Math.max(1, Math.min(item.quantity, v)));
                      }}
                    />

                    {/* Botones debajo del input */}
                    <div className="inventory-delete-buttons">
                      <button
                        className="inventory-confirm-btn"
                        onClick={() => {
                          onDelete(item.id, deleteQty);
                          setDeleteRow(-1);
                        }}
                      >
                        Eliminar
                      </button>
                      <button
                        className="inventory-cancel-btn"
                        onClick={() => setDeleteRow(-1)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ───── Modal sólo para ver la imagen ───── */}
      {modalImage && (
        <div
          className="inventory-modal-overlay"
          onClick={() => setModalImage(null)}
        >
          <div
            className="inventory-modal-content"
            onClick={e => e.stopPropagation()}
          >
            <img src={modalImage} alt="Vista previa" />
            <button
              className="inventory-modal-close-button"
              onClick={() => setModalImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InventoryTable;
