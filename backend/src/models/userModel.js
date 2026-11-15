import pool from "../config/database.js";

export async function findUserByEmail(email) {
  const [rows] = await pool.execute(
    "SELECT id, name, email, password, profile_image, role, created_at FROM users WHERE email = ? LIMIT 1",
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const [rows] = await pool.execute(
    "SELECT id, name, email, profile_image, role, created_at FROM users WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

export async function createUser({ name, email, passwordHash }) {
  const [result] = await pool.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );
  return findUserById(result.insertId);
}

export async function updateUserProfile(id, { name, profileImage }) {
  await pool.execute(
    "UPDATE users SET name = ?, profile_image = ? WHERE id = ?",
    [name, profileImage, id]
  );
  return findUserById(id);
}
