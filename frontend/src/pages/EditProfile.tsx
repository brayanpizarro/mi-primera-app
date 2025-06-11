import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const EditProfile = () => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: '',
    password:'',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Cargar datos del usuario actual
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        password: user.password,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: 'user' | 'admin') => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await axios.patch(`http://localhost:3000/api/v1/users/${user.id}`, formData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      navigate('/inventory');
    } catch (err: any) {
      setError('Error al actualizar perfil');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <h2 className="app-title">Editar Perfil</h2>
          <p className="app-subtitle">Modifica tu información personal</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input 
              type="text" 
              className="form-input"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Correo</label>
            <input 
              type="email" 
              className="form-input"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Rol</label>
            <div className="role-buttons-container">
              <button
                type="button"
                className={`role-button ${formData.role === 'user' ? 'active' : ''}`}
                onClick={() => handleRoleChange('user')}
              >
                Usuario
              </button>
              <button
                type="button"
                className={`role-button ${formData.role === 'admin' ? 'active' : ''}`}
                onClick={() => handleRoleChange('admin')}
              >
                Administrador
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
