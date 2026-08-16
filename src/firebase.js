import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// User Official Live Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC53LQNidhB-X2RgsalDRg7Cz764oRjiks",
  authDomain: "tne-website-62f66.firebaseapp.com",
  projectId: "tne-website-62f66",
  storageBucket: "tne-website-62f66.firebasestorage.app",
  messagingSenderId: "1024497917580",
  appId: "1:1024497917580:web:78a0ed4fe1be388f6865a9",
  measurementId: "G-T9EPTP4CPB"
};

let app;
let db;
let auth;
let storage;
let isMock = false;

try {
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("MOCK_API_KEY")) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    isMock = false;
    console.log("Firebase Live Database & Cloud Storage Initialized Successfully!");
  } else {
    isMock = true;
  }
} catch (e) {
  console.warn("Firebase failed to initialize. Falling back to local state storage mock.", e);
  isMock = true;
}

// Upload File / Data URL to Firebase Cloud Storage
export const uploadImageToFirebaseStorage = async (fileOrDataUrl, pathPrefix = 'products') => {
  if (!isMock && storage) {
    try {
      const fileName = `${pathPrefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const storageRef = ref(storage, `${pathPrefix}/${fileName}`);
      
      let blob;
      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
        const res = await fetch(fileOrDataUrl);
        blob = await res.blob();
      } else {
        blob = fileOrDataUrl;
      }
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (e) {
      console.warn("Firebase Storage upload fallback:", e);
    }
  }
  return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
};

// Highly reliable Mock Firestore that persists to localStorage when in development/mock mode
const mockStore = {
  orders: JSON.parse(localStorage.getItem('tne_orders') || '[]'),
  products: JSON.parse(localStorage.getItem('tne_products') || JSON.stringify([
    {
      id: 'watch-1',
      name: 'Customized Watch',
      price: 27000,
      image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80',
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

const CLOUD_SYNC_URL = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a009ed450c2aa9';

// Global Cloud Sync Pusher (Only pushes when an explicit Admin action is triggered)
let syncDebounceTimer = null;
export const pushToCloudDatabase = (force = false) => {
  if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
  syncDebounceTimer = setTimeout(async () => {
    try {
      await fetch(CLOUD_SYNC_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'TNE_STOREFRONT',
          data: {
            products: mockStore.products,
            orders: mockStore.orders,
            atelierOptions: mockStore.atelierOptions,
            users: mockStore.users,
            updatedAt: Date.now()
          }
        })
      });
      console.log("Cloud Master Catalog updated successfully.");
    } catch (e) {
      console.warn("Cloud sync push error:", e);
    }
  }, 300);
};

// Global Cloud Sync Puller - Overwrites local storage with Cloud Master Catalog
export const pullFromCloudDatabase = async () => {
  try {
    const res = await fetch(CLOUD_SYNC_URL);
    if (res.ok) {
      const result = await res.json();
      if (result && result.data) {
        if (Array.isArray(result.data.products)) {
          mockStore.products = [...result.data.products];
          localStorage.setItem('tne_products', JSON.stringify(result.data.products));
        }
        if (Array.isArray(result.data.orders)) {
          mockStore.orders = [...result.data.orders];
          localStorage.setItem('tne_orders', JSON.stringify(result.data.orders));
        }
        if (result.data.atelierOptions) {
          mockStore.atelierOptions = { ...result.data.atelierOptions };
          localStorage.setItem('tne_atelier_options', JSON.stringify(result.data.atelierOptions));
        }
        if (Array.isArray(result.data.users) && result.data.users.length > 0) {
          mockStore.users = [...result.data.users];
          localStorage.setItem('tne_users', JSON.stringify(result.data.users));
        }
      }
    }
  } catch (e) {
    console.warn("Cloud sync pull error:", e);
  }
};

// Database state syncer with quota protection
const syncMock = () => {
  try {
    localStorage.setItem('tne_orders', JSON.stringify(mockStore.orders));
    localStorage.setItem('tne_products', JSON.stringify(mockStore.products));
    localStorage.setItem('tne_users', JSON.stringify(mockStore.users));
    localStorage.setItem('tne_atelier_options', JSON.stringify(mockStore.atelierOptions));
  } catch (err) {
    console.warn("Storage quota limit reached. Cleaning heavy image buffers to preserve inventory...", err);
    try {
      const optimizedProducts = mockStore.products.map(p => ({
        ...p,
        image: (p.image && p.image.length > 80000) 
          ? 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80' 
          : p.image
      }));
      localStorage.setItem('tne_products', JSON.stringify(optimizedProducts));
      localStorage.setItem('tne_orders', JSON.stringify(mockStore.orders));
    } catch (e) {
      console.error("Critical storage write failure:", e);
    }
  }
  pushToCloudDatabase();
};

// Reset orders and users for clean start
export const resetDatabaseOrdersAndUsers = async () => {
  mockStore.orders = [];
  mockStore.users = [
    { id: 'user-admin', name: 'Nifemi Admin', email: 'admin@tne.com', role: 'Admin', date: new Date().toLocaleDateString() }
  ];
  localStorage.removeItem('tne_orders');
  localStorage.setItem('tne_users', JSON.stringify(mockStore.users));
  syncMock();
};

export const getUsersFromDb = async () => {
  if (!isMock && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (items.length === 0) {
        for (const u of mockStore.users) {
          await setDoc(doc(db, "users", u.id), u);
        }
        return mockStore.users;
      }
      return items;
    } catch (e) {
      console.warn("Firestore users fetch fallback:", e);
      return mockStore.users;
    }
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
  if (!isMock && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (items.length === 0) {
        // Seed default products into fresh live Firestore
        for (const p of mockStore.products) {
          await setDoc(doc(db, "products", p.id), p);
        }
        return mockStore.products;
      }
      return items;
    } catch (e) {
      console.warn("Firestore fetch fallback:", e);
      return mockStore.products;
    }
  } else {
    await pullFromCloudDatabase();
    return mockStore.products;
  }
};

export const addProductToDb = async (productData) => {
  let finalImage = productData.image;
  if (!isMock && storage && productData.image && productData.image.startsWith('data:')) {
    finalImage = await uploadImageToFirebaseStorage(productData.image, 'products');
  }
  const payload = { ...productData, image: finalImage };

  if (!isMock && db) {
    try {
      const newId = `prod-${Date.now()}`;
      await setDoc(doc(db, "products", newId), { id: newId, ...payload });
      return newId;
    } catch (e) {
      console.error("Firestore add error:", e);
    }
  }
  
  const newProduct = { id: `prod-${Date.now()}`, ...payload, reviews: [] };
  mockStore.products.push(newProduct);
  syncMock();
  return newProduct.id;
};

export const editProductInDb = async (productId, updatedData) => {
  let payload = { ...updatedData };
  if (!isMock && storage && updatedData.image && updatedData.image.startsWith('data:')) {
    payload.image = await uploadImageToFirebaseStorage(updatedData.image, 'products');
  }

  if (!isMock && db) {
    try {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, payload);
    } catch (e) {
      console.error("Firestore update error:", e);
    }
  }
  mockStore.products = mockStore.products.map(p => p.id === productId ? { ...p, ...payload } : p);
  syncMock();
};

export const deleteProductFromDb = async (productId) => {
  if (!isMock && db) {
    try {
      const docRef = doc(db, "products", productId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Firestore delete error:", e);
    }
  }
  mockStore.products = mockStore.products.filter(p => p.id !== productId);
  syncMock();
};

export const getOrdersFromDb = async () => {
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "orders"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } else {
    await pullFromCloudDatabase();
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
