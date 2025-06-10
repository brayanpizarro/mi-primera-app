import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import RegisterUser from './pages/RegisterUser';
import InventoryPage from './pages/InventoryPage';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterUser />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
