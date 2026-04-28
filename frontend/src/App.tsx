import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function DashboardPlaceholder() {
  const { user, logout } = useAuth();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <button onClick={logout} className="px-4 py-2 mt-4 text-white bg-red-600 rounded">Logout</button>
    </div>
  );
}

function NewPagePlaceholder() {
  return <div className="p-8">New Page Form</div>;
}

function ViewPagePlaceholder() {
  return <div className="p-8">View Page</div>;
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
              <NewPagePlaceholder />
            </ProtectedRoute>
          } />
          
          <Route path="/pages/:id" element={
            <ProtectedRoute>
              <ViewPagePlaceholder />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
