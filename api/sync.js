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
    },
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
    },
    {
      id: 'prod-two',
      name: 'two',
      price: 20000,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom TNE Personalized Item.',
      customizable: true,
      features: ['Custom initial engraving'],
      inStock: true,
      reviews: []
    },
    {
      id: 'prod-three',
      name: 'three',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'TNE Gift Curation',
      description: 'TNE Curated Gift Box collection.',
      customizable: false,
      features: ['Signature TNE Emerald box'],
      inStock: true,
      reviews: []
    },
    {
      id: 'prod-starter-box',
      name: 'Starter Gift Box',
      price: 10000,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'TNE Gift Curation',
      description: 'Essential TNE luxury gift box including leather keyholder and QR card.',
      customizable: false,
      features: ['Leather Keyholder', 'QR Greeting Card'],
      inStock: true,
      reviews: []
    },
    {
      id: 'prod-classic-box',
      name: 'Classic Luxury Box',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'TNE Gift Curation',
      description: 'Classic luxury gift box with scented candle, keyholder and custom card.',
      customizable: false,
      features: ['Scented Candle', 'Leather Keyholder', 'QR Greeting Card'],
      inStock: true,
      reviews: []
    },
    {
      id: 'prod-check-now',
      name: 'check now',
      price: 1000,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom etched product.',
      customizable: true,
      features: ['Custom engraving'],
      inStock: true,
      reviews: []
    },
    {
      id: 'prod-we',
      name: 'we',
      price: 0,
      image: 'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1513885535751-8b9238bd475a?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'Etched by TNE',
      description: 'Custom product.',
      customizable: true,
      features: [],
      inStock: true,
      reviews: []
    },
    {
      id: 'prod-56',
      name: '56',
      price: 0,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80',
      images: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80'
      ],
      category: 'TNE Collections',
      description: 'Luxury Collection item.',
      customizable: false,
      features: [],
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
        if (body.droppedIds && Array.isArray(body.droppedIds)) {
          if (!currentStore.droppedIds) currentStore.droppedIds = [];
          body.droppedIds.forEach(id => {
            if (!currentStore.droppedIds.includes(String(id))) {
              currentStore.droppedIds.push(String(id));
            }
          });
        }

        // Direct override for dropped products
        if (body.overrideProducts && Array.isArray(body.products)) {
          currentStore.products = body.products;
        } else if (body.products && Array.isArray(body.products)) {
          const prodMap = new Map();
          currentStore.products.forEach(p => prodMap.set(p.id, p));
          body.products.forEach(p => prodMap.set(p.id, p));
          currentStore.products = Array.from(prodMap.values());
        }

        // Always purge any dropped IDs from currentStore.products
        if (currentStore.droppedIds && currentStore.droppedIds.length > 0) {
          const droppedSet = new Set(currentStore.droppedIds.map(String));
          currentStore.products = currentStore.products.filter(p => p && p.id && !droppedSet.has(String(p.id)));
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
