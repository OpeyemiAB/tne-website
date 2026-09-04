const fs = require('fs');
const path = require('path');

const TEMP_FILE_PATH = path.join('/tmp', 'tne_store.json');

const defaultStore = {
  products: [
    { id: 'prod-1', name: 'Necklace scan', price: 12000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Scannable custom gold butterfly name necklace.', customizable: true, inStock: true },
    { id: 'prod-2', name: 'Canvas Size 41-45', price: 24500, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80'], category: 'TNE Collections', description: 'Luxury designer sneakers (Size 41-45).', customizable: false, inStock: true },
    { id: 'prod-3', name: 'Customize wristwatch', price: 25000, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Engraved custom luxury wristwatch.', customizable: true, inStock: true },
    { id: 'prod-4', name: 'Couples bracelet', price: 40000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Matching engraved luxury couple wristwatches and bracelets.', customizable: true, inStock: true },
    { id: 'prod-5', name: 'Boxed Customize bracelet', price: 12500, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Custom name engraved bracelet set in gift box.', customizable: true, inStock: true },
    { id: 'prod-6', name: 'Menstrual belt pad', price: 15000, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80'], category: 'TNE Beauty', description: 'Custom warming menstrual relief pad belt with digital heat display.', customizable: true, inStock: true },
    { id: 'prod-7', name: 'Poedagar', price: 25000, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80'], category: 'TNE Collections', description: 'Poedagar international luxury quartz wristwatches.', customizable: false, inStock: true },
    { id: 'prod-8', name: 'Full set of jewelry', price: 12500, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Full sparkling crystal necklace, earrings, and bracelet set.', customizable: true, inStock: true },
    { id: 'prod-9', name: 'Waist chain', price: 7000, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Delicate crystal heart and wing waist chain.', customizable: true, inStock: true },
    { id: 'prod-10', name: 'Jewelry box', price: 5000, image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80'], category: 'TNE Gift Curation', description: 'Compact travel zippered velvet jewelry box organizer.', customizable: false, inStock: true },
    { id: 'prod-11', name: 'Headband Three in 1', price: 1000, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80'], category: 'TNE Beauty', description: '3-in-1 vibrant colorful headband set.', customizable: false, inStock: true },
    { id: 'prod-12', name: 'Customize bottle', price: 15000, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Custom name printed thermal water bottle.', customizable: true, inStock: true },
    { id: 'prod-13', name: 'Customize journal', price: 5000, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Custom engraved leather notebook journal.', customizable: true, inStock: true },
    { id: 'prod-14', name: 'Perfume set', price: 10500, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80'], category: 'TNE Beauty', description: 'Mystical multi-fragrance luxury perfume gift set.', customizable: false, inStock: true },
    { id: 'prod-15', name: 'Bottle umbrella', price: 5500, image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80'], category: 'TNE Gift Curation', description: 'Novelty wine bottle casing compact umbrella.', customizable: false, inStock: true },
    { id: 'prod-16', name: 'Full set of female jewelry', price: 28000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Deluxe engraved female gift box with watch, bracelet & necklace.', customizable: true, inStock: true },
    { id: 'prod-17', name: 'Charm bracelet', price: 6000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Multi-pendant gold charm chain bracelet.', customizable: true, inStock: true },
    { id: 'prod-18', name: 'Jail wristwatch', price: 7000, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80'], category: 'TNE Collections', description: 'Jiali vintage square gold link wristwatch.', customizable: false, inStock: true },
    { id: 'prod-19', name: 'Tennis bracelet', price: 3800, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Classic cubic zirconia tennis bracelet.', customizable: false, inStock: true },
    { id: 'prod-20', name: 'Stone bracelet', price: 12000, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Baguette cut black & colored gemstone stone bracelet.', customizable: false, inStock: true },
    { id: 'prod-21', name: 'Bracelet', price: 8500, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Stackable gold clover & nail bangle bracelet set.', customizable: true, inStock: true },
    { id: 'prod-22', name: 'Full set of flower jewelry', price: 15000, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80', images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'], category: 'Etched by TNE', description: 'Enameled floral flower blossom necklace, cuff & earring jewelry set.', customizable: true, inStock: true }
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
        if (body.clearDroppedIds) {
          currentStore.droppedIds = [];
        }

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
