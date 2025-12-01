import { Router } from "express";
import {
  getProducts,
  createProduct,
  getCategories,
  deleteProducts,
} from "../controllers/products.controller";

const router = Router();

router.get("/products", getProducts);
router.post("/products", createProduct);
router.delete("/products", deleteProducts);
router.get("/categories", getCategories);

export default router;
