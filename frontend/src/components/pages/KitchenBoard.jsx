import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Utensils, BellRing } from 'lucide-react';

export const KitchenBoard = () => {
  const { outletId = 1 } = useParams();
  const [preparingOrders, setPreparingOrders] = useState([152, 153, 154]);
  const [readyOrders, setReadyOrders] = useState([149, 150, 151]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/outlet/${outletId}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_STATUS_CHANGED') {
        const orderNum = data.order_id;
        
        if (data.status === 'preparing') {
          setPreparingOrders(prev => [...prev.filter(id => id !== orderNum), orderNum]);
        } else if (data.status === 'ready') {
          setPreparingOrders(prev => prev.filter(id => id !== orderNum));
          setReadyOrders(prev => [...prev.filter(id => id !== orderNum), orderNum]);
        } else if (data.status === 'collected') {
          setReadyOrders(prev => prev.filter(id => id !== orderNum));
        }
      }
    };

    return () => ws.close();
  }, [outletId]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col">
      <header className="flex justify-between items-center border-b border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <Utensils className="w-10 h-10 text-rose-500" />
          <h1 className="text-4xl font-black tracking-wider">AMUL COUNTER — ORDER STATUS</h1>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-2 rounded-full text-sm font-bold">
          <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
          LIVE DISPLAY ACTIVE
        </div>
      </header>

      <div className="grid grid-cols-2 gap-8 flex-1">
        {/* PREPARING COLUMN */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col shadow-2xl">
          <h2 className="text-2xl font-black uppercase text-amber-400 tracking-wider mb-6 flex items-center gap-3">
            <span className="w-4 h-4 bg-amber-400 rounded-full"></span> PREPARING IN KITCHEN
          </h2>
          <div className="grid grid-cols-2 gap-4 flex-1 content-start">
            {preparingOrders.map(id => (
              <div key={id} className="bg-slate-800 border border-amber-500/30 rounded-2xl p-6 text-center">
                <span className="text-slate-400 text-xs font-bold block mb-1">ORDER</span>
                <span className="text-5xl font-black text-amber-300">#{id}</span>
              </div>
            ))}
          </div>
        </div>

        {/* READY FOR PICKUP COLUMN */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-8 flex flex-col shadow-2xl">
          <h2 className="text-2xl font-black uppercase text-emerald-400 tracking-wider mb-6 flex items-center gap-3">
            <BellRing className="w-7 h-7 text-emerald-400 animate-bounce" /> READY FOR PICKUP
          </h2>
          <div className="grid grid-cols-2 gap-4 flex-1 content-start">
            {readyOrders.map(id => (
              <div key={id} className="bg-emerald-500/10 border border-emerald-500 rounded-2xl p-6 text-center animate-pulse">
                <span className="text-emerald-400 text-xs font-bold block mb-1">COLLECT NOW</span>
                <span className="text-6xl font-black text-emerald-300">#{id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};