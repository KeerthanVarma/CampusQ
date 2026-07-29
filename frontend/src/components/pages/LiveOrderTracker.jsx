import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, Clock, Flame, PackageCheck, AlertCircle } from 'lucide-react';

const STATUS_STEPS = ['placed', 'accepted', 'preparing', 'ready', 'collected'];

export const LiveOrderTracker = () => {
  const { orderId } = useParams();
  const { user } = useAuth();
  const [orderStatus, setOrderStatus] = useState('placed');

  useEffect(() => {
    if (!user) return;

    const ws = new WebSocket(`ws://localhost:8000/api/v1/ws/student/${user.id}`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'ORDER_STATUS_CHANGED' && data.order_id === parseInt(orderId)) {
        setOrderStatus(data.status);
      }
    };

    return () => ws.close();
  }, [user, orderId]);

  const getCurrentStepIndex = () => STATUS_STEPS.indexOf(orderStatus);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Live Order Ticket</span>
        <h1 className="text-5xl font-black text-rose-500 my-2">#{orderId}</h1>

        {orderStatus === 'ready' && (
          <div className="bg-emerald-500/20 border border-emerald-500 text-emerald-300 p-4 rounded-xl my-6 animate-bounce">
            <h3 className="font-bold text-lg">🎉 Your order is READY!</h3>
            <p className="text-xs">Please present Order #{orderId} at the counter for pick-up.</p>
          </div>
        )}

        <div className="mt-8 space-y-6 text-left">
          {STATUS_STEPS.map((step, index) => {
            const isDone = index <= getCurrentStepIndex();
            const isCurrent = index === getCurrentStepIndex();

            return (
              <div key={step} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                  isDone ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-500'
                } ${isCurrent ? 'ring-4 ring-rose-500/30' : ''}`}>
                  {index + 1}
                </div>

                <div className="flex-1">
                  <p className={`font-bold capitalize text-sm ${isDone ? 'text-slate-100' : 'text-slate-500'}`}>
                    {step}
                  </p>
                  {isCurrent && <p className="text-xs text-rose-400 font-medium">In Progress...</p>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};