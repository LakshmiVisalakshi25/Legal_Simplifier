import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ user, logout }) {
  const navigate = useNavigate();
  return (
    <div className="navbar">
      <h1 onClick={() => navigate('/upload')} style={{ cursor: 'pointer' }}>⚖️ LegalSimplifier</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span onClick={() => navigate('/history')} style={{ color: '#a0aec0', cursor: 'pointer', fontSize: '14px' }}>📋 History</span>
        <span style={{ color: '#a0aec0', fontSize: '14px' }}>Hi, {user.name}</span>
        <button className="nav-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}