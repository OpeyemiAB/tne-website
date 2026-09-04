import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Check, Sparkles, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, toggleWishlist, wishlist, addRecentView } = useGifting();
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  
  // Customization State
  const [engraveName, setEngraveName] = useState('');
  const [customPhoto, setCustomPhoto] = useState(null);
  const [customPhotoName, setCustomPhotoName] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Customer Reviews state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewUser, setReviewUser] = useState('');
  const [reviewsList, setReviewsList] = useState([]);

  useEffect(() => {
    const cleanParam = String(productId || '').trim().toLowerCase();
    const prod = products.find(p => {
      const pId = String(p.id || '').trim().toLowerCase();
      const pNameSlug = String(p.name || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return pId === cleanParam || pNameSlug === cleanParam || pId === `prod-${cleanParam}`;
    });

    if (prod) {
      setProduct(prod);
      setReviewsList(prod.reviews || []);
      addRecentView(prod);
      setActiveImageIndex(0);
    }
  }, [productId, products]);

  if (!product) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <AlertCircle size={48} color="var(--primary-green)" style={{ margin: '0 auto 1rem' }} />
        <h2>Product Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>The product you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="btn-primary" style={{ marginTop: '1.5rem' }}>Return to Shop</Link>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => String(item.id) === String(product.id));

  const DEFAULT_FALLBACK_IMG = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';

  // Sanitize and filter images list, ensuring all secondary gallery URLs are valid strings
  const sanitizedImages = (Array.isArray(product.images) && product.images.length > 0)
    ? product.images.filter(img => Boolean(img) && typeof img === 'string' && img.trim().length > 0)
    : [product.image].filter(Boolean);

  const productImages = sanitizedImages.length > 0 ? sanitizedImages : [DEFAULT_FALLBACK_IMG];
  const currentActiveImg = productImages[activeImageIndex] || productImages[0] || DEFAULT_FALLBACK_IMG;

  // File Upload Simulation
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomPhoto(file);
      setCustomPhotoName(file.name);
    }
  };

  const getCustomizationPayload = () => {
    if (!product.customizable) return null;
    return {
      engraveName: engraveName || null,
      customMessage: customMessage || null,
      photoName: customPhotoName || null,
      hasPersonalization: !!(engraveName || customMessage || customPhotoName)
    };
  };

  const handleAddToBag = () => {
    addToCart(product, quantity, getCustomizationPayload());
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, getCustomizationPayload());
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const number = "2348133231667";
    let message = `Hello TNE! I would like to order: ${product.name} (Qty: ${quantity}).`;
    if (product.customizable) {
      if (engraveName) message += `\nEngraving Name: ${engraveName}`;
      if (customMessage) message += `\nCustom Message: ${customMessage}`;
      if (customPhotoName) message += `\nPhoto attachment name: ${customPhotoName}`;
    }
    message += `\nPrice: ₦${(product.price * quantity).toLocaleString()}`;
    
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewComment.trim() || !reviewUser.trim()) return;
    const newRev = { rating: reviewRating, comment: reviewComment, user: reviewUser };
    setReviewsList(prev => [newRev, ...prev]);
    setReviewComment('');
    setReviewUser('');
  };  // Related products
  const relatedProducts = products.filter(p => p.category === product.category && String(p.id) !== String(product.id)).slice(0, 4);

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem', fontFamily: 'var(--font-sans)' }}>
      
      {/* Full-Screen Photo Zoom Modal */}
      {isZoomModalOpen && (
        <div 
          onClick={() => setIsZoomModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '900px', width: '100%', maxHeight: '90vh', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <img 
              src={currentActiveImg} 
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_FALLBACK_IMG;
              }}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
            />

            {/* Next / Previous Navigation Arrows */}
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev - 1 + productImages.length) % productImages.length);
                  }}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.88)',
                    color: 'var(--primary-green)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Previous picture"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev + 1) % productImages.length);
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    backgroundColor: 'rgba(255, 255, 255, 0.88)',
                    color: 'var(--primary-green)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '46px',
                    height: '46px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Next picture"
                >
                  <ChevronRight size={26} />
                </button>
              </>
            )}

            <button
              onClick={() => setIsZoomModalOpen(false)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                backgroundColor: '#fff',
                color: '#000',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            >
              ✕
            </button>
            <div style={{ color: '#fff', marginTop: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>
              {product.name} (Picture {activeImageIndex + 1} of {productImages.length})
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '4rem', marginBottom: '4rem' }} className="details-grid">
        
        {/* Left Column: Product Image & Gallery */}
        <div>
          <div style={{ position: 'relative', cursor: 'zoom-in' }} onClick={() => setIsZoomModalOpen(true)}>
            <img 
              src={currentActiveImg} 
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = DEFAULT_FALLBACK_IMG;
              }}
              style={{
                width: '100%',
                maxHeight: '520px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'var(--shadow-md)',
                transition: 'all 0.3s ease'
              }}
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                width: '45px',
                height: '45px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-md)',
                color: isWishlisted ? '#ef4444' : 'var(--primary-green)'
              }}
            >
              <Heart size={20} fill={isWishlisted ? '#ef4444' : 'none'} />
            </button>
          </div>

          {/* Interactive Photo Gallery Thumbnails */}
          {productImages.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }} className="custom-scroll">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  style={{
                    border: activeImageIndex === idx ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '2px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    opacity: activeImageIndex === idx ? 1 : 0.65,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    outline: 'none'
                  }}
                  title={`View Picture ${idx + 1}`}
                >
                  <img 
                    src={imgUrl} 
                    alt={`${product.name} thumbnail ${idx + 1}`} 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_FALLBACK_IMG;
                    }}
                    style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px' }} 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: details */}
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {product.category}
          </span>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginTop: '0.5rem', marginBottom: '0.5rem', color: 'var(--primary-green)' }}>
            {product.name}
          </h1>

          {/* Star Rating summary */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} fill="var(--accent-gold)" />
              ))}
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({reviewsList.length} customer reviews)</span>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>
            ₦{product.price.toLocaleString()}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Customization Options form block */}
          {product.customizable && (
            <div style={{
              backgroundColor: 'var(--background-ivory)',
              border: '1px dashed var(--accent-gold)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} /> Personalized Customizations
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Engraving Name/Initials</label>
                  <input 
                    type="text" 
                    placeholder="Enter initials or name (e.g., A.O)"
                    value={engraveName}
                    onChange={e => setEngraveName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Engraving Message / Date</label>
                  <input 
                    type="text" 
                    placeholder="Enter dates or custom texts (e.g., 05-08-2026)"
                    value={customMessage}
                    onChange={e => setCustomMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem' }}>Upload Brand Logo or Photo</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    style={{ fontSize: '0.8rem' }}
                  />
                  {customPhotoName && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--primary-green)', marginTop: '0.25rem' }}>✔ {customPhotoName}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Action triggers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            {/* Quantity Modifier */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', padding: '0.25rem 0.5rem' }}>
                <button onClick={() => setQuantity(prev => Math.max(1, prev - 1))} style={{ fontWeight: 'bold' }}>-</button>
                <span style={{ fontSize: '0.9rem', width: '30px', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(prev => prev + 1)} style={{ fontWeight: 'bold' }}>+</button>
              </div>
            </div>

            {product.inStock === false ? (
              <div style={{
                backgroundColor: '#fff7ed',
                border: '1.5px solid #fdba74',
                color: '#c2410c',
                padding: '1rem',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.9rem',
                textAlign: 'center',
                margin: '1.5rem 0'
              }}>
                ✖ This item is currently unavailable at the moment.
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="buy-buttons">
                  <button onClick={handleAddToBag} className="btn-secondary" style={{ justifyContent: 'center' }}>
                    Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="btn-primary" style={{ justifyContent: 'center' }}>
                    Buy Now
                  </button>
                </div>

                <button 
                  onClick={handleWhatsAppOrder}
                  style={{
                    backgroundColor: '#25D366',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.95rem'
                  }}
                >
                  Order via WhatsApp
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs description vs reviews */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('description')}
            style={{
              padding: '0.75rem 1.5rem',
              borderBottom: activeTab === 'description' ? '2.5px solid var(--primary-green)' : 'none',
              fontWeight: activeTab === 'description' ? '600' : '400',
              color: activeTab === 'description' ? 'var(--primary-green)' : 'var(--text-muted)'
            }}
          >
            Product Features
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.75rem 1.5rem',
              borderBottom: activeTab === 'reviews' ? '2.5px solid var(--primary-green)' : 'none',
              fontWeight: activeTab === 'reviews' ? '600' : '400',
              color: activeTab === 'reviews' ? 'var(--primary-green)' : 'var(--text-muted)'
            }}
          >
            Customer Reviews ({reviewsList.length})
          </button>
        </div>

        {activeTab === 'description' && (
          <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.25rem' }}>
              {product.features && product.features.map((feat, idx) => (
                <li key={idx} style={{ listStyleType: 'disc' }}>{feat}</li>
              ))}
              <li style={{ listStyleType: 'disc' }}>Gift wrapping option available at checkout</li>
            </ul>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }} className="reviews-grid">
              
              {/* Review input */}
              <div>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>Write a Review</h4>
                <form onSubmit={handleAddReview} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={reviewUser}
                    onChange={e => setReviewUser(e.target.value)}
                    required
                    style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                  />
                  <div>
                    <label htmlFor="review-rating-select" style={{ fontSize: '0.8rem', marginRight: '0.5rem' }}>Rating:</label>
                    <select 
                      id="review-rating-select"
                      value={reviewRating} 
                      onChange={e => setReviewRating(Number(e.target.value))}
                      style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                  <textarea 
                    placeholder="Describe your unboxing experience..." 
                    rows={3} 
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    required
                    style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', resize: 'none', outline: 'none' }}
                  />
                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Submit Review</button>
                </form>
              </div>

              {/* Reviews List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reviewsList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Be the first to review this product!</p>
                ) : (
                  reviewsList.map((rev, idx) => (
                    <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <strong style={{ fontSize: '0.9rem' }}>{rev.user}</strong>
                        <div style={{ display: 'flex', color: 'var(--accent-gold)' }}>
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={12} fill="var(--accent-gold)" />
                          ))}
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '2rem' }}>Related Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
            {relatedProducts.map(p => (
              <div key={p.id} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <Link to={`/product/${p.id}`} style={{ display: 'block', height: '200px', overflow: 'hidden' }}>
                  <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Link>
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: '600' }}><Link to={`/product/${p.id}`}>{p.name}</Link></h4>
                  <div style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                    ₦{p.price.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .details-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .buy-buttons {
            grid-template-columns: 1fr !important;
          }
          .reviews-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
}
