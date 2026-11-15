CREATE DATABASE IF NOT EXISTS tripin_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tripin_db;

CREATE TABLE IF NOT EXISTS categories (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS places (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id INT UNSIGNED NULL,
  name VARCHAR(160) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NULL,
  area VARCHAR(120) NULL,
  address VARCHAR(255) NULL,
  image_url TEXT NULL,
  latitude DECIMAL(10, 7) NULL,
  longitude DECIMAL(10, 7) NULL,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_places_category
    FOREIGN KEY (category_id) REFERENCES categories(id)
    ON UPDATE CASCADE
    ON DELETE SET NULL,
  INDEX idx_places_category (category_id),
  INDEX idx_places_published (is_published),
  INDEX idx_places_name (name)
) ENGINE=InnoDB;

INSERT INTO categories (name, slug, description) VALUES
  ('Wisata', 'wisata', 'Destinasi dan aktivitas wisata di Surabaya'),
  ('Kuliner', 'kuliner', 'Tempat makan dan kuliner khas Surabaya'),
  ('Nongkrong', 'nongkrong', 'Kafe, tempat berkumpul, dan coworking space'),
  ('Sejarah', 'sejarah', 'Bangunan, museum, dan lokasi bersejarah'),
  ('Penginapan', 'penginapan', 'Hotel, guest house, dan akomodasi')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);
