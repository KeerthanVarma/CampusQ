import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { ShoppingBag, Plus, Minus, ArrowLeft, AlertCircle } from 'lucide-react';

export const MenuPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState({}); // itemId -> quantity
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/outlets/${id}/menu`)
      .then(res => setMenuItems(res.data))
      .catch(err => {
        setError(err.response?.data?.detail || 'Failed to load menu.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const updateQuantity = (itemId, change) => {
    setCart(prev => {
      const current = prev[itemId] || 0;
      const next = current + change;
      if (next <= 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((total, [itemId, qty]) => {
      const item = menuItems.find(i => i.id === parseInt(itemId));
      return total + (item ? item.price * qty : 0);
    }, 0);
  };

  const handleCheckout = async () => {
    const orderItems = Object.entries(cart).map(([itemId, quantity]) => ({
      item_id: parseInt(itemId),
      quantity
    }));

    try {
      const res = await api.post('/orders/', {
        outlet_id: parseInt(id),
        items: orderItems
      });
      navigate(`/tracker/${res.data.id}`);
    } catch (err) {
      alert(err.response?.data?.detail || 'Order creation failed.');
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Fetching live menu...</div>;

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-slate-800 border border-slate-700 rounded-2xl text-center">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold mb-2">Outlet Unavailable</h3>
        <p className="text-slate-400 text-sm mb-4">{error}</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Back to Outlets
        </button>
      </div>
    );
  }

  const totalAmount = calculateTotal();
  const totalItemCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 pb-28">
      <button 
        onClick={() => navigate('/')} 
        className="flex items-center gap-1 text-slate-400 hover:text-white text-sm font-semibold mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Outlets
      </button>

      <h1 className="text-2xl font-extrabold mb-6">Outlet Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {menuItems.map((item) => {
          const qty = cart[item.id] || 0;
          return (
            <div 
              key={item.id} 
              className={`bg-slate-800 border border-slate-700 p-4 rounded-xl flex gap-4 ${
                !item.is_available ? 'opacity-50' : ''
              }`}
            >
              <img 
                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'} 
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg bg-slate-700 shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-base">{item.name}</h4>
                  <p className="text-rose-400 font-bold text-sm mt-0.5">₹{item.price}</p>
                </div>

                {item.is_available ? (
                  <div className="flex items-center gap-3 mt-3">
                    {qty > 0 ? (
                      <div className="flex items-center gap-3 bg-rose-600/20 border border-rose-500 rounded-lg px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-rose-400 hover:text-white">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold text-rose-300">{qty}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-rose-400 hover:text-white">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="bg-slate-700 hover:bg-rose-600 text-xs font-bold px-3 py-1.5 rounded-lg transition"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-rose-500 font-bold uppercase tracking-wider">Out of Stock</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Zomato-style Floating Bottom Checkout Drawer */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-40">
          <div className="bg-rose-600 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-rose-400/30">
            <div>
              <p className="text-xs text-rose-200 uppercase font-bold tracking-wider">{totalItemCount} Items added</p>
              <p className="text-xl font-black">₹{totalAmount}</p>
            </div>

            <button 
              onClick={handleCheckout}
              className="bg-white text-rose-600 font-extrabold px-5 py-2.5 rounded-xl hover:bg-rose-50 transition shadow-md flex items-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" /> Place Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};