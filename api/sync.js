// Global Central Cloud State in Vercel Edge Memory
let centralStore = {
  products: [
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
      price: 22000,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80',
      category: 'Etched by TNE',
      description: '18k gold plated custom nameplate or date pendant necklace, crafted with precision.',
      customizable: true,
      features: ['18k Gold Plating', 'Water-resistant coating', 'Custom name / date etching'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'I wear mine every day!', user: 'Oyinkan' }]
    },
    {
      id: 'box-classic-1',
      name: 'Classic Luxury Box',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      category: 'TNE Gift Curation',
      description: 'Hand-curated gift hamper featuring premium scented candle, gourmet chocolates, and personalized card.',
      customizable: true,
      features: ['Scented Soy Candle', 'Artisanal Chocolates', 'Custom Satin Ribbon', 'Gold Foil Gift Card'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'The unboxing experience was breathtaking!', user: 'Tunde' }]
    },
    {
      id: 'perfume-duo-1',
      name: 'Signature Dual Perfume',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80',
      category: 'TNE Beauty',
      description: 'Pair of long-lasting luxury eau de parfum bottles (50ml each) crafted with oriental and floral notes.',
      customizable: false,
      features: ['50ml Eau de Parfum x 2', '24hr long-lasting sillage', 'Velvet gift pouch'],
      inStock: true,
      reviews: [{ rating: 5, comment: 'Smells insanely rich and expensive.', user: 'Kemi' }]
    }
  ],
  orders: [],
  users: [
    { id: 'user-admin-1', name: 'Adepitan Oluwanifemi', email: 'oluwanifemiadepitan46@gmail.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() },
    { id: 'user-admin-2', name: 'Nifemi', email: 'hello@thenifemiexperience.com', role: 'Super Admin', status: 'Active', date: new Date().toLocaleDateString() }
  ],
  atelierOptions: {}
};

export default async function handler(req, res) {
  // CORS Headers for cross-device & mobile access
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

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (body) {
        if (body.products) centralStore.products = body.products;
        if (body.orders) centralStore.orders = body.orders;
        if (body.users) centralStore.users = body.users;
        if (body.atelierOptions) centralStore.atelierOptions = body.atelierOptions;
      }
      return res.status(200).json({ success: true, store: centralStore });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(200).json(centralStore);
}
