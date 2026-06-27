/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = 'https://legal-simplifier-backend.onrender.com';

export default function Profile({ logout }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setForm({ name: user.name || '', email: user.email || '' });
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

  const saveProfile = async () => {
    if (!form.name.trim() || !form.email.trim()) return toast.error('Name and email are required');
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${API}/api/auth/update-profile`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      toast.success('Profile updated! Please refresh.');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Update failed');
    }
    setSaving(false);
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/auth/delete-account`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      toast.success('Account deleted');
      window.location.href = '/';
    } catch (err) {
      toast.error('Failed to delete account');
    }
    setDeleting(false);
  };

  const dangerDocs = docs.filter(d => d.overallRisk === 'High').length;
  const safeDocs = docs.filter(d => d.overallRisk === 'Low').length;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>My Profile</h1>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '32px' }}>Manage your account and view usage stats</p>

      {/* Profile card */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: '16px', padding: '32px', marginBottom: '24px', color: '#fff', display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ width: '72px', height: '72px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', flexShrink: 0 }}>
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>{user.name}</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>{user.email}</div>
          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '4px' }}>Free Plan</div>
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

      {/* Edit Profile */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', margin: 0 }}>Account Details</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              style={{ background: '#eef2ff', border: 'none', color: '#667eea', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
            >
              ✏️ Edit
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { setEditing(false); setForm({ name: user.name, email: user.email }); }}
                style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#718096', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: '#fff', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
              >
                {saving ? 'Saving...' : '✓ Save'}
              </button>
            </div>
          )}
        </div>

        {/* Name field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#718096', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
          {editing ? (
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #667eea', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          ) : (
            <div style={{ fontSize: '14px', color: '#1a1a2e', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>{user.name}</div>
          )}
        </div>

        {/* Email field */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#718096', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
          {editing ? (
            <input
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #667eea', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          ) : (
            <div style={{ fontSize: '14px', color: '#1a1a2e', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>{user.email}</div>
          )}
        </div>

        {/* Account type — read only */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '500', color: '#718096', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account Type</label>
          <div style={{ fontSize: '14px', color: '#1a1a2e', padding: '10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ background: '#eef2ff', color: '#667eea', padding: '2px 10px', borderRadius: '10px', fontSize: '12px', fontWeight: '600' }}>Free Plan</span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
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

      {/* Danger Zone */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #fed7d7' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#e53e3e', marginBottom: '8px' }}>⚠️ Danger Zone</h3>
        <p style={{ fontSize: '13px', color: '#718096', marginBottom: '16px', lineHeight: '1.6' }}>
          Deleting your account will permanently remove all your data including analysis history. This action cannot be undone.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            style={{ background: '#fff5f5', border: '1px solid #fed7d7', color: '#e53e3e', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
          >
            🗑 Delete My Account
          </button>
        ) : (
          <div style={{ background: '#fff5f5', borderRadius: '10px', padding: '16px' }}>
            <p style={{ fontSize: '14px', color: '#e53e3e', fontWeight: '600', marginBottom: '12px' }}>
              Are you sure? This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={deleteAccount}
                disabled={deleting}
                style={{ background: '#e53e3e', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Account'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#718096', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}