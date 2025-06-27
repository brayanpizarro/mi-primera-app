import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import InventoryPage from './pages/InventoryPage';
import InventoryPageUser from './pages/InventoryPageUser';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import EditProfile from './pages/EditProfile';
import UsersTable from './pages/UsersTable';


function AppWrapper() {
  return (
    <UserProvider>
      <Router>
        <App />
      </Router>
    </UserProvider>
  );
}

function App() {
  const location = useLocation();


  const hideNavbar = location.pathname === '/login';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />

          <Route path="/editprofile" element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } />

          <Route path="/inventory" element={
            <ProtectedRoute requiredRole="admin">
              <InventoryPage />
            </ProtectedRoute>
          } />

          <Route path="/inventoryUser" element={
            <ProtectedRoute>
              <InventoryPageUser />
            </ProtectedRoute>
          } />

          <Route path="/users" element={
            <ProtectedRoute requiredRole="admin">
              <UsersTable />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default AppWrapper;
