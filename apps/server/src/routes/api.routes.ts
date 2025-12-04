import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
  deleteProducts,
} from "../controllers/products.controller";
import { uploadImage } from "../controllers/upload.controller";

const router = Router();

router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products", deleteProducts);
router.get("/categories", getCategories);
router.post("/upload", uploadImage);

export default router;
