import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSuccess(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => {
      setSuccess(false);
    }, 4000);
  };

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Contact Us</h1>
        <p style={{ color: 'var(--text-muted)' }}>We are here to assist you with order curations, custom engravings, or corporate gifting inquiries.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem' }} className="contact-grid">
        
        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)' }}>Get In Touch</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Have a custom branding request or bulk order inquiry? Send us a message, email, or chat with our gifting concierge on WhatsApp.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--background-ivory)', border: '1.5px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--primary-green)' }}>
                <Phone size={18} style={{ alignSelf: 'center' }} />
              </div>
              <div>
                <strong style={{ display: 'block' }}>Call Line (Inquiries)</strong>
                <span style={{ color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>+234 815 449 3101</span>
                <strong style={{ display: 'block', marginTop: '0.5rem' }}>WhatsApp Concierge (Orders)</strong>
                <a 
                  href="https://wa.me/2348133231667" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ color: 'var(--primary-green)', fontWeight: '600', textDecoration: 'underline' }}
                >
                  +234 813 323 1667 (Chat on WhatsApp)
                </a>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--background-ivory)', border: '1.5px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--primary-green)' }}>
                <Mail size={18} style={{ alignSelf: 'center' }} />
              </div>
              <div>
                <strong style={{ display: 'block' }}>Email Address</strong>
                <span style={{ color: 'var(--text-muted)' }}>hello@tneexperience.com</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--background-ivory)', border: '1.5px solid var(--accent-gold)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--primary-green)' }}>
                <MapPin size={18} style={{ alignSelf: 'center' }} />
              </div>
              <div>
                <strong style={{ display: 'block' }}>Office Address</strong>
                <span style={{ color: 'var(--text-muted)' }}>Lagos, Nigeria</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>Send Message</h3>
          
          {success && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(0,75,73,0.05)',
              border: '1px solid var(--primary-green)',
              color: 'var(--primary-green)',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <Check size={18} />
              <span>Thank you! Your message was sent. TNE support will respond shortly.</span>
            </div>
          )}

          <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                style={{ width: '100%', padding: '0.65rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Message Details</label>
              <textarea 
                rows={4} 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                required
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              Send Inquiry
            </button>
          </form>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
