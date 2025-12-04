import express from "express";
import cors from "cors";
import { json } from "body-parser";
import apiRoutes from "./routes/api.routes";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable pre-flight across-the-board
app.options('*', cors());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(json());

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
