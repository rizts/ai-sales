import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import api from '../lib/axios';

export default function Layout() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await api.post('/api/logout');
    } catch (err) {
      // Ignore errors, we still want to log out locally
    }
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex-shrink-0 flex items-center">
                <span className="font-bold text-xl text-indigo-600">AI Sales Page Generator</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
