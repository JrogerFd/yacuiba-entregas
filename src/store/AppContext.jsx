import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Mock Initial Data
const initialProducts = [
  { id: 1, name: 'Hamburguesa Doble', price: 25, category: 'Comida', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400', restaurant: 'Burger King Yacuiba' },
  { id: 2, name: 'Pizza Pepperoni', price: 50, category: 'Comida', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=400', restaurant: 'Pizzería Central' },
  { id: 3, name: 'Pollo a la Broaster', price: 30, category: 'Comida', image: 'https://images.unsplash.com/photo-1626082895617-2c6ad2e3a097?auto=format&fit=crop&q=80&w=400', restaurant: 'Pollos Copacabana' },
  { id: 4, name: 'Servicio de Taxi (Móvil)', price: 15, category: 'Transporte', image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=400', restaurant: 'Taxis Yacuiba' },
];

const initialAdminSettings = {
  qrCodeUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', // Fake QR
  bankName: 'Banco Unión',
  accountNumber: '1000000000',
  accountName: 'Yacuiba Entregas SRL'
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')) || null);
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('users')) || []);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('products')) || initialProducts);
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('orders')) || []);
  const [adminSettings, setAdminSettings] = useState(() => JSON.parse(localStorage.getItem('adminSettings')) || initialAdminSettings);
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);

  // Sync to localstorage
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('adminSettings', JSON.stringify(adminSettings)); }, [adminSettings]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);

  const login = (phoneOrName, password) => {
    // Hidden admin backdoor
    if (phoneOrName === 'admin' && password === 'admin') {
      const adminUser = { id: 0, phone: 'admin', role: 'admin', name: 'Administrador' };
      setUser(adminUser);
      return true;
    }
    const searchString = String(phoneOrName).trim().toLowerCase();
    const existing = users.find(u => 
      (String(u.phone).trim().toLowerCase() === searchString || String(u.name).trim().toLowerCase() === searchString)
      && String(u.password) === String(password)
    );
    if (existing) {
      setUser(existing);
      return true;
    }
    return false;
  };

  const register = (name, phone, password) => {
    if (users.find(u => String(u.phone).trim() === String(phone).trim())) return false;
    const newUser = { id: Date.now(), name, phone: String(phone).trim(), password: String(password), role: 'user' };
    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => String(item.id) === String(product.id));
      if (existing) {
        return prev.map(item => String(item.id) === String(product.id) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => String(item.id) !== String(id)));
  };

  const clearCart = () => setCart([]);

  const createOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      userId: user.id,
      status: 'pending', // pending, accepted, delivering, completed
      eta: null,
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder.id;
  };

  const updateOrderStatus = (orderId, newStatus, eta = null) => {
    setOrders(prev => prev.map(o => String(o.id) === String(orderId) ? { ...o, status: newStatus, eta: eta !== null ? eta : o.eta } : o));
  };
  
  const updateAdminSettings = (newSettings) => {
      setAdminSettings(prev => ({...prev, ...newSettings}));
  };
  
  const updateProduct = (productId, newData) => {
      setProducts(prev => prev.map(p => String(p.id) === String(productId) ? {...p, ...newData} : p));
  };
  
  const addProduct = (newProduct) => {
      setProducts(prev => [...prev, { ...newProduct, id: Date.now() }]);
  }
  
  const deleteProduct = (productId) => {
      setProducts(prev => prev.filter(p => String(p.id) !== String(productId)));
  }

  return (
    <AppContext.Provider value={{ 
      user, users, products, orders, cart, adminSettings, 
      login, register, logout, addToCart, removeFromCart, clearCart, 
      createOrder, updateOrderStatus, updateAdminSettings, updateProduct, addProduct, deleteProduct
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
