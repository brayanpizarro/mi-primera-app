import { useEffect, useState } from 'react';
import axios from 'axios';
import './UsersTable.css';

interface User {
  name: string;
  rut: string;
  email: string;
  role: string;
}

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingRut, setDeletingRut] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/api/v1/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (err: any) {
        setError('Error al obtener los usuarios');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Eliminar usuario enviando el RUT tal como está en la base de datos
  const handleDelete = async (rut: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/v1/users/by-rut/${rut}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUsers(users.filter(u => u.rut !== rut));
      setDeletingRut(null);
      setConfirmName('');
    } catch (err: any) {
      setError('Error al eliminar el usuario');
    }
  };

  // Obtener el rut del usuario logueado para no permitir eliminarse a sí mismo
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  if (loading) return <div>Cargando usuarios...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="users-table-background">
      <div className="users-table-container">
        <h2 className="inventory-table-title">Usuarios Registrados</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUT</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.rut}</td>
                <td>{user.email}</td>
                <td>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</td>
                <td>
                  {user.rut !== currentUser.rut && (
                    <>
                      <button
                        className="inventory-icon-button"
                        style={{ backgroundColor: '#e92f2f' }}
                        onClick={() => {
                          setDeletingRut(user.rut);
                          setConfirmName(user.name);
                        }}
                      >
                        Eliminar
                      </button>
                      {deletingRut === user.rut && (
                        <div className="inventory-modal-overlay">
                          <div className="inventory-modal-content">
                            <p>¿Está seguro que desea eliminar a "{confirmName}"?</p>
                            <button className="inventory-confirm-btn" onClick={() => handleDelete(user.rut)}>
                              Sí, eliminar
                            </button>
                            <button className="inventory-cancel-btn" onClick={() => setDeletingRut(null)}>
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
