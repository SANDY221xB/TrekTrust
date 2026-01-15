
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import TrekDetails from './pages/TrekDetails';
import { AppState, User, Verification, Review, Role } from './types';
import { db } from './services/db';
import { INITIAL_ADMIN, INITIAL_USER } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(db.get());

  useEffect(() => {
    db.save(state);
  }, [state]);

  const handleLogin = (role: Role) => {
    const user = role === 'ADMIN' ? INITIAL_ADMIN : INITIAL_USER;
    setState(prev => ({ ...prev, currentUser: user }));
  };

  const handleLogout = () => {
    setState(prev => ({ ...prev, currentUser: null }));
  };

  const handleSubmitVerification = (v: Omit<Verification, 'id' | 'status' | 'submittedAt'>) => {
    const newV: Verification = {
      ...v,
      id: `v${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, verifications: [...prev.verifications, newV] }));
  };

  const handleApproveVerification = (id: string) => {
    setState(prev => ({
      ...prev,
      verifications: prev.verifications.map(v => 
        v.id === id ? { ...v, status: 'approved', reviewedAt: new Date().toISOString() } : v
      )
    }));
  };

  const handleRejectVerification = (id: string, reason: string) => {
    setState(prev => ({
      ...prev,
      verifications: prev.verifications.map(v => 
        v.id === id ? { ...v, status: 'rejected', rejectionReason: reason, reviewedAt: new Date().toISOString() } : v
      )
    }));
  };

  const handleSubmitReview = (r: Omit<Review, 'id' | 'createdAt' | 'userName'>) => {
    const newR: Review = {
      ...r,
      id: `r${Date.now()}`,
      userName: state.currentUser?.name || 'Anonymous',
      createdAt: new Date().toISOString()
    };
    setState(prev => ({ ...prev, reviews: [...prev.reviews, newR] }));
  };

  return (
    <Router>
      <Layout user={state.currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home treks={state.treks} companies={state.companies} reviews={state.reviews} />} />
          <Route path="/trek/:id" element={<TrekDetails treks={state.treks} companies={state.companies} reviews={state.reviews} users={[]} />} />
          
          <Route 
            path="/dashboard" 
            element={state.currentUser ? (
              <Dashboard 
                user={state.currentUser} 
                treks={state.treks} 
                companies={state.companies} 
                verifications={state.verifications} 
                reviews={state.reviews}
                onSubmitVerification={handleSubmitVerification}
                onSubmitReview={handleSubmitReview}
              />
            ) : <Navigate to="/login" />} 
          />
          
          <Route 
            path="/admin" 
            element={state.currentUser?.role === 'ADMIN' ? (
              <Admin 
                verifications={state.verifications} 
                users={[INITIAL_USER]} // Simulating single user for demo
                treks={state.treks}
                companies={state.companies}
                reviews={state.reviews}
                onApprove={handleApproveVerification}
                onReject={handleRejectVerification}
              />
            ) : <Navigate to="/" />} 
          />

          <Route path="/login" element={
            <div className="flex items-center justify-center py-20">
              <div className="bg-white p-10 rounded-3xl shadow-xl border max-w-md w-full text-center">
                <h2 className="text-3xl font-bold mb-8">Login to TrekTrust</h2>
                <div className="space-y-4">
                  <button 
                    onClick={() => handleLogin('USER')}
                    className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-md hover:bg-green-800 transition-all"
                  >
                    Login as Hiker (Rahul)
                  </button>
                  <button 
                    onClick={() => handleLogin('ADMIN')}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-md hover:bg-black transition-all"
                  >
                    Login as Admin
                  </button>
                </div>
                <p className="mt-8 text-sm text-gray-400">Secure, verified, and community driven.</p>
              </div>
            </div>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
