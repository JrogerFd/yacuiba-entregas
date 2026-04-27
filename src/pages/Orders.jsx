import { useAppContext } from '../store/AppContext';
import { Package, Clock, CheckCircle } from 'lucide-react';

export default function Orders() {
  const { orders, user } = useAppContext();
  
  // Filtrar pedidos del usuario actual
  const userOrders = orders.filter(o => o.userId === user?.id);

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente de Validación';
      case 'accepted': return 'En Preparación';
      case 'delivering': return 'En Camino';
      case 'completed': return 'Entregado';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#3b82f6';
      case 'delivering': return '#8b5cf6';
      case 'completed': return '#10b981';
      default: return 'var(--text-muted)';
    }
  };

  if (userOrders.length === 0) {
      return (
          <div className="container text-center animate-slide-up" style={{ padding: '4rem 1rem' }}>
              <Package size={48} className="text-muted mb-4" style={{ margin: '0 auto' }} />
              <h2>No tienes pedidos recientes</h2>
              <p className="text-muted mt-2">Visita el catálogo para empezar a pedir.</p>
          </div>
      );
  }

  return (
    <div className="container animate-slide-up">
      <h1 className="mb-4">Mis Pedidos</h1>
      
      <div className="flex-col gap-4">
        {userOrders.map(order => (
          <div key={order.id} className="card">
            <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <div>
                <strong>Pedido #{order.id}</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div style={{ 
                background: getStatusColor(order.status) + '22', 
                color: getStatusColor(order.status),
                padding: '0.25rem 0.75rem',
                borderRadius: '99px',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {getStatusText(order.status)}
              </div>
            </div>

            <div className="mb-4">
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Detalle:</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    {item.quantity}x {item.name} - Bs. {item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <div className="mt-2" style={{ fontWeight: 'bold' }}>
                Total Pagado: Bs. {order.total}
              </div>
            </div>

            {order.eta && order.status !== 'completed' && (
              <div 
                className="flex items-center gap-2 mt-4" 
                style={{ 
                  background: 'var(--primary)', 
                  color: 'white', 
                  padding: '1rem', 
                  borderRadius: 'var(--radius)',
                  fontWeight: 'bold'
                }}
              >
                <Clock size={20} />
                <span>Tiempo estimado de llegada: {order.eta}</span>
              </div>
            )}
            
            {order.status === 'completed' && (
               <div className="flex items-center gap-2 mt-4 text-center justify-center p-2" style={{color: '#10b981', fontWeight: 'bold'}}>
                   <CheckCircle size={20} /> Entregado con éxito
               </div>
            )}
            
          </div>
        ))}
      </div>
    </div>
  );
}
