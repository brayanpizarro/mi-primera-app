// src/pages/RegisterUser.tsx
import './Register.css';

const RegisterUser = () => {
  return (
    <div className="register-wrapper">
      <div className="register-container">
        <div className="register-header">
          <h2 className="app-title">Crear Cuenta</h2>
          <p className="app-subtitle">StockMind - Gestión de Inventarios UCN</p>
        </div>
        
        <form className="register-form">
          <div className="form-group">
            <label className="form-label">Nombre Completo</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Ej: Pablo Perez"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">RUT</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="12345678-9"
              required
              pattern="\d{7,8}-[\dKk]"
            />
          </div>
          
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
              placeholder="Mínimo 8 caracteres"
              required
              minLength={8}
            />
          </div>
          
          <button type="submit" className="submit-button">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterUser;