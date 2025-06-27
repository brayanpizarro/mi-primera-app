import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import './Navbar.css';
import '../pages/Register.css';
import ucnLogo from '../assets/ucnLogo-b0e5fe78.png';
const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  if (!user) {
    return null; 
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const isAdmin = user?.role === 'admin';

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <img src={ucnLogo} alt="UCN Logo" className="navbar-logo" />
      </div>
      <div className="navbar-brand">
        <span>StockMind UCN</span>
      </div>
      <div className="navbar-menu">
        <Link to={isAdmin ? "/inventory" : "/inventoryUser"} className="navbar-item">
          Ver Inventario
        </Link>
        {isAdmin && (
          <>
            <Link to="/register" className="navbar-item">
              Registrar Usuario
            </Link>
            <Link to="/users" className="navbar-item">
              Ver Usuarios
            </Link>
          </>
        )}
        <Link to="/editProfile" className="navbar-item">
          Editar Perfil
        </Link>
      </div>
      <div className="navbar-end">
        <div className="navbar-user">
          <span className="user-name">{user?.name}</span>
          <span className="user-role">{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
