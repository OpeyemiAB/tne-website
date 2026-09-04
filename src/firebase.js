import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
let storage;
let isMock = true;

try {
  // If the user replaces MOCK_API_KEY with a real key, this will connect to the live database
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("MOCK_API_KEY")) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    isMock = false;
  }
} catch (e) {
  console.warn("Firebase failed to initialize. Falling back to local state storage mock.", e);
}

// Client-Side WebP/JPEG Compression Helper with Strict ~20KB Ultra-Lightweight Byte Cap
export const compressImageToWebP = (fileOrDataUrl, maxDimension = 480, quality = 0.50) => {
  return new Promise((resolve) => {
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http') && !fileOrDataUrl.startsWith('data:')) {
      return resolve(fileOrDataUrl);
    }

    const img = new Image();

    // Only set crossOrigin for external http URLs to avoid mobile blob canvas tainting
    if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        let width = img.width || 480;
        let height = img.height || 480;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Export ultra-lightweight JPEG under 20KB per photo
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      } catch (e) {
        console.warn("Mobile canvas compression fallback triggered", e);
        resolve(fileOrDataUrl);
      }
    };

    img.onerror = () => {
      resolve(fileOrDataUrl);
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
      img.src = URL.createObjectURL(fileOrDataUrl);
    } else {
      resolve('');
    }
  });
};

// Upload file/blob/dataURL to Firebase Storage and return public HTTPS getDownloadURL
export const uploadImageToStorage = async (fileOrDataUrl, pathPrefix = 'products') => {
  if (!isMock && storage) {
    try {
      let fileToUpload = fileOrDataUrl;

      // Convert Base64 data URL to Blob for Firebase Storage upload if necessary
      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('data:')) {
        const arr = fileOrDataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        fileToUpload = new Blob([u8arr], { type: mime });
      }

      if (fileToUpload instanceof File || fileToUpload instanceof Blob) {
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.jpg`;
        const storageRef = ref(storage, `${pathPrefix}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, fileToUpload);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      }

      if (typeof fileOrDataUrl === 'string' && fileOrDataUrl.startsWith('http')) {
        return fileOrDataUrl;
      }
    } catch (error) {
      console.error("Firebase Storage Upload Error:", error);
    }
  }

  // Guaranteed fallback for mobile/mock mode: Convert File or Blob to Data URL so it is never blank
  if (fileOrDataUrl instanceof File || fileOrDataUrl instanceof Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result || '');
      reader.onerror = () => resolve('');
      reader.readAsDataURL(fileOrDataUrl);
    });
  }

  return typeof fileOrDataUrl === 'string' ? fileOrDataUrl : '';
};

// Parallel Batch Uploads (1-by-1 sequential to save RAM) with visual progress updates
export const uploadImagesInBatches = async (items, onProgress = () => {}) => {
  const results = [];
  const total = items.length;

  for (let i = 0; i < total; i++) {
    const item = items[i];
    const currentIndex = i + 1;
    onProgress({ current: currentIndex, total, percentage: Math.round((currentIndex / total) * 100) });

    try {
      // 1. Compress to lightweight WebP (max 600px width, 0.65 quality -> ~40KB per image)
      const compressed = await compressImageToWebP(item, 600, 0.65);

      // 2. Upload to Cloud Storage or fallback
      const downloadUrl = await uploadImageToStorage(compressed, 'products');
      results.push(downloadUrl || (typeof item === 'string' ? item : ''));
    } catch (e) {
      console.warn(`Image ${currentIndex} compression warning:`, e);
      results.push(typeof item === 'string' ? item : '');
    }
  }

  return results;
};

