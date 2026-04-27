import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { UserPlus, LogIn } from 'lucide-react';

export default function Auth() {
  const { login, register } = useAppContext();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (login(phone, password)) {
        navigate('/');
      } else {
        setError('Credenciales incorrectas');
      }
    } else {
      if (!name || !phone || !password) {
        setError('Llena todos los campos');
        return;
      }
      if (register(name, phone, password)) {
        navigate('/');
      } else {
        setError('El teléfono ya está registrado');
      }
    }
  };

  return (
    <div className="container flex justify-center items-center animate-slide-up" style={{ minHeight: '60vh' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4 text-primary">
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center', background: '#ffebee', padding: '0.5rem', borderRadius: '4px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="flex-col gap-4">
          {!isLogin && (
            <input 
              type="text" 
              className="input-field" 
              placeholder="Tu Nombre (Ej. Juan Perez)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          )}
          
          <input 
            type="text" 
            className="input-field" 
            placeholder={isLogin ? 'Nombre de Usuario o Teléfono' : 'Número de Teléfono (Ej. 70012345)'} 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
          />
          
          <input 
            type="password" 
            className="input-field" 
            placeholder="Contraseña" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
          />
          
          <button type="submit" className="btn-primary mt-4">
            {isLogin ? <><LogIn size={18} /> Entrar</> : <><UserPlus size={18} /> Crear Cuenta</>}
          </button>
        </form>

        <p className="text-center mt-4 text-muted" style={{ fontSize: '0.9rem' }}>
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)} 
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 'bold', marginLeft: '0.5rem', cursor: 'pointer' }}
          >
            {isLogin ? 'Regístrate' : 'Ingresa aquí'}
          </button>
        </p>
      </div>
    </div>
  );
}
