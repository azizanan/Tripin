import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "../config/database.js";

async function createAdmin() {
  const name = String(process.env.ADMIN_NAME || "").trim();
  const email = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const password = String(process.env.ADMIN_PASSWORD || "");

  if (!name || !email || password.length < 12) {
    throw new Error("Isi ADMIN_NAME, ADMIN_EMAIL, dan ADMIN_PASSWORD minimal 12 karakter di file .env.");
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [existing] = await pool.execute("SELECT id FROM users WHERE email = ? LIMIT 1", [email]);

  if (existing.length) {
    await pool.execute("UPDATE users SET role = 'admin' WHERE id = ?", [existing[0].id]);
    console.log(`Role admin diberikan kepada akun ${email}.`);
  } else {
    await pool.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'admin')",
      [name, email, passwordHash]
    );
    console.log(`Akun admin ${email} berhasil dibuat.`);
  }
}

createAdmin()
  .catch((error) => {
    console.error("Gagal membuat admin:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
