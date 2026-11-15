USE tripin_db;

INSERT INTO categories (category_name, slug, description) VALUES
  ('Tempat Nongkrong', 'tempat-nongkrong', 'Kafe dan tempat berkumpul di Surabaya'),
  ('Wisata Alam', 'wisata-alam', 'Ruang terbuka dan destinasi alam'),
  ('Kuliner', 'kuliner', 'Tempat makan dan kuliner Surabaya'),
  ('Penginapan', 'penginapan', 'Hotel dan akomodasi'),
  ('Wisata Bersejarah', 'wisata-bersejarah', 'Bangunan dan tempat bersejarah'),
  ('Hidden Gems', 'hidden-gems', 'Tempat menarik yang belum banyak dikenal'),
  ('Coworking Space', 'coworking-space', 'Tempat bekerja dan berkolaborasi')
ON DUPLICATE KEY UPDATE
  category_name = VALUES(category_name),
  description = VALUES(description);

-- Contoh destinasi dibuat sebagai draft (is_published = FALSE).
-- Alamat, kecamatan, harga, jam operasional, koordinat, dan foto sengaja NULL
-- sampai diverifikasi dari sumber resmi atau pengelola tempat.
INSERT INTO destinations (category_id, name, slug, description, is_published)
SELECT c.id, s.name, s.slug, s.description, FALSE
FROM (
  SELECT 'Tugu Pahlawan' AS name, 'tugu-pahlawan' AS slug,
    'Destinasi bersejarah dan salah satu ikon Kota Surabaya.' AS description,
    'wisata-bersejarah' AS category_slug
  UNION ALL SELECT 'Kota Lama Surabaya', 'kota-lama-surabaya',
    'Kawasan kota dengan jejak sejarah dan bangunan berarsitektur lama.', 'wisata-bersejarah'
  UNION ALL SELECT 'Taman Bungkul', 'taman-bungkul',
    'Ruang terbuka publik untuk rekreasi dan aktivitas warga.', 'wisata-alam'
  UNION ALL SELECT 'Surabaya North Quay', 'surabaya-north-quay',
    'Destinasi tepi laut untuk menikmati suasana kawasan pelabuhan.', 'hidden-gems'
  UNION ALL SELECT 'Kenjeran', 'kenjeran',
    'Kawasan pesisir dan rekreasi di wilayah Surabaya.', 'wisata-alam'
  UNION ALL SELECT 'House of Sampoerna', 'house-of-sampoerna',
    'Destinasi wisata edukasi dan sejarah di Surabaya.', 'wisata-bersejarah'
  UNION ALL SELECT 'Alun-Alun Surabaya', 'alun-alun-surabaya',
    'Ruang publik dan area aktivitas di pusat Kota Surabaya.', 'hidden-gems'
) AS s
INNER JOIN categories c ON c.slug = s.category_slug
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);
