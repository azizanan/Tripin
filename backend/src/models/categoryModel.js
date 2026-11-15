import pool from "../config/database.js";

export async function listCategories() {
  const [rows] = await pool.execute(
    `SELECT c.id, c.category_name, c.slug, c.description,
       COUNT(d.id) AS destination_count
     FROM categories c
     LEFT JOIN destinations d ON d.category_id = c.id AND d.is_published = TRUE
     GROUP BY c.id
     ORDER BY c.category_name ASC`
  );
  return rows;
}

export async function getCategoryById(id) {
  const [rows] = await pool.execute(
    "SELECT id, category_name, slug, description FROM categories WHERE id = ? LIMIT 1",
    [id]
  );
  return rows[0] || null;
}

export async function createCategory({ categoryName, slug, description }) {
  const [result] = await pool.execute(
    "INSERT INTO categories (category_name, slug, description) VALUES (?, ?, ?)",
    [categoryName, slug, description || null]
  );
  return getCategoryById(result.insertId);
}

export async function updateCategory(id, { categoryName, slug, description }) {
  await pool.execute(
    "UPDATE categories SET category_name = ?, slug = ?, description = ? WHERE id = ?",
    [categoryName, slug, description || null, id]
  );
  return getCategoryById(id);
}

export async function deleteCategory(id) {
  const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
