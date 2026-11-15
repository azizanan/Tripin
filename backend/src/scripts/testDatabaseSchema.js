import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  multipleStatements: true
});

try {
  const schema = await readFile(new URL("../../database/schema.sql", import.meta.url), "utf8");
  const seed = await readFile(new URL("../../database/seeds/initial_data.sql", import.meta.url), "utf8");

  await connection.query(schema);
  await connection.query(seed);

  const [tables] = await connection.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'tripin_db'`
  );
  const tableNames = new Set(tables.map((row) => row.TABLE_NAME || row.table_name));
  for (const required of ["users", "categories", "destinations", "reviews", "favorites"]) {
    assert.ok(tableNames.has(required), `Missing required table: ${required}`);
  }

  const [[categoryCount]] = await connection.query("SELECT COUNT(*) AS total FROM tripin_db.categories");
  const [[destinationCount]] = await connection.query("SELECT COUNT(*) AS total FROM tripin_db.destinations");
  const [[publishedCount]] = await connection.query("SELECT COUNT(*) AS total FROM tripin_db.destinations WHERE is_published = TRUE");

  assert.ok(Number(categoryCount.total) >= 7, "Expected 7 seeded categories.");
  assert.ok(Number(destinationCount.total) >= 7, "Expected 7 draft destination examples.");
  assert.equal(Number(publishedCount.total), 0, "Seed destination examples must remain drafts.");

  console.log("Database schema and seed checks passed.");
} finally {
  await connection.end();
}
