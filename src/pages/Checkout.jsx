import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { MapPin, UploadCloud, CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { cart, removeFromCart, createOrder, adminSettings } = useAppContext();
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleGetLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(`Lat: ${pos.coords.latitude.toFixed(4)}, Lng: ${pos.coords.longitude.toFixed(4)} (Usando GPS)`);
          setIsLocating(false);
        },
        (err) => {
          alert('No se pudo obtener la ubicación. Por favor, escríbela manualmente.');
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
      alert('Tu navegador no soporta geolocalización.');
    }
  };

  const handleSimulateUpload = (e) => {
    // Para simplificar la demo, simulamos la subida de imagen leyendo el archivo como base64
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmOrder = () => {
    if (!location) {
      alert('Por favor ingresa tu dirección de envío o usa el GPS');
      return;
    }
    if (!receiptUrl) {
      alert('Por favor sube tu comprobante de pago');
      return;
    }

    createOrder({
      items: cart,
      total,
      location,
      receiptUrl
    });
    
    navigate('/orders');
  };

  if (cart.length === 0) {
    return (
      <div className="container text-center animate-slide-up" style={{ padding: '4rem 1rem' }}>
        <h2>Tu carrito está vacío</h2>
        <button className="btn-primary mt-4" onClick={() => navigate('/')}>Volver al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="container animate-slide-up">
      <h1 className="mb-4">Finalizar Compra</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Resumen de Carrito */}
        <div className="card">
          <h2>Resumen</h2>
          <div className="mt-4 flex-col gap-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                <div className="flex items-center gap-2">
                  <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                  <div>
                    <span style={{ fontWeight: 500 }}>{item.quantity}x {item.name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span style={{ fontWeight: 'bold' }}>Bs. {item.price * item.quantity}</span>
                  <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            <span>Total a Pagar:</span>
            <span className="text-primary">Bs. {total}</span>
          </div>
        </div>

        {/* Formulario de Envío y Pago */}
        <div className="card">
          <h2>1. Dirección de Envío</h2>
          <div className="mt-4 flex gap-2">
            <input 
              type="text" 
              className="input-field" 
              placeholder="Escribe tu calle/barrio o usa el GPS..." 
              value={location} 
              onChange={e => setLocation(e.target.value)}
            />
            <button className="btn-outline" onClick={handleGetLocation} disabled={isLocating} title="Usar GPS">
              <MapPin size={20} />
            </button>
          </div>

          <h2 className="mt-4" style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>2. Método de Pago</h2>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Paga mediante QR y sube tu comprobante.</p>
          
          <div className="text-center mb-4">
            <img src={adminSettings.qrCodeUrl} alt="QR Code" style={{ width: '150px', height: '150px', objectFit: 'contain', border: '1px solid var(--border)', padding: '0.5rem', borderRadius: '8px' }} />
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
              <strong>{adminSettings.bankName}</strong><br/>
              Cta: {adminSettings.accountNumber}<br/>
              Nombre: {adminSettings.accountName}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleSimulateUpload} 
              style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
            />
            <button className="btn-outline" style={{ width: '100%', pointerEvents: 'none' }}>
              <UploadCloud size={20} /> {receiptUrl ? 'Comprobante Subido' : 'Subir Comprobante (Obligatorio)'}
            </button>
          </div>
          
          {receiptUrl && (
            <div className="mt-4 text-center">
              <img src={receiptUrl} alt="Comprobante" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
            </div>
          )}

          <button 
            className="btn-primary mt-4" 
            style={{ width: '100%', padding: '1rem' }}
            onClick={handleConfirmOrder}
          >
            <CheckCircle size={20} /> Confirmar Pedido
          </button>
        </div>

      </div>
    </div>
  );
}
