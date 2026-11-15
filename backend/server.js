import "dotenv/config";
import app from "./src/app.js";

const PORT = Number(process.env.PORT || 5000);

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET wajib diatur dan minimal 32 karakter. Salin backend/.env.example menjadi backend/.env.");
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`TRIPIN API berjalan di http://localhost:${PORT}`);
});

function shutdown(signal) {
  console.log(`\n${signal} diterima. Menutup server...`);
  server.close(() => process.exit(0));
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
