import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "TRIPIN API",
    message: "Selamat datang di backend TRIPIN"
  });
});

app.use("/api/health", healthRoutes);

export default app;
