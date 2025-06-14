/*
  # Add sample customers and quotes

  1. New Data
    - Add initial customer records
    - Add corresponding quote records
    - Use proper UUID handling
  
  2. Changes
    - Insert sample customers with generated UUIDs
    - Create quotes linked to the customers
    - Preserve all original data including dates and statuses
*/

WITH new_customers AS (
  INSERT INTO customers (id, name, email, phone, created_at, updated_at)
  VALUES 
    (gen_random_uuid(), 'Juan Pérez', 'juan.perez@email.com', '809-555-0123', now(), now()),
    (gen_random_uuid(), 'María Rodríguez', 'maria.r@email.com', '809-555-0124', now(), now())
  RETURNING id, name
)
INSERT INTO quotes (id, customer_id, requirements, budget, use_case, status, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  nc.id,
  CASE nc.name
    WHEN 'Juan Pérez' THEN 'Busco una PC gaming con presupuesto de RD$200,000'
    WHEN 'María Rodríguez' THEN 'Necesito 5 computadoras para mi oficina'
  END,
  CASE nc.name
    WHEN 'Juan Pérez' THEN 200000
    WHEN 'María Rodríguez' THEN 250000
  END,
  'sales',
  CASE nc.name
    WHEN 'Juan Pérez' THEN 'pending'
    WHEN 'María Rodríguez' THEN 'quoted'
  END,
  CASE nc.name
    WHEN 'Juan Pérez' THEN '2024-03-15'::timestamp with time zone
    WHEN 'María Rodríguez' THEN '2024-03-14'::timestamp with time zone
  END,
  now()
FROM new_customers nc;