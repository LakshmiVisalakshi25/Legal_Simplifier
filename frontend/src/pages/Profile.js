import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = 'https://legal-simplifier-backend.onrender.com';

export default function Profile() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API}/api/document/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDocs(data);
      } catch (err) {}
      setLoading(false);
    };
    fetch();
  }, []);

  const dangerDocs = docs.filter(d => d.overallRisk === 'High').length;
  const safeDocs = docs.filter(d => d.overallRisk === 'Low').length;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>My Profile</h1>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '32px' }}>Your account details and usage summary</p>

      {/* Profile card */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '16px', padding: '32px', marginBottom: '24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', flexShrink: 0 }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{user.name}</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>{user.email}</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { num: docs.length, label: 'Total Analyses', icon: '📄', bg: '#eef2ff', color: '#667eea' },
          { num: dangerDocs, label: 'High Risk Docs', icon: '🔴', bg: '#fff5f5', color: '#e53e3e' },
          { num: safeDocs, label: 'Safe Docs', icon: '✅', bg: '#f0fff4', color: '#38a169' },
        ].map(({ num, label, icon, bg, color }) => (
          <div key={label} style={{ background: bg, borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{icon}</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color }}>{loading ? '...' : num}</div>
            <div style={{ fontSize: '12px', color: '#718096', marginTop: '2px' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Account details */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '16px' }}>Account Details</h3>
        {[
          { label: 'Full Name', value: user.name },
          { label: 'Email Address', value: user.email },
          { label: 'Account Type', value: 'Free Plan' },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: '14px', color: '#718096' }}>{label}</span>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={() => navigate('/upload')}
          style={{ flex: 1, background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          📄 Analyze Document
        </button>
        <button
          onClick={() => navigate('/history')}
          style={{ flex: 1, background: '#f8fafc', color: '#4a5568', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
        >
          📋 View History
        </button>
      </div>
    </div>
  );
}