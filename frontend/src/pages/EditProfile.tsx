import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './Register.css';

const EditProfile = () => {
  const {login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    currentPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
 
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!storedUser || !token) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      console.log('Datos del usuario:', parsedUser);

      if (!parsedUser.rut) {
        console.error('No se encontró RUT de usuario en:', parsedUser);
        navigate('/login');
        return;
      }

      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || '',
      }));
    } catch (e) {
      console.error('Error al parsear usuario:', e);
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (!storedUser || !token) {
        throw new Error('No hay sesión activa');
      }

      const parsedUser = JSON.parse(storedUser);
      console.log('Enviando actualización para:', parsedUser); 

      const updateData = {
        ...(formData.name && { name: formData.name }),
        ...(formData.currentPassword && { currentPassword: formData.currentPassword }),
        ...(formData.newPassword && { newPassword: formData.newPassword })
      };

      const response = await axios.patch(
        `http://localhost:3000/api/v1/users/by-rut/${parsedUser.rut}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('Respuesta del servidor:', response.data); 

      if (response.data) {
        const updatedUser = { ...parsedUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser);
        navigate('/profile');
      }
    } catch (err: any) {
      console.error('Error detallado:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
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
            <label className="form-label">Contraseña Actual</label>
            <input 
              type="password" 
              className="form-input"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Nueva Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
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
