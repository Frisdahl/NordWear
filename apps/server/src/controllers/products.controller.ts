import { Request, Response } from "express";
import {
  getProducts as getProductsService,
  createProduct as createProductService,
  getCategories as getCategoriesService,
  deleteProducts as deleteProductsService,
  getProduct as getProductService,
  updateProduct as updateProductService,
  getSizes as getSizesService,
} from "../services/product.service";

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, minPrice, maxPrice, 'categories[]': categories, 'sizes[]': sizes } = req.query;

    const minPriceNum = minPrice ? Number(minPrice) : undefined;
    const maxPriceNum = maxPrice ? Number(maxPrice) : undefined;
    
    const categoryIds = categories ? (Array.isArray(categories) ? categories.map(Number) : [Number(categories)]) : undefined;
    const sizeIds = sizes ? (Array.isArray(sizes) ? sizes.map(Number) : [Number(sizes)]) : undefined;

    const products: any[] = await getProductsService(
      category as string,
      minPriceNum,
      maxPriceNum,
      categoryIds,
      sizeIds
    );
    res.status(200).json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error retrieving products", error: msg });
  }
};

export const getProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID." });
      return;
    }
    const product = await getProductService(id);
    if (!product) {
      res.status(404).json({ message: "Product not found." });
      return;
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(`GET /api/products/${req.params.id} error:`, error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error retrieving product", error: msg });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid product ID." });
      return;
    }
    const productData = req.body;
    const updatedProduct = await updateProductService(id, productData);
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(`PUT /api/products/${req.params.id} error:`, error);
    const msg = error instanceof Error ? error.message : String(error);
    res.status(500).json({ message: "Error updating product", error: msg });
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

export const getSizes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const sizes = await getSizesService();
    res.status(200).json(sizes);
  } catch (error) {
    console.error("GET /api/sizes error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Error retrieving sizes", error: msg });
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
