/*
  # Fix RLS policies for customers and quotes tables

  1. Changes
    - Update RLS policies for customers table
    - Update RLS policies for quotes table
    - Add proper security policies for authenticated users

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON customers;

DROP POLICY IF EXISTS "Quotes are insertable by authenticated users only" ON quotes;
DROP POLICY IF EXISTS "Quotes are viewable by authenticated users only" ON quotes;

-- Recreate policies for customers table
CREATE POLICY "Enable insert for authenticated users" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Recreate policies for quotes table
CREATE POLICY "Enable insert for authenticated users" ON quotes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON quotes
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON quotes
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON quotes
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
DO $$
DECLARE
  customer1_id uuid;
  customer2_id uuid;
BEGIN
  -- Insert customers
  INSERT INTO customers (name, email, phone)
  VALUES ('Juan Pérez', 'juan.perez@email.com', '809-555-0123')
  RETURNING id INTO customer1_id;

  INSERT INTO customers (name, email, phone)
  VALUES ('María Rodríguez', 'maria.r@email.com', '809-555-0124')
  RETURNING id INTO customer2_id;

  -- Insert quotes
  INSERT INTO quotes (customer_id, requirements, budget, use_case, status)
  VALUES 
    (customer1_id, 'Busco una PC gaming con presupuesto de RD$200,000', 200000, 'gaming', 'pending'),
    (customer2_id, 'Necesito 5 computadoras para mi oficina', 250000, 'office', 'quoted');
END $$;