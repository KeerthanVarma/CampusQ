import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import { ToggleLeft, ToggleRight, Power, DollarSign } from 'lucide-react';

export const AdminDashboard = () => {
  const [outlet, setOutlet] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const outletId = 1;

  useEffect(() => {
    fetchOutletData();
  }, []);

  const fetchOutletData = async () => {
    const outletsRes = await api.get('/outlets/');
    const current = outletsRes.data.find(o => o.id === outletId);
    setOutlet(current);

    if (current && current.is_open) {
      const menuRes = await api.get(`/outlets/${outletId}/menu`);
      setMenuItems(menuRes.data);
    }
  };

  const toggleOutletOpen = async () => {
    const newStatus = !outlet.is_open;
    await api.patch(`/outlets/${outletId}/status`, { is_open: newStatus });
    setOutlet(prev => ({ ...prev, is_open: newStatus }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black">{outlet?.name || 'Outlet Management'}</h1>
          <p className="text-xs text-slate-400">Master Controls & Menu Availability</p>
        </div>

        <button
          onClick={toggleOutletOpen}
          className={`px-5 py-2.5 rounded-xl font-extrabold flex items-center gap-2 text-sm transition ${
            outlet?.is_open 
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
              : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          <Power className="w-4 h-4" />
          {outlet?.is_open ? 'OUTLET IS OPEN' : 'OUTLET IS CLOSED'}
        </button>
      </div>

      <h2 className="text-lg font-bold mb-4">Manage Menu Stock</h2>

      <div className="space-y-3">
        {menuItems.map(item => (
          <div key={item.id} className="bg-slate-800/60 border border-slate-700/80 p-4 rounded-xl flex justify-between items-center">
            <div>
              <h4 className="font-bold text-sm">{item.name}</h4>
              <span className="text-xs text-rose-400 font-semibold">₹{item.price}</span>
            </div>

            <button
              className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition ${
                item.is_available 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {item.is_available ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              {item.is_available ? 'IN STOCK' : 'OUT OF STOCK'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};