import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import authRoutes from "./routes/authRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { checkDatabaseConnection } from "./config/database.js";

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Origin tidak diizinkan oleh kebijakan CORS."));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { success: false, message: "Terlalu banyak percobaan. Coba lagi dalam 15 menit." }
});

app.get("/", (_req, res) => {
  res.json({ name: "TRIPIN API", message: "Explore More, Discover Surabaya." });
});

app.get("/api/health", async (_req, res) => {
  try {
    await checkDatabaseConnection();
    return res.json({ success: true, api: "ok", database: "connected" });
  } catch {
    return res.status(503).json({ success: false, api: "ok", database: "disconnected" });
  }
});

app.use("/api/auth/register", authLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/admin", adminRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Endpoint tidak ditemukan." });
});

app.use((error, _req, res, _next) => {
  console.error("API error:", error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({ success: false, message: "Data sudah terdaftar atau sudah ada." });
  }
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({ success: false, message: "Kategori atau destinasi yang dipilih tidak ditemukan." });
  }
  if (error.code === "ER_ROW_IS_REFERENCED_2") {
    return res.status(409).json({ success: false, message: "Data masih digunakan dan tidak dapat dihapus." });
  }
  if (error.message?.includes("Origin tidak diizinkan")) {
    return res.status(403).json({ success: false, message: "Origin tidak diizinkan." });
  }

  return res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : "Terjadi kesalahan pada server."
  });
});

export default app;
