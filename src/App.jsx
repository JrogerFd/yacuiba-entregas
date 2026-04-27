import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import { useAppContext } from './store/AppContext';

function App() {
  const { user } = useAppContext();

  return (
    <div className="app-container">
      <Navbar />
      <div className="container" style={{ paddingBottom: '80px', paddingTop: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
          <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/auth" />} />
          <Route path="/orders" element={user ? <Orders /> : <Navigate to="/auth" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
