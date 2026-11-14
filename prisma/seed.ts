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

// Hand-made products with real photos, served from apps/client/public/products.
// The first image of each product is its thumbnail. Category ids: 5 Sneakers,
// 7 Loafers, 8 Dress shoes, 9 Boots, 10 Accessories.
// Shoe categories get EU shoe sizes, accessories one size, the rest S to XL.
const SHOE_CATEGORY_IDS = [5, 7, 8, 9];
const ACCESSORIES_CATEGORY_ID = 10;

// Deterministic pseudo-random numbers, so every seed run gives the same sizes.
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Not every product comes in every size. Shoes lose 0-1 sizes off the small end
// and 0-2 off the large end, and sometimes one size inside the range is sold
// out. Clothing keeps all sizes or loses the smallest or the largest.
const availableSizeIds = (productId: number, all: number[]): number[] => {
  if (all.length <= 1) return all;
  const rng = mulberry32(productId * 7919 + 13);
  if (all.length <= 4) {
    const drop = Math.floor(rng() * 3);
    return drop === 1 ? all.slice(1) : drop === 2 ? all.slice(0, -1) : all;
  }
  const start = Math.floor(rng() * 2);
  const end = all.length - 1 - Math.floor(rng() * 3);
  const ids = all.slice(start, end + 1);
  if (rng() < 0.4 && ids.length > 4) {
    ids.splice(1 + Math.floor(rng() * (ids.length - 2)), 1);
  }
  return ids;
};

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
    name: "Crossbody Bag - Brown",
    price: 799,
    category_Id: 10,
    description:
      "Kompakt crossbody taske i mørkebrunt læder med fremhævet NORDWEAR-logo, lynlås og justerbar stofrem.",
    images: sequence("brown-crossbody-bag", 5),
  },
  // Collection photographed as four 4:5 views each: main, side, front, detail.
  // Category ids: 1 Skjorter, 5 Sneakers, 7 Loafers, 8 Dress shoes, 9 Boots.
  ...(
    [
      ["sn-01-the-essential", "Essential Low - Ivory", 5, 899, "Low top sneaker i glat elfenbensfarvet læder med ruskindshæl og cremefarvet gummisål. Ren og nordisk, til hverdagen."],
      ["sn-02-the-suede", "Suede Sneaker - Taupe", 5, 999, "Low top sneaker i blødt taupefarvet ruskind med karamelfarvet gummisål. Varm i tonen og let at style."],
      ["sn-03-the-classic", "Classic Sneaker - Black", 5, 949, "Helsort low top sneaker i blødt kornet læder med tonet sål. Et diskret og tidløst udtryk."],
      ["sn-04-the-modern", "Modern Runner - Grey", 5, 1099, "Moderne sneaker i grå mesh og ruskind med let, dæmpet sål. Komfort til lange dage."],
      ["sn-05-the-heritage", "Heritage Sneaker - Brown", 5, 1049, "Low top sneaker i mørkebrunt læder med cremefarvet sål og kontrastsyning. Klassisk med et varmt udtryk."],
      ["lo-01-the-penny", "Penny Loafer - Sand Suede", 7, 1199, "Penny loafer i sandfarvet ruskind med læderhæl. Let og elegant, til både habit og chinos."],
      ["lo-02-the-leather", "Leather Penny Loafer - Brown", 7, 1299, "Penny loafer i mørkebrunt glatlæder med cognacfarvet foring og læderhæl. En fast favorit i garderoben."],
      ["lo-03-the-bit", "Bit Loafer - Black", 7, 1399, "Sort loafer i blankt læder med metalbeslag over vristen. Skarp og stilren."],
      ["lo-04-the-tassel", "Tassel Loafer - Sand Suede", 7, 1299, "Tassel loafer i sandfarvet ruskind med læderkvaster. En afslappet klassiker."],
      ["lo-05-the-signature", "Signature Loafer - Burgundy", 7, 1399, "Penny loafer i dyb burgunderfarvet læder med læderhæl. Et udtryk med karakter."],
      ["ds-01-the-oxford", "Oxford - Black Calf", 8, 1499, "Klassisk oxford med cap toe i sort kalveskind med læderhæl. Til kontoret og de pæne anledninger."],
      ["ds-02-the-derby", "Derby - Brown", 8, 1399, "Derby i mørkebrunt glatlæder med åbne snørebånd og læderhæl. Alsidig fra hverdag til fest."],
      ["ds-03-the-brogue", "Brogue - Burgundy", 8, 1599, "Wingtip brogue i burgunderfarvet læder med fine perforeringer. Håndværk i detaljen."],
      ["ds-04-the-wholecut", "Wholecut - Black", 8, 1599, "Wholecut oxford skåret i ét stykke sort læder, uden syninger over vristen. Minimalistisk og elegant."],
      ["ds-05-the-suede", "Suede Derby - Espresso", 8, 1349, "Derby i mørkt espressofarvet ruskind med læderhæl. Blød i overfladen og afdæmpet i udtrykket."],
      ["bt-01-the-chelsea", "Chelsea - Chestnut", 9, 1599, "Chelsea støvle i kastanjebrunt glatlæder med elastikindsats og trækløkke. Tidløs form til efterår og vinter."],
      ["bt-02-the-utility", "Utility Boot - Black", 9, 1699, "Snørestøvle i sort læder med kraftig lugsål. Robust i udtrykket og klar til vejret."],
      ["bt-03-the-chukka", "Chukka Boot - Espresso Suede", 9, 1399, "Chukka støvle i espressofarvet ruskind med to par øjer og lys søm. Afslappet og elegant."],
      ["sh-01-the-essential", "Essential Skjorte - Ivory", 1, 599, "Button-down skjorte i blød, elfenbensfarvet bomuld med brystlomme. Grundstenen i garderoben."],
      ["sh-02-the-oxford", "Oxford Skjorte - Lyseblå", 1, 649, "Oxford skjorte i lyseblå bomuld med button-down krave og brystlomme. Klassisk og let at kombinere."],
      ["sh-03-the-linen", "Hørskjorte - Sort", 1, 699, "Skjorte i sort hørlignende stof med perlemorsknapper. Let og luftig, med et mørkt udtryk."],
      ["sh-04-the-stripe", "Stribet Skjorte - Blå", 1, 599, "Skjorte i blå og hvid smalstribet bomuld med button-down krave. Frisk og nordisk."],
    ] as [string, string, number, number, string][]
  ).map(([folder, name, category_Id, price, description]) => ({
    name,
    price,
    category_Id,
    description,
    images: sequence(folder, 4),
  })),
];

