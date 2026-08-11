import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ClipboardList, MapPin, Calendar, LogOut, CheckCircle, Trash2, Edit, X, Check } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function CustomerDashboard() {
  const { currentUser, wishlist, orders, toggleWishlist, addToCart, handleLogout, showToast } = useGifting();
  const [activeTab, setActiveTab] = useState('orders');

  // Address book state loaded from user profile or local storage
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem(`tne_addresses_${currentUser?.email}`);
    if (saved) return JSON.parse(saved);
    if (currentUser?.address) {
      return [{ id: 1, name: 'Primary Address', details: currentUser.address }];
    }
    return [];
  });
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');

  // Reminders state loaded cleanly per user with zero hardcoded mock data
  const [reminders, setReminders] = useState(() => {
    const key = currentUser ? `tne_reminders_${currentUser.email}` : 'tne_reminders_guest';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });
  const [newEvent, setNewEvent] = useState('');
  const [newDate, setNewDate] = useState('');
  
  // Editing reminders state
  const [editingReminderId, setEditingReminderId] = useState(null);
  const [editEventText, setEditEventText] = useState('');
  const [editDateText, setEditDateText] = useState('');
  
  // Editing addresses state
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [editAddressNameText, setEditAddressNameText] = useState('');
  const [editAddressDetailsText, setEditAddressDetailsText] = useState('');
  const dateInputRef = useRef(null);

  const saveRemindersToStorage = (newReminders) => {
    const key = currentUser ? `tne_reminders_${currentUser.email}` : 'tne_reminders_guest';
    localStorage.setItem(key, JSON.stringify(newReminders));
    setReminders(newReminders);
  };

  const handleDateChange = (e) => {
    const rawVal = e.target.value;
    if (!rawVal) return;
    const parts = rawVal.split('-');
    if (parts.length === 3) {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const year = parts[0];
      const month = months[parseInt(parts[1], 10) - 1];
      const day = parseInt(parts[2], 10);
      setNewDate(`${month} ${day}, ${year}`);
    } else {
      setNewDate(rawVal);
    }
  };

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>Please log in to view your profile settings.</p>
        <Link to="/login" className="btn-primary" style={{ marginTop: '1.5rem' }}>Login to Profile</Link>
      </div>
    );
  }

  // Filter orders matching customer
  const customerOrders = orders.filter(o => o.customerEmail === currentUser.email);

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddrName.trim() || !newAddrDetails.trim()) return;
    const newAddr = { id: Date.now(), name: newAddrName, details: newAddrDetails };
    const updated = [...addresses, newAddr];
    setAddresses(updated);
    localStorage.setItem(`tne_addresses_${currentUser.email}`, JSON.stringify(updated));
    setNewAddrName('');
    setNewAddrDetails('');
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id);
    setAddresses(updated);
    localStorage.setItem(`tne_addresses_${currentUser.email}`, JSON.stringify(updated));
  };

  const handleStartEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setEditAddressNameText(addr.name);
    setEditAddressDetailsText(addr.details);
  };

  const handleSaveEditAddress = (id) => {
    if (!editAddressNameText.trim() || !editAddressDetailsText.trim()) return;
    const updated = addresses.map(a => a.id === id ? { ...a, name: editAddressNameText, details: editAddressDetailsText } : a);
    setAddresses(updated);
    localStorage.setItem(`tne_addresses_${currentUser.email}`, JSON.stringify(updated));
    setEditingAddressId(null);
  };

  const handleMoveToCart = (product) => {
    addToCart(product);
    toggleWishlist(product);
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newEvent.trim() || !newDate.trim()) return;
    setReminders(prev => [...prev, { id: Date.now(), event: newEvent, date: newDate }]);
    setNewEvent('');
    setNewDate('');
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleStartEdit = (rem) => {
    setEditingReminderId(rem.id);
    setEditEventText(rem.event);
    setEditDateText(rem.date);
  };

  const handleSaveEdit = (id) => {
    if (!editEventText.trim() || !editDateText.trim()) return;
    setReminders(prev => prev.map(r => r.id === id ? { ...r, event: editEventText, date: editDateText } : r));
    setEditingReminderId(null);
  };

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Profile Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--accent-gold)', paddingBottom: '1.5rem' }} className="profile-header-row">
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)' }}>Hello, {currentUser.name}</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Logged in as {currentUser.email}</span>
        </div>
        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#ef4444' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '3rem' }} className="profile-grid">
        
        {/* Navigation Sidebar */}
        <aside style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', alignSelf: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>
            <button 
              onClick={() => setActiveTab('orders')}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTab === 'orders' ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: activeTab === 'orders' ? '600' : '400' }}
            >
              <ClipboardList size={16} /> Order History
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTab === 'wishlist' ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: activeTab === 'wishlist' ? '600' : '400' }}
            >
              <Heart size={16} /> Saved Wishlist
            </button>
            <button 
              onClick={() => setActiveTab('addresses')}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTab === 'addresses' ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: activeTab === 'addresses' ? '600' : '400' }}
            >
              <MapPin size={16} /> Address Book
            </button>
            <button 
              onClick={() => setActiveTab('reminders')}
              style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem', color: activeTab === 'reminders' ? 'var(--primary-green)' : 'var(--text-muted)', fontWeight: activeTab === 'reminders' ? '600' : '400' }}
            >
              <Calendar size={16} /> Gift Reminders
            </button>
          </div>
        </aside>

        {/* Contents */}
        <main>
          
          {/* TAB 1: Order History */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>Your Orders</h3>
              
              {customerOrders.length === 0 ? (
                <div style={{ padding: '3rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center' }}>
                  <ClipboardList size={36} style={{ color: 'var(--primary-green)', opacity: 0.3, margin: '0 auto 0.75rem' }} />
                  <p style={{ color: 'var(--text-muted)' }}>You haven't placed any surprise orders yet.</p>
                  <Link to="/shop" className="btn-primary" style={{ marginTop: '1rem' }}>Browse Gifts</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {customerOrders.map((ord) => (
                    <div key={ord.id} style={{ backgroundColor: '#fff', border: '1.5px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                        <div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Order ID:</span>
                          <div style={{ fontWeight: 'bold' }}>#{ord.id}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status:</span>
                          <div style={{ color: 'var(--accent-gold)', fontWeight: '600' }}>{ord.status}</div>
                        </div>
                      </div>
                      
                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        {ord.items.map((item, idx) => (
                          <div key={idx}>
                            <strong>{item.name}</strong> x{item.quantity} - ₦{(item.price * item.quantity).toLocaleString()}
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                        <Link to={`/track?id=${ord.id}`} style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', fontWeight: '600' }}>
                          Track Delivery ➔
                        </Link>
                        <span style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--primary-green)' }}>
                          Total: ₦{ord.totalCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>Saved Wishlist</h3>
              
              {wishlist.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Your saved wishlist is empty.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                  {wishlist.map(p => (
                    <div key={p.id} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                      <img src={p.image} alt={p.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '600' }}>{p.name}</h4>
                          <span style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '0.9rem', display: 'block', marginTop: '0.25rem' }}>
                            ₦{p.price.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                          <button 
                            onClick={() => handleMoveToCart(p)}
                            className="btn-primary" 
                            style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', borderRadius: '4px', justifyContent: 'center' }}
                          >
                            Add
                          </button>
                          <button 
                            onClick={() => toggleWishlist(p)}
                            style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', color: '#ef4444' }}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Address Book */}
          {activeTab === 'addresses' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>Address Book</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {addresses.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>No saved addresses found. Please register your shipping address below.</p>
                ) : (
                  addresses.map(addr => {
                    const isEditing = editingAddressId === addr.id;
                    return (
                      <div key={addr.id} style={{ padding: '1rem', border: '1.5px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#fff', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, marginRight: '1rem' }}>
                            <input 
                              type="text" 
                              value={editAddressNameText} 
                              onChange={e => setEditAddressNameText(e.target.value)} 
                              style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}
                            />
                            <input 
                              type="text" 
                              value={editAddressDetailsText} 
                              onChange={e => setEditAddressDetailsText(e.target.value)} 
                              style={{ padding: '0.4rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.85rem' }}
                            />
                          </div>
                        ) : (
                          <div>
                            <h5 style={{ fontWeight: '600', color: 'var(--primary-green)', fontSize: '0.95rem' }}>{addr.name}</h5>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{addr.details}</p>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                          {isEditing ? (
                            <>
                              <button onClick={() => handleSaveEditAddress(addr.id)} style={{ border: 'none', background: 'none', color: 'var(--primary-green)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Save</button>
                              <button onClick={() => setEditingAddressId(null)} style={{ border: 'none', background: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleStartEditAddress(addr)} style={{ border: 'none', background: 'none', color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Edit</button>
                              <button onClick={() => handleDeleteAddress(addr.id)} style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>Delete</button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>Add New Address</h4>
              <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxWidth: '400px' }}>
                <input 
                  type="text" 
                  placeholder="Address Title (e.g. Work)" 
                  value={newAddrName} 
                  onChange={e => setNewAddrName(e.target.value)}
                  required
                  style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
                />
                <input 
                  type="text" 
                  placeholder="Street Address Details" 
                  value={newAddrDetails} 
                  onChange={e => setNewAddrDetails(e.target.value)}
                  required
                  style={{ padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Address</button>
              </form>
            </div>
          )}

          {/* TAB 4: Gift Reminders */}
          {activeTab === 'reminders' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-green)', marginBottom: '1.5rem' }}>Gift Reminders</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>We'll send you an automated email alert 7 days prior to these occasions so you can schedule a surprise box in time.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                {reminders.map(rem => {
                  const isEditing = editingReminderId === rem.id;
                  return (
                    <div key={rem.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                          <input 
                            type="text" 
                            value={editEventText} 
                            onChange={e => setEditEventText(e.target.value)} 
                            style={{ flex: 1, padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem' }}
                          />
                          <input 
                            type="text" 
                            value={editDateText} 
                            onChange={e => setEditDateText(e.target.value)} 
                            style={{ width: '100px', padding: '0.25rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '0.8rem' }}
                          />
                        </div>
                      ) : (
                        <div>
                          <strong>{rem.event}</strong>
                          <span style={{ color: 'var(--accent-gold)', fontWeight: '600', marginLeft: '1rem' }}>{rem.date}</span>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(rem.id)} style={{ color: 'var(--primary-green)' }} title="Save"><Check size={16} /></button>
                            <button onClick={() => setEditingReminderId(null)} style={{ color: 'var(--text-muted)' }} title="Cancel"><X size={16} /></button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => handleStartEdit(rem)} style={{ color: 'var(--accent-gold)' }} title="Edit"><Edit size={16} /></button>
                            <button onClick={() => handleDeleteReminder(rem.id)} style={{ color: '#ef4444' }} title="Delete"><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '1rem' }}>Add Reminder</h4>
              <form onSubmit={handleAddReminder} style={{ display: 'flex', gap: '0.5rem', maxWidth: '450px' }}>
                <input 
                  type="text" 
                  placeholder="Event Name (e.g. Sister's Graduation)" 
                  value={newEvent} 
                  onChange={e => setNewEvent(e.target.value)}
                  required
                  style={{ flex: 1, padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
                />
                <div style={{ display: 'flex', gap: '0.25rem', width: '180px', position: 'relative' }}>
                  <input 
                    type="text" 
                    placeholder="Date (e.g. Sept 12)" 
                    value={newDate} 
                    onChange={e => setNewDate(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem', paddingRight: '2rem' }}
                  />
                  {/* Hidden native calendar input */}
                  <input 
                    type="date"
                    ref={dateInputRef}
                    onChange={handleDateChange}
                    style={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      width: '0',
                      height: '0',
                      opacity: 0,
                      pointerEvents: 'none',
                      padding: 0,
                      border: 'none'
                    }}
                  />
                  <button 
                    type="button" 
                    onClick={() => dateInputRef.current?.showPicker()} 
                    style={{ position: 'absolute', right: '0.4rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-gold)', border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
                    title="Select date from calendar"
                  >
                    <Calendar size={16} />
                  </button>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>Add</button>
              </form>
            </div>
          )}

        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
          .profile-header-row {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </div>
  );
}
