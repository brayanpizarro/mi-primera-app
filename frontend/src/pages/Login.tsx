// src/pages/Login.tsx
import './Login.css';

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h2 className="app-title">StockMind</h2>
          <p className="app-subtitle">Gestión de Inventarios UCN</p>
        </div>
        
        <form className="login-form">
          <div className="form-group">
            <label className="form-label">Correo Institucional</label>
            <input 
              type="email" 
              className="form-input"
              placeholder="usuario@alumnos.ucn.cl"
              required
              pattern=".+@(alumnos|ucn)\.cl"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-input"
              placeholder="Ingresa tu contraseña"
              required
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