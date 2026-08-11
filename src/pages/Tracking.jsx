import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Search, Package, ClipboardCheck, Sparkles, Truck, CheckCircle2, ChevronRight } from 'lucide-react';
import { getOrderDetails } from '../firebase';

export default function Tracking() {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    const cleanId = orderIdInput.trim().replace(/^#/, '');
    if (!cleanId) return;
    setLoading(true);
    setSearched(true);
    try {
      const details = await getOrderDetails(cleanId);
      setOrder(details);
    } catch (err) {
      console.error(err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { name: 'Order Placed', code: 'Pending', icon: ClipboardCheck },
    { name: 'Sourcing Items', code: 'Sourcing Items', icon: Package },
    { name: 'Wrapped with Love', code: 'Wrapped with Love', icon: Sparkles },
    { name: 'Out for Delivery', code: 'Out for Delivery', icon: Truck },
    { name: 'Delivered', code: 'Delivered', icon: CheckCircle2 }
  ];

  // Helper to determine status index
  const getStatusIndex = (currentStatus) => {
    return steps.findIndex(step => step.code.toLowerCase() === (currentStatus || '').toLowerCase());
  };

  const statusIdx = order ? getStatusIndex(order.status) : -1;

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', maxWidth: '800px', fontFamily: 'var(--font-sans)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.8rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Track Your Surprise</h1>
        <p style={{ color: 'var(--text-muted)' }}>Enter your unique TNE Order ID to check the progress of your surprise gift package.</p>
      </div>

      {/* Tracker search bar */}
      <form onSubmit={handleTrackSubmit} style={{ display: 'flex', gap: '0.5rem', backgroundColor: '#fff', padding: '1rem', borderRadius: '8px', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', marginBottom: '3rem' }}>
        <input 
          type="text" 
          placeholder="Enter Order ID (e.g. TNE-123456)"
          value={orderIdInput}
          onChange={e => setOrderIdInput(e.target.value)}
          required
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', outline: 'none', fontSize: '0.95rem' }}
        />
        <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={16} /> Track Order
        </button>
      </form>

      {loading && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Fetching tracking timeline...</p>}

      {!loading && searched && !order && (
        <div style={{ textAlign: 'center', padding: '2rem', border: '1.5px solid var(--border-color)', borderRadius: '8px', backgroundColor: '#fff' }}>
          <p style={{ color: '#ef4444', fontWeight: '600' }}>No active order found with ID "{orderIdInput}"</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Please verify the Order ID from your confirmation invoice and try again.</p>
        </div>
      )}

      {/* Timeline view */}
      {!loading && order && (
        <div style={{ backgroundColor: '#fff', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          
          {/* Metadata */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '2.5rem' }} className="track-meta">
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tracking Order:</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--primary-green)' }}>{order.id}</h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Current Status:</span>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--accent-gold)' }}>{order.status}</h3>
            </div>
          </div>

          {/* Stepper timeline */}
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginBottom: '4rem' }} className="stepper-row">
            {/* Timeline connection line */}
            <div style={{
              position: 'absolute',
              top: '25px',
              left: '5%',
              width: '90%',
              height: '3px',
              backgroundColor: '#f1f5f9',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              top: '25px',
              left: '5%',
              width: `${statusIdx * 22.5}%`,
              height: '3px',
              backgroundColor: 'var(--accent-gold)',
              zIndex: 1,
              transition: 'all 0.5s ease'
            }}></div>

            {/* Steps */}
            {steps.map((s, idx) => {
              const StepIcon = s.icon;
              const isPast = statusIdx >= idx;
              const isCurrent = statusIdx === idx;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1, textAlign: 'center' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? 'var(--primary-green)' : isPast ? 'var(--accent-gold)' : '#fff',
                    color: isPast || isCurrent ? '#fff' : 'var(--text-muted)',
                    border: '2.5px solid',
                    borderColor: isCurrent ? 'var(--accent-gold)' : isPast ? 'var(--accent-gold)' : 'var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.3s ease'
                  }}>
                    <StepIcon size={20} />
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: isCurrent || isPast ? '600' : '400',
                    color: isCurrent ? 'var(--primary-green)' : 'var(--text-dark)',
                    marginTop: '0.75rem',
                    maxWidth: '80px'
                  }}>
                    {s.name}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Recipient Details & Unboxing Action */}
          <div style={{ backgroundColor: 'var(--background-ivory)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Delivery Information</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Shipping to <strong>{order.shippingInfo.recipientName}</strong> at <strong>{order.shippingInfo.address}, {order.shippingInfo.city}</strong>.
            </p>

            {statusIdx >= 2 && (
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="unbox-callout">
                <div>
                  <h5 style={{ fontSize: '0.95rem', color: 'var(--primary-green)', fontWeight: '600' }}>Gift Envelope Ready!</h5>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>The recipient can open their digital gift envelope card online.</p>
                </div>
                <Link 
                  to={`/unbox?orderId=${order.id}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    color: 'var(--accent-gold)',
                    fontWeight: '600',
                    fontSize: '0.85rem'
                  }}
                >
                  Preview Unboxing <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
