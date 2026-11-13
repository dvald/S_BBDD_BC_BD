-- Inspección de TDE en SQL Server. No activa cifrado ni modifica bases.
-- Ejecutar en el laboratorio elegido con permisos para consultar las DMV.
-- Un resultado de estado no demuestra restauración ni controla la SQLi.
SELECT
    DB_NAME(database_id) AS base_de_datos,
    encryption_state,
    key_algorithm,
    key_length
FROM sys.dm_database_encryption_keys;

-- Para la base del caso, documentar motor/versión y significado del estado.
-- Después, en un entorno aislado y con su procedimiento específico:
-- 1. Conservar la copia y el material criptográfico necesario bajo control.
-- 2. Comprobar lectura legítima y límites del cifrado frente a SQLi.
-- 3. Probar recuperación con el certificado/clave o protector correspondiente.
-- 4. Registrar validación e intervalos; no copiar claves en el informe.
