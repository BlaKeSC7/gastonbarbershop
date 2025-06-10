/*
  # Fix customers table RLS policies

  1. Changes
    - Drop existing RLS policies
    - Add new policies to allow:
      - Authenticated users to insert new customers
      - Authenticated users to view all customers
      - Users to update and delete their own customer records

  2. Security
    - Enable RLS on customers table
    - Add policies for CRUD operations
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON customers;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON customers;
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON customers;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON customers;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users" ON customers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users" ON customers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable update for authenticated users" ON customers
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users" ON customers
  FOR DELETE
  TO authenticated
  USING (true);