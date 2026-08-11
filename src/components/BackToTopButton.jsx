import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: 'fixed',
        bottom: '8.5rem', /* Sits comfortably above the floating SupportWidget chat bubble */
        right: '2rem',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        color: 'var(--primary-green)',
        border: '1.5px solid var(--accent-gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'transform 0.2s, background-color 0.2s, color 0.2s'
      }}
      className="back-to-top-btn"
      title="Back to Top"
      aria-label="Scroll to top of page"
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--primary-green)';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#fff';
        e.currentTarget.style.color = 'var(--primary-green)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
}
