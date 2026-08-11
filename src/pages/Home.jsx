import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, Calendar, ArrowRight, ShieldCheck, Truck, Star, Sparkles, Heart } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function Home() {
  const { products, addToCart, toggleWishlist, wishlist } = useGifting();
  const navigate = useNavigate();

  // Gift Finder State
  const [finderRecipient, setFinderRecipient] = useState('');
  const [finderOccasion, setFinderOccasion] = useState('');
  const [finderBudget, setFinderBudget] = useState('');
  const [finderCustomize, setFinderCustomize] = useState('');

  const handleFinderSubmit = (e) => {
    e.preventDefault();
    let query = `/shop?`;
    if (finderRecipient) query += `recipient=${encodeURIComponent(finderRecipient)}&`;
    if (finderOccasion) query += `occasion=${encodeURIComponent(finderOccasion)}&`;
    if (finderBudget) query += `budget=${encodeURIComponent(finderBudget)}&`;
    if (finderCustomize) query += `customize=${encodeURIComponent(finderCustomize)}&`;
    navigate(query.slice(0, -1));
  };

  const bestSellers = products.slice(0, 5);

  const occasions = [
    { name: 'Birthday', icon: '🎂' },
    { name: 'Anniversary', icon: '💖' },
    { name: 'Graduation', icon: '🎓' },
    { name: 'Wedding', icon: '💍' },
    { name: 'Corporate', icon: '🏢' },
    { name: 'Mother\'s Day', icon: '👩' },
    { name: 'Father\'s Day', icon: '👨' },
    { name: 'Valentine\'s Day', icon: '💝' },
    { name: 'Baby Shower', icon: '👶' },
    { name: 'Christmas', icon: '🎄' },
    { name: 'New Year', icon: '🎆' }
  ];

  const categories = [
    {
      title: 'Etched by TNE',
      subtitle: 'Personalized & Engraved Gifts',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      link: '/shop?category=Etched by TNE'
    },
    {
      title: 'TNE Gift Curation',
      subtitle: 'Curated gift boxes for every occasion',
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      link: '/shop?category=TNE Gift Curation'
    },
    {
      title: 'TNE Collections',
      subtitle: 'Fashion & Accessories',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
      link: '/shop?category=TNE Collections'
    },
    {
      title: 'TNE Beauty',
      subtitle: 'Skincare & Beauty Essentials',
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80',
      link: '/shop?category=TNE Beauty'
    }
  ];

  const instagramPhotos = [
    'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=300&q=80'
  ];

  return (
    <div className="fade-in" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-dark)' }}>
      
      {/* 1. Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #fff 40%, var(--background-ivory) 100%)',
        padding: '5rem 0',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div className="hero-text-container">
            <span style={{
              fontSize: '0.8rem',
              fontWeight: '600',
              letterSpacing: '3px',
              color: 'var(--accent-gold)',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '1rem'
            }}>Welcome to TNE</span>
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.1,
              color: 'var(--primary-green)',
              marginBottom: '1.5rem',
              fontWeight: '400'
            }}>
              Every Gift <br />Tells a <span style={{ color: 'var(--accent-gold)', fontStyle: 'italic', fontWeight: 'bold' }}>Story.</span>
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-muted)',
              marginBottom: '2.5rem',
              maxWidth: '480px'
            }}>
              Luxury gifts, personalized with love. Fashion, beauty and lifestyle—made for you.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/shop" className="btn-primary">
                Shop Now <ArrowRight size={16} />
              </Link>
              <Link to="/atelier" className="btn-secondary" style={{ borderColor: 'var(--accent-gold)', color: 'var(--primary-green)' }}>
                Start Customizing <Sparkles size={16} style={{ color: 'var(--accent-gold)' }} />
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80" 
              alt="TNE Luxury Gift Box Showcase"
              width={600}
              height={480}
              fetchPriority="high"
              style={{
                width: '100%',
                maxHeight: '480px',
                objectFit: 'cover',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--accent-gold)',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
            {/* Elegant overlay card tag */}
            <div style={{
              position: 'absolute',
              bottom: '1.5rem',
              left: '1.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              padding: '1rem 1.5rem',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--accent-gold)',
              boxShadow: 'var(--shadow-md)',
              backdropFilter: 'blur(4px)'
            }}>
              <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', color: 'var(--accent-gold)' }}>Handcrafted surprise</p>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>Especially For You</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Row */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {categories.map((cat, idx) => (
              <div key={idx} className="luxury-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                  <img 
                    src={cat.image} 
                    alt={cat.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }} 
                    className="cat-img"
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)'
                  }}></div>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{cat.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{cat.subtitle}</p>
                  </div>
                  <Link to={cat.link} className="shop-now-link" style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--primary-green)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    Shop Now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Gift Finder Form Widget */}
      <section style={{
        backgroundColor: 'var(--background-white)',
        padding: '4rem 0',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '900px' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Find The Perfect Gift</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>Answer a few questions and we'll find the perfect gift for you.</p>
          
          <form onSubmit={handleFinderSubmit} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)) 60px',
            gap: '1rem',
            backgroundColor: 'var(--background-ivory)',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1.5px solid var(--border-color)',
            alignItems: 'center'
          }} className="finder-form">
            
            <label htmlFor="finder-recipient-select" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Recipient Selection</label>
            <select 
              id="finder-recipient-select"
              value={finderRecipient} 
              onChange={e => setFinderRecipient(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff', outline: 'none' }}
            >
              <option value="">Who is it for?</option>
              <option value="partner">For Partner</option>
              <option value="parents">For Parents</option>
              <option value="friends">For Friends</option>
              <option value="corporate">For Colleagues</option>
            </select>

            <label htmlFor="finder-occasion-select" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Occasion Selection</label>
            <select 
              id="finder-occasion-select"
              value={finderOccasion} 
              onChange={e => setFinderOccasion(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff', outline: 'none' }}
            >
              <option value="">Occasion?</option>
              <option value="Birthday">Birthday</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate Gifts">Corporate</option>
            </select>

            <label htmlFor="finder-budget-select" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Budget Range Selection</label>
            <select 
              id="finder-budget-select"
              value={finderBudget} 
              onChange={e => setFinderBudget(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff', outline: 'none' }}
            >
              <option value="">Your Budget?</option>
              <option value="15000">Under ₦15,000</option>
              <option value="30000">₦15,000 - ₦30,000</option>
              <option value="60000">₦30,000 - ₦60,000</option>
              <option value="100000">₦60,000+</option>
            </select>

            <label htmlFor="finder-customize-select" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>Customization Selection</label>
            <select 
              id="finder-customize-select"
              value={finderCustomize} 
              onChange={e => setFinderCustomize(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px', fontSize: '0.85rem', backgroundColor: '#fff', outline: 'none' }}
            >
              <option value="">Customize?</option>
              <option value="yes">Yes, Engrave Name</option>
              <option value="no">Standard Item</option>
            </select>

            <button type="submit" className="btn-primary" style={{
              height: '46px',
              width: '100%',
              borderRadius: '6px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--primary-green)'
            }} aria-label="Find gifts based on preferences">
              <Sparkles size={20} style={{ color: 'var(--accent-gold)' }} />
            </button>
          </form>
        </div>
      </section>

      {/* 4. Shop By Occasion */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Shop by Occasion</h2>
          
          <div style={{
            display: 'flex',
            gap: '1.5rem',
            overflowX: 'auto',
            paddingBottom: '1.5rem',
            scrollBehavior: 'smooth'
          }} className="custom-scroll">
            {occasions.map((occ, idx) => (
              <Link 
                key={idx} 
                to={`/shop?occasion=${encodeURIComponent(occ.name)}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '90px',
                  textAlign: 'center',
                  gap: '0.5rem'
                }}
                className="occasion-circle-link"
              >
                <div style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  border: '1.5px solid var(--border-color)',
                  backgroundColor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  boxShadow: 'var(--shadow-sm)',
                  transition: 'var(--transition-smooth)'
                }} className="occ-circle">
                  {occ.icon}
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: 'var(--text-dark)' }}>{occ.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Custom Box Build Callouts */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container promo-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Card 1: Atelier Box Builder */}
          <div style={{
            backgroundImage: 'linear-gradient(rgba(0,75,73,0.85), rgba(0,75,73,0.85)), url(https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px',
            border: '2px solid var(--accent-gold)'
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Build Your Own Gift Box</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', opacity: 0.9, fontSize: '0.9rem', marginBottom: '2rem' }}>
                <li>✔ Choose your box scale</li>
                <li>✔ Add your favourite luxury fillers</li>
                <li>✔ Add a personalized greeting card message</li>
                <li>✔ We deliver beautiful happiness</li>
              </ul>
            </div>
            <Link to="/atelier" className="btn-gold" style={{ alignSelf: 'flex-start' }}>
              Start Building <ArrowRight size={16} />
            </Link>
          </div>

          {/* Card 2: Engraving Custom items */}
          <div style={{
            backgroundImage: 'linear-gradient(rgba(30,41,59,0.85), rgba(30,41,59,0.85)), url(https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=500&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: '#fff',
            borderRadius: 'var(--radius-lg)',
            padding: '3rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '320px',
            border: '2px solid var(--border-color)'
          }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.2rem', color: '#fff', marginBottom: '1rem' }}>Personalized Just for You</h2>
              <p style={{ opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '400px' }}>
                Make it unique. Engrave bracelets, necklaces, watches, wallets, keyholders, and more with names, dates, initials, or custom logos.
              </p>
            </div>
            <Link to="/shop?category=Etched by TNE" className="btn-secondary" style={{ color: '#fff', borderColor: '#fff', alignSelf: 'flex-start' }}>
              Customize Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Best Sellers Grid */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--background-white)' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', textAlign: 'center', marginBottom: '3rem' }}>Best Sellers</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1.5rem' }}>
            {bestSellers.map((product) => {
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
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
                  </button>

                  <Link to={`/product/${product.id}`} style={{ display: 'block', height: '240px', overflow: 'hidden' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                      className="product-grid-img"
                    />
                  </Link>

                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-gold-dark)', fontWeight: '600', textTransform: 'uppercase' }}>
                        {product.category}
                      </span>
                      <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0.25rem 0', fontFamily: 'var(--font-sans)' }}>
                        <Link to={`/product/${product.id}`}>{product.name}</Link>
                      </h3>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                      <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--primary-green)' }}>
                        ₦{product.price.toLocaleString()}
                      </span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="btn-primary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '4px' }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Value Propositions (Emerald Green Row) */}
      <section style={{ backgroundColor: 'var(--primary-green)', color: '#fff', padding: '3.5rem 0', borderBottom: '4px solid var(--accent-gold)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          <div>
            <Gift size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Premium Quality</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Only the absolute best materials.</p>
          </div>
          <div>
            <Sparkles size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Personalized Gifts</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Bespoke engravings crafted for you.</p>
          </div>
          <div>
            <ShieldCheck size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Secure Checkout</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>100% verified, private ordering.</p>
          </div>
          <div>
            <Truck size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Fast Delivery</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Prompt deliveries right to your door.</p>
          </div>
          <div>
            <Star size={32} style={{ color: 'var(--accent-gold)', margin: '0 auto 1rem' }} />
            <h4 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Customer Love</h4>
            <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Rated 5 stars by our gift recipients.</p>
          </div>
        </div>
      </section>

      {/* 8. From Our Customers (Instagram Showcase) */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>From Our Customers</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '3rem' }}>
            Follow our story on Instagram <a href="https://instagram.com/thenifemiexperience" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold-dark)', fontWeight: '600' }}>@thenifemiexperience</a>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }} className="insta-grid">
            {instagramPhotos.map((photo, idx) => (
              <div key={idx} style={{ height: '220px', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                <img 
                  src={photo} 
                  alt="Customer Gift Showcase" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
                  className="insta-img"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        .nav-link {
          transition: var(--transition-smooth);
        }
        @media (hover: hover) {
          .luxury-card:hover .cat-img {
            transform: scale(1.05);
          }
          .luxury-card:hover .product-grid-img {
            transform: scale(1.04);
          }
          .occ-circle:hover {
            border-color: var(--accent-gold) !important;
            color: var(--accent-gold) !important;
            transform: translateY(-4px);
          }
          .insta-img:hover {
            transform: scale(1.06);
          }
          .shop-now-link:hover {
            color: var(--accent-gold) !important;
          }
        }
        .custom-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: var(--border-color);
          border-radius: 3px;
        }
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            text-align: center;
          }
          .hero-text-container div {
            justify-content: center;
          }
          .promo-grid {
            grid-template-columns: 1fr !important;
          }
          .insta-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 500px) {
          .finder-form {
            grid-template-columns: 1fr !important;
            padding: 1rem !important;
          }
          .insta-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
