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

// Enable trust proxy for DigitalOcean Load Balancer
app.set("trust proxy", 1);

// DEBUG: Global Request Logger
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.originalUrl}`);
  next();
});

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

// 5. Stripe webhook (Raw body) - MUST be before JSON parser and CSRF
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

// 6. CSRF Protection - Apply to all other /api/ routes
app.use("/api", csrfProtection);

// 7. Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// 8. Normal JSON parsing
app.use(express.json({ limit: "10mb" }));

// 9. Routes
app.use("/api", apiRoutes);

// 10. Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
