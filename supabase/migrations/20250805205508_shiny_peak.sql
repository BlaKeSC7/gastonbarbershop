/*
  # Remover campo de teléfono del sistema de reseñas

  1. Cambios
    - Hacer el campo client_phone opcional en la tabla reviews
    - Actualizar las reseñas existentes para que no requieran teléfono
    - Mantener la funcionalidad existente pero sin mostrar teléfonos

  2. Seguridad
    - Mantener las políticas RLS existentes
    - No afectar la funcionalidad de administración
*/

-- Hacer el campo client_phone nullable
ALTER TABLE reviews 
ALTER COLUMN client_phone DROP NOT NULL;

-- Actualizar reseñas existentes para remover teléfonos si es necesario
UPDATE reviews 
SET client_phone = NULL 
WHERE client_phone IS NOT NULL;

COMMENT ON COLUMN reviews.client_phone IS 'Phone field is now optional and not displayed publicly for privacy';