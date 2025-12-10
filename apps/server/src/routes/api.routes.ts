import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
  deleteProducts,
  getSizes,
} from "../controllers/products.controller";
import { uploadImage } from "../controllers/upload.controller";
import { login } from "../controllers/auth.controller"; // Import the login controller

const router = Router();

router.post("/login", login); // Add the login route
router.get("/products", getProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products", deleteProducts);
router.get("/categories", getCategories);
router.get("/sizes", getSizes);
router.post("/upload", uploadImage);

export default router;
