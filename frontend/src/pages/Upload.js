import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
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
      res = await axios.post(
        'https://legal-simplifier-backend.onrender.com/api/document/analyze',
        form,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
    } else {
      res = await axios.post(
        'https://legal-simplifier-backend.onrender.com/api/document/analyze',
        { text },
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
    }
    toast.success('Analysis complete!');
    navigate(`/result/${res.data.document._id}`);
  } catch (err) {
    toast.error(err.response?.data?.msg || 'Analysis failed');
  }
  setLoading(false);
};

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>AI is reading your document...<br />This takes 10–15 seconds</p>
    </div>
  );

  return (
    <div className="page">
      <div className="page-title">📄 Analyze a Legal Document</div>
      <div className="page-subtitle">Upload a PDF or paste text — AI will explain every clause in simple language</div>

      <label className={`upload-box ${file ? 'file-selected' : ''}`}>
        <input type="file" accept=".pdf" onChange={e => { setFile(e.target.files[0]); setText(''); }} />
        <div className="upload-icon">📁</div>
        <h3>{file ? file.name : 'Click to upload PDF'}</h3>
        <p>{file ? '✅ File ready to analyze' : 'Supports: Rental Agreement, Job Offer, Loan Document, Employment Bond'}</p>
      </label>

      <div className="divider"><hr /><span>OR paste document text</span><hr /></div>

      <div className="textarea-box">
        <label>Paste document text directly</label>
        <textarea
          placeholder="Paste your legal document text here..."
          value={text}
          onChange={e => { setText(e.target.value); setFile(null); }}
        />
      </div>

      <button className="btn-analyze" onClick={analyze}>
        🔍 Analyze Document with AI
      </button>
    </div>
  );
}