import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Volume2, VolumeX, Mail, Sparkles, Check, ChevronRight } from 'lucide-react';
import { getOrderDetails } from '../firebase';

export default function Unboxing() {
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [loading, setLoading] = useState(true);

  // Extract orderId from URL
  const query = new URLSearchParams(location.search);
  const orderId = query.get('orderId');

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const details = await getOrderDetails(orderId);
          setOrder(details);
        } catch (e) {
          console.error(e);
        }
      }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '80vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1e36', color: '#fff', fontFamily: 'var(--font-sans)' }}>
        <p>Preparing unboxing experience...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0b1e36', color: '#fff', padding: '1rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <Mail size={48} color="var(--accent-gold)" style={{ marginBottom: '1.5rem' }} />
        <h2>Envelope Link Expired or Invalid</h2>
        <p style={{ opacity: 0.8, marginTop: '0.25rem' }}>Please verify your recipient unboxing URL and try again.</p>
        <Link to="/" style={{ color: 'var(--accent-gold)', marginTop: '2rem', fontWeight: '600' }}>Return to Store</Link>
      </div>
    );
  }

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    // Simulating audio unmuting for chime music
    setIsMuted(false);
  };

  return (
    <div style={{
      minHeight: '92vh',
      backgroundColor: '#0b1e36', // Premium deep navy background
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 1.5rem',
      fontFamily: 'var(--font-sans)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative Golden Particle Backgrounds */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', color: 'rgba(212,175,55,0.15)', fontSize: '2rem' }}><Sparkles /></div>
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', color: 'rgba(212,175,55,0.15)', fontSize: '2.5rem' }}><Sparkles /></div>
      <div style={{ position: 'absolute', top: '30%', right: '12%', color: 'rgba(212,175,55,0.1)', fontSize: '1.5rem' }}><Sparkles /></div>

      {/* Audio Controller */}
      {isOpen && (
        <button 
          onClick={() => setIsMuted(!isMuted)}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '2rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid var(--accent-gold)',
            color: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
          }}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Envelope Stage */}
      {!isOpen ? (
        <div style={{ textAlign: 'center', zIndex: 10 }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>
            Hello, {order.shippingInfo.recipientName}
          </h2>
          <p style={{ color: 'var(--accent-gold)', fontSize: '1.05rem', fontWeight: '500', marginBottom: '3rem' }}>
            Someone has sent you a special surprise box!
          </p>

          {/* Interactive Envelope Graphic */}
          <div 
            onClick={handleOpenEnvelope}
            style={{
              width: '320px',
              height: '220px',
              backgroundColor: '#faf9f6',
              borderRadius: '8px',
              margin: '0 auto 2.5rem',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--accent-gold)'
            }}
            className="envelope-bounce"
          >
            {/* Wax Seal */}
            <div style={{
              width: '55px',
              height: '55px',
              borderRadius: '50%',
              backgroundColor: '#8b1e0f', // deep crimson wax seal
              border: '2.5px solid var(--accent-gold)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}>
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '0.85rem' }}>TNE</span>
            </div>

            {/* Folds decoration */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', borderTop: '1px solid rgba(212,175,55,0.4)', background: 'linear-gradient(135deg, #faf9f6 45%, #f1f0eb 100%)', borderRadius: '0 0 8px 8px' }}></div>
          </div>

          <button onClick={handleOpenEnvelope} className="btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Open Surprise Envelope <Sparkles size={16} />
          </button>
        </div>
      ) : (
        /* Unboxed Letter & Gift Contents Display */
        <div style={{ width: '100%', maxWidth: '640px', zIndex: 10, animation: 'fadeIn 0.8s ease' }}>
          
          {/* Audio player simulator for background chime/concierge greeting sound */}
          {!isMuted && (
            <div style={{ display: 'none' }}>
              {/* Fallback to simple audio tag or silent player log */}
              <iframe src="https://assets.mixkit.co/active_storage/sfx/2019/2019-84.wav" allow="autoplay" title="sound"></iframe>
            </div>
          )}

          {/* Letter */}
          <div style={{
            backgroundColor: '#faf9f6',
            color: 'var(--text-dark)',
            borderRadius: '12px',
            border: '2.5px solid var(--accent-gold)',
            padding: '3rem 2.5rem',
            boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
            marginBottom: '3rem',
            position: 'relative'
          }}>
            {/* Letter Header watermark */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.8rem', letterSpacing: '4px' }}>TNE</span>
              <div style={{ fontSize: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>The Nifemi Experience</div>
            </div>

            {/* Letter Greeting message */}
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--primary-green)', fontStyle: 'italic', marginBottom: '2rem', whiteSpace: 'pre-line', textAlign: 'center' }}>
              "{order.options.specialNote || order.options.cardText || 'Thinking of you! Hope this luxury package fills your day with sweet smiles and elegance.'}"
            </div>

            <div style={{ textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent-gold)' }}>
              — Placed with Love by {order.shippingInfo.senderName || 'Anonymous'}
            </div>
          </div>

          {/* Curated Box Fillers list display */}
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--accent-gold)', marginBottom: '1.5rem' }}>Your Curated Package Items</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', justifyContent: 'center' }}>
              {order.items.map((item, idx) => (
                <div key={idx} style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  padding: '1.25rem 0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(212,175,55,0.1)',
                    border: '1px solid var(--accent-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-gold)',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>
                    {item.quantity}x
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: '500', display: 'block', height: '2.2rem', overflow: 'hidden' }}>{item.name}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '3.5rem' }}>
              <Link to="/shop" className="btn-gold">
                Curate a Box for Someone Else <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .envelope-bounce {
          animation: float 3s ease-in-out infinite;
        }
        .envelope-bounce:hover {
          transform: scale(1.03) translateY(-5px);
          border-color: #fff !important;
        }
      `}</style>
    </div>
  );
}
