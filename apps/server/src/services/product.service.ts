import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async (
  categoryName?: string,
  minPrice?: number,
  maxPrice?: number,
  categoryIds?: number[],
  sizeIds?: number[],
  limit?: number,
  sort?: string
) => {
  const where: Prisma.productWhereInput = {
    deleted_at: null,
  };

  if (categoryIds && categoryIds.length > 0) {
    where.category_Id = { in: categoryIds };
  } else if (categoryName) {
    const capitalizedCategoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
    where.category = {
      name: {
        equals: capitalizedCategoryName,
      },
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceFilter: Prisma.FloatFilter = {};
    if (minPrice !== undefined) {
      priceFilter.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      priceFilter.lte = maxPrice;
    }
    where.price = priceFilter;
  }

  if (sizeIds && sizeIds.length > 0) {
    where.product_quantity = {
      some: {
        sizeId: { in: sizeIds },
      },
    };
  }

  let orderBy: Prisma.productOrderByWithRelationInput | undefined;

  switch (sort) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'name-asc':
      orderBy = { name: 'asc' };
      break;
    case 'name-desc':
      orderBy = { name: 'desc' };
      break;
    case 'newest':
      orderBy = { id: 'desc' };
      break;
    case 'oldest':
      orderBy = { id: 'asc' };
      break;
    default:
      orderBy = undefined;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: true,
      product_quantity: {
        include: {
          color: true,
        },
      },
      images: {
        where: { isThumbnail: true },
        take: 1,
      },
    },
    take: limit, // Apply the limit here
  });

  return products.map((product) => {
    const total_stock = product.product_quantity.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const num_variants = product.product_quantity.length;
    const imageUrl = product.images.length > 0 ? product.images[0].url : null;
    
    // Get unique colors
    const colorMap = new Map<number, string>();
    product.product_quantity.forEach(item => {
      if (item.color) {
        colorMap.set(item.color.id, item.color.name);
      }
    });
    const colors = Array.from(colorMap.values());

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      offer_price: product.offer_price,
      status: product.status,
      category_Id: product.category_Id,
      imageUrl: imageUrl,
      category: product.category,
      total_stock: total_stock,
      num_variants: num_variants,
      colors: colors,
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
          color: true,
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

export const searchProducts = async (query: string) => {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
          },
        },
        {
          description: {
            contains: query,
          },
        },
      ],
      deleted_at: null,
    },
    include: {
      category: true,
      images: {
        where: { isThumbnail: true },
        take: 1,
      },
    },
  });

  return products.map((product) => {
    const imageUrl = product.images.length > 0 ? product.images[0].url : null;
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      offer_price: product.offer_price,
      status: product.status,
      category_Id: product.category_Id,
      imageUrl: imageUrl,
      category: product.category,
    };
  });
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

export const getCategory = async (id: number) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

export const getSizes = async () => {
  return await prisma.size.findMany();
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

export const likeProduct = async (customerId: number, productId: number) => {
    return await prisma.customer_likes.create({
        data: {
            customerId,
            productId,
        },
    });
};

export const unlikeProduct = async (customerId: number, productId: number) => {
    const like = await prisma.customer_likes.findUnique({
        where: {
            customerId_productId: {
                customerId,
                productId,
            }
        },
    });

    if (like) {
        return await prisma.customer_likes.delete({
            where: {
                id: like.id,
            },
        });
    }
};

export const getLikedProducts = async (customerId: number) => {
    const likedProducts = await prisma.customer_likes.findMany({
        where: {
            customerId,
        },
        include: {
            product: {
                include: {
                    images: {
                        where: { isThumbnail: true },
                        take: 1,
                    },
                    category: true,
                },
            },
        },
    });

    return likedProducts.map(lp => {
        const product = lp.product;
        const imageUrl = product.images.length > 0 ? product.images[0].url : null;
        return {
            ...lp,
            product: {
                ...product,
                imageUrl,
            },
        };
    });
};

export const getCustomerByUserId = async (userId: number) => {
    // Upsert ensures we either find the existing customer or create a new one safely
    // This handles the race condition where multiple requests try to create the customer at once
    const customer = await prisma.customer.upsert({
        where: {
            userId: userId,
        },
        update: {}, // No updates needed if found
        create: {
            userId: userId,
        },
    });

    return customer;
};
