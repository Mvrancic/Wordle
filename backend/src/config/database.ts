import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const cleanDatabaseUrl = process.env.DATABASE_URL?.replace('?sslmode=require', '') || '';

const pool = new Pool({
  connectionString: cleanDatabaseUrl,
  ssl: cleanDatabaseUrl.includes('supabase') || cleanDatabaseUrl.includes('.supabase.co')
    ? { 
        rejectUnauthorized: false
      }
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  statement_timeout: 30000,
  query_timeout: 30000,
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
