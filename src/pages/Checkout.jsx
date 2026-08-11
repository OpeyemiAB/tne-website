import React, { useState, useEffect } from 'react';
import { useGifting } from '../context/GiftingContext';
import Receipt from '../components/Receipt';

export default function Checkout() {
  const { cart = [], placeOrder, showToast } = useGifting();
  const [orderId, setOrderId] = useState('');
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  const [receiptImage, setReceiptImage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // Checkout Options from Cart
  const [cartOptions, setCartOptions] = useState({
    scheduledDate: '',
    scheduledTime: '',
    giftWrapping: false,
    specialNote: ''
  });

  useEffect(() => {
    const opts = sessionStorage.getItem('tne_checkout_options');
    if (opts) {
      setCartOptions(JSON.parse(opts));
    }

    // Load Paystack Inline JS script dynamically
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Shipping form states
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lagos');
  
  // Payment option
  const [paymentMethod, setPaymentMethod] = useState('Paystack / Flutterwave Secure Gateway');
  const [loading, setLoading] = useState(false);

  const cartSubtotal = (cart || []).reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
  const deliveryFee = (state || 'Lagos').toLowerCase() === 'lagos' ? 2500 : 5000;
  const wrapFee = cartOptions.giftWrapping ? 2000 : 0;
  const grandTotal = cartSubtotal + deliveryFee + wrapFee;

  const handleCopyAccount = () => {
    try {
      navigator.clipboard.writeText('8133231667');
      setIsCopied(true);
      if (showToast) showToast("OPay account number 8133231667 copied!");
      setTimeout(() => setIsCopied(false), 3000);
    } catch (err) {}
  };

  const handleReceiptUpload = (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      if (showToast) showToast("Receipt image size should be less than 5MB.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setReceiptImage(reader.result);
      if (showToast) showToast("Payment receipt screenshot uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  const completeOrderPlacement = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        customerEmail: senderEmail,
        deliveryDate: cartOptions.scheduledDate || 'Standard Delivery',
        deliveryTime: cartOptions.scheduledTime || 'Flexible',
        giftWrapping: cartOptions.giftWrapping,
        specialNote: cartOptions.specialNote,
        totalCost: grandTotal,
        paymentStatus: 'Pending Verification',
        receiptImage: receiptImage,
        shippingInfo: {
          senderName,
          senderEmail,
          senderPhone,
          recipientName,
          recipientPhone,
          address,
          city,
          state,
          deliveryFee,
          paymentMethod: 'Direct Bank Transfer (OPay)'
        },
        items: cart.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          customizations: item.customizations
        }))
      };

      const newOrderId = await placeOrder(orderPayload);
      setOrderId(newOrderId);
      setPlacedOrderDetails({
        id: newOrderId,
        date: new Date().toLocaleDateString(),
        ...orderPayload
      });
      showToast("Order submitted! The admin will verify your payment receipt shortly.", "success");

      // Auto-notify Admin WhatsApp Line (2348133231667)
      const waMsg = encodeURIComponent(`🚨 *NEW ORDER PLACED (Payment Receipt Uploaded)*\n\n*Order ID:* #${newOrderId}\n*Total:* ₦${grandTotal.toLocaleString()}\n*Sender:* ${senderName} (${senderPhone})\n*Recipient:* ${recipientName} (${recipientPhone})\n*Address:* ${address}, ${city}, ${state}\n\n*Payment:* OPay Direct Bank Transfer (Receipt Uploaded)\n\n👉 *Verify Payment in Admin Console:* https://www.thenifemiexperience.com/admin`);
      
      // Auto open WhatsApp notification for instant admin alert
      setTimeout(() => {
        window.open(`https://wa.me/2348133231667?text=${waMsg}`, '_blank');
      }, 800);

    } catch (err) {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (!senderName.trim() || !senderEmail.trim() || !senderPhone.trim() || !recipientName.trim() || !recipientPhone.trim() || !address.trim() || !city.trim()) {
      showToast("Please complete all mandatory checkout details before placing your order.", "error");
      return;
    }

    if (!receiptImage) {
      showToast("Please upload your bank transfer payment receipt screenshot before submitting.", "error");
      return;
    }

    completeOrderPlacement();
  };

  // Render receipt if order is successfully submitted
  if (orderId && placedOrderDetails) {
    return <Receipt order={placedOrderDetails} />;
  }

  // Graceful Empty Cart Guard
  if (cart.length === 0 && !orderId) {
    return (
      <div className="container fade-in" style={{ padding: '4rem 1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <div style={{ backgroundColor: '#fff', border: '1.5px solid var(--border-color)', borderRadius: '12px', padding: '3.5rem 2rem', maxWidth: '520px', margin: '0 auto', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-green)', fontSize: '2.2rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Your gift box is currently empty. Please select products from the shop or build a custom luxury gift box to proceed to checkout.
          </p>
          <a href="/shop" className="btn-gold" style={{ display: 'inline-flex', justifyContent: 'center', padding: '0.8rem 1.8rem', fontSize: '0.95rem' }}>
            Explore Shop Collections
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem', fontFamily: 'var(--font-sans)' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2.2rem', color: 'var(--primary-green)' }}>Checkout Details</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem' }} className="checkout-grid">
        
        {/* Form Inputs */}
        <form onSubmit={handleSubmitOrder} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Section 1: Gifter Info */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Gifter Information (Sender)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Your Full Name</label>
                <input 
                  type="text" 
                  value={senderName} 
                  onChange={e => setSenderName(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Email Address</label>
                <input 
                  type="email" 
                  value={senderEmail} 
                  onChange={e => setSenderEmail(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '1rem', width: '50%' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Phone Number</label>
              <input 
                type="tel" 
                value={senderPhone} 
                onChange={e => setSenderPhone(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
              />
            </div>
          </div>

          {/* Section 2: Recipient Details */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Recipient Delivery Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }} className="form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Recipient's Full Name</label>
                <input 
                  type="text" 
                  value={recipientName} 
                  onChange={e => setRecipientName(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Recipient's Phone Number</label>
                <input 
                  type="tel" 
                  value={recipientPhone} 
                  onChange={e => setRecipientPhone(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Street Address</label>
              <input 
                type="text" 
                placeholder="Apartment, suite, unit, road number"
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                required 
                style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>City</label>
                <input 
                  type="text" 
                  value={city} 
                  onChange={e => setCity(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                />
              </div>
              <div>
                <label htmlFor="checkout-state-select" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>State (Delivery Fee modifier)</label>
                <select 
                  id="checkout-state-select"
                  value={state} 
                  onChange={e => setState(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="Lagos">Lagos (₦2,500)</option>
                  <option value="Abuja">Abuja (₦5,000)</option>
                  <option value="Ogun">Ogun (₦5,000)</option>
                  <option value="Oyo">Oyo (₦5,000)</option>
                  <option value="Rivers">Rivers (₦5,000)</option>
                  <option value="Other">Other States (₦5,000)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Bank Transfer & Receipt Upload */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', marginBottom: '0.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Direct Bank Transfer & Verification
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Make a bank transfer to the official TNE account below and upload your transfer receipt screenshot to place your order.
            </p>
            
            {/* OPay Luxury Account Card */}
            <div style={{
              backgroundColor: 'var(--primary-green)',
              color: '#fff',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '2px solid var(--accent-gold)',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-gold)', fontWeight: 'bold' }}>
                  Official Bank Account
                </span>
                <span style={{ backgroundColor: 'var(--accent-gold)', color: 'var(--primary-green-dark)', padding: '0.25rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  OPay
                </span>
              </div>

              <div style={{ fontSize: '1.6rem', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'monospace', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span>8133231667</span>
                <button 
                  type="button"
                  onClick={handleCopyAccount}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#fff',
                    border: '1px solid var(--accent-gold)',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  {isCopied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>

              <div style={{ fontSize: '0.9rem', color: 'var(--background-ivory)', fontWeight: '600' }}>
                Account Name: <span style={{ color: '#fff', fontWeight: 'bold' }}>Adepitan Oluwanifemi</span>
              </div>
            </div>

            {/* Receipt Upload Box */}
            <div style={{ border: '2px dashed var(--accent-gold)', borderRadius: '8px', padding: '1.25rem', backgroundColor: 'var(--background-ivory)', textAlign: 'center' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '0.4rem', cursor: 'pointer' }}>
                📷 Upload Transfer Receipt / Screenshot (Required)
              </label>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Upload your mobile banking app transfer receipt image. The Admin will verify and issue your official TNE receipt.
              </p>

              <input 
                type="file" 
                accept="image/*" 
                onChange={handleReceiptUpload}
                required
                style={{ fontSize: '0.8rem' }}
              />

              {receiptImage && (
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 'bold' }}>✓ Receipt Image Uploaded!</span>
                  <img src={receiptImage} alt="Payment Receipt Preview" style={{ width: '120px', height: '140px', objectFit: 'cover', borderRadius: '6px', border: '1.5px solid var(--primary-green)' }} />
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Order review side bar */}
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
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>Order Curation</h3>
            
            {/* Items summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem' }} className="custom-scroll">
              {cart.map(item => (
                <div key={item.cartId} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <img src={item.product.image} alt={item.product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: '600' }}>{item.product.name}</span>
                    <span style={{ color: 'var(--text-muted)' }}> (x{item.quantity})</span>
                  </div>
                  <span style={{ fontWeight: '600' }}>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span>₦{cartSubtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              {cartOptions.giftWrapping && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Premium Wrapping</span>
                  <span>₦{wrapFee.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.15rem', color: 'var(--primary-green)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
                <span>Grand Total</span>
                <span>₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={handleSubmitOrder}
              disabled={loading || cart.length === 0}
              className="btn-gold" 
              style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '1rem' }}
            >
              {loading ? 'Processing Order...' : 'Confirm & Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
