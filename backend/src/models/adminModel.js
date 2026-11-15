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
