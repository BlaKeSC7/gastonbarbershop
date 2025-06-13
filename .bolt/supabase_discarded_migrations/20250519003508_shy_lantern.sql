/*
  # Add sample customers and quotes

  1. New Data
    - Add initial customers and their quotes from the existing data
  2. Security
    - No changes to security policies
*/

INSERT INTO customers (id, name, email, phone, created_at, updated_at)
VALUES 
  ('1', 'Juan Pérez', 'juan.perez@email.com', '809-555-0123', now(), now()),
  ('2', 'María Rodríguez', 'maria.r@email.com', '809-555-0124', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO quotes (id, customer_id, requirements, budget, use_case, status, created_at, updated_at)
VALUES 
  (gen_random_uuid(), '1', 'Busco una PC gaming con presupuesto de RD$200,000', 200000, 'sales', 'pending', '2024-03-15', now()),
  (gen_random_uuid(), '2', 'Necesito 5 computadoras para mi oficina', 250000, 'sales', 'quoted', '2024-03-14', now())
ON CONFLICT (id) DO NOTHING;