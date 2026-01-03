import express from "express";
import cors from "cors";
import { json } from "body-parser";
import apiRoutes from "./routes/api.routes";
import { stripeWebhookHandler } from "./controllers/stripe.controller"; // Import the new handler

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// Enable pre-flight across-the-board
app.options('*', cors());

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Stripe webhook must come BEFORE body-parser, to get the raw body
app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), stripeWebhookHandler);

app.use(json()); // General JSON body parser for other routes

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
