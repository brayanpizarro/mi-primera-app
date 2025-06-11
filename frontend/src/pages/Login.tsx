import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';

const Login = () => {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const formattedRut = formatRut(rut);
      
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', {
        rut: formattedRut,
        password
      });

      // Guardar el token y la información del usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirigir según el rol (ahora en minúscula)
      if (response.data.user.role === 'admin') {
        navigate('/inventory');
      } else {
        navigate('/inventoryUser');
      }

    } catch (err: any) {
      // Manejo mejorado de errores
      if (err.response) {
        if (err.response.status === 401) {
          setError('Credenciales incorrectas o usuario no existe');
        } else {
          setError(err.response.data?.message || 'Error en el inicio de sesión');
        }
      } else {
        setError('Error de conexión con el servidor');
      }
      console.error('Error en el login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Permitir solo números, k, K y guión
    value = value.replace(/[^0-9kK-]/g, '');
    setRut(value);
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2 className="app-title">StockMind</h2>
          <p className="app-subtitle">Gestión de Inventarios UCN</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">RUT</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="12.345.678-9"
              required
              value={rut}
              onChange={handleRutChange}
              maxLength={12}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Ingresa tu contraseña"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="register-redirect">
            ¿No tienes una cuenta?{' '}
            <span 
              className="register-link" 
              onClick={() => navigate('/register')}
            >
              Regístrate aquí
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;