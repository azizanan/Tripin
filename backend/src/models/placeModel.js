import pool from "../config/database.js";

export async function getPlaces({ search = "", category = "", limit = 12, offset = 0 } = {}) {
  const conditions = ["p.is_published = TRUE"];
  const values = [];

  if (search) {
    conditions.push("(p.name LIKE ? OR p.description LIKE ? OR p.area LIKE ?)");
    const keyword = `%${search}%`;
    values.push(keyword, keyword, keyword);
  }

  if (category) {
    conditions.push("c.slug = ?");
    values.push(category);
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`;

  const [rows] = await pool.execute(
    `SELECT
       p.id,
       p.name,
       p.slug,
       p.description,
       p.area,
       p.address,
       p.image_url,
       p.latitude,
       p.longitude,
       c.name AS category_name,
       c.slug AS category_slug
     FROM places p
     LEFT JOIN categories c ON c.id = p.category_id
     ${whereClause}
     ORDER BY p.created_at DESC
     LIMIT ? OFFSET ?`,
    [...values, limit, offset]
  );

  return rows;
}

export async function getPlaceById(id) {
  const [rows] = await pool.execute(
    `SELECT
       p.id,
       p.name,
       p.slug,
       p.description,
       p.area,
       p.address,
       p.image_url,
       p.latitude,
       p.longitude,
       c.name AS category_name,
       c.slug AS category_slug
     FROM places p
     LEFT JOIN categories c ON c.id = p.category_id
     WHERE p.id = ? AND p.is_published = TRUE
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}
