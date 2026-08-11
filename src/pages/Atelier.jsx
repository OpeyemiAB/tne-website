import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight, ArrowLeft, Trash } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function Atelier() {
  const { atelierOptions, addToCart, showToast } = useGifting();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Helper to retrieve pre-packaged core items included in each box tier
  const getIncludedItems = (size) => {
    switch(size) {
      case 'Starter':
        return [
          { id: 'fill-keychain', name: 'Leather Keyholder (Included)', price: 0, icon: '🔑', isIncluded: true },
          { id: 'fill-card', name: 'QR Greeting Card (Included)', price: 0, icon: '✉', isIncluded: true }
        ];
      case 'Classic':
        return [
          { id: 'fill-keychain', name: 'Leather Keyholder (Included)', price: 0, icon: '🔑', isIncluded: true },
          { id: 'fill-card', name: 'QR Greeting Card (Included)', price: 0, icon: '✉', isIncluded: true },
          { id: 'fill-candle', name: 'Scented Glass Candle (Included)', price: 0, icon: '🕯', isIncluded: true }
        ];
      case 'Premium':
        return [
          { id: 'fill-keychain', name: 'Leather Keyholder (Included)', price: 0, icon: '🔑', isIncluded: true },
          { id: 'fill-card', name: 'QR Greeting Card (Included)', price: 0, icon: '✉', isIncluded: true },
          { id: 'fill-candle', name: 'Scented Glass Candle (Included)', price: 0, icon: '🕯', isIncluded: true },
          { id: 'fill-watch', name: 'Customized Gold Watch (Included)', price: 0, icon: '⌚', isIncluded: true }
        ];
      case 'Signature':
        return [
          { id: 'fill-keychain', name: 'Leather Keyholder (Included)', price: 0, icon: '🔑', isIncluded: true },
          { id: 'fill-card', name: 'QR Greeting Card (Included)', price: 0, icon: '✉', isIncluded: true },
          { id: 'fill-candle', name: 'Scented Glass Candle (Included)', price: 0, icon: '🕯', isIncluded: true },
          { id: 'fill-watch', name: 'Customized Gold Watch (Included)', price: 0, icon: '⌚', isIncluded: true },
          { id: 'fill-perfume', name: 'Luxury Perfume (Included)', price: 0, icon: '🧴', isIncluded: true },
          { id: 'fill-chocolates', name: 'Deluxe Chocolate Box (Included)', price: 0, icon: '🍫', isIncluded: true }
        ];
      default:
        return [];
    }
  };

  // Custom Curation State
  const [boxSize, setBoxSize] = useState('Classic'); // Starter, Classic, Premium, Signature
  const [ribbonColor, setRibbonColor] = useState('Gold'); // Gold, Emerald, Navy
  const [selectedItems, setSelectedItems] = useState(() => getIncludedItems('Classic'));
  const [cardTemplate, setCardTemplate] = useState('Floral Clean'); // Floral, Gold Foil, Minimal
  const [cardText, setCardText] = useState('');
  const [recipientName, setRecipientName] = useState('');

  // Box details
  const boxDetails = {
    Starter: { name: 'Starter Gift Box', price: 10000, maxItems: 3 },
    Classic: { name: 'Classic Luxury Box', price: 25000, maxItems: 5 },
    Premium: { name: 'Premium Grandeur Box', price: 55000, maxItems: 8 },
    Signature: { name: 'Signature Executive Box', price: 120000, maxItems: 12 }
  };

  // Luxury items that can be added
  const fillerItems = [
    { id: 'fill-perfume', name: 'Luxury Perfume (50ml)', price: 15000, icon: '🧴' },
    { id: 'fill-candle', name: 'Scented Glass Candle', price: 6000, icon: '🕯' },
    { id: 'fill-journal', name: 'Gold-embossed Journal', price: 8500, icon: '📓' },
    { id: 'fill-chocolates', name: 'Deluxe Chocolate Box', price: 9000, icon: '🍫' },
    { id: 'fill-watch', name: 'Customized Gold Watch', price: 27000, icon: '⌚' },
    { id: 'fill-bracelet', name: 'Engraved Cuff Bracelet', price: 13000, icon: '📿' },
    { id: 'fill-keychain', name: 'Leather Keyholder', price: 5000, icon: '🔑' },
    { id: 'fill-card', name: 'Additional QR Greeting Card', price: 3000, icon: '✉' }
  ];


  // Dynamic Box Tier Resolver
  const availableBoxTiers = (atelierOptions?.boxSizes && atelierOptions.boxSizes.length > 0)
    ? atelierOptions.boxSizes
    : Object.keys(boxDetails).map(k => ({ id: k, name: boxDetails[k].name, price: boxDetails[k].price, maxItems: boxDetails[k].maxItems, available: true }));

  const activeBoxObj = availableBoxTiers.find(b => b.id === boxSize || b.name === boxSize) || availableBoxTiers[0] || { price: 25000, maxItems: 5 };
  const basePrice = activeBoxObj.price || 25000;
  const maxAllowedItems = activeBoxObj.maxItems || 5;

  const handleAddItem = (item) => {
    if (selectedItems.length >= maxAllowedItems) {
      showToast(`Maximum capacity reached for ${activeBoxObj.name || boxSize} (${maxAllowedItems} items limit). Upgrade box size to add more!`, 'error');
      return;
    }
    setSelectedItems(prev => [...prev, { ...item, isIncluded: false }]);
    showToast(`Added ${item.name} to box!`);
  };

  const handleRemoveItem = (index) => {
    const removedItem = selectedItems[index];
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
    showToast(`Removed ${removedItem.name}`);
  };

  const itemsPrice = selectedItems.filter(i => !i.isIncluded).reduce((sum, item) => sum + item.price, 0);
  const totalPrice = basePrice + itemsPrice;

  // Add custom curations to cart
  const handleAddToBag = () => {
    if (!recipientName.trim()) {
      showToast("Please enter a recipient name for personalization.", "error");
      return;
    }

    const customProduct = {
      id: `custom-box-${Date.now()}`,
      name: `Bespoke Curated Box (${activeBoxObj.name || boxSize})`,
      price: totalPrice,
      image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=400&q=80',
      category: 'TNE Gift Curation',
      description: `Bespoke custom box curated by client. Includes: ${selectedItems.map(i => i.name).join(', ')}.`
    };

    const customizations = {
      boxSize: activeBoxObj.name || boxSize,
      ribbonColor,
      cardTemplate,
      cardText,
      recipientName,
      itemsList: selectedItems.map(i => i.name),
      hasPersonalization: true
    };

    addToCart(customProduct, 1, customizations);
    showToast("Curated box successfully added to bag!");
    navigate('/checkout');
  };

  // Dynamic Helper to parse included items from box tier configuration
  const parseIncludedItems = (tierIdOrName) => {
    const tierObj = (atelierOptions?.boxSizes || []).find(b => b.id === tierIdOrName || b.name === tierIdOrName);
    if (tierObj && tierObj.includedItems && typeof tierObj.includedItems === 'string') {
      const list = tierObj.includedItems.split(',').map(s => s.trim()).filter(Boolean);
      return list.map((itemName, index) => ({
        id: `inc-${index}-${itemName.replace(/\s+/g, '-')}`,
        name: `${itemName} (Included)`,
        price: 0,
        icon: itemName.toLowerCase().includes('card') ? '✉' : itemName.toLowerCase().includes('candle') ? '🕯' : itemName.toLowerCase().includes('watch') ? '⌚' : itemName.toLowerCase().includes('perfume') ? '🧴' : itemName.toLowerCase().includes('chocolate') ? '🍫' : '🔑',
        isIncluded: true
      }));
    }
    return getIncludedItems(tierIdOrName);
  };

  const handleSelectBoxSize = (size) => {
    setBoxSize(size);
    setSelectedItems(parseIncludedItems(size));
  };

  // Ribbon Color Resolver with fallbacks and case-insensitive color mapping
  const availableRibbons = (atelierOptions?.ribbons && atelierOptions.ribbons.length > 0)
    ? atelierOptions.ribbons
    : [
        { id: 'Gold', name: 'Champagne Gold Satin', colorCode: '#D4AF37', available: true },
        { id: 'Emerald', name: 'Deep Emerald Green', colorCode: '#004B49', available: true },
        { id: 'Navy', name: 'Royal Navy Silk', colorCode: '#1E3A8A', available: true },
        { id: 'Ruby Red', name: 'Ruby Red Velvet', colorCode: '#991B1B', available: true }
      ];

  const activeRibbonObj = availableRibbons.find(r => 
    r.id === ribbonColor || 
    r.name === ribbonColor || 
    (r.id && r.id.toLowerCase() === (ribbonColor || '').toLowerCase()) ||
    (r.name && r.name.toLowerCase() === (ribbonColor || '').toLowerCase())
  ) || availableRibbons[0] || { colorCode: '#D4AF37' };

  const activeRibbonColor = activeRibbonObj.colorCode || (
    (ribbonColor || '').toLowerCase().includes('emerald') ? '#004B49' :
    (ribbonColor || '').toLowerCase().includes('navy') ? '#1E3A8A' :
    (ribbonColor || '').toLowerCase().includes('red') ? '#991B1B' :
    (ribbonColor || '').toLowerCase().includes('pink') ? '#ec4899' :
    '#D4AF37'
  );

  // Box Dimensions simulation scale - dynamically scales with max items capacity!
  const getBoxDimension = () => {
    const capacity = maxAllowedItems || 5;
    // Scale smoothly from 140px (for 3 items) up to 260px (for 15+ items)
    const calculatedPx = Math.min(260, Math.max(140, 125 + capacity * 11));
    return `${calculatedPx}px`;
  };

  const calculatedTotal = basePrice + selectedItems.filter(i => !i.isIncluded).reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Atelier Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(212,175,55,0.1)', color: 'var(--accent-gold-dark)', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.75rem' }}>
          <Sparkles size={16} /> Dynamic Custom Gifting Concierge
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>The Gifting Atelier</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>Curate a bespoke luxury gift box. Choose your box tier, ribbon wrap, luxury goodies, and personal wax-sealed greeting card.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.8fr', gap: '3rem', alignItems: 'start' }} className="atelier-grid">
        
        {/* Left Column: Live Visual Box Simulation & Curation Summary */}
        <div style={{
          backgroundColor: '#fff',
          border: '1.5px solid var(--border-color)',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          transition: 'var(--transition-smooth)'
        }} className="atelier-preview-panel">
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>Your Curated Gift Box</h3>
          
          {/* Live Box graphic simulation */}
          <div style={{
            width: getBoxDimension(),
            height: getBoxDimension(),
            margin: '0 auto 2rem',
            backgroundColor: '#F7F4EE',
            borderRadius: '12px',
            position: 'relative',
            border: '2.5px solid var(--accent-gold)',
            boxShadow: '0 12px 30px rgba(0,75,73,0.15), inset 0 0 15px rgba(212,175,55,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            {/* Live Dynamic Ribbon layout */}
            <div style={{ position: 'absolute', width: '28px', height: '100%', backgroundColor: activeRibbonColor, boxShadow: '0 0 8px rgba(0,0,0,0.15)', transition: 'background-color 0.4s ease' }}></div>
            <div style={{ position: 'absolute', height: '28px', width: '100%', backgroundColor: activeRibbonColor, boxShadow: '0 0 8px rgba(0,0,0,0.15)', transition: 'background-color 0.4s ease' }}></div>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              width: '48px',
              height: '48px',
              backgroundColor: 'var(--primary-green)',
              borderRadius: '8px',
              border: '2px solid var(--accent-gold)',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-gold)',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              letterSpacing: '1px'
            }}>TNE</div>

            {/* Scale Indicator tag */}
            <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'var(--primary-green)', fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--accent-gold)', color: '#fff', fontWeight: '600', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              {activeBoxObj.name || boxSize}
            </div>
          </div>

          {/* Specs List */}
          <div style={{ textAlign: 'left', marginBottom: '2rem', fontSize: '0.85rem' }}>
            <p className="atelier-summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span>Base Box Tier:</span>
              <strong style={{ color: 'var(--primary-green)' }}>{activeBoxObj.name || boxSize} (₦{basePrice.toLocaleString()})</strong>
            </p>
            <p className="atelier-summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span>Ribbon Finish:</span>
              <strong style={{ color: activeRibbonColor, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: activeRibbonColor, display: 'inline-block' }}></span>
                {activeRibbonObj.name || ribbonColor}
              </strong>
            </p>
            <p className="atelier-summary-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
              <span>Greeting Card Theme:</span>
              <strong>{cardTemplate}</strong>
            </p>
            
            <div style={{ marginTop: '1rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Items Added ({selectedItems.length}/{maxAllowedItems}):</span>
              {selectedItems.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>No fillers added yet.</p>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {selectedItems.map((item, idx) => (
                    <span key={idx} style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--background-ivory)', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)' }}>
                      <span>{item.icon}</span> {item.name}
                      {!item.isIncluded && (
                        <button onClick={() => handleRemoveItem(idx)} style={{ color: '#ef4444', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '0.25rem' }}>×</button>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Price */}
          <div className="atelier-summary-row" style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: '600' }}>Live Total:</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>₦{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        {/* Right Side: Step Setup Wizard */}
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2.5rem', boxShadow: 'var(--shadow-md)' }}>
          {/* Step Progress Dots */}
          <div style={{ display: 'flex', gap: '1rem', justifyItems: 'center', justifyContent: 'center', marginBottom: '2.5rem' }}>
            {[
              { num: 1, name: 'Box Style' },
              { num: 2, name: 'Add Fillers' },
              { num: 3, name: 'Card Note' },
              { num: 4, name: 'Finalize' }
            ].map(s => (
              <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: step === s.num ? 'var(--primary-green)' : step > s.num ? 'var(--accent-gold)' : 'var(--background-ivory)',
                  color: step === s.num || step > s.num ? '#fff' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}>
                  {step > s.num ? <Check size={16} /> : s.num}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: step === s.num ? '600' : '400', display: 'none' }} className="step-name-text">{s.name}</span>
              </div>
            ))}
          </div>

          {/* STEP 1: Choose Box Style */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>1. Choose Box Style & Ribbon</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Select the size scale and ribbon wrapping details for your curation.</p>
              
              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Select Curation Tier</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
                {availableBoxTiers.map((bTier) => {
                  const bName = bTier.name || bTier.id;
                  const active = boxSize === bTier.id || boxSize === bName;
                  const isAvailable = bTier.available !== false;
                  const tierMax = bTier.maxItems || 5;

                  return (
                    <div 
                      key={bTier.id || bName} 
                      onClick={() => {
                        if (!isAvailable) {
                          showToast(`${bName} is currently unavailable at the moment.`, 'error');
                          return;
                        }
                        handleSelectBoxSize(bTier.id || bName);
                      }}
                      style={{
                        padding: '1.25rem',
                        border: active ? '2px solid var(--accent-gold)' : '1.5px solid var(--border-color)',
                        backgroundColor: !isAvailable ? '#f9fafb' : active ? 'rgba(212,175,55,0.03)' : '#fff',
                        borderRadius: '8px',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        opacity: isAvailable ? 1 : 0.65,
                        position: 'relative'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{bName}</h4>
                          {!isAvailable && (
                            <span style={{ fontSize: '0.65rem', backgroundColor: '#c2410c', color: '#fff', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: '600' }}>
                              Unavailable at the moment
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fits up to {tierMax} premium products (core goodies included)</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '600', marginTop: '0.25rem' }}>
                          Included: {parseIncludedItems(bTier.id || bName).map(i => i.name.replace(' (Included)', '')).join(', ')}
                        </p>
                      </div>
                      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>₦{(bTier.price || 0).toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Ribbon Tie Wrapping</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {availableRibbons.map((rib) => {
                  const active = ribbonColor === rib.id || ribbonColor === rib.name;
                  const isAvail = rib.available !== false;
                  return (
                    <button
                      key={rib.id || rib.name}
                      onClick={() => {
                        if (!isAvail) {
                          showToast(`${rib.name} is currently unavailable at the moment.`, 'error');
                          return;
                        }
                        setRibbonColor(rib.name || rib.id);
                      }}
                      style={{
                        padding: '0.65rem',
                        border: active ? '2px solid var(--primary-green)' : '1px solid var(--border-color)',
                        backgroundColor: !isAvail ? '#f9fafb' : active ? 'var(--background-ivory)' : '#fff',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        opacity: isAvail ? 1 : 0.6,
                        cursor: isAvail ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: rib.colorCode || '#D4AF37', border: '1px solid #ccc' }}></span>
                      {rib.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Add Fillers */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>2. Add Products inside Box</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Add your favorite luxury goodies inside the box. Capacity limit for {activeBoxObj.name || boxSize}: <strong style={{ color: selectedItems.length >= maxAllowedItems ? '#c2410c' : 'var(--primary-green)' }}>{selectedItems.length}/{maxAllowedItems}</strong>.
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                maxHeight: '350px',
                overflowY: 'auto',
                paddingRight: '0.5rem'
              }} className="custom-scroll">
                {fillerItems.map((item) => {
                  const isFull = selectedItems.length >= maxAllowedItems;
                  return (
                    <div 
                      key={item.id}
                      style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '8px',
                        padding: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'var(--background-white)',
                        opacity: isFull ? 0.7 : 1
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '1.4rem', marginRight: '0.5rem' }}>{item.icon}</span>
                        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '600' }}>₦{item.price.toLocaleString()}</div>
                        </div>
                      </div>
                      <button 
                        disabled={isFull}
                        onClick={() => handleAddItem(item)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor: isFull ? '#e5e7eb' : 'var(--primary-green)',
                          color: isFull ? '#9ca3af' : '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1rem',
                          cursor: isFull ? 'not-allowed' : 'pointer'
                        }}
                        title={isFull ? `Capacity limit (${maxAllowedItems} items max) reached` : `Add ${item.name}`}
                      >
                        +
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Write Card Note */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>3. Personalized Gift Card</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Every surprise needs a heartfelt message. Choose a card background template and type your message.</p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Select Greeting Card Style</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                {((atelierOptions?.cards && atelierOptions.cards.length > 0) ? atelierOptions.cards : [
                  { id: 'Floral Clean', name: 'Floral Elegance', available: true },
                  { id: 'Gold Foil', name: 'Champagne Gold Foil', available: true },
                  { id: 'Minimal', name: 'Modern Minimalist', available: true }
                ]).map((c) => {
                  const active = cardTemplate === c.name || cardTemplate === c.id;
                  const isAvail = c.available !== false;
                  return (
                    <button
                      key={c.id || c.name}
                      onClick={() => {
                        if (!isAvail) {
                          showToast(`${c.name} template is currently unavailable at the moment.`, 'error');
                          return;
                        }
                        setCardTemplate(c.name || c.id);
                      }}
                      style={{
                        padding: '0.75rem 0.5rem',
                        border: active ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                        backgroundColor: !isAvail ? '#f9fafb' : active ? 'var(--background-ivory)' : '#fff',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        opacity: isAvail ? 1 : 0.6,
                        cursor: isAvail ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Message on Card</h4>
              <textarea
                placeholder="Write your beautiful message here..."
                rows={4}
                value={cardText}
                onChange={e => setCardText(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.9rem',
                  resize: 'none',
                  lineHeight: '1.5'
                }}
              />
            </div>
          )}

          {/* STEP 4: Finalize Curation */}
          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>4. Personalize Curation</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Add final details before packaging your surprise.</p>

              <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Recipient's Full Name</h4>
              <input
                type="text"
                placeholder="Who is this surprise for?"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '0.95rem',
                  marginBottom: '2rem'
                }}
              />

              <div style={{ padding: '1.25rem', backgroundColor: 'var(--background-ivory)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <p style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--primary-green)', marginBottom: '0.5rem' }}>Unboxing Preview Ready</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  A secure recipient tracking link and custom unboxing envelope will be created automatically once ordered.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            {step > 1 ? (
              <button 
                onClick={() => setStep(prev => prev - 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--text-muted)' }}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button 
                onClick={() => setStep(prev => prev + 1)}
                className="btn-primary"
              >
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleAddToBag}
                className="btn-gold"
              >
                Add Curation to Bag <Sparkles size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .atelier-preview-panel {
          position: sticky;
          top: 120px;
          align-self: start;
        }
        @media (max-width: 1024px) {
          .atelier-preview-panel {
            position: relative !important;
            top: 0 !important;
            margin-bottom: 2rem !important;
          }
          .atelier-grid {
            grid-template-columns: 1fr !important;
          }
          .step-name-text {
            display: inline !important;
          }
        }
      `}</style>
    </div>
  );
}
