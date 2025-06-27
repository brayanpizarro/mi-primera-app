import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import './Register.css';

const EditProfile = () => {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    currentPassword: '',
    newPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleUser, setIsGoogleUser] = useState(false);
  const [userEmail, setUserEmail] = useState('');

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

      // Verificar si es usuario de Google (RUT por defecto '0-0' o sin RUT)
      const isGoogle = parsedUser.rut === '0-0' || !parsedUser.rut || parsedUser.picture;
      setIsGoogleUser(isGoogle);
      setUserEmail(parsedUser.email || '');

      if (!parsedUser.rut && !parsedUser.email) {
        console.error('No se encontró RUT o email de usuario en:', parsedUser);
        navigate('/login');
        return;
      }

      setFormData(prev => ({
        ...prev,
        name: parsedUser.name || '',
        rut: parsedUser.rut === '0-0' ? '' : (parsedUser.rut || ''),
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

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Permitir solo números, k, K y guión
    value = value.replace(/[^0-9kK-]/g, '');
    setFormData(prev => ({
      ...prev,
      rut: value
    }));
  };

  function formatRut(rut: string) {
    let cleanRut = rut.replace(/[^0-9kK]/gi, '').toUpperCase();
    if (cleanRut.length < 2) return cleanRut;
    const cuerpo = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1);
    let cuerpoConPuntos = '';
    for (let i = cuerpo.length; i > 0; i -= 3) {
      const start = Math.max(i - 3, 0);
      cuerpoConPuntos = (start > 0 ? '.' : '') + cuerpo.slice(start, i) + cuerpoConPuntos;
    }
    return `${cuerpoConPuntos}-${dv}`;
  }

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

      // AGREGA ESTE LOG:
      console.log('Valor actual de formData.rut:', formData.rut);

      // SOLO para Google: formatea el rut antes de enviarlo
      const updateData = {
        ...(formData.name && { name: formData.name }),
        ...(isGoogleUser && formData.rut && formData.rut !== '0-0' && { rut: formatRut(formData.rut) }),
        ...(formData.currentPassword && { currentPassword: formData.currentPassword }),
        ...(formData.newPassword && { newPassword: formData.newPassword })
      };

      // (Opcional) Verifica el valor que se enviará al backend
      console.log('RUT enviado al backend:', updateData.rut);

      let response;
      if (isGoogleUser) {
        response = await axios.patch(
          `http://localhost:3000/api/v1/users/by-email/${parsedUser.email}`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        response = await axios.patch(
          `http://localhost:3000/api/v1/users/by-rut/${parsedUser.rut}`,
          updateData,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }

      if (response.data) {
        const updatedUser = { ...parsedUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        login(updatedUser);
        navigate('/profile');
      }
    } catch (err: any) {
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
          {isGoogleUser && (
            <div className="google-user-notice">
              <p>Usuario de Google - Puedes registrar tu RUT para completar tu perfil</p>
              <p>Email: {userEmail}</p>
            </div>
          )}
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

          {isGoogleUser && (
            <div className="form-group">
              <label className="form-label">RUT (sin puntos ni guion)</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="Ej: 22222222K"
                name="rut"
                value={formData.rut}
                onChange={(e) => {
                  // Solo números y k/K
                  let value = e.target.value.replace(/[^0-9kK]/g, '');
                  setFormData(prev => ({
                    ...prev,
                    rut: value
                  }));
                }}
                maxLength={10}
              />
              <small className="form-help">Ingresa tu RUT sin puntos ni guion. Ejemplo: 22222222k</small>
            </div>
          )}

          {!isGoogleUser && (
            <>
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
            </>
          )}

          {isGoogleUser && (
            <div className="form-group">
              <label className="form-label">Nueva Contraseña (Opcional)</label>
              <input 
                type="password" 
                className="form-input"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Establece una contraseña para tu cuenta"
              />
              <small className="form-help">Los usuarios de Google pueden establecer una contraseña para acceder sin Google</small>
            </div>
          )}

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
