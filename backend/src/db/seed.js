require('dotenv').config();
const bcrypt = require('bcryptjs');
const uuidv4 = require('../utils/id');
const db = require('./store');

async function seed() {
  const existing = db.users.all();
  if (existing.length > 0) {
    console.log('Database already seeded — skipping.');
    return;
  }

  db.reset();

  const passwordHash = await bcrypt.hash('password123', 10);

  const admin = {
    id: uuidv4(),
    name: 'Admin User',
    email: 'admin@furnish3d.com',
    passwordHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  };

  const moderator = {
    id: uuidv4(),
    name: 'Moderator User',
    email: 'mod@furnish3d.com',
    passwordHash,
    role: 'moderator',
    createdAt: new Date().toISOString(),
  };

  const customer = {
    id: uuidv4(),
    name: 'Ibrahim Customer',
    email: 'customer@furnish3d.com',
    passwordHash,
    role: 'customer',
    createdAt: new Date().toISOString(),
  };

  db.users.replaceAll([admin, moderator, customer]);

  const categories = [
    {
      id: uuidv4(),
      name: 'Sofas',
      slug: 'sofas',
      description: 'Lounge seating for living rooms',
    },
    {
      id: uuidv4(),
      name: 'Chairs',
      slug: 'chairs',
      description: 'Dining and accent chairs',
    },
    {
      id: uuidv4(),
      name: 'Tables',
      slug: 'tables',
      description: 'Coffee, dining, and side tables',
    },
    {
      id: uuidv4(),
      name: 'Beds',
      slug: 'beds',
      description: 'Bedroom frames and headboards',
    },
    {
      id: uuidv4(),
      name: 'Storage',
      slug: 'storage',
      description: 'Shelves, cabinets, and sideboards',
    },
  ];

  db.categories.replaceAll(categories);

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const products = [
    {
      id: uuidv4(),
      name: 'Nordic Lounge Sofa',
      slug: 'nordic-lounge-sofa',
      description:
        'A low-profile three-seater with soft linen upholstery and tapered oak legs. Rotate the 3D model to inspect the silhouette from every angle.',
      price: 899,
      imageUrl:
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
      modelUrl: '/models/sofa.glb',
      categoryId: bySlug.sofas,
      stock: 12,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Aria Accent Chair',
      slug: 'aria-accent-chair',
      description:
        'Sculpted boucle chair with a wraparound back — ideal as a reading companion or statement piece.',
      price: 349,
      imageUrl:
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80',
      modelUrl: '/models/chair.glb',
      categoryId: bySlug.chairs,
      stock: 20,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Walnut Coffee Table',
      slug: 'walnut-coffee-table',
      description:
        'Solid walnut slab top on a slender steel base. Inspect grain and proportions in 3D before you buy.',
      price: 429,
      imageUrl:
        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
      modelUrl: '/models/table.glb',
      categoryId: bySlug.tables,
      stock: 15,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Haven Platform Bed',
      slug: 'haven-platform-bed',
      description:
        'Minimal oak platform bed with integrated headboard. Queen size, easy assembly.',
      price: 1199,
      imageUrl:
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
      modelUrl: '/models/bed.glb',
      categoryId: bySlug.beds,
      stock: 8,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Linea Sideboard',
      slug: 'linea-sideboard',
      description:
        'Clean-lined storage cabinet with push-to-open doors and adjustable shelves.',
      price: 679,
      imageUrl:
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80',
      modelUrl: '/models/cabinet.glb',
      categoryId: bySlug.storage,
      stock: 10,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Oslo Dining Chair',
      slug: 'oslo-dining-chair',
      description:
        'Stackable bentwood dining chair with a comfortable curved seat.',
      price: 189,
      imageUrl:
        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&q=80',
      modelUrl: '/models/dining-chair.glb',
      categoryId: bySlug.chairs,
      stock: 40,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Cloud Modular Sofa',
      slug: 'cloud-modular-sofa',
      description:
        'Deep-seat modular sofa with removable covers. Configure pieces to fit your room.',
      price: 1499,
      imageUrl:
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=80',
      modelUrl: '/models/modular-sofa.glb',
      categoryId: bySlug.sofas,
      stock: 6,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      name: 'Marble Side Table',
      slug: 'marble-side-table',
      description:
        'Compact Carrara marble top on a brushed brass pedestal — perfect beside a sofa or bed.',
      price: 259,
      imageUrl:
        'https://images.unsplash.com/photo-1499933374294-4584851497cc?w=800&q=80',
      modelUrl: '/models/side-table.glb',
      categoryId: bySlug.tables,
      stock: 18,
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  db.products.replaceAll(products);

  db.reviews.replaceAll([
    {
      id: uuidv4(),
      userId: customer.id,
      productId: products[0].id,
      rating: 5,
      comment: 'The 3D preview helped me confirm the scale. Love this sofa.',
      status: 'approved',
      createdAt: new Date().toISOString(),
    },
  ]);

  console.log('Seed complete.');
  console.log('Demo accounts (password: password123):');
  console.log('  admin@furnish3d.com (admin)');
  console.log('  mod@furnish3d.com (moderator)');
  console.log('  customer@furnish3d.com (customer)');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
