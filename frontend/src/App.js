import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Upload from './pages/Upload';
import Result from './pages/Result';
import History from './pages/History';
import Navbar from './components/Navbar';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  setUser(null);
  window.location.href = '/';
};

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      {user && <Navbar user={user} logout={logout} />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/upload" /> : <Home />} />
        <Route path="/auth" element={user ? <Navigate to="/upload" /> : <Auth login={login} />} />
        <Route path="/upload" element={user ? <Upload /> : <Navigate to="/auth" />} />
        <Route path="/result/:id" element={user ? <Result /> : <Navigate to="/auth" />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/auth" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}