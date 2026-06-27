import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Navbar */}
      <div style={{
        background: '#fff',
        padding: '16px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a2e' }}>⚖️ LegalSimplifier</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/auth')}
            style={{ background: 'transparent', border: '1px solid #667eea', color: '#667eea', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
          >
            Login
          </button>
          <button
            onClick={() => navigate('/auth')}
            style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', fontWeight: '600' }}
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', padding: '100px 40px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(102,126,234,0.2)', border: '1px solid rgba(102,126,234,0.4)', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#a78bfa', marginBottom: '24px' }}>
          🤖 Powered by LLaMA 3.3 70B AI
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#fff', marginBottom: '20px', lineHeight: '1.2', maxWidth: '700px', margin: '0 auto 20px' }}>
          Understand Any Legal Document
          <br />
          <span style={{ background: 'linear-gradient(135deg, #667eea, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            in 10 Seconds
          </span>
        </h1>
        <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '560px', margin: '0 auto 40px', lineHeight: '1.7' }}>
          Upload any rental agreement, job offer, loan document, or employment bond. AI reads every clause, highlights danger zones, and explains everything in plain simple language.
        </p>

        {/* Single CTA */}
        <button
          onClick={() => navigate('/auth')}
          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', border: 'none', color: '#fff', padding: '16px 48px', borderRadius: '10px', fontSize: '17px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 24px rgba(102,126,234,0.4)' }}
        >
          Analyze My Document Free →
        </button>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '64px', flexWrap: 'wrap' }}>
          {[
            ['10 sec', 'Analysis time'],
            ['100%', 'Free to use'],
            ['50+', 'Document types'],
            ['Plain', 'Simple language']
          ].map(([num, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#a78bfa' }}>{num}</div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ background: '#f8fafc', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#667eea', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>How It Works</div>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', marginBottom: '48px' }}>3 Simple Steps</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { step: '01', icon: '📄', title: 'Upload or Paste', desc: 'Upload a PDF or paste your document text directly into the app' },
            { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'Our AI reads every clause, detects risk level, and understands the legal language' },
            { step: '03', icon: '✅', title: 'Understand & Decide', desc: 'Get a plain English explanation with danger zones highlighted in red' },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} style={{ background: '#fff', borderRadius: '16px', padding: '32px 24px', width: '260px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#667eea', marginBottom: '12px' }}>STEP {step}</div>
              <div style={{ fontSize: '36px', marginBottom: '16px' }}>{icon}</div>
              <h3 style={{ fontSize: '17px', fontWeight: '600', color: '#1a1a2e', marginBottom: '10px' }}>{title}</h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: '#fff', padding: '80px 40px', textAlign: 'center' }}>
        <div style={{ fontSize: '13px', color: '#667eea', fontWeight: '600', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>Features</div>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', marginBottom: '48px' }}>Everything You Need</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
          {[
            { icon: '🔴', title: 'Danger Clause Detection', desc: 'Dangerous clauses highlighted in red so you never miss a trap' },
            { icon: '📊', title: 'Overall Risk Score', desc: 'Instant Low / Medium / High risk rating for the entire document' },
            { icon: '💬', title: 'Plain English Explanation', desc: 'Every clause explained like a friend, not a lawyer' },
            { icon: '📋', title: 'Key Things to Know', desc: 'Top 3 most important things before you sign, summarized clearly' },
            { icon: '📁', title: 'PDF & Text Support', desc: 'Upload PDF files or paste text — both work perfectly' },
            { icon: '🕐', title: 'Analysis History', desc: 'All your past document analyses saved and accessible anytime' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#f8fafc', borderRadius: '12px', padding: '24px', width: '280px', textAlign: 'left' }}>
              <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Who Is It For */}
      <div style={{ background: '#f8fafc', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '700', color: '#1a1a2e', marginBottom: '48px' }}>Who Is It For?</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
          {[
            { icon: '🎓', title: 'Students', desc: 'Understand college bonds, hostel agreements, and internship offer letters before signing' },
            { icon: '💼', title: 'Job Seekers', desc: "Know exactly what you're agreeing to in employment bonds and offer letters" },
            { icon: '🏠', title: 'Tenants', desc: 'Understand every clause in your rental agreement before paying the deposit' },
            { icon: '🏢', title: 'Small Businesses', desc: 'Review vendor contracts and service agreements without expensive lawyers' },
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '200px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{icon}</div>
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#1a1a2e', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.6' }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', padding: '80px 40px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>Don't Sign Blind</h2>
        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginBottom: '36px' }}>
          Understand what you're agreeing to before it's too late
        </p>
        <button
          onClick={() => navigate('/auth')}
          style={{ background: '#fff', border: 'none', color: '#667eea', padding: '16px 48px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer' }}
        >
          Analyze Your Document Free →
        </button>
      </div>

      {/* Footer */}
      <div style={{ background: '#1a1a2e', padding: '24px 40px', textAlign: 'center' }}>
        <p style={{ color: '#64748b', fontSize: '13px' }}>⚖️ LegalSimplifier — Built with React, Node.js, MongoDB & LLaMA AI</p>
      </div>

    </div>
  );
}