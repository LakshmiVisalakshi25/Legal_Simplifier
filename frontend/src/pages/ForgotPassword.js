import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API = 'https://legal-simplifier-backend.onrender.com';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: OTP + new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email.trim()) return setError('Please enter your email');
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API}/api/forgot/send-otp`, { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP');
    }
    setLoading(false);
  };

  const resetPassword = async () => {
    if (!otp.trim() || !newPassword.trim()) return setError('Please fill all fields');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API}/api/forgot/reset-password`, { email, otp, newPassword });
      toast.success('Password reset successful!');
      navigate('/auth');
    } catch (err) {
      setError(err.response?.data?.msg || 'Reset failed');
    }
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>⚖️ LegalSimplifier</h2>
        <p>{step === 1 ? 'Enter your email to receive a reset OTP' : `OTP sent to ${email}`}</p>

        {error && <div className="error">{error}</div>}

        {step === 1 ? (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={sendOTP} disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP →'}
            </button>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Enter OTP (check your email)</label>
              <input
                placeholder="6-digit OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                style={{ letterSpacing: '6px', fontSize: '20px', textAlign: 'center' }}
              />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <button className="btn-primary" onClick={resetPassword} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px' }}>
              <span
                style={{ color: '#667eea', cursor: 'pointer', fontSize: '13px' }}
                onClick={() => { setStep(1); setError(''); setOtp(''); }}
              >
                ← Resend OTP
              </span>
            </div>
          </>
        )}

        <div className="auth-switch">
          Remember your password? <span onClick={() => navigate('/auth')}>Login</span>
        </div>
      </div>
    </div>
  );
}