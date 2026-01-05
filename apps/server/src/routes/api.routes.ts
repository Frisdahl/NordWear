import { Router } from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  updateProductsStatus,
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
import { login, register, getMe, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { logout } from "../controllers/logout.controller";

import {
  createCheckoutSession,
  getCheckoutSession,
} from "../controllers/stripe.controller";
import { sendOrderConfirmation } from "../controllers/email.controller";
import { validateGiftCard, createGiftCard, getGiftCards, deleteGiftCards, getGiftCard, updateGiftCard, searchGiftCards, batchUpdateGiftCards } from "../controllers/giftcard.controller";
import { createFreeOrder, searchOrders, getOrders, getOrder } from "../controllers/order.controller";
import { subscribeNewsletter } from "../controllers/newsletter.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { loginSchema, registerSchema, productSchema, giftCardSchema } from "../utils/validation";
import { Role } from "@prisma/client";

const router = Router();

// Public routes
router.post("/login", validate(loginSchema), login);
router.post("/auth/forgot-password", forgotPassword);
router.post("/auth/reset-password", resetPassword);
router.post("/logout", logout);
router.post("/register", validate(registerSchema), register);
router.get("/auth/me", authenticate, getMe);
router.get("/products", getProducts);
router.get("/products/search", searchProducts);
router.get("/products/:id", getProduct);
router.get("/categories", getCategories);
router.get("/categories/:id", getCategory);
router.get("/sizes", getSizes);
router.get("/shipmondo/products", getShipmondoProducts);
router.get("/shipment-options", getShipmentOptions);
router.post("/quotes", getShipmentRates);
router.post("/create-checkout-session", createCheckoutSession);
router.get("/checkout-session", getCheckoutSession);
router.post("/send-order-confirmation", sendOrderConfirmation);
router.post("/gift-cards/validate", validateGiftCard);
router.post("/newsletter/subscribe", subscribeNewsletter);

// Protected routes (Logged in users)
router.post("/products/like", authenticate, likeProduct);
router.delete("/products/unlike", authenticate, unlikeProduct);
router.get("/products/liked/:customerId", authenticate, getLikedProducts);
router.get("/customer/by-user/:userId", authenticate, getCustomerByUserId);
router.post("/orders/create-free", authenticate, createFreeOrder);

// Admin only routes
router.get("/admin/products", authenticate, authorize(Role.ADMIN), getProducts);
router.get("/admin/products/:id", authenticate, authorize(Role.ADMIN), getProduct);
router.post("/products", authenticate, authorize(Role.ADMIN), validate(productSchema), createProduct);
router.put("/products/bulk-status", authenticate, authorize(Role.ADMIN), updateProductsStatus);
router.put("/products/:id", authenticate, authorize(Role.ADMIN), validate(productSchema.partial()), updateProduct);
router.delete("/products", authenticate, authorize(Role.ADMIN), deleteProducts);
router.post("/upload", authenticate, authorize(Role.ADMIN), uploadImage);

router.post("/gift-cards", authenticate, authorize(Role.ADMIN), validate(giftCardSchema), createGiftCard);
router.get("/gift-cards", authenticate, authorize(Role.ADMIN), getGiftCards);
router.get("/gift-cards/search", authenticate, authorize(Role.ADMIN), searchGiftCards);
router.put("/gift-cards/batch-update", authenticate, authorize(Role.ADMIN), batchUpdateGiftCards);
router.get("/gift-cards/:id", authenticate, authorize(Role.ADMIN), getGiftCard);
router.put("/gift-cards/:id", authenticate, authorize(Role.ADMIN), validate(giftCardSchema.partial()), updateGiftCard);
router.delete("/gift-cards/batch-delete", authenticate, authorize(Role.ADMIN), deleteProducts);

router.get("/orders/search", authenticate, authorize(Role.ADMIN), searchOrders);
router.get("/orders", authenticate, authorize(Role.ADMIN), getOrders);
router.get("/orders/:id", authenticate, authorize(Role.ADMIN), getOrder);

export default router;
