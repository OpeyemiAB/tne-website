import fs from 'fs';
import path from 'path';

const TEMP_FILE_PATH = path.join('/tmp', 'tne_store.json');

// Default Seed Data fallback
const defaultStore = {
  products: [
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
      reviews: [{ rating: 5, comment: 'The unboxing experience was breathtaking!', user: 'Tunde' }]
    }
  ],
  orders: [],
  users: [
    { id: 'user-admin-1', name: 'Adepitan Oluwanifemi', email: 'oluwanifemiadepitan46@gmail.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() },
    { id: 'user-admin-2', name: 'Nifemi', email: 'hello@thenifemiexperience.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() }
  ],
  atelierOptions: {}
};

// Memory Cache
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const currentStore = getStoreData();

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body) {
        // Merge products gracefully
        if (body.products && Array.isArray(body.products)) {
          const prodMap = new Map();
          // Existing store products
          currentStore.products.forEach(p => prodMap.set(p.id, p));
          // Body products (updates & new additions)
          body.products.forEach(p => prodMap.set(p.id, p));
          currentStore.products = Array.from(prodMap.values());
        }

        // Merge orders gracefully
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
      return res.status(200).json({ success: true, store: currentStore });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(200).json(currentStore);
}
