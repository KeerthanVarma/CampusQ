import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Utensils, LogOut, User as UserIcon, LayoutDashboard, Monitor } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-rose-500 tracking-wide">
        <Utensils className="w-6 h-6 text-rose-500" />
        <span>Campus<span className="text-white">Q</span></span>
      </Link>

      {user && (
        <div className="flex items-center gap-6">
          <span className="text-sm text-slate-300 flex items-center gap-1">
            <UserIcon className="w-4 h-4 text-slate-400" /> {user.name} ({user.role})
          </span>

          {user.role === 'staff' && (
            <>
              <Link to="/staff" className="text-sm font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1">
                <LayoutDashboard className="w-4 h-4" /> Staff Panel
              </Link>
              <Link to="/kitchen" className="text-sm font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                <Monitor className="w-4 h-4" /> Kitchen Display
              </Link>
            </>
          )}

          <button 
            onClick={handleLogout}
            className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-lg transition flex items-center gap-1 text-slate-200"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};