import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getProducts = async () => {
  return await prisma.product.findMany({
    include: {
      category: true,
    },
  });
};

export const createProduct = async (data: {
  name: string;
  price: number;
  categoryId?: number;
}) => {
  const { categoryId, ...rest } = data;
  const payload: any = { ...rest };

  // if your schema requires a category relation, connect it here
  if (categoryId != null) {
    payload.category = { connect: { id: categoryId } };
  }

  return await prisma.product.create({
    data: payload,
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

      return tx.product.deleteMany({
        where: { id: { in: ids } },
      });
    }
  );

  return result;
};
