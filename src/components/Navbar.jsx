import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Shield } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout, cart } = useAppContext();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav style={{ background: 'var(--primary)', color: 'white', padding: '1rem', position: 'sticky', top: 0, zIndex: 100 }}>
      <div className="container flex justify-between items-center" style={{ padding: 0 }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 700 }}>
          Yacuiba<span style={{ color: '#fff000' }}>Entregas</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/checkout')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', position: 'relative' }}>
            <ShoppingCart size={24} />
            {cartItemsCount > 0 && (
              <span style={{ position: 'absolute', top: -8, right: -8, background: '#fff000', color: '#000', borderRadius: '50%', width: 20, height: 20, fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                {cartItemsCount}
              </span>
            )}
          </button>
          
          <div style={{ position: 'relative' }}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
              <User size={24} />
            </button>
            
            {isMenuOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--surface)', color: 'var(--text-main)', borderRadius: 'var(--radius)', padding: '0.5rem', minWidth: '150px', boxShadow: 'var(--shadow)', marginTop: '0.5rem', zIndex: 101 }}>
                {!user ? (
                  <button className="btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }} onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}>
                    Iniciar Sesión
                  </button>
                ) : (
                  <>
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                      Hola, {user.name}
                    </div>
                    {user.role === 'admin' && (
                      <button className="btn-outline" style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', border: 'none', textAlign: 'left', padding: '0.5rem' }} onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}>
                        <Shield size={16} /> Admin Panel
                      </button>
                    )}
                    <button className="btn-outline" style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', border: 'none', textAlign: 'left', padding: '0.5rem' }} onClick={() => { navigate('/orders'); setIsMenuOpen(false); }}>
                      <Package size={16} /> Mis Pedidos
                    </button>
                    <button className="btn-outline" style={{ width: '100%', display: 'flex', gap: '0.5rem', border: 'none', textAlign: 'left', padding: '0.5rem', color: 'var(--primary)' }} onClick={() => { logout(); navigate('/'); setIsMenuOpen(false); }}>
                      <LogOut size={16} /> Salir
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
