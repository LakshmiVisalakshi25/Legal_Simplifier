import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('https://legal-simplifier-backend.onrender.com/api/document/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocs(data);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading history...</p></div>;

  return (
    <div className="page">
      <div className="page-title">📋 Past Analyses</div>
      <div className="page-subtitle">All your previously analyzed documents</div>
      {docs.length === 0 ? (
        <div className="empty"><h3>No documents yet</h3><p>Upload your first legal document to get started</p></div>
      ) : (
        <div className="history-grid">
          {docs.map(doc => (
            <div key={doc._id} className="history-card" onClick={() => navigate(`/result/${doc._id}`)}>
              <div>
                <h4>{doc.fileName}</h4>
                <p>{doc.documentType} · Risk: <span className={`risk-${doc.overallRisk?.toLowerCase()}`}>{doc.overallRisk}</span> · {new Date(doc.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="btn-view">View →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}