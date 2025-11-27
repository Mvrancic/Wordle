import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Limpiar la URL de parámetros que pg no necesita
const cleanDatabaseUrl = process.env.DATABASE_URL?.replace('?sslmode=require', '') || '';

// Configurar pool de conexiones PostgreSQL
const pool = new Pool({
  connectionString: cleanDatabaseUrl,
  ssl: cleanDatabaseUrl.includes('supabase') || cleanDatabaseUrl.includes('.supabase.co')
    ? { 
        rejectUnauthorized: false
      }
    : false,
  max: 20, // máximo de conexiones en el pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Manejar errores del pool
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
