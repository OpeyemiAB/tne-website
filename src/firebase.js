import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Standard Firebase config - users can replace this with their actual config credentials
const firebaseConfig = {
  apiKey: "MOCK_API_KEY_TNE_UX_PORTFOLIO",
  authDomain: "tne-luxury.firebaseapp.com",
  projectId: "tne-luxury",
  storageBucket: "tne-luxury.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:mock123"
};

let app;
let db;
let auth;
let isMock = true;

try {
  // If the user replaces MOCK_API_KEY with a real key, this will connect to the live database
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("MOCK_API_KEY")) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    isMock = false;
  }
} catch (e) {
  console.warn("Firebase failed to initialize. Falling back to local state storage mock.", e);
}

// Highly reliable Mock Firestore that persists to localStorage when in development/mock mode
const mockStore = {
  orders: JSON.parse(localStorage.getItem('tne_orders') || '[]'),
  products: JSON.parse(localStorage.getItem('tne_products') || JSON.stringify([
    {
      id: 'watch-1',
      name: 'Customized Watch',
      price: 27000,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Elegant golden mesh watch, custom engraved with initials or special message on the caseback.',
      customizable: true,
      features: ['Stainless steel gold mesh band', 'Japanese quartz movement', 'Custom engraving on back'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'Gorgeous finish, looks extremely premium!', user: 'Bisi' }]
    },
    {
      id: 'necklace-1',
      name: 'Customized Necklace',
      price: 17500,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom nameplate pendant necklace plated in 18k champagne gold.',
      customizable: true,
      features: ['18k Gold Plated', 'Custom name engraving', 'Adjustable 16-18 inch chain'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'Perfect anniversary gift, my wife loved the typography.', user: 'Ade' }]
    },
    {
      id: 'bracelet-1',
      name: 'Engraved Bracelet',
      price: 13000,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Sleek open-cuff bracelet in premium gold metal, custom engraved with date or message.',
      customizable: true,
      features: ['Polished gold coating', 'Inner or outer custom engraving', 'Flexible cuff style'],
      inStock: true,
      reviews: []
    },
    {
      id: 'box-signature',
      name: 'Luxury Gift Box',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'TNE Gift Curation',
      description: 'Our signature deep emerald gift box decorated with a luxury gold satin bow. Includes a customized journal, scented candle, and gold watch.',
      customizable: false,
      features: ['Custom emerald green rigid box', 'Handmade gold satin ribbon', 'Includes 3 premium luxury products'],
      inStock: true,
      reviews: []
    },
    {
      id: 'perfume-set',
      name: 'Perfume Set',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
      category: 'TNE Beauty',
      description: 'Exquisite dual perfume gift set featuring our signature TNE fragrance collection.',
      customizable: false,
      features: ['2x 50ml EDP bottles', 'Long-lasting signature scent', 'Elegant gold cap detailing'],
      inStock: true,
      reviews: []
    }
  ])),
  users: JSON.parse(localStorage.getItem('tne_users') || JSON.stringify([
    { id: 'user-admin-1', name: 'Adepitan Oluwanifemi', email: 'oluwanifemiadepitan46@gmail.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() },
    { id: 'user-admin-2', name: 'Nifemi', email: 'hello@thenifemiexperience.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() }
  ])),
  atelierOptions: JSON.parse(localStorage.getItem('tne_atelier_options') || JSON.stringify({
    boxSizes: [
      { id: 'Starter', name: 'Starter Gift Box', price: 10000, maxItems: 3, includedItems: 'Leather Keyholder, QR Greeting Card', available: true },
      { id: 'Classic', name: 'Classic Luxury Box', price: 25000, maxItems: 5, includedItems: 'Leather Keyholder, QR Greeting Card, Scented Glass Candle', available: true },
      { id: 'Premium', name: 'Premium Grandeur Box', price: 55000, maxItems: 8, includedItems: 'Leather Keyholder, QR Greeting Card, Scented Glass Candle, Customized Gold Watch', available: true },
      { id: 'Signature', name: 'Signature Executive Box', price: 120000, maxItems: 12, includedItems: 'Leather Keyholder, QR Greeting Card, Scented Glass Candle, Customized Gold Watch, Luxury Perfume, Deluxe Chocolate Box', available: true }
    ],
    ribbons: [
      { id: 'Gold', name: 'Champagne Gold Satin', colorCode: '#D4AF37', available: true },
      { id: 'Emerald', name: 'Deep Emerald Green', colorCode: '#004B49', available: true },
      { id: 'Navy', name: 'Royal Navy Silk', colorCode: '#1E3A8A', available: true },
      { id: 'Ruby Red', name: 'Ruby Red Velvet', colorCode: '#991B1B', available: true }
    ],
    cards: [
      { id: 'Floral Clean', name: 'Floral Elegance', available: true },
      { id: 'Gold Foil', name: 'Champagne Gold Foil', available: true },
      { id: 'Minimal', name: 'Modern Minimalist', available: true }
    ]
  }))
};

// Multi-device Central Cloud Syncer (/api/sync)
const syncMock = () => {
  localStorage.setItem('tne_orders', JSON.stringify(mockStore.orders));
  localStorage.setItem('tne_products', JSON.stringify(mockStore.products));
  localStorage.setItem('tne_users', JSON.stringify(mockStore.users));
  localStorage.setItem('tne_atelier_options', JSON.stringify(mockStore.atelierOptions));

  // Push updates to central cloud API so phones, laptops, and all admin devices sync instantly
  try {
    const payload = {
      orders: mockStore.orders,
      products: mockStore.products,
      users: mockStore.users,
      atelierOptions: mockStore.atelierOptions
    };
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {});
  } catch (e) {}
};

