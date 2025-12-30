import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import apiRoutes from "./routes/api.routes";
import errorHandler from "./middleware/errorHandler";
import { stripeWebhookHandler } from "./controllers/stripe.controller";

const app = express();
const prisma = new PrismaClient();

app.options("*", cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Stripe webhook MUST be raw (BEFORE express.json)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

// ✅ Normal JSON parsing for all other routes
app.use(express.json({ limit: "10mb" }));

app.use("/api", apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
