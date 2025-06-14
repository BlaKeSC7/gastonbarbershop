/*
  # Fix customers table RLS policies

  1. Changes
    - Drop existing RLS policies on customers table
    - Add new policies for:
      - Insert: Allow authenticated users to insert new customers
      - Select: Allow authenticated users to view customers
      - Update: Allow authenticated users to update customers they created
      - Delete: Allow authenticated users to delete customers they created

  2. Security
    - Enable RLS on customers table
    - Policies ensure users can only:
      - Insert new customers when authenticated
      - View all customers when authenticated
      - Update/delete only customers they created
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Customers are insertable by authenticated users only" ON customers;
DROP POLICY IF EXISTS "Customers are viewable by authenticated users only" ON customers;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only" 
ON customers FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Enable read access for authenticated users only" 
ON customers FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Enable update for users based on user_id" 
ON customers FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for users based on user_id" 
ON customers FOR DELETE 
TO authenticated 
USING (auth.uid() = id);