// Initial & Periodic Cloud Fetch across all devices
export const syncCloudStateOnLoad = async () => {
  try {
    const res = await fetch('/api/sync');
    if (res.ok) {
      const data = await res.json();
      if (data) {
        if (data.products && data.products.length > 0) mockStore.products = data.products;
        if (data.orders) mockStore.orders = data.orders;
        if (data.users && data.users.length > 0) mockStore.users = data.users;
        if (data.atelierOptions) mockStore.atelierOptions = data.atelierOptions;

        localStorage.setItem('tne_products', JSON.stringify(mockStore.products));
        localStorage.setItem('tne_orders', JSON.stringify(mockStore.orders));
        localStorage.setItem('tne_users', JSON.stringify(mockStore.users));
        localStorage.setItem('tne_atelier_options', JSON.stringify(mockStore.atelierOptions));
      }
    }
  } catch (e) {}
};
syncCloudStateOnLoad();

// Auto-sync in background every 8 seconds for live multi-device updates
if (typeof window !== 'undefined') {
  setInterval(syncCloudStateOnLoad, 8000);
}

// Reset orders and users for clean start
export const resetDatabaseOrdersAndUsers = async () => {
  mockStore.orders = [];
  mockStore.users = [
    { id: 'user-admin-1', name: 'Adepitan Oluwanifemi', email: 'oluwanifemiadepitan46@gmail.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() },
    { id: 'user-admin-2', name: 'Nifemi', email: 'hello@thenifemiexperience.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() }
  ];
  localStorage.removeItem('tne_orders');
  localStorage.setItem('tne_users', JSON.stringify(mockStore.users));
  syncMock();
};

export const getUsersFromDb = async () => {
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    const stored = JSON.parse(localStorage.getItem('tne_users') || '[]');
    if (stored && stored.length > 0) {
      mockStore.users = stored;
    }
    return mockStore.users;
  }
};

export const addUserToDb = async (userData) => {
  const newUser = {
    id: `user-${Date.now()}`,
    date: new Date().toLocaleDateString(),
    role: 'Staff',
    status: 'Active',
    ...userData
  };
  if (!isMock) {
    await setDoc(doc(db, "users", newUser.id), newUser);
  } else {
    const existingIdx = mockStore.users.findIndex(u => (u.email || '').toLowerCase() === (userData.email || '').toLowerCase());
    if (existingIdx > -1) {
      mockStore.users[existingIdx] = { ...mockStore.users[existingIdx], ...userData };
    } else {
      mockStore.users.push(newUser);
    }
    syncMock();
  }
  return newUser.id;
};

export const updateUserStatusInDb = async (email, status) => {
  const clean = (email || '').toLowerCase();
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "users"));
    const docMatch = querySnapshot.docs.find(d => (d.data().email || '').toLowerCase() === clean);
    if (docMatch) {
      await updateDoc(doc(db, "users", docMatch.id), { status });
    }
  } else {
    mockStore.users = mockStore.users.map(u => (u.email || '').toLowerCase() === clean ? { ...u, status } : u);
    syncMock();
  }
};

