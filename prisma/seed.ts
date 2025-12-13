import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateProducts(categories: {id: number, name: string}[]) {
    const products = [];
    let productId = 1;
    const adjectives = ['Basic', 'Classic', 'Urban', 'Nordic', 'Viking', 'Fjörd', 'Arctic', 'Asgardian'];
    const nouns: { [key: string]: string[] } = {
        'Shirts': ['Tee', 'Shirt', 'Top', 'Polo'],
        'Hoodies': ['Hoodie', 'Crewneck', 'Sweatshirt', 'Zip-up'],
        'Jackets': ['Jacket', 'Parka', 'Windbreaker', 'Bomber'],
        'Pants': ['Pants', 'Jeans', 'Chinos', 'Shorts'],
        'Sneakers': ['Sneakers', 'Boots', 'Shoes', 'Loafers'],
        'Deals': ['Deal Tee', 'Deal Hoodie', 'Deal Jacket', 'Deal Pants']
    };

    for (const category of categories) {
        for (let i = 0; i < 20; i++) {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const nounList = nouns[category.name] || ['Product'];
            const noun = nounList[Math.floor(Math.random() * nounList.length)];
            const name = `${adj} ${noun} #${i + 1}`;
            const price = Math.floor(Math.random() * 501) + 299;
            
            products.push({
                id: productId++,
                name,
                price,
                offer_price: Math.random() < 0.3 ? +(price * 0.8).toFixed(2) : null,
                category_Id: category.id,
                status: ProductStatus.ONLINE,
                description: `En lækker ${noun.toLowerCase()} i høj kvalitet.`
            });
        }
    }
    return products;
}

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
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `User`;');
  await prisma.$executeRawUnsafe('TRUNCATE TABLE `ProductImage`;');
  await prisma.$executeRawUnsafe('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('Tables cleared.');

  // 1.5. Seed Users
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@example.com', password: hashedPasswordAdmin, role: Role.ADMIN },
      { name: 'Regular User', email: 'user@example.com', password: hashedPasswordUser, role: Role.USER },
    ],
    skipDuplicates: true,
  });
  console.log('Users seeded.');

  // 2. Insert Categories
  const categoriesToSeed = [
      { id: 1, name: 'Shirts' },
      { id: 2, name: 'Hoodies' },
      { id: 3, name: 'Jackets' },
      { id: 4, name: 'Pants' },
      { id: 5, name: 'Sneakers' },
      { id: 6, name: 'Deals' },
  ];
  await prisma.category.createMany({ data: categoriesToSeed, skipDuplicates: true });
  console.log('Categories seeded.');

  // 3. Insert Colors
  const colorsToSeed = [
      { id: 1, name: 'Black' },
      { id: 2, name: 'White' },
      { id: 3, name: 'Heather Grey' },
      { id: 4, name: 'Navy Blue' },
  ];
  await prisma.color.createMany({ data: colorsToSeed, skipDuplicates: true });
  console.log('Colors seeded.');

  // 4. Insert Sizes
  const sizesToSeed = [
      { id: 1, name: 'S' },
      { id: 2, name: 'M' },
      { id: 3, name: 'L' },
      { id: 4, name: 'XL' },
  ];
  await prisma.size.createMany({ data: sizesToSeed, skipDuplicates: true });
  console.log('Sizes seeded.');

  // 5. Insert Products
  const productsToSeed = generateProducts(categoriesToSeed);
  await prisma.product.createMany({
    data: productsToSeed.map(({ id, name, price, offer_price, category_Id, status, description }) => ({
        id, name, price, offer_price, category_Id, status, description
    })),
    skipDuplicates: true,
  });
  console.log(`${productsToSeed.length} products seeded.`);

  // Create ProductImage entries for each product
  const imagesToSeed = productsToSeed.map(product => ({
    productId: product.id,
    url: `https://picsum.photos/seed/product${product.id}/400/400`,
    isThumbnail: true,
  }));
  await prisma.productImage.createMany({ data: imagesToSeed, skipDuplicates: true });
  console.log('Product images seeded.');

  // 6. Insert Product Quantities
  const quantitiesToSeed = [];
  for (const product of productsToSeed) {
      for (const size of sizesToSeed) {
          for (const color of colorsToSeed) {
              if (Math.random() > 0.3) { // Create quantity for 70% of combinations
                  quantitiesToSeed.push({
                      productId: product.id,
                      sizeId: size.id,
                      colorId: color.id,
                      quantity: Math.floor(Math.random() * 100)
                  });
              }
          }
      }
  }
  await prisma.product_quantity.createMany({ data: quantitiesToSeed, skipDuplicates: true });
  console.log('Product quantities seeded.');

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