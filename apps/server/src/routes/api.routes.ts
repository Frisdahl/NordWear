import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  getCategories,
  getCategory,
  deleteProducts,
  getSizes,
  likeProduct,
  unlikeProduct,
  getLikedProducts,
  getCustomerByUserId,
  searchProducts,
} from "../controllers/products.controller";
import {
  getShipmondoProducts,
  getShipmentOptions,
  getShipmentRates,
} from "../controllers/shipping.controller";
import { uploadImage } from "../controllers/upload.controller";
import { login, register } from "../controllers/auth.controller"; // Import the login controller

import {
  createCheckoutSession,
  getCheckoutSession,
} from "../controllers/stripe.controller";
import { sendOrderConfirmation } from "../controllers/email.controller";
import { validateGiftCard, createGiftCard, getGiftCards } from "../controllers/giftcard.controller";
import { createFreeOrder } from "../controllers/order.controller";
import { subscribeNewsletter } from "../controllers/newsletter.controller";

const router = Router();

router.post("/login", login); // Add the login route
router.post("/register", register);
router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.get("/products/:id", getProduct);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products", deleteProducts);
router.post("/products/like", likeProduct);
router.delete("/products/unlike", unlikeProduct);
router.get("/products/liked/:customerId", getLikedProducts);
router.get("/customer/by-user/:userId", getCustomerByUserId);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategory);
router.get("/sizes", getSizes);
router.post("/upload", uploadImage);

// shipment routes

router.get("/shipmondo/products", getShipmondoProducts);
router.get("/shipment-options", getShipmentOptions);
router.post("/quotes", getShipmentRates);
router.post("/create-checkout-session", createCheckoutSession);
router.get("/checkout-session", getCheckoutSession);
router.post("/send-order-confirmation", sendOrderConfirmation);

// Gift card routes
router.post("/gift-cards/validate", validateGiftCard);
router.post("/gift-cards", createGiftCard);
router.get("/gift-cards", getGiftCards);
router.post("/orders/create-free", createFreeOrder);
router.post("/newsletter/subscribe", subscribeNewsletter);

export default router;