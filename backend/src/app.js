import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import placeRoutes from "./routes/placeRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => {
  res.json({
    name: "TRIPIN API",
    message: "Selamat datang di backend TRIPIN"
  });
});

app.use("/api/health", healthRoutes);
app.use("/api/places", placeRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan."
  });
});

app.use((error, _req, res, _next) => {
  console.error("API error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : "Terjadi kesalahan pada server."
  });
});

export default app;
