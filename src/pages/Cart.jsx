import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, Sparkles, Gift } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function Cart() {
  const { cart, updateCartQuantity, removeFromCart, products } = useGifting();
  const navigate = useNavigate();

  // Scheduled date states
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [giftWrapping, setGiftWrapping] = useState(false);
  const [specialNote, setSpecialNote] = useState('');

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Calculate delivery fee preview
  const estimatedDelivery = 2500; 
  const totalCost = cartSubtotal + estimatedDelivery;

  const handleCheckout = () => {
    // Save scheduled options to session to fetch in checkout
    const checkoutOptions = {
      scheduledDate,
      scheduledTime,
      giftWrapping,
      specialNote
    };
    sessionStorage.setItem('tne_checkout_options', JSON.stringify(checkoutOptions));
    navigate('/checkout');
  };

  const relatedSuggestions = products.slice(0, 3);

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <ShoppingBag size={64} color="var(--primary-green)" style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
        <h2>Your Shopping Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Select standard collections or create custom gift boxes to get started.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link to="/shop" className="btn-primary">Browse Shop</Link>
          <Link to="/atelier" className="btn-secondary">Build a Custom Box</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem', fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Shopping Bag</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }} className="cart-grid">
        
        {/* Left Column: Cart items & scheduler */}
        <div>
          {/* Cart list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            {cart.map((item) => (
              <div 
                key={item.cartId} 
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  backgroundColor: '#fff',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  position: 'relative'
                }}
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                
                <div style={{ flex: 1, paddingRight: '2.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '600', textTransform: 'uppercase' }}>
                    {item.product.category}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary-green)', margin: '0.25rem 0' }}>
                    {item.product.name}
                  </h3>
                  
                  {/* Customization Details */}
                  {item.customizations && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem', backgroundColor: 'var(--background-ivory)', borderRadius: '6px', margin: '0.5rem 0' }}>
                      {item.customizations.boxSize && <div><strong>Box Size:</strong> {item.customizations.boxSize}</div>}
                      {item.customizations.ribbonColor && <div><strong>Ribbon wrap:</strong> {item.customizations.ribbonColor}</div>}
                      {item.customizations.cardTemplate && <div><strong>Card Style:</strong> {item.customizations.cardTemplate}</div>}
                      {item.customizations.cardText && <div><strong>Card Message:</strong> "{item.customizations.cardText}"</div>}
                      {item.customizations.engraveName && <div><strong>Engraving Initials:</strong> {item.customizations.engraveName}</div>}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.2rem 0.5rem' }}>
                      <button onClick={() => updateCartQuantity(item.cartId, -1)} style={{ fontWeight: 'bold' }}>-</button>
                      <span style={{ fontSize: '0.85rem', width: '25px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateCartQuantity(item.cartId, 1)} style={{ fontWeight: 'bold' }}>+</button>
                    </div>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => removeFromCart(item.cartId)}
                  style={{ color: '#ef4444', position: 'absolute', top: '1.5rem', right: '1.5rem' }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          {/* Schedulers & wrapping Options */}
          <div style={{ backgroundColor: '#fff', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: 'var(--primary-green)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gift size={22} style={{ color: 'var(--accent-gold)' }} /> Delivery Scheduling & Wrapping
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="scheduler-form">
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Preferred Delivery Date</label>
                <input 
                  type="date"
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Preferred Delivery Window</label>
                <select
                  value={scheduledTime}
                  onChange={e => setScheduledTime(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="">Select Time Window</option>
                  <option value="morning">Morning (8am - 12pm)</option>
                  <option value="afternoon">Afternoon (12pm - 4pm)</option>
                  <option value="evening">Evening (4pm - 7pm)</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600' }}>
                <input 
                  type="checkbox"
                  checked={giftWrapping}
                  onChange={e => setGiftWrapping(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--primary-green)' }}
                />
                Add Premium Gift Wrapping & Floral Ribbon (+₦2,000)
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Special Instructions / Delivery Notes</label>
              <textarea
                placeholder="Include gate code, specific instructions, or delivery requests..."
                rows={3}
                value={specialNote}
                onChange={e => setSpecialNote(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', outline: 'none', resize: 'none' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & checkout trigger */}
        <div>
          <div style={{
            backgroundColor: 'var(--background-white)',
            border: '1.5px solid var(--border-color)',
            borderRadius: '12px',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            position: 'sticky',
            top: '120px',
            alignSelf: 'start'
          }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Order Summary</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal ({totalCartItems} items)</span>
                <span>₦{cartSubtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Estimated Delivery</span>
                <span>₦{estimatedDelivery.toLocaleString()}</span>
              </div>
              {giftWrapping && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Premium Gift Wrapping</span>
                  <span>₦2,000</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--primary-green)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <span>Estimated Total</span>
                <span>₦{(totalCost + (giftWrapping ? 2000 : 0)).toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '1rem' }}
            >
              Proceed to Secure Checkout <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
