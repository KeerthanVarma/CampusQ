import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { Store, Lock, Clock, ArrowRight } from 'lucide-react';

export const StudentHome = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/outlets/')
      .then(res => setOutlets(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading campus food outlets...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Campus Outlets</h1>
        <p className="text-slate-400 mt-1">Select an outlet to order for pick-up without standing in queues.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            onClick={() => outlet.is_open && navigate(`/outlet/${outlet.id}`)}
            className={`bg-slate-800 border rounded-2xl overflow-hidden transition duration-200 ${
              outlet.is_open 
                ? 'border-slate-700 hover:border-rose-500/50 cursor-pointer hover:scale-[1.02] shadow-xl' 
                : 'border-slate-800 opacity-60 cursor-not-allowed'
            }`}
          >
            <div className="h-40 bg-slate-700 relative overflow-hidden">
              <img 
                src={outlet.image_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'} 
                alt={outlet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                {outlet.is_open ? (
                  <span className="bg-emerald-500/90 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                    Open
                  </span>
                ) : (
                  <span className="bg-rose-600/90 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Closed
                  </span>
                )}
              </div>
            </div>

            <div className="p-5">
              <h3 className="text-xl font-bold mb-2 flex items-center justify-between">
                <span>{outlet.name}</span>
                {outlet.is_open && <ArrowRight className="w-5 h-5 text-rose-400" />}
              </h3>

              <div className="flex items-center text-slate-400 text-xs gap-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> ~{outlet.estimated_wait_time} mins wait
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};