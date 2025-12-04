import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      deleted_at: null,
    },
    include: {
      category: true,
      product_quantity: {
        select: {
          quantity: true,
        },
      },
    },
  });

  // Calculate total_stock and num_variants for each product
  return products.map((product) => {
    const total_stock = product.product_quantity.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const num_variants = product.product_quantity.length;

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      offer_price: product.offer_price,
      status: product.status,
      category_Id: product.category_Id,
      deleted_at: product.deleted_at,
      category: product.category,
      total_stock: total_stock,
      num_variants: num_variants,
    };
  });
};

export const getProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      shipment_size: true,
      images: true, // Include the image gallery
      product_quantity: {
        include: {
          size: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  // Restructure the variants data to be more frontend-friendly
  const variants = product.product_quantity.map(item => ({
    size: item.size.name,
    stock: item.quantity,
    // Assuming a default or related price per variant if available
    // price: item.price, 
  }));

  return { ...product, variants };
};

export const createProduct = async (data: any) => {
  const { shipment_size, variants, images, ...productData } = data;

  const newProduct = await prisma.product.create({
    data: {
      ...productData,
      shipment_size: {
        create: shipment_size,
      },
      images: {
        create: images,
      },
    },
  });

  if (variants && variants.length > 0) {
    const sizeNames = variants.map((v: any) => v.size);
    const sizes = await prisma.size.findMany({
      where: {
        name: { in: sizeNames },
      },
    });
    const sizeMap = new Map(sizes.map((s) => [s.name, s.id]));

    const productQuantities = variants.map((v: any) => ({
      productId: newProduct.id,
      sizeId: sizeMap.get(v.size),
      quantity: v.stock,
      // colorId will be handled later
      colorId: 1,
    }));

    await prisma.product_quantity.createMany({
      data: productQuantities,
    });
  }

  return newProduct;
};

export const updateProduct = async (id: number, data: any) => {
  const { shipment_size, variants, images, ...productData } = data;

  return prisma.$transaction(async (tx) => {
    // 1. Update the core product data
    const updatedProduct = await tx.product.update({
      where: { id },
      data: productData,
    });

    // 2. Update the shipment size
    if (shipment_size) {
      await tx.shipment_size.upsert({
        where: { productId: id },
        update: shipment_size,
        create: { ...shipment_size, productId: id },
      });
    }

    // 3. Delete old images and create new ones
    await tx.productImage.deleteMany({ where: { productId: id } });
    if (images && images.length > 0) {
      await tx.productImage.createMany({
        data: images.map((img: { url: string; isThumbnail: boolean }) => ({
          ...img,
          productId: id,
        })),
      });
    }

    // 4. Delete old variants
    await tx.product_quantity.deleteMany({
      where: { productId: id },
    });

    // 5. Create new variants
    if (variants && variants.length > 0) {
      const sizeNames = variants.map((v: any) => v.size);
      const sizes = await tx.size.findMany({
        where: { name: { in: sizeNames } },
      });
      const sizeMap = new Map(sizes.map((s) => [s.name, s.id]));

      const productQuantities = variants.map((v: any) => ({
        productId: id,
        sizeId: sizeMap.get(v.size),
        quantity: v.stock,
        colorId: 1, // Hardcoded for now
      }));

      await tx.product_quantity.createMany({
        data: productQuantities,
      });
    }

    return updatedProduct;
  });
};

export const getCategories = async () => {
  return await prisma.category.findMany();
};

export const deleteProducts = async (ids: number[]) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { count: 0 };
  }

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // Safe deletes
      await tx.cart_item.deleteMany({
        where: { productId: { in: ids } },
      });

      await tx.product_quantity.deleteMany({
        where: { productId: { in: ids } },
      });

      // Only delete if table exists
      if (tx.customer_likes) {
        await tx.customer_likes.deleteMany({
          where: { productId: { in: ids } },
        });
      }

      // DO NOT delete order_item

      // Soft-delete the product
      return tx.product.updateMany({
        where: { id: { in: ids } },
        data: { deleted_at: new Date() },
      });
    }
  );

  return result;
};
