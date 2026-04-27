import { useState } from 'react';
import { useAppContext } from '../store/AppContext';
import { Check, Edit, Trash2, Plus, Save } from 'lucide-react';

export default function AdminDashboard() {
  const { 
    orders, updateOrderStatus, updateAdminSettings, adminSettings, 
    products, addProduct, updateProduct, deleteProduct, users
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="container animate-slide-up">
      <h1 className="mb-4">Panel de Administración</h1>

      <div className="flex gap-4 mb-4" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          className={activeTab === 'orders' ? 'btn-primary' : 'btn-outline'} 
          onClick={() => setActiveTab('orders')}
        >
          Pedidos Entrantes
        </button>
        <button 
          className={activeTab === 'products' ? 'btn-primary' : 'btn-outline'} 
          onClick={() => setActiveTab('products')}
        >
          Editar Productos
        </button>
        <button 
          className={activeTab === 'settings' ? 'btn-primary' : 'btn-outline'} 
          onClick={() => setActiveTab('settings')}
        >
          Ajustes / Pago
        </button>
      </div>

      {activeTab === 'orders' && <OrdersTab orders={orders} users={users} updateOrderStatus={updateOrderStatus} />}
      {activeTab === 'products' && <ProductsTab products={products} addProduct={addProduct} updateProduct={updateProduct} deleteProduct={deleteProduct} />}
      {activeTab === 'settings' && <SettingsTab adminSettings={adminSettings} updateAdminSettings={updateAdminSettings} />}

    </div>
  );
}

function OrdersTab({ orders, users, updateOrderStatus }) {
  const [etaInputs, setEtaInputs] = useState({});

  const handleEtaChange = (id, val) => {
    setEtaInputs({ ...etaInputs, [id]: val });
  };

  const handleUpdate = (orderId, status) => {
    const eta = etaInputs[orderId] || null;
    updateOrderStatus(orderId, status, eta);
  };

  return (
    <div className="flex-col gap-4">
      {orders.length === 0 && <p>No hay pedidos.</p>}
      {orders.map(order => {
        const customer = users.find(u => String(u.id) === String(order.userId)) || { name: 'Desconocido', phone: 'Sin número' };
        return (
        <div key={order.id} className="card" style={{ borderLeft: `5px solid ${order.status === 'pending' ? 'var(--primary)' : '#10b981'}` }}>
          <div className="flex justify-between items-center mb-2">
            <h3>Pedido #{order.id}</h3>
            <span style={{ padding: '0.2rem 0.5rem', background: '#eee', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              Estado: {order.status}
            </span>
          </div>
          <p><strong>Cliente:</strong> {customer.name} (☎ {customer.phone})</p>
          <p><strong>Ubicación:</strong> {order.location}</p>
          <p><strong>Total:</strong> Bs. {order.total}</p>
          
          <div className="mt-2 text-muted" style={{ fontSize: '0.9rem' }}>
            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
          </div>

          <div className="mt-4 flex gap-4" style={{ flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <strong>Comprobante:</strong>
              {order.receiptUrl ? (
                <a href={order.receiptUrl} target="_blank" rel="noreferrer" style={{ display: 'block', color: 'var(--primary)' }}>Ver Imagen de Comprobante</a>
              ) : (
                <span className="text-muted">No subido</span>
              )}
            </div>
            
            <div style={{ flex: 2, minWidth: '250px' }}>
              <strong>Acciones del Admin:</strong>
              <div className="flex gap-2 mt-2">
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ej: 20 mins..." 
                  value={etaInputs[order.id] || order.eta || ''}
                  onChange={(e) => handleEtaChange(order.id, e.target.value)}
                  style={{ flex: 1 }}
                />
                {order.status === 'pending' && (
                  <button className="btn-primary" onClick={() => handleUpdate(order.id, 'accepted')}>
                    Aceptar
                  </button>
                )}
                <button className="btn-outline" style={{ background: '#10b981', color: 'white', borderColor: '#10b981' }} onClick={() => handleUpdate(order.id, 'delivering')}>
                  En Camino
                </button>
                <button className="btn-outline" onClick={() => handleUpdate(order.id, 'completed')}>
                  Finalizar
                </button>
              </div>
            </div>
          </div>
        </div>
      )})}
    </div>
  );
}

function ProductsTab({ products, addProduct, updateProduct, deleteProduct }) {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: '', image: '', restaurant: '' });
  
  const handleAdd = () => {
    if(!newProduct.name || !newProduct.price) return alert("Nombre y precio son obligatorios");
    addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price)
    });
    setNewProduct({ name: '', price: '', category: '', image: '', restaurant: '' });
  };

  return (
    <div className="flex-col gap-4">
      <div className="card">
        <h3>Agregar Nuevo Producto</h3>
        <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
          <input className="input-field" placeholder="Nombre" value={newProduct.name} onChange={e=>setNewProduct({...newProduct, name: e.target.value})} />
          <input className="input-field" type="number" placeholder="Precio (Bs)" value={newProduct.price} onChange={e=>setNewProduct({...newProduct, price: e.target.value})} />
          <input className="input-field" placeholder="Categoría" value={newProduct.category} onChange={e=>setNewProduct({...newProduct, category: e.target.value})} />
          <input className="input-field" placeholder="URL Imagen" value={newProduct.image} onChange={e=>setNewProduct({...newProduct, image: e.target.value})} />
          <input className="input-field" placeholder="Local/Restaurante" value={newProduct.restaurant} onChange={e=>setNewProduct({...newProduct, restaurant: e.target.value})} />
          <button className="btn-primary" onClick={handleAdd}><Plus size={18}/> Agregar</button>
        </div>
      </div>

      <div className="card">
        <h3>Catálogo Actual</h3>
        <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Local</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.5rem 0' }}>{p.name}</td>
                <td>Bs. {p.price}</td>
                <td>{p.restaurant}</td>
                <td>
                  <button onClick={() => deleteProduct(p.id)} style={{ color: 'red', background: 'none', border:'none', cursor:'pointer' }}><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsTab({ adminSettings, updateAdminSettings }) {
  const [settings, setSettings] = useState(adminSettings);

  const handleSave = () => {
    updateAdminSettings(settings);
    alert('Ajustes guardados con éxito');
  };

  return (
    <div className="card flex-col gap-4">
      <h3>Datos de Pago (Código QR)</h3>
      <p className="text-muted">Esta información será mostrada al usuario en la página de Checkout.</p>
      
      <div className="flex-col gap-2 mt-2">
        <label>URL Imagen Código QR</label>
        <input 
          type="text" 
          className="input-field" 
          value={settings.qrCodeUrl} 
          onChange={e => setSettings({...settings, qrCodeUrl: e.target.value})} 
        />
        
        <label>Nombre del Banco</label>
        <input 
          type="text" 
          className="input-field" 
          value={settings.bankName} 
          onChange={e => setSettings({...settings, bankName: e.target.value})} 
        />
        
        <label>Número de Cuenta (Opcional)</label>
        <input 
          type="text" 
          className="input-field" 
          value={settings.accountNumber} 
          onChange={e => setSettings({...settings, accountNumber: e.target.value})} 
        />
        
        <label>Nombre Titular</label>
        <input 
          type="text" 
          className="input-field" 
          value={settings.accountName} 
          onChange={e => setSettings({...settings, accountName: e.target.value})} 
        />
      </div>

      <button className="btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-start' }}><Save size={18} /> Guardar Cambios</button>
    </div>
  );
}
