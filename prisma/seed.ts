import { PrismaClient, Role, ProductStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Account passwords come from the environment so they never live in the
// public repository. The old defaults are only used against a local database.
const isLocalDatabase = /@(localhost|127\.0\.0\.1|mysql)[:/]/.test(
  process.env.DATABASE_URL ?? "",
);

function seedPassword(envName: string, localDefault: string): string {
  const fromEnv = process.env[envName];
  if (fromEnv) return fromEnv;
  if (isLocalDatabase) return localDefault;
  if (envName === "SEED_ADMIN_PASSWORD") {
    console.error(
      "Refusing to seed a non-local database without SEED_ADMIN_PASSWORD.",
    );
    process.exit(1);
  }
  // Remote database and no password given: a random one that nobody knows.
  return randomBytes(24).toString("hex");
}

function generateProducts(categories: { id: number; name: string }[]) {
  const products = [];
  let productId = 1;
  const adjectives = [
    "Essential",
    "Premium",
    "Signatur",
    "Klassisk",
    "Urban",
    "Nordisk",
    "Limitless",
    "Timeless",
  ];
  const suffixes = [
    "Walnut",
    "Midnight",
    "Forest",
    "Onyx",
    "Slate",
    "Sand",
    "Navy",
    "Charcoal",
    "Ivory",
    "Olive",
    "Stone",
  ];
  const pricePoints = [
    299, 349, 399, 449, 499, 549, 599, 649, 699, 749, 799, 899, 999, 1099, 1199,
    1299, 1499,
  ];

  const nouns: { [key: string]: string[] } = {
    Skjorter: [
      "Oxford Skjorte",
      "Hørblanding Skjorte",
      "Denim Skjorte",
      "Polo",
      "Business Skjorte",
    ],
    Hættetrøjer: [
      "Heavyweight Hoodie",
      "Zip Hoodie",
      "Oversized Sweatshirt",
      "Crewneck",
      "Fleece Hoodie",
    ],
    Bukser: ["Chinos", "Slim Fit Jeans", "Cargo Bukser", "Joggers", "Shorts"],
    Sneakers: [
      "Low Top Sneaker",
      "High Top Sneaker",
      "Læder Sneaker",
      "Canvas Sko",
      "Runner",
    ],
    Tilbud: [
      "Outlet T-shirt",
      "Outlet Hoodie",
      "Sæson Jakke",
      "Restparti Bukser",
    ],
  };

  for (const category of categories) {
    for (let i = 0; i < 20; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      const nounList = nouns[category.name] || ["Produkt"];
      const noun = nounList[Math.floor(Math.random() * nounList.length)];

      const name = `${adj} ${noun} - ${suffix}`;
      const price = pricePoints[Math.floor(Math.random() * pricePoints.length)];

      products.push({
        id: productId++,
        name,
        price,
        offer_price: Math.random() < 0.2 ? Math.floor(price * 0.7) : null, // 20% chance of offer, round down
        category_Id: category.id,
        status: ProductStatus.ONLINE,
        description: `En ${adj.toLowerCase()} ${noun.toLowerCase()} i farven ${suffix.toLowerCase()}. Perfekt til enhver lejlighed.`,
      });
    }
  }
  return products;
}

// Hand-made products with real photos, served from apps/client/public/products.
// The first image of each product is its thumbnail. Category ids: 5 Sneakers,
// 7 Loafers, 8 Dress shoes, 9 Boots, 10 Accessories.
const sequence = (folder: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/products/${folder}/${i + 1}.webp`);

const HAND_MADE_PRODUCTS: {
  name: string;
  price: number;
  category_Id: number;
  description: string;
  images: string[];
}[] = [
  {
    name: "Essential Sneaker - Black Suede",
    price: 899,
    category_Id: 5,
    description:
      "Low top sneaker i italiensk garvet ruskindslæder (LWG-certificeret) med blød læderforing, økologisk bomuldssnøre og ydersål af naturgummi.",
    images: [
      "side",
      "back",
      "lifestyle",
      "on-foot",
      "front-details",
      "sole",
    ].map((n) => `/products/black-suede/${n}.webp`),
  },
  {
    name: "Essential Sneaker - Cream Leather",
    price: 949,
    category_Id: 5,
    description:
      "Low top sneaker i blødt cremefarvet læder med ruskindshæl og tonet gummisål. Et roligt, nordisk udtryk til hverdagen.",
    images: sequence("cream-leather-sneaker", 4),
  },
  {
    name: "Suede Penny Loafer - Taupe",
    price: 1199,
    category_Id: 7,
    description:
      "Penny loafer i blødt taupefarvet ruskind med cremefarvet gummisål. Let og elegant, til både habit og chinos.",
    images: sequence("taupe-suede-loafer", 4),
  },
  {
    name: "Cap Toe Oxford - Black",
    price: 1399,
    category_Id: 8,
    description:
      "Klassisk oxford med cap toe i sort glatlæder med cognacfarvet læderforing og læderhæl. Til kontoret og de pæne anledninger.",
    images: sequence("black-cap-toe-oxford", 4),
  },
  {
    name: "Chelsea Boot - Brown",
    price: 1499,
    category_Id: 9,
    description:
      "Chelsea støvle i mørkebrunt læder med elastikindsats og trækløkke. Tidløs form til efterår og vinter.",
    images: sequence("brown-chelsea-boot", 4),
  },
  {
    name: "Crossbody Bag - Brown",
    price: 799,
    category_Id: 10,
    description:
      "Kompakt crossbody taske i mørkebrunt læder med fremhævet NORDWEAR-logo, lynlås og justerbar stofrem.",
    images: sequence("brown-crossbody-bag", 5),
  },
];async function main() {
  console.log("Seeding database...");

  // Resolve passwords first, so a refused run never touches the database.
  const hashedPasswordAdmin = await bcrypt.hash(
    seedPassword("SEED_ADMIN_PASSWORD", "admin123"),
    10,
  );
  const hashedPasswordUser = await bcrypt.hash(
    seedPassword("SEED_USER_PASSWORD", "user123"),
    10,
  );

  // 1. Clear tables
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 0;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `category`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `color`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `size`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `product`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `product_quantity`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `customer`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `order`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `order_item`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `cart_item`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `customer_likes`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `shipment_size`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `User`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `ProductImage`;");
  await prisma.$executeRawUnsafe("TRUNCATE TABLE `GiftCard`;");
  await prisma.$executeRawUnsafe("SET FOREIGN_KEY_CHECKS = 1;");
  console.log("Tables cleared.");

  // 1.5. Seed Users
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPasswordAdmin,
        role: Role.ADMIN,
      },
      {
        name: "Regular User",
        email: "user@example.com",
        password: hashedPasswordUser,
        role: Role.USER,
      },
    ],
    skipDuplicates: true,
  });
  console.log("Users seeded.");

  // 2. Insert Categories
  const categoriesToSeed = [
    { id: 1, name: "Skjorter" },
    { id: 2, name: "Hættetrøjer" },
    { id: 4, name: "Bukser" },
    { id: 5, name: "Sneakers" },
    { id: 6, name: "Tilbud" },
    { id: 7, name: "Loafers" },
    { id: 8, name: "Dress shoes" },
    { id: 9, name: "Boots" },
    { id: 10, name: "Accessories" },
  ];
  await prisma.category.createMany({
    data: categoriesToSeed,
    skipDuplicates: true,
  });
  console.log("Categories seeded.");

  // 3. Insert Colors
  const colorsToSeed = [
    { id: 1, name: "Black" },
    { id: 2, name: "White" },
    { id: 3, name: "Heather Grey" },
    { id: 4, name: "Navy Blue" },
  ];
  await prisma.color.createMany({ data: colorsToSeed, skipDuplicates: true });
  console.log("Colors seeded.");

  // 4. Insert Sizes
  const sizesToSeed = [
    { id: 1, name: "S" },
    { id: 2, name: "M" },
    { id: 3, name: "L" },
    { id: 4, name: "XL" },
  ];
  await prisma.size.createMany({ data: sizesToSeed, skipDuplicates: true });
  console.log("Sizes seeded.");

  // 5. Insert Products
  // Random generated products only for the original categories
  const productsToSeed = generateProducts(
    categoriesToSeed.filter((c) => c.id <= 6),
  );
  const generatedCount = productsToSeed.length;
  let nextProductId = generatedCount + 1;
  const handMade = HAND_MADE_PRODUCTS.map((p) => ({
    id: nextProductId++,
    name: p.name,
    price: p.price,
    offer_price: null,
    category_Id: p.category_Id,
    status: ProductStatus.ONLINE,
    description: p.description,
    images: p.images,
  }));
  productsToSeed.push(...handMade);
  await prisma.product.createMany({
    data: productsToSeed.map(
      ({ id, name, price, offer_price, category_Id, status, description }) => ({
        id,
        name,
        price,
        offer_price,
        category_Id,
        status,
        description,
      }),
    ),
    skipDuplicates: true,
  });
  console.log(`${productsToSeed.length} products seeded.`);

  // Create ProductImage entries for each product
  const imagesToSeed = [
    ...productsToSeed.slice(0, generatedCount).map((product) => ({
      productId: product.id,
      url: `https://picsum.photos/seed/product${product.id}/400/400`,
      isThumbnail: true,
    })),
    ...handMade.flatMap((product) =>
      product.images.map((url, i) => ({
        productId: product.id,
        url,
        isThumbnail: i === 0,
      })),
    ),
  ];
  await prisma.productImage.createMany({
    data: imagesToSeed,
    skipDuplicates: true,
  });
  console.log("Product images seeded.");

  // 6. Insert Product Quantities
  const quantitiesToSeed = [];
  for (const product of productsToSeed) {
    for (const size of sizesToSeed) {
      for (const color of colorsToSeed) {
        if (Math.random() > 0.3) {
          // Create quantity for 70% of combinations
          quantitiesToSeed.push({
            productId: product.id,
            sizeId: size.id,
            colorId: color.id,
            quantity: Math.floor(Math.random() * 100),
          });
        }
      }
    }
  }
  await prisma.product_quantity.createMany({
    data: quantitiesToSeed,
    skipDuplicates: true,
  });
  console.log("Product quantities seeded.");

  // 7. Seed Gift Cards
  await prisma.giftCard.createMany({
    data: [
      {
        code: "GIFT500",
        balance: 50000,
        initialAmount: 50000,
        isEnabled: true,
      }, // 500 DKK
      {
        code: "GIFT100",
        balance: 10000,
        initialAmount: 10000,
        isEnabled: true,
      }, // 100 DKK
      {
        code: "GIFTFREE",
        balance: 1000000,
        initialAmount: 1000000,
        isEnabled: true,
      }, // 10,000 DKK
    ],
    skipDuplicates: true,
  });
  console.log("Gift cards seeded.");

  // 8. Seed Customers
  const regularUser = await prisma.user.findUnique({
    where: { email: "user@example.com" },
  });
  if (regularUser) {
    const customer = await prisma.customer.create({
      data: {
        userId: regularUser.id,
      },
    });
    console.log("Customer seeded.");

    // 9. Seed Orders
    const ordersToSeed = [
      {
        id: 1,
        customerId: customer.id,
        amount: 89900,
        currency: "dkk",
        status: "COMPLETED" as any,
        paymentIntentId: "pi_test_1",
        customerDetails: { email: regularUser.email, name: regularUser.name },
        shippingDetails: {
          address: {
            line1: "Testvej 1",
            city: "Testby",
            postal_code: "1234",
            country: "DK",
          },
        },
      },
      {
        id: 2,
        customerId: customer.id,
        amount: 45000,
        currency: "dkk",
        status: "PENDING" as any,
        paymentIntentId: "pi_test_2",
        customerDetails: { email: regularUser.email, name: regularUser.name },
        shippingDetails: {
          address: {
            line1: "Gade 2",
            city: "Aarhus",
            postal_code: "8000",
            country: "DK",
          },
        },
      },
      {
        id: 3,
        customerId: customer.id,
        amount: 120000,
        currency: "dkk",
        status: "CANCELED" as any,
        paymentIntentId: "pi_test_3",
        customerDetails: { email: regularUser.email, name: regularUser.name },
        shippingDetails: {
          address: {
            line1: "Vej 3",
            city: "Kbh",
            postal_code: "1000",
            country: "DK",
          },
        },
      },
    ];

    for (const orderData of ordersToSeed) {
      const order = await prisma.order.create({ data: orderData });

      // Add some order items
      await prisma.order_item.createMany({
        data: [
          {
            orderId: order.id,
            productId: 1,
            quantity: 1,
            price: 29900,
            sizeId: 1,
            colorId: 1,
          },
          {
            orderId: order.id,
            productId: 2,
            quantity: 2,
            price: 30000,
            sizeId: 2,
            colorId: 2,
          },
        ],
      });
    }
    console.log("Orders and order items seeded.");
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
