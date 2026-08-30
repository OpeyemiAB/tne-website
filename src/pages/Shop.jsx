import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Filter, Search, Heart, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function Shop() {
  const { products, toggleWishlist, wishlist, addToCart } = useGifting();
  const location = useLocation();

  // URL search query parsers
  const getParam = (name) => {
    const params = new URLSearchParams(location.search);
    return params.get(name) || '';
  };

  const [activeCategory, setActiveCategory] = useState(getParam('category'));
  const [activeOccasion, setActiveOccasion] = useState(getParam('occasion'));
  const [searchFilter, setSearchFilter] = useState(getParam('search'));
  const [sortBy, setSortBy] = useState('popular');
  const [priceRange, setPriceRange] = useState('all');

  useEffect(() => {
    setActiveCategory(getParam('category'));
    setActiveOccasion(getParam('occasion'));
    setSearchFilter(getParam('search'));
  }, [location.search]);

  // Categories & Occasions options
  const categories = ['Etched by TNE', 'TNE Gift Curation', 'TNE Collections', 'TNE Beauty'];
  
  const occasions = [
    'Birthday', 'Anniversary', 'Graduation', 'Wedding', 'Corporate Gifts',
    'Mother\'s Day', 'Father\'s Day', 'Valentine\'s Day', 'Baby Shower',
    'Christmas', 'New Year'
  ];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    // 1. Category Filter
    if (activeCategory && product.category !== activeCategory) return false;
    
    // 2. Occasion Filter (Simulation matching: custom boxes/curations fit occasions, while others are general unless tagged)
    if (activeOccasion) {
      if (product.category === 'TNE Collections' || product.category === 'TNE Beauty') {
        // general items don't restrict occasion, but let's allow them
      } else {
        // simulated check: some products are birthday/anniversary focused
        if (activeOccasion === 'Corporate Gifts' && product.name.includes('Watch')) return true;
        if (activeOccasion === 'Birthday' && product.name.includes('Cake')) return true;
      }
    }

    // 3. Search Filter
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // 4. Price range Filter
    if (priceRange !== 'all') {
      const price = product.price;
      if (priceRange === 'under-15') return price < 15000;
      if (priceRange === '15-30') return price >= 15000 && price <= 30000;
      if (priceRange === '30-60') return price >= 30000 && price <= 60000;
      if (priceRange === 'above-60') return price > 60000;
    }

    return true;
  });

  // Sorting logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'low-to-high') return a.price - b.price;
    if (sortBy === 'high-to-low') return b.price - a.price;
    return 0; // default popular sorting
  });

  const clearFilters = () => {
    setActiveCategory('');
    setActiveOccasion('');
    setSearchFilter('');
    setPriceRange('all');
  };

  return (
    <div className="container fade-in shop-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem', fontFamily: 'var(--font-sans)', width: '100%', boxSizing: 'border-box' }}>
      
      {/* 1. Sidebar Filters */}
      <aside style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', alignSelf: 'start' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SlidersHorizontal size={18} /> Filters
          </h3>
          {(activeCategory || activeOccasion || searchFilter || priceRange !== 'all') && (
            <button onClick={clearFilters} style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: '500' }}>
              Clear All
            </button>
          )}
        </div>

        {/* Active Filters Display */}
        {(activeCategory || activeOccasion || searchFilter || priceRange !== 'all') && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
            {activeCategory && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--background-ivory)', border: '1.5px solid var(--accent-gold)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--primary-green)' }}>
                Category: {activeCategory.replace('TNE ', '')}
                <button onClick={() => setActiveCategory('')} style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: '0.2rem', fontSize: '0.85rem' }}>×</button>
              </span>
            )}
            {activeOccasion && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--background-ivory)', border: '1px solid var(--accent-gold)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--primary-green)' }}>
                Occasion: {activeOccasion}
                <button onClick={() => setActiveOccasion('')} style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: '0.2rem', fontSize: '0.85rem' }}>×</button>
              </span>
            )}
            {priceRange !== 'all' && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--background-ivory)', border: '1px solid var(--accent-gold)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--primary-green)' }}>
                Budget: {priceRange === 'under-15' ? 'Under ₦15k' : priceRange === '15-30' ? '₦15k-30k' : priceRange === '30-60' ? '₦30k-60k' : '₦60k+'}
                <button onClick={() => setPriceRange('all')} style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: '0.2rem', fontSize: '0.85rem' }}>×</button>
              </span>
            )}
            {searchFilter && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', backgroundColor: 'var(--background-ivory)', border: '1px solid var(--accent-gold)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--primary-green)' }}>
                Search: "{searchFilter}"
                <button onClick={() => setSearchFilter('')} style={{ color: '#ef4444', fontWeight: 'bold', marginLeft: '0.2rem', fontSize: '0.85rem' }}>×</button>
              </span>
            )}
          </div>
        )}

        {/* Category section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categories</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <button 
              onClick={() => setActiveCategory('')} 
              style={{ textAlign: 'left', color: !activeCategory ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: !activeCategory ? '600' : '400' }}
            >
              All Categories
            </button>
            {categories.map((cat, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveCategory(cat)} 
                style={{ textAlign: 'left', color: activeCategory === cat ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: activeCategory === cat ? '600' : '400' }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion Section */}
        <div style={{ marginBottom: '2rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Occasions</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scroll">
            <button 
              onClick={() => setActiveOccasion('')} 
              style={{ textAlign: 'left', color: !activeOccasion ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: !activeOccasion ? '600' : '400' }}
            >
              All Occasions
            </button>
            {occasions.map((occ, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveOccasion(occ)} 
                style={{ textAlign: 'left', color: activeOccasion === occ ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: activeOccasion === occ ? '600' : '400' }}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Section */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Budget</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            {[
              { label: 'All Budgets', value: 'all' },
              { label: 'Under ₦15,000', value: 'under-15' },
              { label: '₦15,000 - ₦30,000', value: '15-30' },
              { label: '₦30,000 - ₦60,000', value: '30-60' },
              { label: 'Above ₦60,000', value: 'above-60' }
            ].map((opt, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: priceRange === opt.value ? 'var(--text-dark)' : 'var(--text-muted)' }}>
                <input 
                  type="radio" 
                  name="priceRange" 
                  checked={priceRange === opt.value} 
                  onChange={() => setPriceRange(opt.value)}
                  style={{ accentColor: 'var(--primary-green)' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* 2. Products List Area */}
      <main>
        {/* Mobile Filter Category Pills */}
        <div className="mobile-categories" style={{ display: 'none', overflowX: 'auto', gap: '0.35rem', paddingBottom: '0.5rem', marginBottom: '0.75rem', WebkitOverflowScrolling: 'touch', width: '100%', flexWrap: 'nowrap' }}>
          <button 
            onClick={() => setActiveCategory('')} 
            style={{ 
              padding: '0.4rem 0.65rem', 
              borderRadius: '20px', 
              border: !activeCategory ? '1.5px solid var(--primary-green)' : '1px solid var(--border-color)', 
              backgroundColor: !activeCategory ? 'var(--primary-green)' : '#fff', 
              color: !activeCategory ? '#fff' : 'var(--text-dark)', 
              fontSize: '0.75rem', 
              fontWeight: '500', 
              whiteSpace: 'nowrap',
              flexShrink: 0,
              cursor: 'pointer'
            }}
          >
            All
          </button>
          {categories.map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => setActiveCategory(cat)} 
              style={{ 
                padding: '0.4rem 0.65rem', 
                borderRadius: '20px', 
                border: activeCategory === cat ? '1.5px solid var(--primary-green)' : '1px solid var(--border-color)', 
                backgroundColor: activeCategory === cat ? 'var(--primary-green)' : '#fff', 
                color: activeCategory === cat ? '#fff' : 'var(--text-dark)', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                whiteSpace: 'nowrap',
                flexShrink: 0,
                cursor: 'pointer'
              }}
            >
              {cat.replace('TNE ', '')}
            </button>
          ))}
        </div>

        {/* Mobile Dropdowns (Occasion & Budget) */}
        <div className="mobile-selects" style={{ display: 'none', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          <select 
            value={activeOccasion} 
            onChange={e => setActiveOccasion(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', color: 'var(--text-dark)' }}
          >
            <option value="">All Occasions</option>
            {occasions.map((occ, idx) => (
              <option key={idx} value={occ}>{occ}</option>
            ))}
          </select>
          <select 
            value={priceRange} 
            onChange={e => setPriceRange(e.target.value)}
            style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', outline: 'none', backgroundColor: '#fff', color: 'var(--text-dark)' }}
          >
            <option value="all">All Budgets</option>
            <option value="under-15">Under ₦15k</option>
            <option value="15-30">₦15k - ₦30k</option>
            <option value="30-60">₦30k - ₦60k</option>
            <option value="above-60">₦60k+</option>
          </select>
          {(activeCategory || activeOccasion || priceRange !== 'all' || searchFilter) && (
            <button 
              onClick={clearFilters} 
              style={{ 
                gridColumn: 'span 2', 
                padding: '0.5rem', 
                border: '1px solid #ef4444', 
                borderRadius: '6px', 
                color: '#ef4444', 
                backgroundColor: 'rgba(239, 68, 68, 0.05)', 
                fontSize: '0.75rem', 
                fontWeight: '600', 
                cursor: 'pointer', 
                textAlign: 'center',
                marginTop: '0.25rem'
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
        {/* Top Control Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          backgroundColor: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)'
        }} className="shop-controls">
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{sortedProducts.length}</strong> products
          </span>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '0.4rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
            >
              <option value="popular">Popularity</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Cards Grid */}
        {sortedProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Filter size={48} style={{ margin: '0 auto 1rem', opacity: 0.3, color: 'var(--primary-green)' }} />
            <h3>No Products Found</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Try clearing filters or search queries.</p>
            <button onClick={clearFilters} className="btn-primary" style={{ marginTop: '1.5rem' }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', width: '100%', boxSizing: 'border-box' }}>
            {sortedProducts.map((product) => {
              const isWishlisted = wishlist.some(item => item.id === product.id);
              return (
                <div key={product.id} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', position: 'relative' }}>
                  
                  {/* Heart Icon toggle */}
                  <button 
                    onClick={() => toggleWishlist(product)}
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      backgroundColor: 'rgba(255,255,255,0.85)',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10,
                      color: isWishlisted ? '#ef4444' : 'var(--primary-green)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
                  </button>

                  {/* Stock availability badge */}
                  {product.inStock === false && (
                    <span style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      backgroundColor: '#c2410c',
                      color: '#fff',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      zIndex: 10,
                      boxShadow: 'var(--shadow-sm)',
                      letterSpacing: '0.5px'
                    }}>
                      Unavailable at the moment
                    </span>
                  )}

                  <Link to={`/product/${product.id}`} style={{ display: 'block', height: '240px', overflow: 'hidden', opacity: product.inStock === false ? 0.75 : 1, position: 'relative' }}>
                    <img 
                      src={product.image || (product.images && product.images[0]) || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'} 
                      alt={product.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                      className="product-grid-img"
                    />
                    {product.images && product.images.length > 1 && (
                      <span style={{
                        position: 'absolute',
                        bottom: '0.6rem',
                        right: '0.6rem',
                        backgroundColor: 'rgba(0,0,0,0.65)',
                        color: '#fff',
                        fontSize: '0.65rem',
                        fontWeight: '600',
                        padding: '0.2rem 0.45rem',
                        borderRadius: '4px',
                        backdropFilter: 'blur(4px)',
                        letterSpacing: '0.3px'
                      }}>
                        📷 {product.images.length} Photos
                      </span>
                    )}
                  </Link>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', fontWeight: '600', textTransform: 'uppercase' }}>
                        {product.category}
                      </span>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0.25rem 0', fontFamily: 'var(--font-sans)' }}>
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.4rem', margin: '0.5rem 0' }}>
                        {product.description}
                      </p>
                    </div>

                    <div className="product-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary-green)' }}>
                        ₦{product.price.toLocaleString()}
                      </span>
                      {product.inStock === false ? (
                        <button 
                          disabled
                          style={{
                            padding: '0.4rem 0.6rem',
                            fontSize: '0.75rem',
                            borderRadius: '4px',
                            backgroundColor: '#f3f4f6',
                            color: '#9ca3af',
                            border: '1px solid #e5e7eb',
                            cursor: 'not-allowed',
                            fontWeight: '600'
                          }}
                        >
                          Unavailable
                        </button>
                      ) : (
                        <button 
                          onClick={() => addToCart(product)}
                          className="btn-primary" 
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        .mobile-categories, .mobile-selects {
          display: none !important;
        }
        @media (max-width: 1024px) {
          aside {
            display: none !important;
          }
          .mobile-categories {
            display: flex !important;
          }
          .mobile-selects {
            display: grid !important;
          }
          .shop-grid {
            grid-template-columns: 1fr !important;
            padding: 1.5rem 1rem !important;
          }
          .shop-controls {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
