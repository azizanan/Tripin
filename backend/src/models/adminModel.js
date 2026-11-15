import pool from "../config/database.js";

export async function getAdminStats() {
  const [[destinations]] = await pool.execute("SELECT COUNT(*) AS total FROM destinations");
  const [[users]] = await pool.execute("SELECT COUNT(*) AS total FROM users");
  const [[reviews]] = await pool.execute("SELECT COUNT(*) AS total FROM reviews");
  const [[categories]] = await pool.execute("SELECT COUNT(*) AS total FROM categories");
  const [[published]] = await pool.execute("SELECT COUNT(*) AS total FROM destinations WHERE is_published = TRUE");
  return {
    totalDestinations: destinations.total,
    publishedDestinations: published.total,
    totalUsers: users.total,
    totalReviews: reviews.total,
    totalCategories: categories.total
  };
}

export async function listAdminDestinations() {
  const [rows] = await pool.execute(
    `SELECT d.id, d.category_id, d.name, d.slug, d.description, d.address,
       d.district, d.latitude, d.longitude, d.price_min, d.price_max,
       d.opening_hours, d.image, d.is_published, d.created_at,
       c.category_name,
       COALESCE(AVG(r.rating), 0) AS average_rating,
       COUNT(r.id) AS review_count
     FROM destinations d
     LEFT JOIN categories c ON c.id = d.category_id
     LEFT JOIN reviews r ON r.destination_id = d.id
     GROUP BY d.id, c.category_name
     ORDER BY d.created_at DESC`
  );
  return rows;
}

export async function listAdminReviews() {
  const [rows] = await pool.execute(
    `SELECT r.id, r.user_id, r.destination_id, r.rating, r.comment, r.created_at,
       u.name AS user_name, u.email AS user_email, d.name AS destination_name
     FROM reviews r
     INNER JOIN users u ON u.id = r.user_id
     INNER JOIN destinations d ON d.id = r.destination_id
     ORDER BY r.created_at DESC
     LIMIT 200`
  );
  return rows;
}
