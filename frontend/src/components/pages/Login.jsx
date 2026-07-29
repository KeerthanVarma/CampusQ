import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User, Hash } from 'lucide-react';

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('@iitgn.ac.in')) {
      setError('Please use your official @iitgn.ac.in email address.');
      return;
    }

    try {
      if (isRegister) {
        await register({ email, password, name, roll_number: rollNumber, role: 'student' });
        await login(email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <ShieldCheck className="w-12 h-12 text-rose-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-400 text-sm">IIT Gandhinagar Campus Portal</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500 text-rose-400 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Roll Number</label>
                <div className="relative">
                  <Hash className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500"
                    placeholder="e.g. 21110001"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">IITGN Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500"
                placeholder="student@iitgn.ac.in"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-rose-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 font-semibold py-2.5 rounded-lg transition duration-200 mt-2"
          >
            {isRegister ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-6">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            onClick={() => setIsRegister(!isRegister)} 
            className="text-rose-400 hover:underline font-semibold"
          >
            {isRegister ? 'Log In' : 'Register Here'}
          </button>
        </p>
      </div>
    </div>
  );
};