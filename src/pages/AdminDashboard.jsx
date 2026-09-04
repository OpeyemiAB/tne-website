import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Database, LogOut, Sparkles, Check, Trash2, Plus, Users, UserPlus, Camera, Upload, Image as ImageIcon } from 'lucide-react';
import { useGifting } from '../context/GiftingContext';

export default function AdminDashboard() {
  const { orders, products, updateOrderStatus, addProduct, editProduct, deleteProduct, atelierOptions, updateAtelierOptions, handleLogout, showToast } = useGifting();
  const [activeTab, setActiveTab] = useState('orders');
  const navigate = useNavigate();

  // New Product Form state
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodCategory, setProdCategory] = useState('Etched by TNE');
  const [prodDescription, setProdDescription] = useState('');
  const [prodFeatures, setProdFeatures] = useState('');
  const [prodCustomizable, setProdCustomizable] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [previewReceiptImg, setPreviewReceiptImg] = useState(null);

  // Atelier Customization state
  const [newBoxName, setNewBoxName] = useState('');
  const [newBoxPrice, setNewBoxPrice] = useState('');
  const [newBoxMaxItems, setNewBoxMaxItems] = useState('5');
  const [newBoxIncluded, setNewBoxIncluded] = useState('');
  const [newRibbonName, setNewRibbonName] = useState('');
  const [newRibbonColor, setNewRibbonColor] = useState('#D4AF37');
  const [newCardName, setNewCardName] = useState('');

  // Staff & Users directory state
  const [systemUsers, setSystemUsers] = useState([]);
  const displayUsers = Array.from(new Map(systemUsers.map(u => [(u.email || '').toLowerCase(), u])).values());

  useEffect(() => {
    const loadUsers = async () => {
      const { getUsersFromDb } = await import('../firebase');
      const data = await getUsersFromDb();
      if (data) setSystemUsers(data);
    };
    loadUsers();
  }, [activeTab]);

  // Automatic Browser Storage Cleanser on Mount to prevent quota exceeded errors
  useEffect(() => {
    try {
      let totalLen = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('tne_')) totalLen += (localStorage.getItem(k) || '').length;
      }
      if (totalLen > 2000000) {
        console.warn("Clogged browser cache detected. Clearing localStorage...");
        localStorage.removeItem('tne_products');
        localStorage.removeItem('tne_dropped_products');
      }
    } catch (e) {}
  }, []);

  const handleSignOut = () => {
    handleLogout();
    navigate('/');
  };

  const [isSubmittingProd, setIsSubmittingProd] = useState(false);

  const [prodImagesList, setProdImagesList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);

  const handleProductImageFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result;
        setProdImagesList(prev => [...prev, dataUrl]);
        setProdImage(prev => (prev && typeof prev === 'string' && (prev.startsWith('http') || prev.startsWith('data:')) ? prev : dataUrl));
      };
      reader.readAsDataURL(file);
    });
    if (showToast) showToast(`✓ ${files.length} photo(s) added to gallery!`, "success");
  };

  const removeProdImageFromNewForm = (indexToRemove) => {
    setProdImagesList(prev => {
      const updated = prev.filter((_, idx) => idx !== indexToRemove);
      if (prodImage === prev[indexToRemove]) {
        setProdImage(updated[0] || '');
      }
      return updated;
    });
  };

  const handleInventoryAddGalleryImages = (product, e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const existingImages = (product.images && product.images.length > 0) ? [...product.images] : [product.image];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        existingImages.push(reader.result);
        try {
          await editProduct(product.id, { 
            images: existingImages,
            image: existingImages[0]
          });
          if (showToast) showToast("Photo added to product gallery live!", "success");
        } catch (err) {
          if (showToast) showToast("Failed to add photo to gallery.", "error");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleInventoryDeleteGalleryImage = async (product, imgIndexToDelete) => {
    const existingImages = (product.images && product.images.length > 0) ? [...product.images] : [product.image];
    if (existingImages.length <= 1) {
      if (showToast) showToast("A product must have at least one photo.", "error");
      return;
    }
    const updatedImages = existingImages.filter((_, idx) => idx !== imgIndexToDelete);
    try {
      await editProduct(product.id, { 
        images: updatedImages,
        image: updatedImages[0]
      });
      if (showToast) showToast("Photo removed from gallery.", "info");
    } catch (err) {
      if (showToast) showToast("Failed to remove photo.", "error");
    }
  };

  const handleInventorySetCoverImage = async (product, targetImgUrl) => {
    const existingImages = (product.images && product.images.length > 0) ? [...product.images] : [product.image];
    const reordered = [targetImgUrl, ...existingImages.filter(img => img !== targetImgUrl)];
    try {
      await editProduct(product.id, { 
        image: targetImgUrl,
        images: reordered
      });
      if (showToast) showToast("Primary cover photo updated!", "success");
    } catch (err) {
      if (showToast) showToast("Failed to update cover photo.", "error");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const finalImages = prodImagesList.length > 0 
      ? prodImagesList 
      : (prodImage ? [prodImage] : []);

    if (!prodName.trim() || !prodPrice || finalImages.length === 0) {
      if (showToast) showToast("Please enter product name, price, and upload at least one photo.", "error");
      return;
    }

    setIsSubmittingProd(true);
    setUploadProgress({ current: 0, total: finalImages.length, percentage: 0, text: 'Preparing WebP image compression...' });

    try {
      const newProd = {
        name: prodName.trim(),
        price: Number(prodPrice),
        image: finalImages[0],
        images: finalImages,
        category: prodCategory,
        description: prodDescription.trim(),
        features: prodFeatures.split('\n').filter(f => f.trim() !== ''),
        customizable: prodCustomizable,
        inStock: true
      };

      await addProduct(newProd, (prog) => {
        setUploadProgress({
          current: prog.current,
          total: prog.total,
          percentage: prog.percentage,
          text: `Uploading picture ${prog.current} of ${prog.total} (${prog.percentage}%)`
        });
      });

      // Reset form
      setProdName('');
      setProdPrice('');
      setProdImage('');
      setProdImagesList([]);
      setProdDescription('');
      setProdFeatures('');
      setProdCustomizable(false);
      setFormSuccess(true);
      if (showToast) showToast(`✓ Product "${prodName}" uploaded live with ${finalImages.length} photo(s)!`, "success");

      setTimeout(() => {
        setFormSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("Product Creation Error:", err);
      if (showToast) showToast(`Upload Failed: ${err.message || 'Check connection or permissions'}`, "error");
    } finally {
      setIsSubmittingProd(false);
      setUploadProgress(null);
    }
  };

  const orderStages = ['Pending', 'Sourcing Items', 'Wrapped with Love', 'Out for Delivery', 'Delivered'];

  // Staff creation state
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Staff');
  const [newStaffPassword, setNewStaffPassword] = useState('');

  const handleResetData = async () => {
    if (window.confirm("Are you sure you want to drop all test orders and users to start fresh? This cannot be undone.")) {
      const { resetDatabaseOrdersAndUsers } = await import('../firebase');
      await resetDatabaseOrdersAndUsers();
      window.location.reload();
    }
  };

  const handleRecoverDatabase = async () => {
    try {
      const storedProds = JSON.parse(localStorage.getItem('tne_products') || '[]');
      const storedOrders = JSON.parse(localStorage.getItem('tne_orders') || '[]');
      
      if (storedProds.length > 0 || storedOrders.length > 0) {
        await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: storedProds,
            orders: storedOrders
          })
        });
        if (showToast) showToast(`Restored ${storedProds.length} products & ${storedOrders.length} orders to central server!`, "success");
        setTimeout(() => window.location.reload(), 1200);
      } else {
        if (showToast) showToast("No stored admin data found on this device.", "info");
      }
    } catch (e) {
      if (showToast) showToast("Recovery failed.", "error");
    }
  };

  const [staffSuccessMsg, setStaffSuccessMsg] = useState('');

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    const nameVal = newStaffName.trim();
    const emailVal = newStaffEmail.trim();
    const roleVal = newStaffRole.trim() || 'Staff';
    const passVal = newStaffPassword.trim() || 'staff123';

    if (!nameVal || !emailVal) return;

    try {
      const { addUserToDb, getUsersFromDb } = await import('../firebase');
      await addUserToDb({
        name: nameVal,
        email: emailVal,
        role: roleVal,
        password: passVal
      });

      // Clear input fields immediately
      setNewStaffName('');
      setNewStaffEmail('');
      setNewStaffPassword('');
      setNewStaffRole('Staff');

      // Fetch clean user list to prevent duplicates
      const refreshedUsers = await getUsersFromDb();
      setSystemUsers(refreshedUsers);

      const msg = `🎉 Staff account created for ${nameVal} (${roleVal})!`;
      setStaffSuccessMsg(msg);
      if (showToast) showToast(msg, 'success');

      setTimeout(() => {
        setStaffSuccessMsg('');
      }, 4000);
    } catch (err) {
      console.error("Failed to create staff:", err);
      if (showToast) showToast(`Failed to create staff: ${err.message}`, 'error');
    }
  };

  return (
    <div className="container fade-in" style={{ padding: '3rem 1.5rem', fontFamily: 'var(--font-sans)' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--accent-gold)', paddingBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--primary-green)' }}>TNE Admin Panel</h1>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monitor client purchases, manage staff, and update catalog settings.</span>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={handleRecoverDatabase}
            style={{
              backgroundColor: 'rgba(0,75,73,0.08)',
              color: 'var(--primary-green)',
              border: '1px solid var(--primary-green)',
              padding: '0.4rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
            title="Recover previously saved products and orders from device cache to central server"
          >
            ♻️ Recover Database
          </button>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tab controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setActiveTab('orders')}
          className={activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ClipboardList size={18} /> Orders Monitor ({orders.length})
        </button>
        <button 
          onClick={() => setActiveTab('inventory')}
          className={activeTab === 'inventory' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Database size={18} /> Catalog Manager ({products.length})
        </button>
        <button 
          onClick={() => setActiveTab('atelier')}
          className={activeTab === 'atelier' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Sparkles size={18} /> Atelier Box Manager
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          className={activeTab === 'staff' ? 'btn-primary' : 'btn-secondary'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Users size={18} /> Staff & Accounts
        </button>
        <button 
          type="button"
          onClick={async () => {
            const { restoreAllProductsToLive } = await import('../firebase');
            await restoreAllProductsToLive();
            if (showToast) showToast("✓ All 22 catalog products restored live to the storefront!", "success");
            setTimeout(() => window.location.reload(), 600);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: 'rgba(56,158,13,0.1)',
            color: '#389e0d',
            border: '1px solid #389e0d',
            borderRadius: '6px',
            padding: '0.5rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🔄 Sync All {products.length} Products Live
        </button>
        <button 
          type="button"
          onClick={() => {
            localStorage.clear();
            if (showToast) showToast("Browser cache cleared cleanly! Refreshing...", "success");
            setTimeout(() => window.location.reload(), 600);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            backgroundColor: '#fffbe6',
            color: '#d46b08',
            border: '1px solid #ffe58f',
            borderRadius: '6px',
            padding: '0.5rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          🧹 Clear Storage Cache
        </button>
      </div>

      {/* TABS CONTAINER */}

      {/* Tab 1: Orders Monitor */}
      {activeTab === 'orders' && (
        <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', margin: 0 }}>
              Live Order Management ({orders.length})
            </h3>
            {orders.length > 0 && (
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm("Are you sure you want to clear all test orders for production start?")) {
                    const { clearAllOrdersFromDb } = await import('../firebase');
                    await clearAllOrdersFromDb();
                    window.location.reload();
                  }
                }}
                style={{
                  backgroundColor: 'rgba(239,68,68,0.1)',
                  color: '#ef4444',
                  border: '1px solid #ef4444',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Trash2 size={14} /> Clear Test Orders
              </button>
            )}
          </div>

          {orders.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>No active orders found. Clean order book ready for live sales!</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }} className="admin-table">
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '1rem 0.5rem' }}>Order Ref & Time</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Sender (Gifter)</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Recipient Info</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Curation / Items</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Delivery Target</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Price</th>
                  <th style={{ padding: '1rem 0.5rem' }}>Tracking Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--primary-green)', fontSize: '0.95rem' }}>#{ord.id}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold-dark)', marginTop: '0.2rem', fontWeight: '600' }}>
                        🕒 {ord.timestamp || ord.date || new Date().toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <strong>{ord.shippingInfo.senderName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.shippingInfo.senderEmail}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.shippingInfo.senderPhone}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <strong>{ord.shippingInfo.recipientName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.shippingInfo.address}, {ord.shippingInfo.city}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ord.shippingInfo.recipientPhone}</div>
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      {ord.items.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '0.5rem' }}>
                          • {item.name} (x{item.quantity})
                          {item.customizations && (
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginLeft: '0.5rem', padding: '0.25rem', borderLeft: '2px solid var(--accent-gold)' }}>
                              {item.customizations.engraveName && <div>Engrave: {item.customizations.engraveName}</div>}
                              {item.customizations.boxSize && <div>Box size: {item.customizations.boxSize}</div>}
                              {item.customizations.ribbonColor && <div>Ribbon: {item.customizations.ribbonColor}</div>}
                              {item.customizations.cardText && <div>Note: "{item.customizations.cardText}"</div>}
                            </div>
                          )}
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '1rem 0.5rem' }}>{ord.deliveryDate}</td>
                    <td style={{ padding: '1rem 0.5rem', fontWeight: 'bold' }}>₦{ord.totalCost.toLocaleString()}</td>
                    <td style={{ padding: '1rem 0.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Order Fulfillment Stage</label>
                          <select 
                            value={ord.status || 'Pending'}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value, ord.paymentStatus)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.8rem',
                              backgroundColor: 'var(--background-white)',
                              outline: 'none',
                              fontWeight: '600',
                              color: 'var(--primary-green)'
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Payment Verification</label>
                          <select 
                            value={ord.paymentStatus || (ord.shippingInfo?.paymentMethod?.includes('Paystack') ? 'Paid' : 'Pending')}
                            onChange={(e) => updateOrderStatus(ord.id, ord.status, e.target.value)}
                            style={{
                              padding: '0.4rem',
                              borderRadius: '4px',
                              border: '1px solid var(--border-color)',
                              fontSize: '0.75rem',
                              backgroundColor: (ord.paymentStatus === 'Paid' || (!ord.paymentStatus && ord.shippingInfo?.paymentMethod?.includes('Paystack'))) ? '#f6ffed' : ord.paymentStatus === 'Failed' ? '#fff2f0' : '#fffbe6',
                              color: (ord.paymentStatus === 'Paid' || (!ord.paymentStatus && ord.shippingInfo?.paymentMethod?.includes('Paystack'))) ? '#389e0d' : ord.paymentStatus === 'Failed' ? '#cf1322' : '#d46b08',
                              outline: 'none',
                              fontWeight: 'bold'
                            }}
                          >
                            <option value="Paid">🟢 Paid (Verified)</option>
                            <option value="Pending">🟡 Pending Payment</option>
                            <option value="Failed">🔴 Payment Failed</option>
                          </select>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.4rem' }}>
                            {(ord.receiptImage || ord.shippingInfo?.receiptImage) && (
                              <button
                                type="button"
                                onClick={() => setPreviewReceiptImg(ord.receiptImage || ord.shippingInfo?.receiptImage)}
                                style={{
                                  backgroundColor: 'rgba(212,175,55,0.15)',
                                  color: 'var(--accent-gold-dark)',
                                  border: '1px solid var(--accent-gold)',
                                  borderRadius: '4px',
                                  padding: '0.35rem 0.5rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                📷 View Transfer Receipt
                              </button>
                            )}

                            {ord.paymentStatus === 'Paid' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const phone = (ord.shippingInfo?.senderPhone || '').replace(/\D/g, '');
                                  const name = ord.shippingInfo?.senderName || 'Valued Customer';
                                  const total = ord.totalCost ? ord.totalCost.toLocaleString() : '0';
                                  const msg = encodeURIComponent(`Hello ${name}! 🌟\n\nYour payment of ₦${total} for Order #${ord.id} at *The Nifemi Experience* has been VERIFIED & CONFIRMED!\n\nView your official paid receipt here:\nhttps://www.thenifemiexperience.com/track?id=${ord.id}`);
                                  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
                                }}
                                style={{
                                  backgroundColor: '#f6ffed',
                                  color: '#389e0d',
                                  border: '1px solid #b7eb8f',
                                  borderRadius: '4px',
                                  padding: '0.35rem 0.5rem',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                📱 Send Paid Receipt via WhatsApp
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 2: Catalog Manager (Upload items) */}
      {activeTab === 'inventory' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '3rem' }} className="admin-catalog-grid">
          {/* Create new product Form */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem', boxShadow: 'var(--shadow-sm)', alignSelf: 'start' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Upload New Product
            </h3>

            {formSuccess && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'rgba(0,75,73,0.05)',
                border: '1px solid var(--primary-green)',
                color: 'var(--primary-green)',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem',
                marginBottom: '1.5rem'
              }}>
                <Check size={18} />
                <span>Product uploaded and added to the live catalog successfully!</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Product Name</label>
                <input 
                  type="text" 
                  value={prodName} 
                  onChange={e => setProdName(e.target.value)} 
                  required
                  placeholder="e.g., Scented Glass Candle"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Price (₦)</label>
                  <input 
                    type="number" 
                    value={prodPrice} 
                    onChange={e => setProdPrice(e.target.value)} 
                    required
                    placeholder="5000"
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Category</label>
                  <select 
                    value={prodCategory} 
                    onChange={e => setProdCategory(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', backgroundColor: '#fff' }}
                  >
                    <option value="Etched by TNE">Etched by TNE (Personalized)</option>
                    <option value="TNE Gift Curation">TNE Gift Curation (Boxes)</option>
                    <option value="TNE Collections">TNE Collections (Fashion)</option>
                    <option value="TNE Beauty">TNE Beauty (Cosmetics)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Product Pictures / Photo Gallery</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {/* File Upload Option (Multiple Photos) */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'center',
                    gap: '0.5rem',
                    border: '1.5px dashed var(--accent-gold)',
                    backgroundColor: 'rgba(212,175,55,0.08)',
                    color: 'var(--primary-green)',
                    padding: '0.85rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 'bold'
                  }}>
                    <Upload size={16} /> Upload Multiple Photos (Device / Camera)
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleProductImageFileUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>

                  {/* Image URL Option Fallback */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>OR Paste Image Web URL:</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                      type="text" 
                      value={typeof prodImage === 'string' ? (prodImage.startsWith('data:') ? '[Uploaded Photo]' : prodImage) : ''} 
                      onChange={e => setProdImage(e.target.value)} 
                      placeholder="https://images.unsplash.com/..."
                      style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', fontSize: '0.8rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (prodImage.trim()) {
                          setProdImagesList(prev => [...prev, prodImage.trim()]);
                          if (showToast) showToast("URL added to photo gallery!", "success");
                        }
                      }}
                      style={{
                        backgroundColor: 'var(--primary-green)',
                        color: 'var(--accent-gold)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.4rem 0.75rem',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      + Add URL
                    </button>
                  </div>

                  {/* Live Multi-Photo Gallery Preview Grid */}
                  {prodImagesList.length > 0 && (
                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Selected Photos ({prodImagesList.length})</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>★ First image is Primary Cover</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {prodImagesList.map((imgUrl, idx) => (
                          <div key={idx} style={{ position: 'relative', width: '64px', height: '64px' }}>
                            <img src={imgUrl} alt={`Selected ${idx + 1}`} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', border: idx === 0 ? '2px solid var(--accent-gold)' : '1px solid #cbd5e1' }} />
                            {idx === 0 && (
                              <span style={{ position: 'absolute', top: '-6px', left: '-6px', backgroundColor: 'var(--accent-gold-dark)', color: '#fff', fontSize: '0.55rem', fontWeight: 'bold', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                                Cover
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => removeProdImageFromNewForm(idx)}
                              style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-6px',
                                backgroundColor: '#ef4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer'
                              }}
                              title="Remove photo"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Description</label>
                <textarea 
                  rows={2} 
                  value={prodDescription} 
                  onChange={e => setProdDescription(e.target.value)}
                  placeholder="Brief story or description of the product..."
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', resize: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Features list (One per line)</label>
                <textarea 
                  rows={2} 
                  value={prodFeatures} 
                  onChange={e => setProdFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2"
                  style={{ width: '100%', padding: '0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none', resize: 'none' }}
                />
              </div>

              <div style={{ margin: '0.5rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input 
                    type="checkbox" 
                    checked={prodCustomizable}
                    onChange={e => setProdCustomizable(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--primary-green)' }}
                  />
                  Enable name/photo customizations for this product
                </label>
              </div>

              {uploadProgress && (
                <div style={{ margin: '0.5rem 0', padding: '0.85rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--primary-green)', marginBottom: '0.4rem' }}>
                    <span>{uploadProgress.text}</span>
                    <span>{uploadProgress.percentage}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#dcfce7', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${uploadProgress.percentage}%`, height: '100%', backgroundColor: 'var(--primary-green)', transition: 'width 0.2s ease' }} />
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmittingProd}
                className="btn-gold" 
                style={{ justifyContent: 'center', padding: '0.75rem', opacity: isSubmittingProd ? 0.7 : 1, cursor: isSubmittingProd ? 'not-allowed' : 'pointer' }}
              >
                <Plus size={18} /> {isSubmittingProd ? (uploadProgress ? uploadProgress.text : 'Uploading Product...') : 'Upload Product'}
              </button>
            </form>
          </div>

          {/* Current listing */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)', maxHeight: '650px', overflowY: 'auto' }} className="custom-scroll">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', margin: 0 }}>
                Live Storefront Inventory
              </h3>
              <a 
                href="/shop" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  backgroundColor: 'rgba(0,75,73,0.1)',
                  color: 'var(--primary-green)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  textDecoration: 'none'
                }}
              >
                👁 View Live Storefront ➔
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {products.map(p => {
                const gallery = (p.images && p.images.length > 0) ? p.images : [p.image];
                return (
                  <div key={p.id} style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      
                      {/* Product Gallery Strip */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                          {gallery.map((imgUrl, gIdx) => (
                            <div key={gIdx} style={{ position: 'relative', width: '52px', height: '52px' }}>
                              <img 
                                src={imgUrl} 
                                alt={`${p.name} ${gIdx + 1}`} 
                                onClick={() => handleInventorySetCoverImage(p, imgUrl)}
                                style={{
                                  width: '52px',
                                  height: '52px',
                                  objectFit: 'cover',
                                  borderRadius: '6px',
                                  border: p.image === imgUrl ? '2px solid var(--accent-gold)' : '1px solid var(--border-color)',
                                  cursor: 'pointer'
                                }}
                                title="Click to set as primary cover photo"
                              />
                              {gallery.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleInventoryDeleteGalleryImage(p, gIdx)}
                                  style={{
                                    position: 'absolute',
                                    top: '-4px',
                                    right: '-4px',
                                    backgroundColor: '#ef4444',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '16px',
                                    height: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justify: 'center',
                                    cursor: 'pointer'
                                  }}
                                  title="Delete photo"
                                >
                                  <Trash2 size={9} />
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add Photo Button */}
                          <label 
                            htmlFor={`add-photo-${p.id}`}
                            style={{
                              width: '52px',
                              height: '52px',
                              borderRadius: '6px',
                              border: '1.5px dashed var(--accent-gold)',
                              backgroundColor: 'rgba(212,175,55,0.1)',
                              color: 'var(--primary-green)',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justify: 'center',
                              cursor: 'pointer',
                              fontSize: '0.6rem',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}
                            title="Add photo to this product gallery"
                          >
                            <Plus size={14} /> Photo
                            <input 
                              id={`add-photo-${p.id}`}
                              type="file" 
                              accept="image/*" 
                              multiple
                              onChange={(e) => handleInventoryAddGalleryImages(p, e)} 
                              style={{ display: 'none' }} 
                            />
                          </label>
                        </div>
                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                          📷 {gallery.length} Photo(s) • Click photo to set cover
                        </span>
                      </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{p.name}</div>
                    <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--background-ivory)', color: 'var(--text-muted)', padding: '0.1rem 0.35rem', borderRadius: '4px', display: 'inline-block', marginTop: '0.2rem' }}>
                      {p.category}
                    </span>
                  </div>
                  
                  {/* Inline Price Editor */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Price (₦)</span>
                    <input 
                      type="number" 
                      defaultValue={p.price}
                      onBlur={(e) => {
                        const val = Number(e.target.value);
                        if (val && val !== p.price) {
                          editProduct(p.id, { price: val });
                        }
                      }}
                      style={{
                        width: '90px',
                        padding: '0.3rem 0.5rem',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        color: 'var(--primary-green)',
                        border: '1.5px solid var(--accent-gold)',
                        borderRadius: '4px',
                        textAlign: 'right'
                      }}
                      title="Click to change price (auto-saves)"
                    />
                  </div>

                  {/* Stock Availability Toggle */}
                  <button 
                    onClick={() => editProduct(p.id, { inStock: p.inStock === false ? true : false })}
                    style={{
                      backgroundColor: p.inStock !== false ? 'rgba(0,75,73,0.08)' : '#fff7ed',
                      color: p.inStock !== false ? 'var(--primary-green)' : '#c2410c',
                      border: p.inStock !== false ? '1px solid var(--primary-green)' : '1px solid #fdba74',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    title="Click to toggle product availability"
                  >
                    {p.inStock !== false ? '✔ In Stock' : '✖ Unavailable'}
                  </button>

                  {/* Drop Item button */}
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      border: '1px solid #fee2e2',
                      padding: '0.4rem 0.65rem',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginLeft: '0.25rem'
                    }}
                    title="Drop item from live storefront"
                  >
                    <Trash2 size={14} /> Drop
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )}

      {/* Tab 3: Atelier Box & Customization Manager */}
      {activeTab === 'atelier' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Top Row: Box Tiers Management */}
          <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--primary-green)', marginBottom: '1.5rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              Gift Box Tiers & Item Capacities
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }} className="atelier-admin-grid">
              
              {/* Existing Box Tiers list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(atelierOptions.boxSizes || []).map((b, idx) => (
                  <div key={b.id || idx} style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '1rem', backgroundColor: 'var(--background-ivory)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1rem', color: 'var(--primary-green)' }}>{b.name}</strong>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {/* Stock toggle */}
                        <button
                          onClick={() => {
                            const updated = (atelierOptions.boxSizes || []).map((item, i) => i === idx ? { ...item, available: !item.available } : item);
                            updateAtelierOptions({ ...atelierOptions, boxSizes: updated });
                          }}
                          style={{
                            backgroundColor: b.available !== false ? 'rgba(0,75,73,0.08)' : '#fff7ed',
                            color: b.available !== false ? 'var(--primary-green)' : '#c2410c',
                            border: b.available !== false ? '1px solid var(--primary-green)' : '1px solid #fdba74',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                        >
                          {b.available !== false ? '✔ Available' : '✖ Unavailable'}
                        </button>

                        {/* Drop Box Tier */}
                        <button
                          onClick={() => {
                            const updated = (atelierOptions.boxSizes || []).filter((_, i) => i !== idx);
                            updateAtelierOptions({ ...atelierOptions, boxSizes: updated });
                          }}
                          style={{
                            backgroundColor: '#fef2f2',
                            color: '#ef4444',
                            border: '1px solid #fee2e2',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          <Trash2 size={12} /> Drop
                        </button>
                      </div>
                    </div>

                    {/* Inline Edit Inputs for Price, Max Items capacity, and Included Items */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.8rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Box Base Price (₦)</label>
                        <input 
                          type="number"
                          defaultValue={b.price}
                          onBlur={(e) => {
                            const newPrice = Number(e.target.value);
                            if (newPrice && newPrice !== b.price) {
                              const updated = (atelierOptions.boxSizes || []).map((item, i) => i === idx ? { ...item, price: newPrice } : item);
                              updateAtelierOptions({ ...atelierOptions, boxSizes: updated });
                            }
                          }}
                          style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Max Products Capacity</label>
                        <input 
                          type="number"
                          defaultValue={b.maxItems || 5}
                          onBlur={(e) => {
                            const newMax = Number(e.target.value);
                            if (newMax && newMax !== b.maxItems) {
                              const updated = (atelierOptions.boxSizes || []).map((item, i) => i === idx ? { ...item, maxItems: newMax } : item);
                              updateAtelierOptions({ ...atelierOptions, boxSizes: updated });
                            }
                          }}
                          style={{ width: '100%', padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Included Goodies (Comma Separated)</label>
                      <input 
                        type="text"
                        defaultValue={b.includedItems || 'Leather Keyholder, QR Greeting Card'}
                        onBlur={(e) => {
                          const newInc = e.target.value;
                          if (newInc !== b.includedItems) {
                            const updated = (atelierOptions.boxSizes || []).map((item, i) => i === idx ? { ...item, includedItems: newInc } : item);
                            updateAtelierOptions({ ...atelierOptions, boxSizes: updated });
                          }
                        }}
                        style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Box Tier Form */}
              <div style={{ backgroundColor: 'var(--background-ivory)', border: '1px dashed var(--accent-gold)', borderRadius: '8px', padding: '1.5rem' }}>
                <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--primary-green)', marginBottom: '1rem' }}>
                  + Add New Box Tier
                </h4>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (!newBoxName || !newBoxPrice) return;
                  const newBoxObj = {
                    id: newBoxName.replace(/\s+/g, '-'),
                    name: newBoxName,
                    price: Number(newBoxPrice),
                    maxItems: Number(newBoxMaxItems || 5),
                    includedItems: newBoxIncluded || 'Leather Keyholder, QR Greeting Card',
                    available: true
                  };
                  const updatedBoxes = [...(atelierOptions.boxSizes || []), newBoxObj];
                  updateAtelierOptions({ ...atelierOptions, boxSizes: updatedBoxes });
                  setNewBoxName('');
                  setNewBoxPrice('');
                  setNewBoxMaxItems('5');
                  setNewBoxIncluded('');
                }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Box Tier Name</label>
                    <input 
                      type="text"
                      placeholder="e.g. VIP Royal Trunk"
                      value={newBoxName}
                      onChange={e => setNewBoxName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Price (₦)</label>
                      <input 
                        type="number"
                        placeholder="45000"
                        value={newBoxPrice}
                        onChange={e => setNewBoxPrice(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Max Fillers</label>
                      <input 
                        type="number"
                        value={newBoxMaxItems}
                        onChange={e => setNewBoxMaxItems(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Included Goodies (Comma Separated)</label>
                    <input 
                      type="text"
                      placeholder="Leather Keyholder, QR Greeting Card, Scented Candle"
                      value={newBoxIncluded}
                      onChange={e => setNewBoxIncluded(e.target.value)}
                      style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                    />
                  </div>
                  <button type="submit" className="btn-gold" style={{ justifyContent: 'center', padding: '0.6rem' }}>
                    <Plus size={16} /> Add Box Tier
                  </button>
                </form>
              </div>

            </div>
          </div>

          {/* Bottom Row: Ribbons & Card Templates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="atelier-admin-grid">
            
            {/* Ribbon Satin Colors */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--primary-green)', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                Ribbon Satin Finishes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {(atelierOptions.ribbons || []).map((r, idx) => (
                  <div key={r.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: r.colorCode || '#D4AF37', border: '1px solid #ccc' }}></div>
                      <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{r.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => {
                          const updated = (atelierOptions.ribbons || []).map((item, i) => i === idx ? { ...item, available: !item.available } : item);
                          updateAtelierOptions({ ...atelierOptions, ribbons: updated });
                        }}
                        style={{
                          backgroundColor: r.available !== false ? 'rgba(0,75,73,0.08)' : '#fff7ed',
                          color: r.available !== false ? 'var(--primary-green)' : '#c2410c',
                          border: r.available !== false ? '1px solid var(--primary-green)' : '1px solid #fdba74',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {r.available !== false ? 'Available' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => {
                          const updated = (atelierOptions.ribbons || []).filter((_, i) => i !== idx);
                          updateAtelierOptions({ ...atelierOptions, ribbons: updated });
                        }}
                        style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '600' }}
                      >
                        Drop
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Ribbon Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newRibbonName) return;
                const newR = { id: newRibbonName, name: newRibbonName, colorCode: newRibbonColor, available: true };
                const updatedR = [...(atelierOptions.ribbons || []), newR];
                updateAtelierOptions({ ...atelierOptions, ribbons: updatedR });
                setNewRibbonName('');
              }} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Ribbon Name (e.g. Rose Gold)"
                    value={newRibbonName}
                    onChange={e => setNewRibbonName(e.target.value)}
                    required
                    style={{ flex: 1.2, padding: '0.45rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid var(--border-color)', padding: '0.2rem 0.4rem', borderRadius: '4px', backgroundColor: '#fff', flex: 1 }}>
                    <input 
                      type="color"
                      value={newRibbonColor.startsWith('#') && newRibbonColor.length === 7 ? newRibbonColor : '#D4AF37'}
                      onChange={e => setNewRibbonColor(e.target.value)}
                      title="Click visual color picker"
                      style={{ width: '28px', height: '28px', padding: 0, border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="#D4AF37 or HSL"
                      value={newRibbonColor}
                      onChange={e => setNewRibbonColor(e.target.value)}
                      title="Type Hex (#D4AF37), HSL, or RGB code"
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.75rem', fontWeight: '600' }}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  + Add Ribbon
                </button>
              </form>
            </div>

            {/* Greeting Cards */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--primary-green)', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                Card Template Styles
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {(atelierOptions.cards || []).map((c, idx) => (
                  <div key={c.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '600', fontSize: '0.85rem' }}>{c.name}</span>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button
                        onClick={() => {
                          const updated = (atelierOptions.cards || []).map((item, i) => i === idx ? { ...item, available: !item.available } : item);
                          updateAtelierOptions({ ...atelierOptions, cards: updated });
                        }}
                        style={{
                          backgroundColor: c.available !== false ? 'rgba(0,75,73,0.08)' : '#fff7ed',
                          color: c.available !== false ? 'var(--primary-green)' : '#c2410c',
                          border: c.available !== false ? '1px solid var(--primary-green)' : '1px solid #fdba74',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {c.available !== false ? 'Available' : 'Unavailable'}
                      </button>
                      <button
                        onClick={() => {
                          const updated = (atelierOptions.cards || []).filter((_, i) => i !== idx);
                          updateAtelierOptions({ ...atelierOptions, cards: updated });
                        }}
                        style={{ backgroundColor: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: '600' }}
                      >
                        Drop
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Card Form */}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newCardName) return;
                const newC = { id: newCardName, name: newCardName, available: true };
                const updatedC = [...(atelierOptions.cards || []), newC];
                updateAtelierOptions({ ...atelierOptions, cards: updatedC });
                setNewCardName('');
              }} style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  placeholder="Card Name (e.g. Vintage Velvet)"
                  value={newCardName}
                  onChange={e => setNewCardName(e.target.value)}
                  required
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', border: '1px solid var(--border-color)', borderRadius: '4px' }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>
                  + Add Card
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* Tab 4: Staff & Accounts */}
      {activeTab === 'staff' && (
        <div>
            {/* Tracking Metrics summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }} className="admin-metrics-grid">
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Registered Customers</span>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
                  {displayUsers.filter(u => u.role === 'Customer' || !u.role).length} Users
                </h2>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Staff Accounts</span>
                <h2 style={{ fontSize: '2rem', color: 'var(--accent-gold-dark)', marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
                  {displayUsers.filter(u => u.role && u.role !== 'Customer').length} Staff
                </h2>
              </div>
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.25rem', boxShadow: 'var(--shadow-sm)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total System Directory</span>
                <h2 style={{ fontSize: '2rem', color: 'var(--primary-green)', marginTop: '0.2rem', fontFamily: 'var(--font-serif)' }}>
                  {displayUsers.length} Accounts
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '2rem' }} className="atelier-admin-grid">
              {/* Registered Users & Staff Table */}
              <div style={{ backgroundColor: '#fff', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  System Accounts & Staff Directory
                </h3>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Email / Login</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Custom Role</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Status</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Access Control</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayUsers.map((u, idx) => {
                        const isMainAdmin = (u.email || '').toLowerCase() === 'admin@tne.com';
                        const isRevoked = u.status === 'Revoked';

                        return (
                          <tr key={u.id || idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{u.name || 'Anonymous User'}</td>
                            <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              <span style={{ backgroundColor: (u.role || '').includes('Admin') ? 'rgba(0,75,73,0.1)' : 'var(--background-ivory)', color: (u.role || '').includes('Admin') ? 'var(--primary-green)' : 'var(--accent-gold-dark)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '600' }}>
                                {u.role || 'Customer'}
                              </span>
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem', color: isRevoked ? '#ef4444' : '#16a34a', fontWeight: 'bold' }}>
                              {isRevoked ? '🔴 Revoked' : '🟢 Active'}
                            </td>
                            <td style={{ padding: '0.75rem 0.5rem' }}>
                              {!isMainAdmin && u.role && u.role !== 'Customer' ? (
                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                                  <button
                                    onClick={async () => {
                                      const { updateUserStatusInDb, getUsersFromDb } = await import('../firebase');
                                      const newStatus = isRevoked ? 'Active' : 'Revoked';
                                      await updateUserStatusInDb(u.email, newStatus);
                                      const refreshed = await getUsersFromDb();
                                      setSystemUsers(refreshed);
                                      showToast(`Access ${newStatus === 'Revoked' ? 'revoked' : 're-activated'} for ${u.name}!`, newStatus === 'Revoked' ? 'error' : 'success');
                                    }}
                                    style={{
                                      backgroundColor: isRevoked ? '#f6ffed' : '#fff2f0',
                                      color: isRevoked ? '#389e0d' : '#cf1322',
                                      border: isRevoked ? '1px solid #b7eb8f' : '1px solid #ffccc7',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: 'bold',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    {isRevoked ? 'Activate' : 'Revoke'}
                                  </button>

                                  <button
                                    onClick={async () => {
                                      const newPass = window.prompt(`Enter new password for ${u.name} (${u.email}):`, u.password || 'staff123');
                                      if (newPass && newPass.trim()) {
                                        const { updateUserPasswordInDb, getUsersFromDb } = await import('../firebase');
                                        await updateUserPasswordInDb(u.email, newPass.trim());
                                        const refreshed = await getUsersFromDb();
                                        setSystemUsers(refreshed);
                                        if (showToast) showToast(`🔑 Password updated for ${u.name}!`, 'success');
                                      }
                                    }}
                                    style={{
                                      backgroundColor: 'rgba(0,75,73,0.08)',
                                      color: 'var(--primary-green)',
                                      border: '1px solid var(--primary-green)',
                                      padding: '0.25rem 0.5rem',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      fontWeight: 'bold',
                                      cursor: 'pointer'
                                    }}
                                    title="Change account password"
                                  >
                                    🔑 Pass
                                  </button>

                                  <button
                                    onClick={async () => {
                                      if (window.confirm(`Are you sure you want to permanently delete staff account ${u.name}?`)) {
                                        const { deleteUserFromDb, getUsersFromDb } = await import('../firebase');
                                        await deleteUserFromDb(u.email);
                                        const refreshed = await getUsersFromDb();
                                        setSystemUsers(refreshed);
                                        showToast(`Deleted staff account for ${u.name}.`);
                                      }
                                    }}
                                    style={{
                                      backgroundColor: '#fef2f2',
                                      color: '#ef4444',
                                      border: '1px solid #fee2e2',
                                      padding: '0.25rem 0.4rem',
                                      borderRadius: '4px',
                                      fontSize: '0.7rem',
                                      cursor: 'pointer'
                                    }}
                                    title="Delete staff account permanently"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              ) : (
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Protected</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            {/* Create New Staff Account Form */}
            <div style={{ backgroundColor: '#fff', border: '1px dashed var(--primary-green)', borderRadius: '8px', padding: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--primary-green)', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                + Create Staff Account
              </h3>

              {staffSuccessMsg && (
                <div style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', color: '#389e0d', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                  {staffSuccessMsg}
                </div>
              )}
              
              <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Staff Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Nifemi Operations"
                    value={newStaffName}
                    onChange={e => setNewStaffName(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Staff Business Email</label>
                  <input 
                    type="email" 
                    placeholder="nifemi@thenifemiexperience.com"
                    value={newStaffEmail}
                    onChange={e => setNewStaffEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Custom Role Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Fulfillment Lead, Inventory Spec."
                      value={newStaffRole}
                      onChange={e => setNewStaffRole(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.25rem' }}>Initial Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={newStaffPassword}
                      onChange={e => setNewStaffPassword(e.target.value)}
                      required
                      style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', outline: 'none' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
                  <UserPlus size={16} /> Create Staff Account
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Image Modal Overlay */}
      {previewReceiptImg && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 2500,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1.5rem'
        }} onClick={() => setPreviewReceiptImg(null)}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '1.5rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            textAlign: 'center'
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, fontFamily: 'var(--font-serif)', color: 'var(--primary-green)' }}>Uploaded Payment Receipt</h3>
              <button onClick={() => setPreviewReceiptImg(null)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', color: '#ef4444' }}>✕</button>
            </div>
            <img src={previewReceiptImg} alt="Uploaded Bank Transfer Receipt" style={{ width: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
            <button onClick={() => setPreviewReceiptImg(null)} className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
              Close Inspector
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .atelier-admin-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
