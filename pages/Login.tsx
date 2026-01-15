
import React, { useState } from 'react';
import { Role } from '../types.ts';

interface LoginProps {
  onLogin: (role: Role) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login for a standard user
    onLogin('USER');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center rounded-[2.5rem] overflow-hidden relative shadow-2xl" 
         style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1544124499-58912cbddaad?auto=format&fit=crop&q=80&w=2000")' }}>
      
      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20 backdrop-blur-[1px]"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-10 rounded-[2rem] shadow-2xl relative z-10 border border-white/20">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-green-700 rounded-2xl flex items-center justify-center shadow-lg mb-6 transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
            <i className="fas fa-mountain text-white text-3xl"></i>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {activeTab === 'login' ? 'Welcome Back' : 'Start Your Journey'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {activeTab === 'login' 
              ? 'Access your verified trekking history.' 
              : 'Join India\'s most trusted trekking community.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button 
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'login' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab('signup')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'signup' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
          >
            Sign Up
          </button>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {activeTab === 'signup' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Rahul Sharma"
                />
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Email Address</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="hiker@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Password</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-xs"></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all shadow-lg hover:shadow-green-900/30 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-gray-100"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">Admin Testing</span>
          <div className="flex-grow border-t border-gray-100"></div>
        </div>

        <button 
          onClick={() => onLogin('ADMIN')}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-900 text-xs font-bold rounded-xl text-gray-900 bg-transparent hover:bg-gray-900 hover:text-white transition-all group"
        >
          <i className="fas fa-user-shield group-hover:scale-110 transition-transform"></i>
          Simulate Admin Access
        </button>

        <p className="mt-6 text-center text-[10px] text-gray-400 leading-relaxed">
          Secure verification provided by TrekTrust India.<br/>
          By logging in, you agree to our <a href="#" className="font-bold text-gray-500 hover:text-green-700 underline">Terms</a> and <a href="#" className="font-bold text-gray-500 hover:text-green-700 underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