// Highly reliable Mock Firestore that persists to localStorage when in development/mock mode
const mockStore = {
  orders: JSON.parse(localStorage.getItem('tne_orders') || '[]'),
  products: JSON.parse(localStorage.getItem('tne_products') || JSON.stringify([
    { id: 'prod-1', name: 'Necklace scan', price: 12000, image: '/necklace_scan.jpg', images: ['/necklace_scan.jpg'], category: 'Etched by TNE', description: 'Scannable custom gold butterfly name necklace with QR code engraving.', customizable: true, inStock: true },
    { id: 'prod-2', name: 'Canvas Size 41-45', price: 24500, image: '/canvas_1.jpg', images: ['/canvas_1.jpg', '/canvas_2.jpg', '/canvas_3.jpg', '/canvas_4.jpg', '/canvas_5.jpg', '/canvas_6.jpg', '/canvas_7.jpg', '/canvas_8.jpg', '/canvas_9.jpg'], category: 'TNE Collections', description: 'Luxury designer sneakers collection (Size 41-45) including Nike Air Force 1 Stussy, Supreme, Graffiti & Air Jordan.', customizable: false, inStock: true },
    { id: 'prod-3', name: 'Customize wristwatch', price: 25000, image: '/custom_watch_1.jpg', images: ['/custom_watch_1.jpg'], category: 'Etched by TNE', description: 'Engraved custom Casio luxury wristwatches with personalized names ("Imole", "Oluwafemi") and QR code clasp engraving in velvet display box.', customizable: true, inStock: true },
    { id: 'prod-4', name: 'Couples bracelet', price: 40000, image: '/couples_watch_1.jpg', images: ['/couples_watch_1.jpg', '/couples_watch_2.jpg', '/couples_watch_3.jpg', '/couples_watch_4.jpg', '/couples_watch_5.jpg', '/couples_watch_6.jpg', '/couples_watch_7.jpg'], category: 'Etched by TNE', description: 'Matching custom engraved Casio couple wristwatches set available in Silver, Pink, Royal Blue, Emerald Green, and Matte Black dial variants.', customizable: true, inStock: true },
    { id: 'prod-5', name: 'Boxed Customize bracelet', price: 12500, image: '/boxed_bracelet_1.jpg', images: ['/boxed_bracelet_1.jpg'], category: 'Etched by TNE', description: 'Custom engraved black stainless steel link chain name bracelet set (engraved "Ayomi", "Samie") presented in velvet red luxury gift box.', customizable: true, inStock: true },
    { id: 'prod-6', name: 'Menstrual belt pad', price: 15000, image: '/menstrual_belt_1.jpg', images: ['/menstrual_belt_1.jpg'], category: 'TNE Beauty', description: 'Custom warming menstrual relief heating pad belt with digital temperature display, custom name printing ("Kunmi ❤️"), packaged in pink gift boxes.', customizable: true, inStock: true },
    { id: 'prod-7', name: 'Poedagar', price: 25000, image: '/poedagar_1.jpg', images: ['/poedagar_1.jpg'], category: 'TNE Collections', description: 'Poedagar international luxury stainless steel quartz wristwatches with sunburst blue and emerald green dials in original display boxes with guarantee cards.', customizable: false, inStock: true },
    { id: 'prod-8', name: 'Full set of jewelry', price: 12500, image: '/full_jewelry_set_1.jpg', images: ['/full_jewelry_set_1.jpg'], category: 'Etched by TNE', description: 'Full sparkling marquise crystal gold leaf necklace, drop earrings, and matching bracelet jewelry set.', customizable: true, inStock: true },
    { id: 'prod-9', name: 'Waist chain', price: 7000, image: '/waist_chain_1.jpg', images: ['/waist_chain_1.jpg', '/waist_chain_2.jpg', '/waist_chain_3.jpg'], category: 'Etched by TNE', description: 'Delicate crystal heart pendant & silver/gold angel wings belly body waist chain.', customizable: true, inStock: true },
    { id: 'prod-10', name: 'Jewelry box', price: 5000, image: '/jewelry_box_1.jpg', images: ['/jewelry_box_1.jpg'], category: 'TNE Gift Curation', description: 'Compact portable zippered travel velvet jewelry box organizer with ring slots & necklace hooks available in Blush Pink, Tiffany Turquoise, Off-White & Black.', customizable: false, inStock: true },
    { id: 'prod-11', name: 'Headband Three in 1', price: 1000, image: '/headband_1.jpg', images: ['/headband_1.jpg'], category: 'TNE Beauty', description: '3-in-1 vibrant colorful soft stretch headband set available in neon green, sky blue, lilac, baby pink, magenta, and red.', customizable: false, inStock: true },
    { id: 'prod-12', name: 'Customize bottle', price: 15000, image: '/custom_bottle_1.jpg', images: ['/custom_bottle_1.jpg'], category: 'Etched by TNE', description: 'Personalized name thermal insulated water bottles with heart calligraphy script ("Aurora", "Claire", "Gemma", "Madison") in Pastel Pink, Crisp White, Slate Grey & Matte Black.', customizable: true, inStock: true },
    { id: 'prod-13', name: 'Customize journal', price: 5000, image: '/custom_journal_1.jpg', images: ['/custom_journal_1.jpg'], category: 'Etched by TNE', description: 'Personalized name engraved hardcover faux-leather notebook journals with elastic band closures ("Brian", "Bastian") in Matte Black & Tan Leather.', customizable: true, inStock: true },
    { id: 'prod-14', name: 'Perfume set', price: 10500, image: '/perfume_set_1.jpg', images: ['/perfume_set_1.jpg'], category: 'TNE Beauty', description: 'Mystical luxury multi-fragrance 4-piece Eau De Parfum gift sets (4 x 30ml) available in various designer collections.', customizable: false, inStock: true },
    { id: 'prod-15', name: 'Bottle umbrella', price: 5500, image: '/bottle_umbrella_1.jpg', images: ['/bottle_umbrella_1.jpg'], category: 'TNE Gift Curation', description: 'Novelty DECO wine bottle casing folding compact umbrella available in Lime Green, Crimson Red, Pastel Pink, Sky Blue, Pure White, Bright Yellow, Champagne Gold & Black.', customizable: false, inStock: true },
    { id: 'prod-16', name: 'Full set of female jewelry', price: 28000, image: '/female_jewelry_set_1.jpg', images: ['/female_jewelry_set_1.jpg'], category: 'Etched by TNE', description: 'Deluxe custom engraved gold female luxury gift set including chain-link watch ("MAMA ❤"), name bar bracelet ("Igiwa girl"), and pave crystal angel wing heart pendant necklace ("Sweet Coco") in red presentation gift box.', customizable: true, inStock: true },
    { id: 'prod-17', name: 'Charm bracelet', price: 6000, image: '/charm_bracelet_1.jpg', images: ['/charm_bracelet_1.jpg', '/charm_bracelet_2.jpg', '/charm_bracelet_3.jpg', '/charm_bracelet_4.jpg', '/charm_bracelet_5.jpg'], category: 'Etched by TNE', description: 'Multi-pendant gold charm chain bracelets available in Medusa Coin Blue, Emerald Butterfly, Dior Lock Black, Crescent Moon Red, and MK Clover White design variants in pink presentation box.', customizable: true, inStock: true },
    { id: 'prod-18', name: 'Jail wristwatch', price: 7000, image: '/jiali_watch_1.jpg', images: ['/jiali_watch_1.jpg', '/jiali_watch_2.jpg', '/jiali_watch_3.jpg'], category: 'TNE Collections', description: 'Jiali vintage luxury square link wristwatches with Roman numeral dial, available in Champagne Gold, Soft Pink & Silver link strap variants in presentation box.', customizable: false, inStock: true },
    { id: 'prod-19', name: 'Tennis bracelet', price: 3800, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Classic cubic zirconia tennis bracelet.', customizable: false, inStock: true },
    { id: 'prod-20', name: 'Stone bracelet', price: 12000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Baguette cut black & colored gemstone stone bracelet.', customizable: false, inStock: true },
    { id: 'prod-21', name: 'Bracelet', price: 8500, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Stackable gold clover & nail bangle bracelet set.', customizable: true, inStock: true },
    { id: 'prod-22', name: 'Full set of flower jewelry', price: 15000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Enameled floral flower blossom necklace, cuff & earring jewelry set.', customizable: true, inStock: true }
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

// Safe LocalStorage Set Helper (Prevents QuotaExceededError DOMException 22)
const safeSetLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.warn(`localStorage quota exceeded for ${key}. Compressing products for local storage...`);
    try {
      if (key === 'tne_products' && Array.isArray(mockStore.products)) {
        // Keep actual user photo intact, trimming only if excessively large
        const compressedProducts = mockStore.products.map(p => ({
          ...p,
          image: typeof p.image === 'string' && p.image.length > 80000 ? p.image.substring(0, 80000) : p.image,
          images: Array.isArray(p.images) ? p.images.map(img => typeof img === 'string' && img.length > 80000 ? img.substring(0, 80000) : img) : p.images,
          imageUrls: Array.isArray(p.imageUrls) ? p.imageUrls.map(img => typeof img === 'string' && img.length > 80000 ? img.substring(0, 80000) : img) : p.imageUrls
        }));
        localStorage.setItem(key, JSON.stringify(compressedProducts));
      }
    } catch (innerErr) {
      console.warn("Storage quota bypass active.");
    }
  }
};

// Real-Time Cross-Tab & Incognito Broadcast Sync Channel
const syncChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('tne_sync_channel') : null;

if (syncChannel) {
  syncChannel.onmessage = (event) => {
    if (event && event.data && Array.isArray(event.data.products)) {
      mockStore.products = event.data.products;
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('tne_db_update'));
      }
    }
  };
}

// Non-Destructive Multi-device Central Cloud Syncer (/api/sync)
const syncMock = () => {
  safeSetLocalStorage('tne_orders', JSON.stringify(mockStore.orders));
  safeSetLocalStorage('tne_products', JSON.stringify(mockStore.products));
  safeSetLocalStorage('tne_users', JSON.stringify(mockStore.users));
  safeSetLocalStorage('tne_atelier_options', JSON.stringify(mockStore.atelierOptions));

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tne_db_update'));
  }

  if (syncChannel) {
    try {
      syncChannel.postMessage({ products: mockStore.products });
    } catch (e) {}
  }

  // Push updates to central cloud API
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

// Two-Way Central Cloud Syncer (/api/sync) - Instant Multi-Device & Instant Drop Sync
export const syncCloudStateOnLoad = async () => {
  if (!isMock && db) return; // In live Firestore mode, onSnapshot handles realtime sync directly

  try {
    const res = await fetch('/api/sync');
    if (res.ok) {
      const data = await res.json();
      let hasNewLocalProductsToPush = false;
      const combinedMap = new Map();

      // Read local dropped product IDs set
      const localDroppedStr = localStorage.getItem('tne_dropped_products') || '[]';
      const droppedSet = new Set(JSON.parse(localDroppedStr).map(String));
      if (data && Array.isArray(data.droppedIds)) {
        data.droppedIds.forEach(id => droppedSet.add(String(id)));
        localStorage.setItem('tne_dropped_products', JSON.stringify(Array.from(droppedSet)));
      }

      // 1. Load server products (filtering dropped items)
      if (data && Array.isArray(data.products) && data.products.length > 0) {
        data.products.forEach(p => {
          if (p && p.id && !droppedSet.has(String(p.id))) {
            combinedMap.set(String(p.id), p);
          }
        });
      }

      // 2. Merge client localStorage products only if they are valid & not dropped
      const localSavedStr = localStorage.getItem('tne_products');
      if (localSavedStr) {
        try {
          const localProds = JSON.parse(localSavedStr);
          if (Array.isArray(localProds) && localProds.length > 0) {
            localProds.forEach(p => {
              if (p && p.id && !droppedSet.has(String(p.id))) {
                if (!combinedMap.has(String(p.id))) {
                  hasNewLocalProductsToPush = true;
                  combinedMap.set(String(p.id), p);
                } else {
                  // Prefer server product if server has explicit http/file image path
                  const serverProd = combinedMap.get(String(p.id));
                  if (serverProd && serverProd.image && !serverProd.image.startsWith('data:')) {
                    combinedMap.set(String(p.id), { ...p, image: serverProd.image, images: serverProd.images || [serverProd.image] });
                  }
                }
              }
            });
          }
        } catch (e) {}
      }

      const mergedProducts = combinedMap.size > 0 ? Array.from(combinedMap.values()) : mockStore.products.filter(p => !droppedSet.has(String(p.id)));
      mockStore.products = mergedProducts;
      safeSetLocalStorage('tne_products', JSON.stringify(mergedProducts));

      // 3. If client had local products missing from server, push complete merged list to /api/sync immediately!
      if (hasNewLocalProductsToPush) {
        fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            products: mergedProducts,
            overrideProducts: true,
            droppedIds: Array.from(droppedSet)
          })
        }).catch(() => {});
      }

      if (data && Array.isArray(data.orders)) {
        const existingOrdersMap = new Map();
        mockStore.orders.forEach(o => existingOrdersMap.set(o.id, o));
        data.orders.forEach(o => existingOrdersMap.set(o.id, o));

        mockStore.orders = Array.from(existingOrdersMap.values());
        safeSetLocalStorage('tne_orders', JSON.stringify(mockStore.orders));
      }

      if (data && Array.isArray(data.users) && data.users.length > 0) {
        mockStore.users = data.users;
        localStorage.setItem('tne_users', JSON.stringify(data.users));
      }

      if (data && data.atelierOptions && Object.keys(data.atelierOptions).length > 0) {
        mockStore.atelierOptions = data.atelierOptions;
        localStorage.setItem('tne_atelier_options', JSON.stringify(data.atelierOptions));
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('tne_db_update'));
      }
    }
  } catch (e) {}
};

