import { useAppContext } from '../store/AppContext';
import { Plus } from 'lucide-react';

export default function Home() {
  const { products, addToCart } = useAppContext();

  // Group products by category
  const categories = products.reduce((acc, current) => {
    if (!acc[current.category]) acc[current.category] = [];
    acc[current.category].push(current);
    return acc;
  }, {});

  return (
    <div className="animate-slide-up">
      <header className="mb-4">
        <h1>¿Qué te apetece hoy?</h1>
        <p className="text-muted">Pide de los mejores lugares en Yacuiba</p>
      </header>

      {Object.keys(categories).map(category => (
        <section key={category} className="mb-4">
          <h2 style={{ marginBottom: '1rem' }}>{category}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {categories[category].map(product => (
              <div key={product.id} className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{product.name}</h3>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{product.restaurant}</p>
                    <p className="text-primary" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Bs. {product.price}</p>
                  </div>
                  <button 
                    className="btn-primary mt-4" 
                    onClick={() => addToCart(product)}
                    style={{ width: '100%' }}
                  >
                    <Plus size={18} /> Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
