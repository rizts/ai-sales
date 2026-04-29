import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import CreateSalesPage from './pages/CreateSalesPage';
import ViewSalesPage from './pages/ViewSalesPage';

function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={logout} className="px-4 py-2 text-white bg-red-600 rounded">Logout</button>
      </div>
      <p className="mb-4">Welcome, {user?.name}!</p>
      <a href="/pages/new" className="inline-block px-4 py-2 text-white bg-blue-600 rounded">Create New Sales Page</a>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPlaceholder />
            </ProtectedRoute>
          } />
          
          <Route path="/pages/new" element={
            <ProtectedRoute>
              <CreateSalesPage />
            </ProtectedRoute>
          } />
          
          <Route path="/pages/:id" element={
            <ProtectedRoute>
              <ViewSalesPage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
