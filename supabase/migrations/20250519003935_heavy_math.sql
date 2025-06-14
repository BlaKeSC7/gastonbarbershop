/*
  # Add products to database

  1. New Data
    - Insert all products from the frontend into the database
    - Each product includes:
      - title
      - description
      - price
      - rating
      - image_url
      - category
      - specs (as JSONB)
*/

INSERT INTO products (id, title, description, price, rating, image_url, category, specs, created_at, updated_at)
VALUES 
  -- Laptops
  (
    gen_random_uuid(),
    'MacBook Pro 14"',
    'Último MacBook Pro con chip M2 Pro, perfecto para profesionales y creadores de contenido.',
    175000,
    4.8,
    'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg',
    'Laptops',
    jsonb_build_object(
      'processor', 'Apple M2 Pro',
      'ram', '16GB Memoria Unificada',
      'storage', '512GB SSD',
      'display', '14" Liquid Retina XDR'
    ),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'ASUS ROG Strix G15',
    'Laptop gaming con RTX 4060 y pantalla 165Hz para gaming competitivo.',
    145000,
    4.7,
    'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg',
    'Laptops',
    jsonb_build_object(
      'processor', 'AMD Ryzen 9 7945HX',
      'ram', '32GB DDR5',
      'storage', '1TB NVMe SSD',
      'graphics', 'NVIDIA RTX 4060 8GB'
    ),
    now(),
    now()
  ),
  -- Add more products here following the same pattern
  (
    gen_random_uuid(),
    'Monitor Gaming 240Hz',
    'Monitor gaming de alta frecuencia para juegos competitivos.',
    55000,
    4.7,
    'https://images.pexels.com/photos/1038916/pexels-photo-1038916.jpeg',
    'Monitores',
    jsonb_build_object(
      'display', '25" 1080p IPS',
      'features', array['240Hz', 'G-Sync', '0.5ms GTG']
    ),
    now(),
    now()
  ),
  (
    gen_random_uuid(),
    'Silla Gaming Pro RGB',
    'Silla gaming premium con iluminación RGB y máximo confort.',
    25000,
    4.6,
    'https://images.pexels.com/photos/1957477/pexels-photo-1957477.jpeg',
    'Sillas',
    jsonb_build_object(
      'features', array['RGB personalizable', 'Reclinable 180°', 'Cojines memory foam']
    ),
    now(),
    now()
  );