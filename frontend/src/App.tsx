import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import InventoryPageUser from './pages/InventoryPageUser'
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <UserProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <Routes>
            {/* Ruta por defecto - redirige al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterUser />} />

            {/* Rutas protegidas */}
            <Route path="/editprofile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />

            {/* Rutas protegidas para admin */}
            <Route path="/inventory" element={
              <ProtectedRoute requiredRole="admin">
                <InventoryPage />
              </ProtectedRoute>
            } />

            {/* Rutas protegidas para cualquier usuario autenticado */}
            <Route path="/inventoryUser" element={
              <ProtectedRoute>
                <InventoryPageUser />
              </ProtectedRoute>
            } />

            {/* Ruta para capturar rutas no definidas */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
