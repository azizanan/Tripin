import { Router } from "express";
import { checkDatabaseConnection } from "../config/database.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    await checkDatabaseConnection();

    return res.status(200).json({
      success: true,
      status: "ok",
      message: "TRIPIN API dan database berhasil terhubung."
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);

    return res.status(503).json({
      success: false,
      status: "degraded",
      message: "API berjalan, tetapi database belum dapat diakses."
    });
  }
});

export default router;
