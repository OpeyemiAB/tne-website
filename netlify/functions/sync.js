const fs = require('fs');
const path = require('path');

const TEMP_FILE_PATH = path.join('/tmp', 'tne_store.json');

const defaultStore = {
  products: [
    {
      id: 'prod-customize-bracelet',
      name: 'Customize bracelet',
      price: 7000,
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom engraved gold bar name bracelet with initial charms.',
      customizable: true,
      features: ['18k Gold Plated', 'Custom name engraving', 'Monique & Signature charms'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'Engraving came out super sharp and beautiful!', user: 'Monique' }]
    },
    {
      id: 'prod-customize-journal',
      name: 'Customize journal',
      price: 17000,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom laser engraved wooden journal and pen set with personalized photo and Bible verse.',
      customizable: true,
      features: ['Natural bamboo wood cover', 'Custom photo engraving', 'Includes matching engraved pen'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'Purchased for Pastor Popoola, amazing quality!', user: 'Grace' }]
    },
    {
      id: 'prod-one',
      name: 'one',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom TNE Personalized Gift item.',
      customizable: true,
      features: ['Custom laser etching'],
      inStock: true,
      reviews: []
    }
  ],
  orders: [],
  users: [
    { id: 'user-admin-1', name: 'Adepitan Oluwanifemi', email: 'oluwanifemiadepitan46@gmail.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() },
    { id: 'user-admin-2', name: 'Nifemi', email: 'hello@thenifemiexperience.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() }
  ],
  atelierOptions: {}
};

let memoryStore = null;

const getStoreData = () => {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(TEMP_FILE_PATH)) {
      const fileData = fs.readFileSync(TEMP_FILE_PATH, 'utf8');
      if (fileData) {
        memoryStore = JSON.parse(fileData);
        return memoryStore;
      }
    }
  } catch (e) {}
  memoryStore = defaultStore;
  return memoryStore;
};

const saveStoreData = (data) => {
  memoryStore = data;
  try {
    fs.writeFileSync(TEMP_FILE_PATH, JSON.stringify(data), 'utf8');
  } catch (e) {}
};

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const currentStore = getStoreData();

  if (event.httpMethod === 'POST') {
    try {
      const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
      if (body) {
        if (body.droppedIds && Array.isArray(body.droppedIds)) {
          if (!currentStore.droppedIds) currentStore.droppedIds = [];
          body.droppedIds.forEach(id => {
            if (!currentStore.droppedIds.includes(String(id))) {
              currentStore.droppedIds.push(String(id));
            }
          });
        }

        if (body.newProduct) {
          const p = body.newProduct;
          if (p && p.name) {
            if (!p.id) p.id = `prod-${Date.now()}`;

            let rawImg = p.image || (p.images && p.images[0]) || '';
            if (rawImg.includes('drive.google.com') && rawImg.includes('/d/')) {
              const driveId = rawImg.split('/d/')[1].split('/')[0];
              rawImg = `https://lh3.googleusercontent.com/d/${driveId}`;
            } else if (!rawImg) {
              rawImg = 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80';
            }

            p.image = rawImg;
            p.images = [rawImg];
            p.imageUrls = [rawImg];
            p.price = Number(p.price) || 0;
            p.category = p.category || 'Etched by TNE';
            p.customizable = p.customizable !== false;
            p.inStock = p.inStock !== false;

            const existingIdx = currentStore.products.findIndex(item => String(item.id) === String(p.id));
            if (existingIdx > -1) {
              currentStore.products[existingIdx] = p;
            } else {
              currentStore.products.unshift(p);
            }
          }
        }

        if (body.overrideProducts && Array.isArray(body.products)) {
          currentStore.products = body.products;
        } else if (body.products && Array.isArray(body.products)) {
          const prodMap = new Map();
          currentStore.products.forEach(p => prodMap.set(p.id, p));
          body.products.forEach(p => prodMap.set(p.id, p));
          currentStore.products = Array.from(prodMap.values());
        }

        if (currentStore.droppedIds && currentStore.droppedIds.length > 0) {
          const droppedSet = new Set(currentStore.droppedIds.map(String));
          currentStore.products = currentStore.products.filter(p => p && p.id && !droppedSet.has(String(p.id)));
        }

        if (body.orders && Array.isArray(body.orders)) {
          const orderMap = new Map();
          currentStore.orders.forEach(o => orderMap.set(o.id, o));
          body.orders.forEach(o => orderMap.set(o.id, o));
          currentStore.orders = Array.from(orderMap.values());
        }

        if (body.users) currentStore.users = body.users;
        if (body.atelierOptions) currentStore.atelierOptions = body.atelierOptions;

        saveStoreData(currentStore);
      }
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, store: currentStore }) };
    } catch (e) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 200, headers, body: JSON.stringify(currentStore) };
};
