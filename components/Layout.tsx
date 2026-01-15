
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types.ts';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                <div className="bg-green-700 p-1.5 rounded-lg">
                  <i className="fas fa-mountain text-white text-xl"></i>
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">TrekTrust <span className="text-green-700">India</span></span>
              </Link>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/treks" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/treks' ? 'border-green-600 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Treks
                </Link>
                <Link to="/companies" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${location.pathname === '/companies' ? 'border-green-600 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                  Companies
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <Link to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="text-gray-500 hover:text-green-700 text-sm font-medium">
                    {user.role === 'ADMIN' ? 'Admin Panel' : 'My Dashboard'}
                  </Link>
                  <button onClick={onLogout} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TrekTrust India. Verified reviews for authentic experiences.
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-gray-400">
            <a href="#" className="hover:text-gray-500"><i className="fab fa-instagram"></i></a>
            <a href="#" className="hover:text-gray-500"><i className="fab fa-twitter"></i></a>
            <a href="#" className="hover:text-gray-500"><i className="fab fa-facebook"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
