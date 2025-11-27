import { Request, Response } from 'express';
import { Product } from '@prisma/client';
import { productService } from '../services/product.service';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products: Product[] = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products', error });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const productData = req.body;
        const newProduct: Product = await productService.createProduct(productData);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};