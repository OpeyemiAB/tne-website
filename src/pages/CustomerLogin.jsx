import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGifting } from '../context/GiftingContext';

export default function CustomerLogin() {
  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { handleLogin, handleRegister, showToast } = useGifting();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        handleRegister(name, email, password);
        showToast(`Welcome to The Nifemi Experience, ${name}! Your account was created successfully.`, 'success');
      } else {
        const user = handleLogin(email, password);
        showToast(`Welcome back to The Nifemi Experience, ${user?.name || email}!`, 'success');
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    showToast(`Password reset link sent to ${resetEmail}!`);
    setIsForgotPassword(false);
    setResetEmail('');
  };

  if (isForgotPassword) {
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
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>
              Reset Password
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleResetSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email Address</label>
              <input 
                type="email"
                placeholder="customer@email.com"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1rem' }}
            >
              Send Reset Link
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem' }}>
            <button 
              onClick={() => setIsForgotPassword(false)}
              style={{ color: 'var(--accent-gold)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--primary-green)', fontWeight: 'bold' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            {isRegister ? 'Register to save addresses and track wishlists.' : 'Log in to track your personal gift orders.'}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1.5rem', border: '1px solid #fee2e2' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegister && (
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Your Name</label>
              <input 
                type="text"
                placeholder="Adenike Bello"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.9rem' }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email Address</label>
            <input 
              type="email"
              placeholder="customer@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', margin: 0 }}>Password</label>
              {!isRegister && (
                <button 
                  type="button" 
                  onClick={() => { setIsForgotPassword(true); setError(''); }} 
                  style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <input 
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.9rem' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', marginTop: '1rem' }}
          >
            {isRegister ? 'Create Account' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem' }}>
          <button 
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{ color: 'var(--accent-gold)', fontWeight: '600' }}
          >
            {isRegister ? 'Already have an account? Log in' : 'New to TNE? Create account'}
          </button>
        </div>
      </div>
    </div>
  );
}
