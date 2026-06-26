import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function Result() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`https://legal-simplifier-backend.onrender.com/api/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoc(data);
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="loading"><div className="spinner"></div><p>Loading results...</p></div>;

  return (
    <div className="page">
      <button className="btn-back" onClick={() => navigate('/upload')}>← Analyze Another</button>

      <div className="result-header">
        <span className="doc-type">{doc.documentType}</span>
        <h2>Document Analysis Report</h2>
        <p className="summary">{doc.summary}</p>
        <div className="score-row">
          <div className="score-box">
            <div className={`score-num risk-${doc.overallRisk.toLowerCase()}`}>{doc.overallRisk}</div>
            <div className="score-lbl">Overall Risk</div>
          </div>
          <div className="count-box">
            <div className="count-item"><div className="num danger-num">{doc.dangerCount}</div><div className="lbl">Danger Clauses</div></div>
            <div className="count-item"><div className="num warning-num">{doc.warningCount}</div><div className="lbl">Warnings</div></div>
            <div className="count-item"><div className="num safe-num">{doc.clauses.filter(c => c.risk === 'safe').length}</div><div className="lbl">Safe Clauses</div></div>
          </div>
        </div>
      </div>

      {doc.keyThingsToKnow?.length > 0 && (
        <div className="key-things">
          <h3>⚠️ Key Things To Know Before Signing</h3>
          <ul>{doc.keyThingsToKnow.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      )}

      <div className="clauses-title">📋 Clause by Clause Breakdown</div>
      {doc.clauses.map((clause, i) => (
        <div key={i} className={`clause-card clause-${clause.risk}`}>
          <div className="clause-top">
            <h4>{clause.title}</h4>
            <span className={`risk-badge badge-${clause.risk}`}>{clause.risk}</span>
          </div>
          <div className="clause-original">"{clause.original}"</div>
          <div className="clause-simplified">{clause.simplified}</div>
        </div>
      ))}
    </div>
  );
}