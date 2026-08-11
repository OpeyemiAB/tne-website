import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { 
  getProductsFromDb, 
  getOrdersFromDb, 
  addOrderToDb, 
  updateOrderStatusInDb, 
  addProductToDb,
  editProductInDb,
  deleteProductFromDb,
  getAtelierOptionsFromDb,
  updateAtelierOptionsInDb
} from '../firebase';

const GiftingContext = createContext();

export const useGifting = () => useContext(GiftingContext);

export const GiftingProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [atelierOptions, setAtelierOptions] = useState({ boxSizes: [], ribbons: [], cards: [] });
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('tne_current_user') || 'null'));

  const [cart, setCart] = useState(() => {
    const user = JSON.parse(localStorage.getItem('tne_current_user') || 'null');
    const key = user ? `tne_cart_${user.email}` : 'tne_cart_guest';
    return JSON.parse(localStorage.getItem(key) || '[]');
  });

  const [wishlist, setWishlist] = useState(() => {
    const user = JSON.parse(localStorage.getItem('tne_current_user') || 'null');
    const key = user ? `tne_wishlist_${user.email}` : 'tne_wishlist_guest';
    return JSON.parse(localStorage.getItem(key) || '[]');
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => JSON.parse(localStorage.getItem('tne_recent') || '[]'));
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    // Reset toast state after 3 seconds
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Load database items on start
  const refreshDatabase = async () => {
    try {
      const dbProducts = await getProductsFromDb();
      const dbOrders = await getOrdersFromDb();
      const dbAtelier = await getAtelierOptionsFromDb();
      setProducts(dbProducts);
      setOrders(dbOrders);
      setAtelierOptions(dbAtelier);
    } catch (e) {
      console.error("Failed to load inventory/orders", e);
    }
  };

  useEffect(() => {
    refreshDatabase();

    // Real-time cross-tab storage listener
    const handleStorageChange = () => {
      refreshDatabase();
    };
    window.addEventListener('storage', handleStorageChange);

    // Real-time background sync polling every 3 seconds (auto-syncs orders and products across admin & customer views)
    const syncInterval = setInterval(() => {
      refreshDatabase();
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(syncInterval);
    };
  }, []);

  // Persist user-isolated state changes with ref tracking to prevent race conditions on login/logout
  const prevUserEmailRef = useRef(currentUser?.email);

  useEffect(() => {
    const activeEmail = currentUser ? currentUser.email : 'guest';
    const prevEmail = prevUserEmailRef.current || 'guest';
    
    if (activeEmail === prevEmail) {
      const key = currentUser ? `tne_cart_${currentUser.email}` : 'tne_cart_guest';
      localStorage.setItem(key, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  useEffect(() => {
    const activeEmail = currentUser ? currentUser.email : 'guest';
    const prevEmail = prevUserEmailRef.current || 'guest';
    
    if (activeEmail === prevEmail) {
      const key = currentUser ? `tne_wishlist_${currentUser.email}` : 'tne_wishlist_guest';
      localStorage.setItem(key, JSON.stringify(wishlist));
    }
  }, [wishlist, currentUser]);

  useEffect(() => {
    localStorage.setItem('tne_current_user', JSON.stringify(currentUser));
    
    // Load new user data
    const userCart = localStorage.getItem(currentUser ? `tne_cart_${currentUser.email}` : 'tne_cart_guest') || '[]';
    const userWishlist = localStorage.getItem(currentUser ? `tne_wishlist_${currentUser.email}` : 'tne_wishlist_guest') || '[]';
    
    setCart(JSON.parse(userCart));
    setWishlist(JSON.parse(userWishlist));
    
    // Update ref AFTER loading so that subsequent edits are persisted under the new user
    prevUserEmailRef.current = currentUser?.email;
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('tne_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Cart Functions
  const addToCart = (product, quantity = 1, customizations = null) => {
    showToast(`${product.name} added to bag!`, 'success');
    setIsCartOpen(true);
    setCart((prevCart) => {
      // Create a unique identifier for items with specific customizations
      const configKey = customizations 
        ? JSON.stringify(customizations) 
        : 'standard';
      
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.configKey === configKey
      );

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { 
          cartId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product, 
          quantity, 
          customizations, 
          configKey 
        }];
      }
    });
  };

  const removeFromCart = (cartId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartId !== cartId));
  };

  const updateCartQuantity = (cartId, delta) => {
    setCart((prevCart) => 
      prevCart.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, newQty) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  // Wishlist Functions
  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // Recently Viewed Functions
  const addRecentView = (product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [product, ...filtered].slice(0, 5); // Max 5 items
    });
  };

  // Checkout and Order Placement
  const placeOrder = async (orderPayloadOrInfo, options = {}) => {
    let orderData = {};

    if (orderPayloadOrInfo && orderPayloadOrInfo.items && orderPayloadOrInfo.shippingInfo) {
      // Complete payload passed from Checkout
      orderData = {
        ...orderPayloadOrInfo,
        receiptImage: orderPayloadOrInfo.receiptImage || orderPayloadOrInfo.shippingInfo?.receiptImage,
        paymentStatus: orderPayloadOrInfo.paymentStatus || 'Pending Verification',
        customerEmail: orderPayloadOrInfo.customerEmail || orderPayloadOrInfo.shippingInfo?.senderEmail || (currentUser ? currentUser.email : ''),
        recipientName: orderPayloadOrInfo.shippingInfo?.recipientName || 'Recipient',
        deliveryDate: orderPayloadOrInfo.deliveryDate || options.scheduledDate || 'Regular Delivery'
      };
    } else {
      // Legacy signature (shippingInfo, options)
      const shippingInfo = orderPayloadOrInfo || {};
      const totalCost = (cart || []).reduce((sum, item) => sum + ((item.product?.price || 0) * item.quantity), 0);
      const deliveryFee = shippingInfo.state && shippingInfo.state.toLowerCase() === 'lagos' ? 2500 : 5000;
      orderData = {
        items: (cart || []).map(item => ({
          productId: item.product?.id,
          name: item.product?.name,
          price: item.product?.price,
          quantity: item.quantity,
          customizations: item.customizations
        })),
        shippingInfo,
        deliveryFee,
        totalCost: totalCost + deliveryFee,
        options,
        paymentStatus: 'Pending Verification',
        receiptImage: shippingInfo.receiptImage,
        customerEmail: currentUser ? currentUser.email : shippingInfo.senderEmail,
        recipientName: shippingInfo.recipientName,
        deliveryDate: options.scheduledDate || 'Regular Delivery'
      };
    }

    try {
      const orderId = await addOrderToDb(orderData);
      await refreshDatabase();
      clearCart();
      return orderId;
    } catch (e) {
      console.error("Order submission failed:", e);
      throw e;
    }
  };

  // Admin Order Stage & Payment Status Updating
  const updateOrderStatus = async (orderId, newStatus, paymentStatus) => {
    try {
      await updateOrderStatusInDb(orderId, newStatus, paymentStatus);
      await refreshDatabase();
    } catch (e) {
      console.error("Status update failed:", e);
    }
  };

  // Admin Inventory Management
  const addProduct = async (productData) => {
    try {
      const id = await addProductToDb(productData);
      await refreshDatabase();
      return id;
    } catch (e) {
      console.error("Adding product failed:", e);
    }
  };

  const editProduct = async (productId, updatedData) => {
    try {
      await editProductInDb(productId, updatedData);
      await refreshDatabase();
    } catch (e) {
      console.error("Editing product failed:", e);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await deleteProductFromDb(productId);
      showToast("Product dropped from live storefront.", "info");
      await refreshDatabase();
    } catch (e) {
      console.error("Deleting product failed:", e);
    }
  };

  const updateAtelierOptions = async (updatedData) => {
    try {
      await updateAtelierOptionsInDb(updatedData);
      showToast("Atelier availability settings updated live!", "success");
      await refreshDatabase();
    } catch (e) {
      console.error("Updating Atelier options failed:", e);
    }
  };

  // Customer Account Auth
  const handleRegister = (name, email, password) => {
    const newUser = { id: `usr-${Date.now()}`, name, email, password, addresses: [], wishlist: [] };
    const users = JSON.parse(localStorage.getItem('tne_users') || '[]');
    if (users.some(u => u.email === email)) {
      throw new Error("Email already registered");
    }
    users.push(newUser);
    localStorage.setItem('tne_users', JSON.stringify(users));
    setCurrentUser(newUser);
    return newUser;
  };

  const handleLogin = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Super Admin logins (oluwanifemiadepitan46@gmail.com, hello@thenifemiexperience.com, admin@tne.com)
    if (cleanEmail === 'oluwanifemiadepitan46@gmail.com' || cleanEmail === 'hello@thenifemiexperience.com' || cleanEmail === 'admin@tne.com') {
      if (cleanEmail === 'oluwanifemiadepitan46@gmail.com' && password && password !== 'Oyinkansola@1') {
        throw new Error("Invalid password for Super Admin account.");
      }
      const adminUser = { 
        id: 'admin-super', 
        name: cleanEmail === 'oluwanifemiadepitan46@gmail.com' ? 'Adepitan Oluwanifemi' : 'Nifemi', 
        email: cleanEmail, 
        role: 'Super Admin',
        status: 'Active'
      };
      setCurrentUser(adminUser);
      localStorage.setItem('tne_current_user', JSON.stringify(adminUser));
      return adminUser;
    }

    const users = JSON.parse(localStorage.getItem('tne_users') || '[]');
    const user = users.find(u => (u.email || '').toLowerCase() === cleanEmail);

    if (user) {
      if (user.password && password && user.password !== password) {
        throw new Error("Invalid password for this account.");
      }
      setCurrentUser(user);
      localStorage.setItem('tne_current_user', JSON.stringify(user));
      return user;
    }

    const newUser = { id: `usr-${Date.now()}`, name: cleanEmail.split('@')[0], email: cleanEmail, role: 'Customer' };
    setCurrentUser(newUser);
    localStorage.setItem('tne_current_user', JSON.stringify(newUser));
    return newUser;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <GiftingContext.Provider value={{
      products,
      orders,
      atelierOptions,
      cart,
      wishlist,
      currentUser,
      recentlyViewed,
      toast,
      showToast,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      addRecentView,
      placeOrder,
      updateOrderStatus,
      addProduct,
      editProduct,
      deleteProduct,
      updateAtelierOptions,
      handleRegister,
      handleLogin,
      handleLogout
    }}>
      {children}
    </GiftingContext.Provider>
  );
};
