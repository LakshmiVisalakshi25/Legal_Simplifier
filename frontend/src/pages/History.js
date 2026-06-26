import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const API = 'https://legal-simplifier-backend.onrender.com';

export default function History() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API}/api/document/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(data);
    } catch (err) {
      toast.error('Failed to load history');
    }
    setLoading(false);
  };

  const deleteDoc = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this analysis?')) return;
    setDeleting(id);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/api/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(docs.filter(d => d._id !== id));
      toast.success('Deleted successfully');
    } catch (err) {
      toast.error('Failed to delete');
    }
    setDeleting(null);
  };

  const filtered = docs.filter(doc =>
    doc.fileName?.toLowerCase().includes(search.toLowerCase()) ||
    doc.documentType?.toLowerCase().includes(search.toLowerCase())
  );

  const riskColor = (risk) => {
    if (risk === 'High') return { bg: '#fff5f5', color: '#e53e3e' };
    if (risk === 'Medium') return { bg: '#fffaf0', color: '#d69e2e' };
    return { bg: '#f0fff4', color: '#38a169' };
  };

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#667eea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '40px 20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a2e' }}>Past Analyses</h1>
        <span style={{ background: '#eef2ff', color: '#667eea', fontSize: '13px', fontWeight: '600', padding: '4px 14px', borderRadius: '20px' }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''}
        </span>
      </div>
      <p style={{ color: '#718096', fontSize: '14px', marginBottom: '24px' }}>All your previously analyzed legal documents</p>

      {/* Search */}
      {docs.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px' }}>🔍</span>
          <input
            placeholder="Search by file name or document type..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 42px',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
              boxSizing: 'border-box'
            }}
          />
          {search && (
            <span
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#a0aec0', fontSize: '18px' }}
            >×</span>
          )}
        </div>
      )}

      {/* Empty state */}
      {docs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📂</div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>No documents yet</h3>
          <p style={{ color: '#718096', marginBottom: '24px' }}>Upload your first legal document to get started</p>
          <button
            onClick={() => navigate('/upload')}
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
          >
            Analyze Your First Document →
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>No results found</h3>
          <p style={{ color: '#718096' }}>Try searching with different keywords</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtered.map(doc => {
            const rc = riskColor(doc.overallRisk);
            return (
              <div
                key={doc._id}
                onClick={() => navigate(`/result/${doc._id}`)}
                style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '20px 24px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #f0f0f0',
                  transition: 'box-shadow 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', background: '#eef2ff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                    📄
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' }}>
                      {doc.fileName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: '#718096' }}>{doc.documentType}</span>
                      <span style={{ color: '#e2e8f0' }}>·</span>
                      <span style={{ fontSize: '12px', background: rc.bg, color: rc.color, padding: '2px 8px', borderRadius: '10px', fontWeight: '500' }}>
                        {doc.overallRisk} Risk
                      </span>
                      <span style={{ color: '#e2e8f0' }}>·</span>
                      <span style={{ fontSize: '12px', color: '#a0aec0' }}>
                        {new Date(doc.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <button
                    onClick={(e) => deleteDoc(e, doc._id)}
                    disabled={deleting === doc._id}
                    style={{
                      background: 'transparent',
                      border: '1px solid #fed7d7',
                      color: '#e53e3e',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {deleting === doc._id ? '...' : '🗑 Delete'}
                  </button>
                  <button
                    onClick={() => navigate(`/result/${doc._id}`)}
                    style={{
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      border: 'none',
                      color: '#fff',
                      padding: '6px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    View →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}