/*
  # Fix Products RLS Policies

  1. Changes
    - Drop existing RLS policies for products table
    - Create new policies that properly allow:
      - Public read access to all products
      - Authenticated users to insert products
      
  2. Security
    - Enable RLS on products table
    - Add policies for:
      - Public read access
      - Authenticated insert access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Products are insertable by authenticated users only" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert access for authenticated users only" ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);