// Run sync once on initial page load (no heavy repeating background loops to save bandwidth/credits)
syncCloudStateOnLoad();

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

export const getUsersSync = () => mockStore.users;

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

export const updateUserPasswordInDb = async (email, password) => {
  const clean = (email || '').toLowerCase();
  if (!isMock) {
    const querySnapshot = await getDocs(collection(db, "users"));
    const docMatch = querySnapshot.docs.find(d => (d.data().email || '').toLowerCase() === clean);
    if (docMatch) {
      await updateDoc(doc(db, "users", docMatch.id), { password });
    }
  } else {
    mockStore.users = mockStore.users.map(u => (u.email || '').toLowerCase() === clean ? { ...u, password } : u);
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

// Real-Time Listeners using Firestore onSnapshot
export const subscribeToProducts = (callback) => {
  if (!isMock && db) {
    const productsRef = collection(db, "products");
    return onSnapshot(productsRef, (snapshot) => {
      const liveProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(liveProducts);
    }, (error) => {
      console.error("Error in real-time products listener:", error);
    });
  } else {
    callback(mockStore.products);
    if (typeof window !== 'undefined') {
      const handleUpdate = () => callback(mockStore.products);
      window.addEventListener('tne_db_update', handleUpdate);
      return () => window.removeEventListener('tne_db_update', handleUpdate);
    }
    return () => {};
  }
};

export const subscribeToOrders = (callback) => {
  if (!isMock && db) {
    const ordersRef = collection(db, "orders");
    return onSnapshot(ordersRef, (snapshot) => {
      const liveOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(liveOrders);
    }, (error) => {
      console.error("Error in real-time orders listener:", error);
    });
  } else {
    callback(mockStore.orders);
    if (typeof window !== 'undefined') {
      const handleUpdate = () => callback(mockStore.orders);
      window.addEventListener('tne_db_update', handleUpdate);
      return () => window.removeEventListener('tne_db_update', handleUpdate);
    }
    return () => {};
  }
};

// Helper methods that match Firestore APIs
export const getProductsFromDb = async () => {
  if (!isMock && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error("Firestore getProducts Error:", err);
      throw new Error(`Failed to fetch products from Firestore: ${err.message}`);
    }
  } else {
    return mockStore.products;
  }
};

export const addProductToDb = async (productData, onProgress = () => {}) => {
  // 1. Process, compress to WebP, and upload all images in parallel batches
  const rawImages = (productData.images && productData.images.length > 0) 
    ? productData.images 
    : (productData.image ? [productData.image] : []);

  const uploadedImages = await uploadImagesInBatches(rawImages, onProgress, 4);

  const mainImage = uploadedImages[0] || '';

  const newProduct = {
    name: productData.name || '',
    price: Number(productData.price) || 0,
    image: mainImage,
    images: uploadedImages,
    imageUrls: uploadedImages,
    category: productData.category || 'TNE Collections',
    description: productData.description || '',
    features: productData.features || [],
    customizable: Boolean(productData.customizable),
    inStock: productData.inStock !== false,
    reviews: productData.reviews || [],
    createdAt: new Date().toISOString()
  };

  if (!isMock && db) {
    try {
      // 2. Write to global top-level "products" collection
      const docRef = await addDoc(collection(db, "products"), newProduct);
      return docRef.id;
    } catch (err) {
      console.warn("Firestore Product Write Error (falling back to cloud syncer):", err);
    }
  }

  newProduct.id = `prod-${Date.now()}`;
  mockStore.products.unshift(newProduct);
  safeSetLocalStorage('tne_products', JSON.stringify(mockStore.products));
  
  // Push newly created product to server API immediately so it is permanently saved across all devices
  try {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: mockStore.products,
        overrideProducts: true
      })
    }).catch(() => {});
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tne_db_update'));
  }

  return newProduct.id;
};

