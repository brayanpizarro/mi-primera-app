// src/pages/Login.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './Login.css';

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const formatRut = (value: string) => {
    // Eliminar puntos y guión
    let rutLimpio = value.replace(/\./g, '').replace(/-/g, '');
    
    // Eliminar todo lo que no sean números o k
    rutLimpio = rutLimpio.replace(/[^0-9kK]/g, '');
    
    if (rutLimpio.length > 1) {
      // Obtener dígito verificador
      const dv = rutLimpio.slice(-1);
      // Obtener rut sin dígito verificador
      const rutSinDv = rutLimpio.slice(0, -1);
      
      // Formatear con puntos
      let rutFormateado = rutSinDv;
      if (rutSinDv.length > 3) {
        rutFormateado = rutSinDv.slice(0, -3) + '.' + rutSinDv.slice(-3);
      }
      if (rutFormateado.length > 7) {
        rutFormateado = rutFormateado.slice(0, -7) + '.' + rutFormateado.slice(-7);
      }
      
      // Agregar guión y dígito verificador
      rutFormateado = rutFormateado + '-' + dv;
      return rutFormateado.toUpperCase();
    }
    return rutLimpio;
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedRut = formatRut(e.target.value);
    setRut(formattedRut);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ rut, password });
      navigate('/inventory');
    } catch (err: any) {
      setError(err?.message || 'Credenciales inválidas');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2 className="app-title">StockMind</h2>
          <p className="app-subtitle">Gestión de Inventarios UCN</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">RUT</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ej: 12.345.678-9"
              value={rut}
              onChange={handleRutChange}
              required
              pattern="^(\d{1,2}\.?\d{3}\.?\d{3}-[\dkK])$"
              title="Formato de RUT inválido. Debe ser como: 12.345.678-9"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          
          <button type="submit" className="submit-button">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;