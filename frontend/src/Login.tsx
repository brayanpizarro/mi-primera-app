// src/Login.tsx
import React, { useState } from 'react';
import './Login.css';

// Función para validar formato de RUT chileno
const validarRUT = (rut: string): boolean => {
  if (!rut || typeof rut !== 'string') return false;
  
  // Eliminar puntos y guión, y convertir a mayúsculas
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  
  // Separar el RUT del dígito verificador
  const [cuerpo, dv] = rutLimpio.split('-');
  
  if (!cuerpo || !dv || cuerpo.length < 7) return false;
  
  // Calcular dígito verificador esperado
  let suma = 0;
  let multiplicador = 2;
  
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }
  
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();
  
  return dv === dvCalculado;
};

const Login = () => {
  // Estados para manejar los inputs y errores
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!rut || !password) {
      setError('Por favor complete todos los campos');
      return;
    }
    
    if (!validarRUT(rut)) {
      setError('El RUT ingresado no es válido');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Simular autenticación
    try {
      setLoading(true);
      // Aquí iría la llamada real a tu API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Si todo sale bien, redirigir al dashboard
      console.log('Login exitoso!', { rut, password });
      // En una app real: navigate('/dashboard');
    } catch (err) {
      setError('Error al iniciar sesión. Verifique sus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>StockMind</h2>
        
        {/* Mensaje de error */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Campo RUT */}
        <div className="form-group">
          <label htmlFor="rut">RUT (Ej: 12.345.678-9)</label>
          <input
            id="rut"
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            placeholder="12.345.678-9"
            disabled={loading}
          />
        </div>
        
        {/* Campo Contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••"
            disabled={loading}
          />
        </div>
        
        {/* Botón de submit */}
        <button 
          type="submit" 
          className="login-button"
          disabled={loading}
        >
          {loading ? 'Validando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

export default Login;