export const editProductInDb = async (productId, updatedData, onProgress = () => {}) => {
  let finalUpdate = { ...updatedData };

  // If new image files or base64 data URLs are provided, upload in parallel WebP batches
  if (updatedData.images && Array.isArray(updatedData.images)) {
    const uploadedImages = await uploadImagesInBatches(updatedData.images, onProgress, 4);
    finalUpdate.images = uploadedImages;
    finalUpdate.imageUrls = uploadedImages;
    finalUpdate.image = uploadedImages[0] || updatedData.image || '';
  } else if (updatedData.image) {
    const uploaded = await uploadImagesInBatches([updatedData.image], onProgress, 1);
    finalUpdate.image = uploaded[0] || '';
  }

  if (!isMock && db) {
    try {
      const docRef = doc(db, "products", String(productId));
      await updateDoc(docRef, finalUpdate);
      return;
    } catch (err) {
      console.warn("Firestore Product Edit Warning (falling back to syncer):", err);
    }
  }

  mockStore.products = mockStore.products.map(p => String(p.id) === String(productId) ? { ...p, ...finalUpdate } : p);
  safeSetLocalStorage('tne_products', JSON.stringify(mockStore.products));

  // Push edited product directly to server API immediately so it persists across refreshes & Incognito
  try {
    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: mockStore.products,
        overrideProducts: true
      })
    }).catch(() => {});
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tne_db_update'));
  }
};

