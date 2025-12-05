import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Clear tables
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 0;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `category`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `color`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `size`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `product`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `product_quantity`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `customer`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `order`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `order_item`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `cart_item`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `customer_likes`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `shipment_size`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `User`;'); // Clear User table
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('Tables cleared.');

  // 1.5. Seed Users
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  await prisma.user.createMany({
    data: [
      { email: 'admin@example.com', password: hashedPasswordAdmin, role: Role.ADMIN },
      { email: 'user@example.com', password: hashedPasswordUser, role: Role.USER },
    ],
    skipDuplicates: true,
  });
  console.log('Users seeded.');

  // 2. Insert Categories
  await prisma.category.createMany({
    data: [
      { id: 1, name: 'T-Shirts' },
      { id: 2, name: 'Hoodies' },
      { id: 3, name: 'Jackets' },
      { id: 4, name: 'Pants' },
    ],
    skipDuplicates: true,
  });
  console.log('Categories seeded.');

  // 3. Insert Colors
  await prisma.color.createMany({
    data: [
      { id: 1, name: 'Black' },
      { id: 2, name: 'White' },
      { id: 3, name: 'Heather Grey' },
      { id: 4, name: 'Navy Blue' },
    ],
    skipDuplicates: true,
  });
  console.log('Colors seeded.');

  // 4. Insert Sizes
  await prisma.size.createMany({
    data: [
      { id: 1, name: 'S' },
      { id: 2, name: 'M' },
      { id: 3, name: 'L' },
      { id: 4, name: 'XL' },
    ],
    skipDuplicates: true,
  });
  console.log('Sizes seeded.');

  // 5. Insert Products (and associated images)
  const productsToSeed = [
    { id: 1, name: 'Nordic Rune Tee', price: 29.99, offer_price: 24.99, category_Id: 1, status: ProductStatus.ONLINE, description: 'En behagelig t-shirt med nordisk design.' },
    { id: 2, name: 'Viking Spirit Hoodie', price: 69.99, offer_price: null, category_Id: 2, status: ProductStatus.OFFLINE, description: 'En varm hoodie med et råt look.' },
    { id: 3, name: 'Fjörd Explorer Jacket', price: 149.99, offer_price: 129.99, category_Id: 3, status: ProductStatus.DRAFT, description: 'En holdbar jakke til eventyrere.' },
    { id: 4, name: 'Urban Cargo Pants', price: 79.99, offer_price: null, category_Id: 4, status: ProductStatus.ONLINE, description: 'Praktiske cargo bukser til hverdagsbrug.' },
    { id: 5, name: 'Arctic Patrol Parka', price: 199.99, offer_price: null, category_Id: 3, status: ProductStatus.ONLINE, description: 'Ultimativ vinterparka mod kulden.' },
    { id: 6, name: 'Longship Crewneck', price: 59.99, offer_price: 54.99, category_Id: 2, status: ProductStatus.DRAFT, description: 'Klassisk crewneck med maritimt tema.' },
    { id: 7, name: 'Asgardian Denim Jeans', price: 89.99, offer_price: null, category_Id: 4, status: ProductStatus.ONLINE, description: 'Slidstærke jeans med god pasform.' },
    { id: 8, name: 'Basic Logo Tee', price: 24.99, offer_price: null, category_Id: 1, status: ProductStatus.DRAFT, description: 'En simpel t-shirt med vores logo.' },
  ];

  await prisma.product.createMany({
    data: productsToSeed.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      offer_price: p.offer_price,
      category_Id: p.category_Id,
      status: p.status,
      description: p.description,
    })),
    skipDuplicates: true,
  });
  console.log('Products seeded.');

  // Create ProductImage entries for each product
  for (const product of productsToSeed) {
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: `https://picsum.photos/seed/product${product.id}/300/300`, // Using original imageUrl logic
        isThumbnail: true,
      },
    });
  }
  console.log('Product images seeded.');

  // 6. Insert Product Quantities
  await prisma.product_quantity.createMany({
    data: [
        { productId: 1, sizeId: 1, colorId: 1, quantity: 50 }, { productId: 1, sizeId: 2, colorId: 1, quantity: 50 }, { productId: 1, sizeId: 3, colorId: 1, quantity: 30 }, { productId: 1, sizeId: 4, colorId: 1, quantity: 10 },
        { productId: 1, sizeId: 1, colorId: 2, quantity: 40 }, { productId: 1, sizeId: 2, colorId: 2, quantity: 40 }, { productId: 1, sizeId: 3, colorId: 2, quantity: 25 }, { productId: 1, sizeId: 4, colorId: 2, quantity: 5 },
        { productId: 2, sizeId: 2, colorId: 3, quantity: 30 }, { productId: 2, sizeId: 3, colorId: 3, quantity: 30 }, { productId: 2, sizeId: 4, colorId: 3, quantity: 20 },
        { productId: 2, sizeId: 2, colorId: 4, quantity: 25 }, { productId: 2, sizeId: 3, colorId: 4, quantity: 25 }, { productId: 2, sizeId: 4, colorId: 4, quantity: 15 },
        { productId: 3, sizeId: 1, colorId: 4, quantity: 15 }, { productId: 3, sizeId: 2, colorId: 4, quantity: 20 }, { productId: 3, sizeId: 3, colorId: 4, quantity: 15 }, { productId: 3, sizeId: 4, colorId: 4, quantity: 10 },
        { productId: 4, sizeId: 2, colorId: 1, quantity: 40 }, { productId: 4, sizeId: 3, colorId: 1, quantity: 40 },
        { productId: 4, sizeId: 2, colorId: 4, quantity: 30 }, { productId: 4, sizeId: 3, colorId: 4, quantity: 30 },
        { productId: 5, sizeId: 3, colorId: 4, quantity: 20 }, { productId: 5, sizeId: 4, colorId: 4, quantity: 15 },
        { productId: 6, sizeId: 1, colorId: 3, quantity: 35 }, { productId: 6, sizeId: 2, colorId: 3, quantity: 35 }, { productId: 6, sizeId: 3, colorId: 3, quantity: 25 },
        { productId: 7, sizeId: 2, colorId: 1, quantity: 45 }, { productId: 7, sizeId: 3, colorId: 1, quantity: 45 },
        { productId: 8, sizeId: 1, colorId: 2, quantity: 60 }, { productId: 8, sizeId: 2, colorId: 2, quantity: 60 }, { productId: 8, sizeId: 3, colorId: 2, quantity: 50 }, { productId: 8, sizeId: 4, colorId: 2, quantity: 20 },
    ],
    skipDuplicates: true,
  });
  console.log('Product quantities seeded.');

  // 7. Insert Customers
  await prisma.customer.createMany({
    data: [
        { id: 1, created_at: new Date() },
        { id: 2, created_at: new Date() },
    ],
    skipDuplicates: true,
  });
  console.log('Customers seeded.');

  // 8. Insert Orders
  await prisma.order.createMany({
    data: [
      { id: 1, customerId: 1, subtotal: 54.98, created_at: new Date('2025-11-15 10:30:00') },
      { id: 2, customerId: 2, subtotal: 229.98, created_at: new Date('2025-11-20 14:00:00') },
      { id: 3, customerId: 1, subtotal: 69.99, created_at: new Date('2025-11-28 18:45:00') },
    ],
    skipDuplicates: true,
  });
  console.log('Orders seeded.');

  // 9. Insert Order Items
  await prisma.order_item.createMany({
    data: [
      { orderId: 1, productId: 1, sizeId: 2, colorId: 1, quantity: 2, price_each: 24.99, total_price: 49.98 },
      { orderId: 2, productId: 3, sizeId: 3, colorId: 4, quantity: 1, price_each: 129.99, total_price: 129.99 },
      { orderId: 2, productId: 4, sizeId: 3, colorId: 1, quantity: 1, price_each: 79.99, total_price: 79.99 },
      { orderId: 3, productId: 2, sizeId: 4, colorId: 3, quantity: 1, price_each: 69.99, total_price: 69.99 },
    ],
    skipDuplicates: true,
  });
  console.log('Order items seeded.');

  // 10. Insert Cart Items
  await prisma.cart_item.createMany({
    data: [
      { customerId: 1, productId: 4, sizeId: 2, colorId: 4, quantity: 1 },
    ],
    skipDuplicates: true,
  });
  console.log('Cart items seeded.');

  // 11. Insert Customer Likes
  await prisma.customer_likes.createMany({
    data: [
      { customerId: 1, productId: 2 },
      { customerId: 2, productId: 1 },
    ],
    skipDuplicates: true,
  });
  console.log('Customer likes seeded.');

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
