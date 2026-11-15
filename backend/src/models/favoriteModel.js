import pool from "../config/database.js";

export async function listFavorites(userId) {
  const [rows] = await pool.execute(
    `SELECT d.id, d.name, d.slug, d.description, d.address, d.district, d.image,
       COALESCE(AVG(r.rating), 0) AS rating,
       COUNT(DISTINCT r.id) AS review_count,
       f.created_at AS favorited_at, c.category_name
     FROM favorites f
     INNER JOIN destinations d ON d.id = f.destination_id
     LEFT JOIN categories c ON c.id = d.category_id
     LEFT JOIN reviews r ON r.destination_id = d.id
     WHERE f.user_id = ?
     GROUP BY d.id, f.created_at, c.category_name
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function addFavorite(userId, destinationId) {
  await pool.execute(
    "INSERT INTO favorites (user_id, destination_id) VALUES (?, ?)",
    [userId, destinationId]
  );
}

export async function removeFavorite(userId, destinationId) {
  const [result] = await pool.execute(
    "DELETE FROM favorites WHERE user_id = ? AND destination_id = ?",
    [userId, destinationId]
  );
  return result.affectedRows > 0;
}
