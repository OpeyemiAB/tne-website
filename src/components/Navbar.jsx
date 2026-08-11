import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Heart, User, ShoppingBag, X, Menu, Trash2, ChevronDown } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function Navbar() {
  const { cart, wishlist, currentUser, updateCartQuantity, removeFromCart, handleLogout, isCartOpen, setIsCartOpen } = useGifting();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileCustomerCareOpen, setIsMobileCustomerCareOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [isCustomerCareDropdownOpen, setIsCustomerCareDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      {/* 1. Announcement Bar */}
      <div style={{
        backgroundColor: 'var(--primary-green)',
        color: 'var(--accent-gold)',
        fontSize: '0.75rem',
        padding: '0.5rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: '500',
        borderBottom: '1px solid var(--accent-gold)',
        letterSpacing: '1px'
      }}>
        <span className="announcement-left">Luxury Gifting • Personalization • Fashion • Beauty</span>
        <span className="announcement-right" style={{ color: '#fff' }}>Free Delivery on Orders Above ₦50,000</span>
      </div>

      {/* 2. Main Header Nav */}
      <header style={{
        backgroundColor: 'var(--background-white)',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        padding: '1rem 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          
          {/* Mobile Menu Icon */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="mobile-toggle"
            style={{ display: 'none', color: 'var(--primary-green)' }}
            aria-label="Open mobile navigation menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '1.8rem', 
              letterSpacing: '3px', 
              color: 'var(--primary-green)', 
              fontWeight: '700',
              margin: 0,
              lineHeight: 1
            }}>TNE</h1>
            <span style={{ 
              fontSize: '0.55rem', 
              letterSpacing: '1.5px', 
              textTransform: 'uppercase', 
              color: 'var(--primary-green)',
              fontWeight: '600',
              marginTop: '2px'
            }}>The Nifemi Experience</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Home</NavLink>
            
            {/* Shop Dropdown */}
            <div 
              style={{ position: 'relative' }} 
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <NavLink to="/shop" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Shop <ChevronDown size={14} />
              </NavLink>
              {isShopDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fff',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.75rem 0',
                  minWidth: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 100
                }}>
                  <Link to="/shop?category=Etched by TNE" className="dropdown-item">Etched by TNE</Link>
                  <Link to="/shop?category=TNE Gift Curation" className="dropdown-item">TNE Gift Curation</Link>
                  <Link to="/shop?category=TNE Collections" className="dropdown-item">TNE Collections (Fashion)</Link>
                  <Link to="/shop?category=TNE Beauty" className="dropdown-item">TNE Beauty</Link>
                </div>
              )}
            </div>
            
            {/* Customer Care Dropdown */}
            <div 
              style={{ position: 'relative' }} 
              onMouseEnter={() => setIsCustomerCareDropdownOpen(true)}
              onMouseLeave={() => setIsCustomerCareDropdownOpen(false)}
            >
              <span className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                Customer Care <ChevronDown size={14} />
              </span>
              {isCustomerCareDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: '#fff',
                  border: '1.5px solid var(--border-color)',
                  borderRadius: '6px',
                  boxShadow: 'var(--shadow-md)',
                  padding: '0.75rem 0',
                  minWidth: '220px',
                  display: 'flex',
                  flexDirection: 'column',
                  zIndex: 100
                }}>
                  <NavLink to="/faqs" className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}>FAQs</NavLink>
                  <NavLink to="/shipping" className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}>Shipping & Delivery</NavLink>
                  <NavLink to="/refunds" className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}>Returns & Refunds</NavLink>
                  <NavLink to="/track" className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}>Track Your Order</NavLink>
                  <NavLink to="/privacy" className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}>Privacy Policy</NavLink>
                  <NavLink to="/terms" className={({ isActive }) => isActive ? "dropdown-item active" : "dropdown-item"}>Terms & Conditions</NavLink>
                </div>
              )}
            </div>

            <NavLink to="/atelier" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"} style={{ fontWeight: '600' }}>Customize</NavLink>
            <NavLink to="/about" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>About Us</NavLink>
            <NavLink to="/contact" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Contact</NavLink>
          </nav>

          {/* Icons Grid */}
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', color: 'var(--primary-green)' }}>
            <button onClick={() => setIsSearchOpen(true)} className="icon-btn" title="Search" aria-label="Open search search bar">
              <Search size={20} />
            </button>
            
            <Link to="/dashboard?tab=wishlist" className="icon-btn" title="Wishlist" style={{ position: 'relative' }}>
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="badge">{wishlist.length}</span>
              )}
            </Link>

            <Link to={currentUser ? "/dashboard" : "/login"} className="icon-btn" title="Account">
              <User size={20} />
            </Link>

            <button onClick={() => setIsCartOpen(true)} className="icon-btn" title="Cart" style={{ position: 'relative' }} aria-label="Open shopping bag cart">
              <ShoppingBag size={20} />
              {totalCartItems > 0 && (
                <span className="badge">{totalCartItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. Search Overlay */}
      {isSearchOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(30, 41, 59, 0.15)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          paddingTop: '6rem'
        }} onClick={() => setIsSearchOpen(false)}>
          <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
            border: '1.5px solid var(--accent-gold)',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setIsSearchOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
              aria-label="Close search overlay"
            >
              <X size={20} />
            </button>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>Search TNE Store</h3>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text"
                placeholder="Search perfumes, watches, gift boxes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  outline: 'none',
                  fontSize: '0.95rem'
                }}
                autoFocus
              />
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Slide-out Cart Drawer */}
      {isCartOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 1001,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          {/* Drawer backdrop closer */}
          <div style={{ flex: 1 }} onClick={() => setIsCartOpen(false)}></div>
          
          {/* Content */}
          <div style={{
            width: '100%',
            maxWidth: '420px',
            backgroundColor: '#fff',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={20} /> Your Cart ({totalCartItems})
              </h3>
              <button onClick={() => setIsCartOpen(false)} style={{ color: 'var(--text-muted)' }} aria-label="Close cart drawer">
                <X size={24} />
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
                  <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <p>Your shopping cart is empty.</p>
                  <Link 
                    to="/shop" 
                    onClick={() => setIsCartOpen(false)}
                    style={{
                      display: 'inline-block',
                      marginTop: '1rem',
                      color: 'var(--accent-gold)',
                      fontWeight: '600'
                    }}
                  >
                    Shop Curated Collections
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.cartId} style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingBottom: '1rem',
                    borderBottom: '1px solid #f1f5f9',
                    position: 'relative'
                  }}>
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ flex: 1, paddingRight: '2rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-green)' }}>{item.product.name}</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', fontWeight: '600', margin: '0.2rem 0' }}>
                        ₦{item.product.price.toLocaleString()}
                      </p>

                      {/* Customization Details */}
                      {item.customizations && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.2rem 0', padding: '0.25rem', backgroundColor: 'var(--background-ivory)', borderRadius: '4px' }}>
                          {item.customizations.boxSize && <div>Box Size: {item.customizations.boxSize}</div>}
                          {item.customizations.ribbonColor && <div>Ribbon: {item.customizations.ribbonColor}</div>}
                          {item.customizations.cardText && <div>Note: "{item.customizations.cardText}"</div>}
                          {item.customizations.engraveName && <div>Engrave: {item.customizations.engraveName}</div>}
                        </div>
                      )}

                      {/* Quantity Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button 
                          onClick={() => updateCartQuantity(item.cartId, -1)}
                          style={{ border: '1px solid var(--border-color)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '0.85rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.cartId, 1)}
                          style={{ border: '1px solid var(--border-color)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Delete Item */}
                    <button 
                      onClick={() => removeFromCart(item.cartId)}
                      style={{ color: '#ef4444', position: 'absolute', top: 0, right: 0 }}
                      title="Remove Item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Subtotal & Checkout */}
            {cart.length > 0 && (
              <div style={{
                padding: '1.5rem',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--background-ivory)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontWeight: '600' }}>
                  <span>Subtotal:</span>
                  <span style={{ color: 'var(--primary-green)', fontSize: '1.1rem' }}>₦{cartSubtotal.toLocaleString()}</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Shipping & delivery fees calculated at checkout.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="btn-primary" 
                    style={{ justifyContent: 'center', width: '100%' }}
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="btn-secondary" 
                    style={{ justifyContent: 'center', width: '100%' }}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Slide-out Mobile Menu */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 1002,
          display: 'flex'
        }}>
          <div style={{
            width: '280px',
            backgroundColor: '#fff',
            height: '100%',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 'bold' }}>TNE Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', fontSize: '1.05rem', fontWeight: '500' }}>
              <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"}>Home</NavLink>
              <NavLink to="/shop" end onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"}>Shop All</NavLink>
              <NavLink to="/atelier" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"}>Build a Gift Box</NavLink>
              
              {/* Collapsible Customer Care sub-list */}
              <div>
                <button 
                  onClick={() => setIsMobileCustomerCareOpen(!isMobileCustomerCareOpen)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    width: '100%', 
                    color: 'var(--text-dark)', 
                    fontWeight: '500', 
                    fontSize: '1.05rem', 
                    padding: '0.25rem 0',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <span>Customer Care</span>
                  <ChevronDown size={16} style={{ transform: isMobileCustomerCareOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s', color: 'var(--text-muted)' }} />
                </button>
                {isMobileCustomerCareOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1rem', marginTop: '0.75rem', borderLeft: '1.5px solid var(--accent-gold)' }}>
                    <NavLink to="/faqs" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"} style={{ fontSize: '0.95rem' }}>FAQs</NavLink>
                    <NavLink to="/shipping" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"} style={{ fontSize: '0.95rem' }}>Shipping & Delivery</NavLink>
                    <NavLink to="/refunds" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"} style={{ fontSize: '0.95rem' }}>Returns & Refunds</NavLink>
                    <NavLink to="/track" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"} style={{ fontSize: '0.95rem' }}>Track Your Order</NavLink>
                    <NavLink to="/privacy" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"} style={{ fontSize: '0.95rem' }}>Privacy Policy</NavLink>
                    <NavLink to="/terms" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"} style={{ fontSize: '0.95rem' }}>Terms & Conditions</NavLink>
                  </div>
                )}
              </div>

              <NavLink to="/about" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"}>About Us</NavLink>
              <NavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => isActive ? "mobile-nav-item active" : "mobile-nav-item"}>Contact</NavLink>
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsMobileMenuOpen(false)}></div>
        </div>
      )}

      {/* Styled JSX fallback styles */}
      <style>{`
         .nav-link {
          font-size: 0.95rem;
          color: var(--text-dark);
          font-weight: 500;
          padding: 0.4rem 0;
          position: relative;
          transition: color 0.25s ease;
        }
        .nav-link:hover {
          color: var(--accent-gold) !important;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--accent-gold);
          transform: scaleX(0);
          transform-origin: right;
          transition: transform 0.3s ease;
        }
        .nav-link:hover::after,
        .nav-link.active::after {
          transform: scaleX(1);
          transform-origin: left;
        }
        .nav-link.active {
          color: var(--accent-gold) !important;
          font-weight: 600;
        }
        .dropdown-item {
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
          color: var(--text-dark);
          transition: var(--transition-smooth);
        }
        .dropdown-item:hover,
        .dropdown-item.active {
          background-color: var(--background-ivory);
          color: var(--primary-green);
          padding-left: 1.75rem;
          font-weight: 500;
        }
        .icon-btn {
          position: relative;
          color: var(--primary-green);
          display: flex;
          align-items: center;
          justifyContent: center;
          transition: var(--transition-smooth);
        }
        .icon-btn:hover {
          color: var(--accent-gold);
          transform: scale(1.05);
        }
        .badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: var(--accent-gold);
          color: var(--primary-green-dark);
          font-size: 0.65rem;
          font-weight: bold;
          padding: 0.1rem 0.35rem;
          border-radius: 10px;
          border: 1px solid #fff;
        }
        .mobile-nav-item {
          color: var(--text-dark);
          text-decoration: none;
          padding: 0.25rem 0;
          transition: color 0.2s ease;
        }
        .mobile-nav-item.active {
          color: var(--primary-green) !important;
          font-weight: 600;
          border-bottom: 2px solid var(--primary-green);
          align-self: flex-start;
          padding-bottom: 2px;
        }
        @media (max-width: 1024px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
          .announcement-left {
            display: none !important;
          }
          .announcement-bar {
            justify-content: center !important;
          }
        }
      `}</style>
    </>
  );
}
