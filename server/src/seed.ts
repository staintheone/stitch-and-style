import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const seedProducts = [
  { name: 'Classic White Tee', price: 19.99, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop', sizes: ['S','M','L','XL'], colors: ['White'], inStock: true },
  { name: 'Denim Jacket', price: 79.99, image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop', sizes: ['M','L','XL'], colors: ['Blue','Black'], inStock: true },
  { name: 'Slim Fit Chinos', price: 49.99, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop', sizes: ['S','M','L','XL'], colors: ['Beige','Navy'], inStock: false },
  { name: 'Patterned Shirt', price: 39.99, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', sizes: ['S','M','L'], colors: ['Red','Green','Blue'], inStock: true },
  { name: 'Black Hoodie', price: 54.99, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', sizes: ['S','M','L','XL','XXL'], colors: ['Black','Grey'], inStock: true },
  { name: 'Linen Summer Dress', price: 64.99, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', sizes: ['XS','S','M','L'], colors: ['White','Beige','Blue'], inStock: true },
  { name: 'Leather Belt', price: 29.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop', sizes: ['S','M','L'], colors: ['Brown','Black'], inStock: true },
  { name: 'Wool Overcoat', price: 149.99, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop', sizes: ['M','L','XL'], colors: ['Grey','Navy','Black'], inStock: false },
  { name: 'Sneakers', price: 89.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop', sizes: ['S','M','L','XL'], colors: ['White','Red','Black'], inStock: true },
  { name: 'Striped Polo', price: 34.99, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop', sizes: ['S','M','L','XL'], colors: ['Navy','White','Green'], inStock: true },
  { name: 'Cargo Shorts', price: 44.99, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop', sizes: ['S','M','L','XL'], colors: ['Khaki','Green','Black'], inStock: true },
  { name: 'Silk Scarf', price: 24.99, image: 'https://images.unsplash.com/photo-1623832101940-647285e32a58?q=80&w=880&auto=format&fit=crop', sizes: ['One Size'], colors: ['Red','Blue','Gold'], inStock: false },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: { email: 'admin@stitchandstyle.com', password: adminPassword, name: 'Admin', role: 'admin' },
  });

  // Create test customer
  const customerPassword = await bcrypt.hash('customer123', 10);
  await prisma.user.create({
    data: { email: 'customer@test.com', password: customerPassword, name: 'Test Customer', role: 'customer' },
  });

  // Create products
  for (const p of seedProducts) {
    await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        image: p.image,
        sizes: JSON.stringify(p.sizes),
        colors: JSON.stringify(p.colors),
        inStock: p.inStock,
      },
    });
  }

  console.log('✅ Seeded 12 products, 1 admin, 1 customer');
  console.log('   Admin:    admin@stitchandstyle.com / admin123');
  console.log('   Customer: customer@test.com / customer123');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