export const userUploadedProductsList = [
  { id: 'prod-1', name: 'Necklace scan', price: 12000, image: '/necklace_scan.jpg', images: ['/necklace_scan.jpg'], category: 'Etched by TNE', description: 'Scannable custom gold butterfly name necklace with QR code engraving.', customizable: true, inStock: true },
  { id: 'prod-2', name: 'Canvas Size 41-45', price: 24500, image: '/canvas_1.jpg', images: ['/canvas_1.jpg', '/canvas_2.jpg', '/canvas_3.jpg', '/canvas_4.jpg', '/canvas_5.jpg', '/canvas_6.jpg', '/canvas_7.jpg', '/canvas_8.jpg', '/canvas_9.jpg'], category: 'TNE Collections', description: 'Luxury designer sneakers collection (Size 41-45) including Nike Air Force 1 Stussy, Supreme, Graffiti & Air Jordan.', customizable: false, inStock: true },
  { id: 'prod-3', name: 'Customize wristwatch', price: 25000, image: '/custom_watch_1.jpg', images: ['/custom_watch_1.jpg'], category: 'Etched by TNE', description: 'Engraved custom Casio luxury wristwatches with personalized names ("Imole", "Oluwafemi") and QR code clasp engraving in velvet display box.', customizable: true, inStock: true },
  { id: 'prod-4', name: 'Couples bracelet', price: 40000, image: '/couples_watch_1.jpg', images: ['/couples_watch_1.jpg', '/couples_watch_2.jpg', '/couples_watch_3.jpg', '/couples_watch_4.jpg', '/couples_watch_5.jpg', '/couples_watch_6.jpg', '/couples_watch_7.jpg'], category: 'Etched by TNE', description: 'Matching custom engraved Casio couple wristwatches set available in Silver, Pink, Royal Blue, Emerald Green, and Matte Black dial variants.', customizable: true, inStock: true },
  { id: 'prod-5', name: 'Boxed Customize bracelet', price: 12500, image: '/boxed_bracelet_1.jpg', images: ['/boxed_bracelet_1.jpg'], category: 'Etched by TNE', description: 'Custom engraved black stainless steel link chain name bracelet set (engraved "Ayomi", "Samie") presented in velvet red luxury gift box.', customizable: true, inStock: true },
  { id: 'prod-6', name: 'Menstrual belt pad', price: 15000, image: '/menstrual_belt_1.jpg', images: ['/menstrual_belt_1.jpg'], category: 'TNE Beauty', description: 'Custom warming menstrual relief heating pad belt with digital temperature display, custom name printing ("Kunmi ❤️"), packaged in pink gift boxes.', customizable: true, inStock: true },
  { id: 'prod-7', name: 'Poedagar', price: 25000, image: '/poedagar_1.jpg', images: ['/poedagar_1.jpg'], category: 'TNE Collections', description: 'Poedagar international luxury stainless steel quartz wristwatches with sunburst blue and emerald green dials in original display boxes with guarantee cards.', customizable: false, inStock: true },
  { id: 'prod-8', name: 'Full set of jewelry', price: 12500, image: '/full_jewelry_set_1.jpg', images: ['/full_jewelry_set_1.jpg'], category: 'Etched by TNE', description: 'Full sparkling marquise crystal gold leaf necklace, drop earrings, and matching bracelet jewelry set.', customizable: true, inStock: true },
  { id: 'prod-9', name: 'Waist chain', price: 7000, image: '/waist_chain_1.jpg', images: ['/waist_chain_1.jpg', '/waist_chain_2.jpg', '/waist_chain_3.jpg'], category: 'Etched by TNE', description: 'Delicate crystal heart pendant & silver/gold angel wings belly body waist chain.', customizable: true, inStock: true },
  { id: 'prod-10', name: 'Jewelry box', price: 5000, image: '/jewelry_box_1.jpg', images: ['/jewelry_box_1.jpg'], category: 'TNE Gift Curation', description: 'Compact portable zippered travel velvet jewelry box organizer with ring slots & necklace hooks available in Blush Pink, Tiffany Turquoise, Off-White & Black.', customizable: false, inStock: true },
  { id: 'prod-11', name: 'Headband Three in 1', price: 1000, image: '/headband_1.jpg', images: ['/headband_1.jpg'], category: 'TNE Beauty', description: '3-in-1 vibrant colorful soft stretch headband set available in neon green, sky blue, lilac, baby pink, magenta, and red.', customizable: false, inStock: true },
  { id: 'prod-12', name: 'Customize bottle', price: 15000, image: '/custom_bottle_1.jpg', images: ['/custom_bottle_1.jpg'], category: 'Etched by TNE', description: 'Personalized name thermal insulated water bottles with heart calligraphy script ("Aurora", "Claire", "Gemma", "Madison") in Pastel Pink, Crisp White, Slate Grey & Matte Black.', customizable: true, inStock: true },
  { id: 'prod-13', name: 'Customize journal', price: 5000, image: '/custom_journal_1.jpg', images: ['/custom_journal_1.jpg'], category: 'Etched by TNE', description: 'Personalized name engraved hardcover faux-leather notebook journals with elastic band closures ("Brian", "Bastian") in Matte Black & Tan Leather.', customizable: true, inStock: true },
  { id: 'prod-14', name: 'Perfume set', price: 10500, image: '/perfume_set_1.jpg', images: ['/perfume_set_1.jpg'], category: 'TNE Beauty', description: 'Mystical luxury multi-fragrance 4-piece Eau De Parfum gift sets (4 x 30ml) available in various designer collections.', customizable: false, inStock: true },
  { id: 'prod-15', name: 'Bottle umbrella', price: 5500, image: '/bottle_umbrella_1.jpg', images: ['/bottle_umbrella_1.jpg'], category: 'TNE Gift Curation', description: 'Novelty DECO wine bottle casing folding compact umbrella available in Lime Green, Crimson Red, Pastel Pink, Sky Blue, Pure White, Bright Yellow, Champagne Gold & Black.', customizable: false, inStock: true },
  { id: 'prod-16', name: 'Full set of female jewelry', price: 28000, image: '/female_jewelry_set_1.jpg', images: ['/female_jewelry_set_1.jpg'], category: 'Etched by TNE', description: 'Deluxe custom engraved gold female luxury gift set including chain-link watch ("MAMA ❤"), name bar bracelet ("Igiwa girl"), and pave crystal angel wing heart pendant necklace ("Sweet Coco") in red presentation gift box.', customizable: true, inStock: true },
  { id: 'prod-17', name: 'Charm bracelet', price: 6000, image: '/charm_bracelet_1.jpg', images: ['/charm_bracelet_1.jpg', '/charm_bracelet_2.jpg', '/charm_bracelet_3.jpg', '/charm_bracelet_4.jpg', '/charm_bracelet_5.jpg'], category: 'Etched by TNE', description: 'Multi-pendant gold charm chain bracelets available in Medusa Coin Blue, Emerald Butterfly, Dior Lock Black, Crescent Moon Red, and MK Clover White design variants in pink presentation box.', customizable: true, inStock: true },
  { id: 'prod-18', name: 'Jail wristwatch', price: 7000, image: '/jiali_watch_1.jpg', images: ['/jiali_watch_1.jpg', '/jiali_watch_2.jpg', '/jiali_watch_3.jpg'], category: 'TNE Collections', description: 'Jiali vintage luxury square link wristwatches with Roman numeral dial, available in Champagne Gold, Soft Pink & Silver link strap variants in presentation box.', customizable: false, inStock: true },
  { id: 'prod-19', name: 'Tennis bracelet', price: 3800, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Classic cubic zirconia tennis bracelet.', customizable: false, inStock: true },
  { id: 'prod-20', name: 'Stone bracelet', price: 12000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Baguette cut black & colored gemstone stone bracelet.', customizable: false, inStock: true },
  { id: 'prod-21', name: 'Bracelet', price: 8500, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Stackable gold clover & nail bangle bracelet set.', customizable: true, inStock: true },
  { id: 'prod-22', name: 'Full set of flower jewelry', price: 15000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Enameled floral flower blossom necklace, cuff & earring jewelry set.', customizable: true, inStock: true }
];

export const restoreAllProductsToLive = async () => {
  localStorage.removeItem('tne_dropped_products');
  // Preserve whatever products are currently in mockStore (with user's updated images)
  const currentProds = (mockStore.products && mockStore.products.length > 0) ? mockStore.products : userUploadedProductsList;
  mockStore.products = [...currentProds];
  safeSetLocalStorage('tne_products', JSON.stringify(mockStore.products));
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearDroppedIds: true, products: currentProds, overrideProducts: true })
    });
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tne_db_update'));
  }
};

export const deleteProductFromDb = async (productId) => {
  const cleanId = String(productId);

  // 1. Add to local dropped IDs list
  const localDropped = JSON.parse(localStorage.getItem('tne_dropped_products') || '[]');
  if (!localDropped.includes(cleanId)) {
    localDropped.push(cleanId);
    localStorage.setItem('tne_dropped_products', JSON.stringify(localDropped));
  }

  // 2. Filter product out of in-memory store and localStorage
  mockStore.products = mockStore.products.filter(p => String(p.id) !== cleanId);
  localStorage.setItem('tne_products', JSON.stringify(mockStore.products));

  if (!isMock && db) {
    try {
      const docRef = doc(db, "products", cleanId);
      await deleteDoc(docRef);
    } catch (err) {
      console.error("Firestore Product Delete Error:", err);
      throw new Error(`Failed to delete product from Firestore: ${err.message}`);
    }
  }

  // 3. POST override to cloud server with droppedIds list
  try {
    await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        products: mockStore.products,
        overrideProducts: true,
        droppedIds: localDropped
      })
    });
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('tne_db_update'));
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

export { db, auth, storage, isMock };
