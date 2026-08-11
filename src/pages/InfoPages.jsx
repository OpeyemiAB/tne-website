import React from 'react';

// FAQs Page
export function FAQs() {
  const faqsList = [
    { q: "How does TNE personalization work?", a: "For items like necklaces, watches, and keyholders, you can type your preferred initials/names or upload your company logo directly on the product detail page before adding the item to your shopping cart." },
    { q: "What is the delivery timeline within Nigeria?", a: "Standard Lagos deliveries are dispatched within 2-3 business days. Deliveries to other Nigerian states (Abuja, Rivers, Oyo, etc.) take 3-5 business days." },
    { q: "Can I schedule a gift box surprise delivery for a future date?", a: "Yes, absolutely! On the Cart page, you can choose your preferred delivery date and time slot (morning, afternoon, or evening) using our scheduling widget." },
    { q: "What is the 'Digital Unboxing' experience?", a: "Every TNE surprise gift box includes a unique QR code. When scanned by the recipient, it opens a beautifully animated digital envelope on their phone, revealing a personalized letter from you along with music and details of the physical items inside." }
  ];

  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)', textAlign: 'center', marginBottom: '3rem' }}>Frequently Asked Questions</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {faqsList.map((faq, idx) => (
          <div key={idx} style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: '600', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Q: {faq.q}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Shipping & Delivery Page
export function Shipping() {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)', textAlign: 'center', marginBottom: '2.5rem' }}>Shipping & Delivery Policy</h1>
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2.5rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>Delivery Fee Rates</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          TNE offers flat rate delivery fees based on the delivery location inside Nigeria:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>📍 <strong>Lagos deliveries:</strong> Flat fee of ₦2,500.</li>
          <li>📍 <strong>Other Nigerian States (Abuja, Port Harcourt, Ibadan, etc.):</strong> Flat fee of ₦5,000.</li>
        </ul>
        
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>Fulfillment and Shipment</h3>
        <p>
          All personalized orders are carefully engraved and wrapped by hand. Once dispatched, the gifter will receive an order confirmation containing a live tracking link.
        </p>
      </div>
    </div>
  );
}

// Returns & Refunds Page
export function Refunds() {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>THE NIFEMI EXPERIENCE</h1>
        <h2 style={{ fontSize: '1.2rem', color: 'var(--accent-gold-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>REFUND & RETURN POLICY</h2>
      </div>

      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2.5rem', lineHeight: '1.8', fontSize: '0.95rem', boxShadow: 'var(--shadow-sm)' }}>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>1. CUSTOMIZED & PERSONALIZED ORDERS</h3>
          <p>Customized and personalized products cannot be cancelled, returned or refunded once production has started.</p>
          <p>This includes personalized bracelets, necklaces, journals, gift boxes, engraved items and other products made specifically for you.</p>
          <p style={{ fontWeight: '500', color: 'var(--primary-green)', marginTop: '0.5rem' }}>Please ensure that all names, spellings, colours, sizes and customization details provided are correct before confirming your order.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>2. CHANGE OF MIND</h3>
          <p>We do not offer refunds simply because a customer changes their mind after an order has been confirmed or production has started.</p>
          <p>For orders that have not yet entered production, cancellation may be considered at the discretion of The Nifemi Experience.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>3. WRONG OR DEFECTIVE ITEMS</h3>
          <p>Please contact us within 24 hours of receiving your order with clear pictures or videos of the item.</p>
          <p>Where the issue is confirmed to be our fault, we may offer a replacement, correction or refund, depending on the situation.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>4. CUSTOMER-PROVIDED DETAILS</h3>
          <p>The customer is responsible for providing accurate information for customization.</p>
          <p>If an item is produced exactly according to the details provided by the customer and there is an error in those details, the item will not qualify for a refund or free replacement.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>5. DELIVERY FEES</h3>
          <p>Delivery fees are non-refundable once an order has been dispatched.</p>
          <p>If an order is returned or redelivered because the customer provided an incorrect address, was unavailable to receive the order, or failed to communicate properly with the dispatch rider, any additional delivery charges will be borne by the customer.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>6. ITEMS THAT HAVE BEEN USED</h3>
          <p>Items must be returned unused, undamaged and in their original condition where a return has been approved.</p>
          <p>Items that have been used, damaged by the customer, altered or tampered with may not qualify for a refund or exchange.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>7. SALE & PROMOTIONAL ITEMS</h3>
          <p>Items purchased during sales, promotions or special offers are generally not eligible for refunds, unless the item is defective or the error was caused by The Nifemi Experience.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>8. REFUND PROCESSING</h3>
          <p>Once a refund has been approved, the refund will be processed through the original payment method where possible.</p>
          <p>Refund processing time may depend on the payment platform or bank involved.</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>9. ORDER CANCELLATION</h3>
          <p>Once materials have been purchased or production has started for an order, cancellation may no longer be possible.</p>
          <p>Where cancellation is approved before production begins, any applicable non-refundable charges already incurred may be deducted from the amount refunded.</p>
        </div>

        <div style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.5rem', marginTop: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>10. IMPORTANT</h3>
          <p style={{ marginBottom: '1rem' }}>By placing an order with The Nifemi Experience, you confirm that you have read, understood and agreed to this Refund & Return Policy.</p>
          <p style={{ marginBottom: '1.5rem' }}>We encourage every customer to carefully confirm their order details before payment, especially for customized and personalized products.</p>
          <div style={{ textAlign: 'center', color: 'var(--primary-green)', fontWeight: '600', fontStyle: 'italic', marginTop: '1.5rem' }}>
            <p>Thank you for choosing The Nifemi Experience.</p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginTop: '0.25rem', color: 'var(--accent-gold-dark)' }}>Elegance in every surprise.</p>
          </div>
        </div>

      </div>
    </div>
  );
}

// Privacy Policy Page
export function Privacy() {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)', textAlign: 'center', marginBottom: '2.5rem' }}>Privacy Policy</h1>
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2.5rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          At The Nifemi Experience (TNE), we value the privacy of our customers and their gift recipients. We collect only necessary details to package and deliver your surprises securely.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>What Information We Collect</h3>
        <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <li>Sender details (Name, phone number, email address) to manage invoices and order updates.</li>
          <li>Recipient details (Name, shipping address, telephone number) for delivery dispatch.</li>
          <li>Personalized text engravings and files/photos uploaded for custom branding.</li>
        </ul>
      </div>
    </div>
  );
}

// Terms & Conditions Page
export function Terms() {
  return (
    <div className="container fade-in" style={{ padding: '4rem 1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--text-dark)', maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)', textAlign: 'center', marginBottom: '2.5rem' }}>Terms & Conditions</h1>
      <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2.5rem', lineHeight: '1.8', fontSize: '0.95rem' }}>
        <p style={{ marginBottom: '1.5rem' }}>
          Welcome to The Nifemi Experience. By using our website, you agree to comply with our terms of service.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>Order Agreement</h3>
        <p style={{ marginBottom: '1.5rem' }}>
          Orders are only processed once confirmation is verified (such as bank transfers or cash payment approvals). By submitting a custom message or uploading brand logos, you confirm that you own the rights to the content and authorize TNE to engrave it.
        </p>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>Contact Details</h3>
        <p>
          For any inquiries regarding our terms, please email us at <strong>thenifemiexperience@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
}
