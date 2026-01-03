import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";
import apiRoutes from "./routes/api.routes";
import errorHandler from "./middleware/errorHandler";
import { stripeWebhookHandler } from "./controllers/stripe.controller";
import { csrfProtection } from "./middleware/csrf";

const app = express();
const prisma = new PrismaClient();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

// 1. CORS - MUST be first to handle preflight requests correctly
app.use(
  cors({
    origin: clientUrl,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
  })
);

// 2. Security Headers (Adjusted for development/local fonts if needed)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// 3. Prevent HTTP Parameter Pollution
app.use(hpp());

// 4. Parse cookies
app.use(cookieParser());

// 5. CSRF Protection - Apply to all /api/ routes except webhook
app.use("/api/", (req, res, next) => {
  if (req.path === "/stripe/webhook") return next();
  csrfProtection(req, res, next);
});

// 6. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Increased to 1000 to be more lenient during development
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to /api/ routes except webhook
app.use("/api/", (req, res, next) => {
  if (req.path === "/stripe/webhook") return next();
  limiter(req, res, next);
});

// 6. Stripe webhook (Raw body)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

// 7. Normal JSON parsing
app.use(express.json({ limit: "10mb" }));

// 8. Routes
app.use("/api", apiRoutes);

// 9. Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
