
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Home from './pages/Home.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Admin from './pages/Admin.tsx';
import TrekDetails from './pages/TrekDetails.tsx';
import Login from './pages/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { AppState, Verification, Review, Role } from './types.ts';
import { db } from './services/db.ts';
import { INITIAL_ADMIN, INITIAL_USER } from './constants.tsx';

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

  const handleSubmitReview = (r: Omit<Review, 'id' | 'createdAt' | 'userName'> & { id?: string }) => {
    setState(prev => {
      const existingIdx = r.id ? prev.reviews.findIndex(item => item.id === r.id) : -1;
      
      if (existingIdx > -1) {
        // Update existing review
        const updatedReviews = [...prev.reviews];
        updatedReviews[existingIdx] = {
          ...updatedReviews[existingIdx],
          ...r,
          id: r.id! // Keep the original ID
        };
        return { ...prev, reviews: updatedReviews };
      } else {
        // Create new review
        const newR: Review = {
          ...r as Omit<Review, 'id' | 'createdAt' | 'userName'>,
          id: `r${Date.now()}`,
          userName: prev.currentUser?.name || 'Anonymous',
          createdAt: new Date().toISOString()
        };
        return { ...prev, reviews: [...prev.reviews, newR] };
      }
    });
  };

  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review? This action is permanent.')) {
      setState(prev => ({
        ...prev,
        reviews: prev.reviews.filter(r => r.id !== id)
      }));
    }
  };

  return (
    <Router>
      <Layout user={state.currentUser} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Home treks={state.treks} companies={state.companies} reviews={state.reviews} />} />
          <Route path="/trek/:id" element={<TrekDetails treks={state.treks} companies={state.companies} reviews={state.reviews} users={[INITIAL_USER]} />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={state.currentUser}>
                <Dashboard 
                  user={state.currentUser!} 
                  treks={state.treks} 
                  companies={state.companies} 
                  verifications={state.verifications} 
                  reviews={state.reviews}
                  onSubmitVerification={handleSubmitVerification}
                  onSubmitReview={handleSubmitReview}
                />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute user={state.currentUser} requiredRole="ADMIN">
                <Admin 
                  verifications={state.verifications} 
                  users={[INITIAL_USER]} 
                  treks={state.treks}
                  companies={state.companies}
                  reviews={state.reviews}
                  onApprove={handleApproveVerification}
                  onReject={handleRejectVerification}
                  onDeleteReview={handleDeleteReview}
                />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/login" 
            element={state.currentUser ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} 
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
