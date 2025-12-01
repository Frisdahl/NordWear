import { Request, Response } from "express";
import { Product } from "@prisma/client";
import {
  getProducts as getProductsService,
  createProduct as createProductService,
  getCategories as getCategoriesService,
} from "../services/product.service";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products: Product[] = await getProductsService();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct: Product = await createProductService(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving categories", error });
  }
};
