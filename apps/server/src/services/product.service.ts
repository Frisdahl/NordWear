import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProducts = async () => {
    return await prisma.product.findMany({
        include: {
            category: true,
        },
    });
};

export const createProduct = async (data: { name: string; price: number; categoryId?: number }) => {
    return await prisma.product.create({
        data,
    });
};

export const getCategories = async () => {
    return await prisma.category.findMany();
};