-- Jalankan hanya jika database lokal sebelumnya dibuat dari schema TRIPIN
-- versi awal yang memakai categories.name dan tabel places.
-- Urutan: schema.sql -> migration ini -> seeds/initial_data.sql.
USE tripin_db;

SET @has_old_category_name = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'categories'
    AND column_name = 'name'
);
SET @has_new_category_name = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE()
    AND table_name = 'categories'
    AND column_name = 'category_name'
);
SET @category_migration = IF(
  @has_old_category_name = 1 AND @has_new_category_name = 0,
  'ALTER TABLE categories CHANGE COLUMN name category_name VARCHAR(80) NOT NULL',
  'SELECT 1'
);
PREPARE category_stmt FROM @category_migration;
EXECUTE category_stmt;
DEALLOCATE PREPARE category_stmt;

SET @has_legacy_places = (
  SELECT COUNT(*) FROM information_schema.tables
  WHERE table_schema = DATABASE()
    AND table_name = 'places'
);
SET @copy_legacy_places = IF(
  @has_legacy_places = 1,
  'INSERT INTO destinations
    (category_id, name, slug, description, address, district, latitude, longitude, image, is_published)
   SELECT category_id, name, slug, description, address, area, latitude, longitude, image_url, is_published
   FROM places
   ON DUPLICATE KEY UPDATE
     description = VALUES(description),
     address = VALUES(address),
     district = VALUES(district),
     latitude = VALUES(latitude),
     longitude = VALUES(longitude),
     image = VALUES(image),
     is_published = VALUES(is_published)',
  'SELECT 1'
);
PREPARE places_stmt FROM @copy_legacy_places;
EXECUTE places_stmt;
DEALLOCATE PREPARE places_stmt;

-- Tabel places lama sengaja tidak dihapus agar data sumber tetap tersedia
-- sebagai cadangan selama proses migrasi.
