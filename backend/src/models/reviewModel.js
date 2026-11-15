import pool from "../config/database.js";

export async function listReviews(destinationId) {
  const [rows] = await pool.execute(
    `SELECT r.id, r.user_id, r.destination_id, r.rating, r.comment, r.created_at,
       u.name AS user_name, u.profile_image
     FROM reviews r
     INNER JOIN users u ON u.id = r.user_id
     WHERE r.destination_id = ?
     ORDER BY r.created_at DESC`,
    [destinationId]
  );
  return rows;
}

export async function listReviewsByUser(userId) {
  const [rows] = await pool.execute(
    `SELECT r.id, r.user_id, r.destination_id, r.rating, r.comment, r.created_at,
       d.name AS destination_name, d.image AS destination_image
     FROM reviews r
     INNER JOIN destinations d ON d.id = r.destination_id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [userId]
  );
  return rows;
}

export async function createReview({ userId, destinationId, rating, comment }) {
  const [result] = await pool.execute(
    "INSERT INTO reviews (user_id, destination_id, rating, comment) VALUES (?, ?, ?, ?)",
    [userId, destinationId, rating, comment]
  );
  return getReviewById(result.insertId);
}

export async function getReviewById(id) {
  const [rows] = await pool.execute(
    "SELECT id, user_id, destination_id, rating, comment, created_at FROM reviews WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

export async function updateReview(id, { rating, comment }) {
  await pool.execute(
    "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
    [rating, comment, id]
  );
  return getReviewById(id);
}

export async function deleteReview(id) {
  const [result] = await pool.execute("DELETE FROM reviews WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function getReviewOwner(id) {
  const [rows] = await pool.execute("SELECT user_id FROM reviews WHERE id = ? LIMIT 1", [id]);
  return rows[0] || null;
}
