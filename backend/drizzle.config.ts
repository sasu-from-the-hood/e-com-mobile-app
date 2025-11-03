import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';


const dbType = process.env.DB_TYPE || 'postgresql';

export default defineConfig({
  schema: './src/database/schema/',
  out: './src/database/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    // password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || '',
  },
  verbose: true,
  strict: true,
});