async function main() {
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
    { id: 5, name: "Sneakers" },
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
  // Products have no colour options; every variant uses this single colour
  // (id 1, which the admin product form also uses).
  const colorsToSeed = [{ id: 1, name: "Standard" }];
  await prisma.color.createMany({ data: colorsToSeed, skipDuplicates: true });
  console.log("Colors seeded.");

  // 4. Insert Sizes
  const sizesToSeed = [
    { id: 1, name: "S" },
    { id: 2, name: "M" },
    { id: 3, name: "L" },
    { id: 4, name: "XL" },
    // EU shoe sizes
    { id: 5, name: "40" },
    { id: 6, name: "41" },
    { id: 7, name: "42" },
    { id: 8, name: "43" },
    { id: 9, name: "44" },
    { id: 10, name: "45" },
    { id: 11, name: "46" },
    { id: 12, name: "One size" },
  ];
  const sizeIdsFor = (categoryId: number) =>
    SHOE_CATEGORY_IDS.includes(categoryId)
      ? [5, 6, 7, 8, 9, 10, 11]
      : categoryId === ACCESSORIES_CATEGORY_ID
        ? [12]
        : [1, 2, 3, 4];
  await prisma.size.createMany({ data: sizesToSeed, skipDuplicates: true });
  console.log("Sizes seeded.");

  // 5. Insert Products
  const productsToSeed = HAND_MADE_PRODUCTS.map((p, i) => ({
    id: i + 1,
    name: p.name,
    price: p.price,
    offer_price: null,
    category_Id: p.category_Id,
    status: ProductStatus.ONLINE,
    description: p.description,
    images: p.images,
  }));
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
  const imagesToSeed = productsToSeed.flatMap((product) =>
    product.images.map((url, i) => ({
      productId: product.id,
      url,
      isThumbnail: i === 0,
    })),
  );
  await prisma.productImage.createMany({
    data: imagesToSeed,
    skipDuplicates: true,
  });
  console.log("Product images seeded.");

  // 6. Insert Product Quantities
  const quantitiesToSeed = [];
  for (const product of productsToSeed) {
    const productSizeIds = availableSizeIds(
      product.id,
      sizeIdsFor(product.category_Id),
    );
    for (const size of sizesToSeed.filter((s) => productSizeIds.includes(s.id))) {
      for (const color of colorsToSeed) {
        quantitiesToSeed.push({
          productId: product.id,
          sizeId: size.id,
          colorId: color.id,
          quantity: 5 + Math.floor(Math.random() * 55),
        });
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
            sizeId: 12, // One size (product 1 is the crossbody bag)
            colorId: 1,
          },
          {
            orderId: order.id,
            productId: 2,
            quantity: 2,
            price: 30000,
            sizeId: 8, // EU 43 (product 2 is in stock in 43)
            colorId: 1,
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
