import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';
import ucnLogo from '../assets/ucnLogo-b0e5fe78.png';
import eicLogo from '../assets/eicLogo-586fa087.png';


const RegisterUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    rut: '',
    email: '',
    password: '',
    role: 'user' 
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const formatRut = (rut: string) => {
    // Eliminar puntos y guión existentes
    let cleanRut = rut.replace(/\./g, '').replace(/-/g, '');
    
    // Formatear con puntos y guión
    if (cleanRut.length > 1) {
      cleanRut = cleanRut.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + cleanRut.slice(-1);
    }
    
    return cleanRut.toUpperCase();
  };

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
  
      const formattedRut = formatRut(formData.rut);
      
      
      await axios.post('http://localhost:3000/api/v1/auth/register', {
        ...formData,
        rut: formattedRut
      });

      
      navigate('/inventory');
    } catch (err: any) {
      
      if (err.response) {
        if (err.response.status === 400) {
          setError('El usuario ya existe');
        } else {
          setError(err.response.data?.message || 'Error en el registro');
        }
      } else {
        setError('Error de conexión con el servidor');
      }
      console.error('Error en el registro:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
     
      <div className="logos-container">
        <img src={ucnLogo} alt="Universidad Católica del Norte" className="institution-logo" />
        <img src={eicLogo} alt="Escuela de Ingeniería y Ciencias" className="institution-logo" />
      </div>

      <div className="register-container">
        <div className="register-header">
          <h2 className="app-title">Crear Cuenta</h2>
          <p className="app-subtitle">StockMind - Gestión de Inventarios UCN</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ej: Pablo Perez"
              required
              name="name"
              minLength={1}
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">RUT</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="12.345.678-9"
              required
              name="rut"
              value={formData.rut}
              onChange={handleRutChange}
              maxLength={12}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Correo Institucional</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="usuario@alumnos.ucn.cl"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo de Usuario</label>
            <div className="role-buttons-container">
              <button
                type="button"
                className={`role-button ${formData.role === 'user' ? 'active' : ''}`}
                onClick={() => handleRoleChange('user')}
              >
                Usuario Normal
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
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>

          
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;