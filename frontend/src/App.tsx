import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import InventoryPageUser from './pages/InvetoryPageUser'
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
   return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterUser />} />

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

        {/* Otras rutas protegidas pueden agregarse aquí */}
      </Routes>
    </Router>
  );
}

export default App;
