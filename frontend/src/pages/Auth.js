import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Auth({ login }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handle = async () => {
    setError('');

    // Validation
    if (!form.email.trim()) return setError('Please enter your email');
    if (!form.password.trim()) return setError('Please enter your password');
    if (!isLogin && !form.name.trim()) return setError('Please enter your name');
    if (!isLogin && form.password.length < 6) return setError('Password must be at least 6 characters');

    setLoading(true);
    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await axios.post(`https://legal-simplifier-backend.onrender.com${url}`, payload);
      login(data.user, data.token);
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>⚖️ LegalSimplifier</h2>
        <p>{isLogin ? 'Sign in to analyze your legal documents' : 'Create an account to get started'}</p>
        {error && <div className="error">{error}</div>}
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
        )}
        <div className="form-group">
          <label>Email</label>
          <input
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Password {!isLogin && <span style={{ color: '#a0aec0', fontSize: '11px' }}>(min 6 characters)</span>}</label>
          <input
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>
        <button className="btn-primary" onClick={handle} disabled={loading}>
          {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); setForm({ name: '', email: '', password: '' }); }}>
            {isLogin ? 'Register' : 'Login'}
          </span>
        </div>
        {isLogin && (
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <span
              onClick={() => navigate('/forgot-password')}
              style={{ color: '#667eea', cursor: 'pointer', fontSize: '13px' }}
            >
              Forgot Password?
            </span>
          </div>
        )}
      </div>
    </div>
  );
}