export const deleteUserFromDb = async (email) => {
  const clean = (email || '').toLowerCase();
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "users"));
    const docMatch = querySnapshot.docs.find(d => (d.data().email || '').toLowerCase() === clean);
    if (docMatch) {
      await deleteDoc(doc(db, "users", docMatch.id));
    }
  } else {
    mockStore.users = mockStore.users.filter(u => (u.email || '').toLowerCase() !== clean);
    syncMock();
  }
};

// Helper methods that match Firestore APIs
export const getProductsFromDb = async () => {
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "products"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return mockStore.products;
  }
};

export const addProductToDb = async (productData) => {
  const imagesList = (productData.images && productData.images.length > 0) 
    ? productData.images 
    : (productData.image ? [productData.image] : []);
  const mainImage = imagesList[0] || productData.image || '';

  const newProduct = {
    id: `prod-${Date.now()}`,
    reviews: [],
    ...productData,
    image: mainImage,
    images: imagesList
  };

  if (!isMock) {
    const docRef = await addDoc(collection(db, "products"), newProduct);
    return docRef.id;
  } else {
    mockStore.products.push(newProduct);
    syncMock();
    return newProduct.id;
  }
};

export const editProductInDb = async (productId, updatedData) => {
  if (!isMock) {
    const docRef = doc(db, "products", productId);
    await updateDoc(docRef, updatedData);
  } else {
    mockStore.products = mockStore.products.map(p => p.id === productId ? { ...p, ...updatedData } : p);
    syncMock();
  }
};

export const deleteProductFromDb = async (productId) => {
  if (!isMock) {
    const docRef = doc(db, "products", productId);
    await deleteDoc(docRef);
  } else {
    mockStore.products = mockStore.products.filter(p => p.id !== productId);
    syncMock();
  }
};

export const getOrdersFromDb = async () => {
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "orders"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    return mockStore.orders;
  }
};

export const addOrderToDb = async (orderData) => {
  const now = new Date();
  const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const fullTimestamp = `${formattedDate} at ${formattedTime}`;

  const finalOrder = {
    id: `TNE-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'Pending',
    date: formattedDate,
    timestamp: fullTimestamp,
    createdAt: now.toISOString(),
    ...orderData
  };
  
  if (!isMock) {
    await setDoc(doc(db, "orders", finalOrder.id), finalOrder);
    return finalOrder.id;
  } else {
    mockStore.orders.unshift(finalOrder);
    syncMock();
    return finalOrder.id;
  }
};

export const clearAllOrdersFromDb = async () => {
  mockStore.orders = [];
  localStorage.removeItem('tne_orders');
  syncMock();
};

export const updateOrderStatusInDb = async (orderId, status, paymentStatus) => {
  const updatePayload = { status };
  if (paymentStatus) updatePayload.paymentStatus = paymentStatus;

  if (!isMock) {
    const docRef = doc(db, "orders", orderId);
    await updateDoc(docRef, updatePayload);
  } else {
    mockStore.orders = mockStore.orders.map(o => o.id === orderId ? { ...o, ...updatePayload } : o);
    syncMock();
  }
};

export const getOrderDetails = async (orderId) => {
  const clean = (orderId || '').trim().replace(/^#/, '').toLowerCase();
  if (!isMock) {
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) return docSnap.data();

    const querySnapshot = await getDocs(collection(db, "orders"));
    const match = querySnapshot.docs.find(d => {
      const dId = d.id.replace(/^#/, '').toLowerCase();
      return dId === clean;
    });
    return match ? match.data() : null;
  } else {
    const match = mockStore.orders.find(o => {
      const oId = (o.id || '').replace(/^#/, '').toLowerCase();
      return oId === clean;
    });
    return match || null;
  }
};

export const getAtelierOptionsFromDb = async () => {
  if (!isMock) {
    const docRef = doc(db, "settings", "atelier");
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : mockStore.atelierOptions;
  } else {
    return mockStore.atelierOptions;
  }
};

export const updateAtelierOptionsInDb = async (updatedOptions) => {
  if (!isMock) {
    const docRef = doc(db, "settings", "atelier");
    await setDoc(docRef, updatedOptions, { merge: true });
  } else {
    mockStore.atelierOptions = { ...mockStore.atelierOptions, ...updatedOptions };
    syncMock();
  }
};

export { db, auth, isMock };
