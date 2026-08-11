import React, { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is touch-based or has mobile screen width
    const checkDevice = () => {
      const mobileWidth = window.innerWidth <= 768;
      const touchDevice = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobileWidth || touchDevice);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);

    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Dynamic hover bindings for interactive items
    const addHoverListeners = () => {
      const elements = document.querySelectorAll(
        'a, button, input, select, textarea, .occ-circle, .luxury-card, [role="button"], .social-icon-btn, .quick-prompt-btn'
      );
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovered(true));
        el.addEventListener('mouseleave', () => setIsHovered(false));
      });
    };

    addHoverListeners();

    // Observe route transitions or dynamically rendered cards
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Outer Follower Circle - only visible on links and buttons */}
      <div 
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: isHovered ? '38px' : '0px',
          height: isHovered ? '38px' : '0px',
          border: '1.5px solid var(--accent-gold)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'width 0.18s ease-out, height 0.18s ease-out, opacity 0.18s ease-out, background-color 0.18s ease-out',
          opacity: isHovered ? 1 : 0,
          backgroundColor: 'rgba(212, 175, 55, 0.15)'
        }}
      />
    </>
  );
}
