import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar({ user, logout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      background: '#1a1a2e',
      padding: '0 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)'
    }}>

      {/* Logo */}
      <div
        onClick={() => navigate('/upload')}
        style={{ fontSize: '18px', fontWeight: '700', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        ⚖️ <span>LegalSimplifier</span>
      </div>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => navigate('/upload')}
          style={{
            background: isActive('/upload') ? 'rgba(102,126,234,0.2)' : 'transparent',
            border: 'none',
            color: isActive('/upload') ? '#a78bfa' : '#94a3b8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: isActive('/upload') ? '600' : '400'
          }}
        >
          📄 Analyze
        </button>

        <button
          onClick={() => navigate('/history')}
          style={{
            background: isActive('/history') ? 'rgba(102,126,234,0.2)' : 'transparent',
            border: 'none',
            color: isActive('/history') ? '#a78bfa' : '#94a3b8',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: isActive('/history') ? '600' : '400'
          }}
        >
          📋 History
        </button>

        {/* User dropdown */}
        <div style={{ position: 'relative', marginLeft: '8px' }}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            style={{
              background: 'rgba(102,126,234,0.15)',
              border: '1px solid rgba(102,126,234,0.3)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <div style={{
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <span>{user.name?.split(' ')[0]}</span>
            <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
          </button>

          {/* Dropdown menu */}
          {showDropdown && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '44px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              minWidth: '180px',
              overflow: 'hidden',
              zIndex: 200
            }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1a1a2e' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: '#a0aec0', marginTop: '2px' }}>{user.email}</div>
              </div>
              <button
                onClick={() => { navigate('/profile'); setShowDropdown(false); }}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                👤 My Profile
              </button>
              <button
                onClick={() => { navigate('/history'); setShowDropdown(false); }}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                📋 History
              </button>
              <div style={{ borderTop: '1px solid #f0f0f0' }}>
                <button
                  onClick={handleLogout}
                  style={{ width: '100%', background: 'transparent', border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '13px', color: '#e53e3e', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {showDropdown && (
        <div
          onClick={() => setShowDropdown(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        />
      )}
    </div>
  );
}