import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Printer, Download, CheckCircle } from 'lucide-react';

export default function Receipt({ order }) {
  const receiptRef = useRef();

  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const itemsList = order.items || [];
  const itemSubtotal = itemsList.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
  const shipInfo = order.shippingInfo || {};

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', fontFamily: 'var(--font-sans)' }}>
      {/* Success Notification */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <CheckCircle size={48} color="var(--primary-green)" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Order Confirmed</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Thank you for shopping with The Nifemi Experience. Your order <strong>{order.id}</strong> has been registered!
        </p>
      </div>

      {/* Invoice Card */}
      <div 
        ref={receiptRef} 
        style={{
          backgroundColor: '#fff',
          border: '1.5px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          color: 'var(--text-dark)'
        }}
        className="printable-invoice"
      >
        {/* Brand Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--accent-gold)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 'bold', margin: 0, letterSpacing: '2px' }}>TNE</h1>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>The Nifemi Experience</span>
          </div>
          <div style={{ textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <p>hello@thenifemiexperience.com</p>
            <p>+234 815 449 3101 | WhatsApp: +234 813 323 1667</p>
            <p>Lagos, Nigeria</p>
          </div>
        </div>

        {/* Payment Status Banner */}
        {order.paymentStatus === 'Failed' ? (
          <div style={{ backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#cf1322', letterSpacing: '0.5px' }}>Payment Failed / Unpaid</span>
              <p style={{ fontSize: '0.8rem', color: '#8c8c8c', marginTop: '0.1rem' }}>Payment was not verified. Your Order ID <strong>{order.id}</strong> is saved.</p>
            </div>
            <span style={{ backgroundColor: '#ff4d4f', color: '#fff', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>UNPAID</span>
          </div>
        ) : (order.paymentStatus === 'Paid' || (shipInfo.paymentMethod?.includes('Paystack') && order.paymentStatus !== 'Pending')) ? (
          <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#389e0d', letterSpacing: '0.5px' }}>Official Paid Receipt</span>
              <p style={{ fontSize: '0.8rem', color: '#8c8c8c', marginTop: '0.1rem' }}>Verified Payment Completed • Ref: {order.id}</p>
            </div>
            <span style={{ backgroundColor: '#52c41a', color: '#fff', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>PAID & VERIFIED</span>
          </div>
        ) : (
          <div style={{ backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#096dd9', letterSpacing: '0.5px' }}>Pending Payment Verification</span>
              <p style={{ fontSize: '0.8rem', color: '#8c8c8c', marginTop: '0.1rem' }}>Transfer receipt uploaded. Order ID {order.id} will update to Paid upon Admin verification.</p>
            </div>
            <span style={{ backgroundColor: '#1890ff', color: '#fff', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>VERIFICATION PENDING</span>
          </div>
        )}

        {/* Invoice Meta */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem', fontSize: '0.85rem' }}>
          <div>
            <p style={{ color: 'var(--text-muted)' }}>Order ID:</p>
            <p style={{ fontWeight: '600' }}>{order.id}</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Order Date:</p>
            <p style={{ fontWeight: '600' }}>{order.date || new Date().toLocaleDateString()}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'var(--text-muted)' }}>Delivery To:</p>
            <p style={{ fontWeight: '600' }}>{shipInfo.recipientName || 'Recipient'}</p>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Delivery Address:</p>
            <p style={{ fontWeight: '600' }}>{shipInfo.address || ''}, {shipInfo.city || ''}, {shipInfo.state || ''}</p>
          </div>
        </div>

        {/* Invoice Table */}
        <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem 0.5rem', width: '45%' }}>Item Description</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'center', width: '15%', whiteSpace: 'nowrap' }}>Qty</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', width: '20%', whiteSpace: 'nowrap' }}>Unit Price</th>
                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right', width: '20%', whiteSpace: 'nowrap' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {itemsList.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    <div style={{ fontWeight: '600' }}>{item.name || 'Custom Product'}</div>
                    {item.customizations && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {item.customizations.boxSize && <span>Box: {item.customizations.boxSize} • </span>}
                        {item.customizations.ribbonColor && <span>Ribbon: {item.customizations.ribbonColor} • </span>}
                        {item.customizations.cardText && <span>Note: "{item.customizations.cardText}" • </span>}
                        {item.customizations.engraveName && <span>Engrave Name: {item.customizations.engraveName} • </span>}
                        {item.customizations.hasPersonalization && <span>Personalized</span>}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center', whiteSpace: 'nowrap' }}>{item.quantity || 1}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>₦{(item.price || 0).toLocaleString()}</td>
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', whiteSpace: 'nowrap' }}>₦{((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary */}
        <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span>₦{itemSubtotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Fee</span>
            <span>₦{(shipInfo.deliveryFee || order.deliveryFee || 2500).toLocaleString()}</span>
          </div>
          {order.giftWrapping && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Premium Gift Wrapping</span>
              <span>Included</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--primary-green)', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
            <span>Total Cost</span>
            <span>₦{(order.totalCost || (itemSubtotal + (shipInfo.deliveryFee || 2500))).toLocaleString()}</span>
          </div>
        </div>

        {/* Footer Notes */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
          <p style={{ fontWeight: '600', color: 'var(--primary-green)', marginBottom: '0.25rem' }}>Thank You for choosing The Nifemi Experience!</p>
          <p>If you have any questions about this receipt, please contact us.</p>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          onClick={handlePrint}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--primary-green)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '500',
            cursor: 'pointer',
            border: 'none'
          }}
        >
          <Printer size={16} /> Print Receipt
        </button>

        <Link 
          to="/shop"
          className="btn-secondary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '500',
            textDecoration: 'none'
          }}
        >
          Continue Shopping
        </Link>

        <Link 
          to="/"
          className="btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            fontWeight: '500',
            textDecoration: 'none'
          }}
        >
          Go to Home
        </Link>
      </div>

      {/* CSS style for print */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-invoice, .printable-invoice * {
            visibility: visible;
          }
          .printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
