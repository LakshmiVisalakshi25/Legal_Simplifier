import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const API = 'https://legal-simplifier-backend.onrender.com';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const analyze = async () => {
    if (!file && !text.trim()) return toast.error('Please upload a PDF or paste document text');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      let res;
      if (file) {
        const form = new FormData();
        form.append('document', file);
        res = await axios.post(`${API}/api/document/analyze`, form, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await axios.post(`${API}/api/document/analyze`, { text }, {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
      }
      toast.success('Analysis complete!');
      navigate(`/result/${res.data.document._id}`);
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Analysis failed');
    }
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped);
      setText('');
    } else {
      toast.error('Only PDF files are supported');
    }
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '56px', height: '56px', border: '4px solid #e2e8f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '24px' }}></div>
      <div style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>AI is reading your document...</div>
      <div style={{ fontSize: '14px', color: '#718096' }}>This takes about 10–15 seconds</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e', marginBottom: '8px' }}>
          Analyze a Legal Document
        </h1>
        <p style={{ color: '#718096', fontSize: '15px' }}>
          Upload a PDF or paste text — AI explains every clause in plain simple language
        </p>
      </div>

      {/* Document type badges */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {['Rental Agreement', 'Job Offer Letter', 'Employment Bond', 'Loan Document', 'Terms & Conditions'].map(type => (
          <span key={type} style={{ background: '#eef2ff', color: '#667eea', fontSize: '12px', fontWeight: '500', padding: '4px 12px', borderRadius: '20px' }}>
            {type}
          </span>
        ))}
      </div>

      {/* Upload Box */}
      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        style={{
          display: 'block',
          background: file ? '#f0fff4' : dragOver ? '#eef2ff' : '#fff',
          border: `2px dashed ${file ? '#38a169' : dragOver ? '#667eea' : '#cbd5e0'}`,
          borderRadius: '16px',
          padding: '48px 32px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '8px'
        }}
      >
        <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => { setFile(e.target.files[0]); setText(''); }} />
        {file ? (
          <>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#38a169', marginBottom: '4px' }}>{file.name}</div>
            <div style={{ fontSize: '13px', color: '#68d391' }}>File ready — click Analyze below</div>
            <button
              onClick={(e) => { e.preventDefault(); setFile(null); }}
              style={{ marginTop: '12px', background: 'transparent', border: '1px solid #fc8181', color: '#e53e3e', padding: '4px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
            >
              Remove file
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📂</div>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '6px' }}>
              Drop your PDF here or click to browse
            </div>
            <div style={{ fontSize: '13px', color: '#a0aec0' }}>
              Supports PDF files up to 10MB
            </div>
          </>
        )}
      </label>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
        <span style={{ color: '#a0aec0', fontSize: '13px', fontWeight: '500' }}>OR</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e2e8f0' }} />
      </div>

      {/* Paste Text Box */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📋</span>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#4a5568' }}>Paste Document Text</span>
        </div>
        <textarea
          placeholder="Paste your legal document text here... e.g. rental agreement, job offer letter, employment bond"
          value={text}
          onChange={e => { setText(e.target.value); setFile(null); }}
          style={{
            width: '100%',
            height: '180px',
            padding: '16px 20px',
            border: 'none',
            outline: 'none',
            resize: 'vertical',
            fontSize: '14px',
            color: '#2d3748',
            fontFamily: 'inherit',
            lineHeight: '1.6',
            boxSizing: 'border-box'
          }}
        />
        {text && (
          <div style={{ padding: '8px 20px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#718096' }}>
            {text.length} characters · {text.split(' ').filter(w => w).length} words
          </div>
        )}
      </div>

      {/* Analyze Button */}
      <button
        onClick={analyze}
        disabled={loading || (!file && !text.trim())}
        style={{
          width: '100%',
          padding: '16px',
          background: (!file && !text.trim()) ? '#e2e8f0' : 'linear-gradient(135deg, #667eea, #764ba2)',
          color: (!file && !text.trim()) ? '#a0aec0' : '#fff',
          border: 'none',
          borderRadius: '12px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: (!file && !text.trim()) ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}
      >
        🔍 Analyze Document with AI
      </button>

      {/* Note */}
      <p style={{ textAlign: 'center', color: '#a0aec0', fontSize: '12px', marginTop: '12px' }}>
        ⚡ First analysis may take 30 seconds if server is waking up · Your documents are never stored permanently
      </p>

    </div>
  );
}