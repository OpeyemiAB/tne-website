import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Footer() {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    setSubscribed(true);
    setEmailInput('');
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer style={{ backgroundColor: '#fff', borderTop: '1px solid var(--border-color)', marginTop: '4rem', fontFamily: 'var(--font-sans)' }}>
      {/* 1. Newsletter Callout (Dark Green Banner style from Mockup) */}
      <div style={{
        backgroundColor: 'var(--primary-green)',
        color: '#fff',
        padding: '3rem 1.5rem',
        borderBottom: '4px solid var(--accent-gold)'
      }}>
        <div className="container newsletter-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center' }}>
          <div className="newsletter-text">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: '#fff', marginBottom: '0.5rem' }}>Be the first to know</h2>
            <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>Get exclusive deals, new arrivals and gift ideas directly in your inbox.</p>
          </div>
          <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.5rem', width: '100%', maxWidth: '450px' }}>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{
                flex: 1,
                padding: '0.8rem 1rem',
                border: '1px solid var(--accent-gold)',
                borderRadius: '6px',
                outline: 'none',
                fontSize: '0.9rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#fff'
              }}
            />
            <button type="submit" className="btn-gold" style={{ padding: '0.8rem 1.5rem', whiteSpace: 'nowrap' }}>
              {subscribed ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div style={{ padding: '4rem 0 2rem' }}>
        <div className="container footer-links-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem' }}>
          
          {/* Column 1: Brand Info */}
          <div>
            <Link to="/">
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: 'var(--primary-green)', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>TNE</div>
              <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary-green)', fontWeight: '600' }}>The Nifemi Experience</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.25rem', maxWidth: '300px' }}>
              Luxury gifting, personalization, fashion, beauty and lifestyle—crafted with love. Elegance in every surprise.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <a href="https://instagram.com/thenifemiexperience" target="_blank" rel="noopener noreferrer" className="social-icon-btn instagram" title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://tiktok.com/@the_nifemi_experience" target="_blank" rel="noopener noreferrer" className="social-icon-btn tiktok" title="TikTok">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                </svg>
              </a>
              <a href="https://wa.me/2348133231667" target="_blank" rel="noopener noreferrer" className="social-icon-btn whatsapp" title="WhatsApp">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
              <a href="mailto:thenifemiexperience@gmail.com" className="social-icon-btn email" title="Email"><Mail size={18} /></a>
            </div>
          </div>

          {/* Column 2: Shop links */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Shop</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <Link to="/shop" className="footer-link">All Products</Link>
              <Link to="/shop?category=Etched by TNE" className="footer-link">Etched by TNE</Link>
              <Link to="/shop?category=TNE Gift Curation" className="footer-link">Gift Curation</Link>
              <Link to="/shop?category=TNE Collections" className="footer-link">Fashion</Link>
              <Link to="/shop?category=TNE Beauty" className="footer-link">Beauty</Link>
              <Link to="/shop?sort=newest" className="footer-link">New Arrivals</Link>
            </div>
          </div>

          {/* Column 3: Customer Care links */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Customer Care</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <Link to="/faqs" className="footer-link">FAQs</Link>
              <Link to="/shipping" className="footer-link">Shipping & Delivery</Link>
              <Link to="/refunds" className="footer-link">Returns & Refunds</Link>
              <Link to="/track" className="footer-link">Track Your Order</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
              <Link to="/terms" className="footer-link">Terms & Conditions</Link>
              <Link to="/admin-login" className="footer-link" style={{ color: 'var(--accent-gold-dark)', fontWeight: '600' }}>Admin Portal</Link>
            </div>
          </div>

          {/* Column 4: Contact details */}
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '600', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Contact Us</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Phone size={16} style={{ color: 'var(--accent-gold)', marginTop: '2px' }} />
                <span>+234 815 449 3101</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <Mail size={16} style={{ color: 'var(--accent-gold)', marginTop: '2px' }} />
                <span>thenifemiexperience@gmail.com</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <MapPin size={16} style={{ color: 'var(--accent-gold)', marginTop: '2px' }} />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Solid Styled Copyright Footer Banner */}
        <div style={{
          backgroundColor: 'var(--primary-green)',
          color: '#fff',
          borderTop: '2.5px solid var(--accent-gold)',
          padding: '1.5rem 0',
          marginTop: '3.5rem',
          fontSize: '0.85rem',
          letterSpacing: '0.5px'
        }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <span style={{ color: 'var(--accent-gold)', fontWeight: '500' }}>
              © 2026 The Nifemi Experience. All Rights Reserved.
            </span>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <Link to="/privacy" style={{ color: '#fff', opacity: 0.8, transition: 'var(--transition-smooth)' }} className="copyright-link">Privacy Policy</Link>
              <Link to="/terms" style={{ color: '#fff', opacity: 0.8, transition: 'var(--transition-smooth)' }} className="copyright-link">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-muted);
          transition: var(--transition-smooth);
        }
        .footer-link:hover {
          color: var(--primary-green);
          padding-left: 0.25rem;
        }
        .social-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-green);
          transition: var(--transition-smooth);
          padding: 0.25rem;
        }
        .social-icon-btn svg {
          display: block;
          margin: 0;
        }
        .social-icon-btn:hover {
          color: var(--accent-gold) !important;
          transform: translateY(-2px) scale(1.15);
        }
        .copyright-link:hover {
          color: var(--accent-gold) !important;
          opacity: 1 !important;
        }
        @media (max-width: 768px) {
          .footer-links-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
          .footer-links-grid > div:first-child {
            grid-column: span 2 !important;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 1.5rem;
          }
          .footer-links-grid > div:last-child {
            grid-column: span 2 !important;
            border-top: 1px solid #f1f5f9;
            padding-top: 1.5rem;
          }
          .newsletter-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 1.5rem !important;
          }
          .newsletter-grid form {
            max-width: 100% !important;
            flex-direction: row !important;
            gap: 0.5rem !important;
          }
        }
      `}</style>
    </footer>
  );
}
