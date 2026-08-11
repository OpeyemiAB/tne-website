import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleLogin, showToast } = useGifting();
  const navigate = useNavigate();

  const handleAdminSignIn = (e) => {
    e.preventDefault();
    setError('');
    try {
      const loggedUser = handleLogin(email, password);
      const roleStr = (loggedUser?.role || '').toLowerCase();

      if (loggedUser.status === 'Revoked') {
        setError('Access Revoked: Your staff account access has been suspended by the Admin.');
        return;
      }

      if (roleStr.includes('admin') || roleStr.includes('staff')) {
        if (showToast) showToast(`Welcome back, ${loggedUser.name || 'Admin'}! Console unlocked.`, 'success');
        navigate('/admin');
      } else {
        setError('Access Denied. Customer accounts cannot access the Staff/Admin console.');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '80vh', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-sans)', padding: '2rem' }}>
      <div style={{
        backgroundColor: '#fff',
        border: '1.5px solid var(--border-color)',
        borderRadius: '12px',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>Admin Console</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Access The Nifemi Experience management dashboard.</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            color: '#ef4444',
            padding: '0.75rem',
            borderRadius: '6px',
            fontSize: '0.8rem',
            marginBottom: '1.5rem'
          }}>
            <Lock size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Admin Email</label>
            <input 
              type="email"
              placeholder="admin@tne.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Password</label>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1rem' }}
          >
            Authenticate Login
          </button>
        </form>

      </div>
    </div>
  );
}
