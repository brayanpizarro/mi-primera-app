// src/pages/RegisterUser.tsx

import './Register.css';

const RegisterUser = () => {
  return (
    <div className="register-container">
      <h2>Registro Usuario</h2>
      <form>
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input type="text" placeholder="Ej: JuanPerez" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" placeholder="Ej: usuario@email.com" />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" placeholder="******" />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select>
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        </div>
        <button type="submit" className="submit-button">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterUser;