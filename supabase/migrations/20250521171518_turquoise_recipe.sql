/*
  # Fix customers table RLS policies

  1. Changes
    - Drop existing RLS policies for customers table
    - Add new RLS policies to allow:
      - Authenticated users to insert new customers
      - Authenticated users to view all customers
      - Authenticated users to update customer records
      - Authenticated users to delete customer records

  2. Security
    - Enable RLS on customers table
    - Add policies for all CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON customers;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON customers;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users"
ON customers FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users"
ON customers FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Enable update for authenticated users"
ON customers FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users"
ON customers FOR DELETE
TO authenticated
USING (true);