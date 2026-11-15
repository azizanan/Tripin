import pool from "../config/database.js";

const SORTS = {
  newest: "d.created_at DESC",
  rating: "average_rating DESC, review_count DESC",
  popular: "review_count DESC, average_rating DESC",
  name: "d.name ASC"
};

function buildFilters(filters) {
  const where = ["d.is_published = TRUE"];
  const values = [];

  if (filters.search) {
    where.push("(d.name LIKE ? OR d.description LIKE ? OR d.address LIKE ? OR d.district LIKE ?)");
    const term = `%${filters.search}%`;
    values.push(term, term, term, term);
  }
  if (filters.categoryId) {
    where.push("d.category_id = ?");
    values.push(filters.categoryId);
  }
  if (filters.district) {
    where.push("d.district LIKE ?");
    values.push(`%${filters.district}%`);
  }
  if (filters.minPrice !== null) {
    where.push("(d.price_max IS NULL OR d.price_max >= ?)");
    values.push(filters.minPrice);
  }
  if (filters.maxPrice !== null) {
    where.push("(d.price_min IS NULL OR d.price_min <= ?)");
    values.push(filters.maxPrice);
  }
  return { clause: `WHERE ${where.join(" AND ")}`, values };
}

const SELECT_DESTINATION = `
  SELECT d.id, d.category_id, d.name, d.slug, d.description, d.address,
    d.district, d.latitude, d.longitude, d.price_min, d.price_max,
    d.opening_hours, d.image, d.created_at,
    c.category_name, c.slug AS category_slug,
    COALESCE(AVG(r.rating), 0) AS average_rating,
    COUNT(r.id) AS review_count
  FROM destinations d
  LEFT JOIN categories c ON c.id = d.category_id
  LEFT JOIN reviews r ON r.destination_id = d.id
`;

export async function listDestinations(filters) {
  const { clause, values } = buildFilters(filters);
  const orderBy = SORTS[filters.sort] || SORTS.newest;

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total FROM destinations d
     LEFT JOIN categories c ON c.id = d.category_id ${clause}`,
    values
  );

  const [rows] = await pool.execute(
    `${SELECT_DESTINATION}
     ${clause}
     GROUP BY d.id, c.category_name, c.slug
     ORDER BY ${orderBy}
     LIMIT ? OFFSET ?`,
    [...values, filters.limit, filters.offset]
  );

  return { destinations: rows, total: countRows[0].total };
}

export async function getDestinationById(id, { includeUnpublished = false } = {}) {
  const publishedClause = includeUnpublished ? "" : "AND d.is_published = TRUE";
  const [rows] = await pool.execute(
    `${SELECT_DESTINATION}
     WHERE d.id = ? ${publishedClause}
     GROUP BY d.id, c.category_name, c.slug
     LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

export async function createDestination(data) {
  const [result] = await pool.execute(
    `INSERT INTO destinations
     (category_id, name, slug, description, address, district, latitude, longitude,
      price_min, price_max, opening_hours, image, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.categoryId, data.name, data.slug, data.description || null,
      data.address || null, data.district || null, data.latitude, data.longitude,
      data.priceMin, data.priceMax, data.openingHours || null, data.image || null,
      Boolean(data.isPublished)
    ]
  );
  return getDestinationById(result.insertId, { includeUnpublished: true });
}

export async function updateDestination(id, data) {
  await pool.execute(
    `UPDATE destinations SET category_id = ?, name = ?, slug = ?, description = ?,
      address = ?, district = ?, latitude = ?, longitude = ?, price_min = ?,
      price_max = ?, opening_hours = ?, image = ?, is_published = ?
     WHERE id = ?`,
    [
      data.categoryId, data.name, data.slug, data.description || null,
      data.address || null, data.district || null, data.latitude, data.longitude,
      data.priceMin, data.priceMax, data.openingHours || null, data.image || null,
      Boolean(data.isPublished), id
    ]
  );
  return getDestinationById(id, { includeUnpublished: true });
}

export async function deleteDestination(id) {
  const [result] = await pool.execute("DELETE FROM destinations WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

export async function listDestinationsByCategory(categoryId, filters) {
  return listDestinations({ ...filters, categoryId });
}
