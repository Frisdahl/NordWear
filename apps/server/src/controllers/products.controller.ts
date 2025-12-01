import { Request, Response } from "express";
import {
  getProducts as getProductsService,
  createProduct as createProductService,
  getCategories as getCategoriesService,
  deleteProducts as deleteProductsService,
} from "../services/product.service";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products: any[] = await getProductsService();
    res.status(200).json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error retrieving products", error: msg });
  }
};

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData = req.body;
    const newProduct: any = await createProductService(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("POST /api/products error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error creating product", error: msg });
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
    console.error("GET /api/categories error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error retrieving categories", error: msg });
  }
};

export const deleteProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.some((id) => typeof id !== "number")) {
      res.status(400).json({ message: "Invalid 'ids' array in request body" });
      return;
    }

    const result = await deleteProductsService(ids);
    res.status(200).json(result);
  } catch (error) {
    console.error("DELETE /api/products error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error deleting products", error: msg });
  }
};
