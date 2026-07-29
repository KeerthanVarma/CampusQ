import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { CheckCircle, Play, PackageCheck, Power } from 'lucide-react';

export const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const outletId = 1; // Default outlet for testing

  const fetchOrders = () => {
    api.get('/outlets/').then(() => {
      // Fetching mock or live active items
    });
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold">Staff Kitchen Controller</h1>
          <p className="text-slate-400 text-sm">Amul Counter</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* State Columns */}
        {['placed', 'preparing', 'ready'].map((columnStatus) => (
          <div key={columnStatus} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-wider flex justify-between">
              <span>{columnStatus}</span>
            </h3>

            <div className="space-y-4">
              {/* Order Cards */}
              <div className="bg-slate-800 border border-slate-700 p-4 rounded-xl shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-black text-rose-400 text-lg">Order #154</span>
                  <span className="text-xs text-slate-400">₹170</span>
                </div>
                
                <ul className="text-xs text-slate-300 mb-4 space-y-1">
                  <li>• Maggi x2</li>
                  <li>• Cold Coffee x1</li>
                </ul>

                <button 
                  onClick={() => updateStatus(154, columnStatus === 'placed' ? 'preparing' : 'ready')}
                  className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2 rounded-lg transition"
                >
                  Advance Status
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};