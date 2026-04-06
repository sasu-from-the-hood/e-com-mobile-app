import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // In production, use compiled dist folder; in development, use src folder
  schema: isProduction ? './database/schema/*.js' : './src/database/schema/',
  out: isProduction ? './database/migrations/*.js' : './src/database/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USERNAME || 'root',
    ...(isProduction && process.env.DB_PASSWORD ? { password: process.env.DB_PASSWORD } : {}),
    database: process.env.DB_DATABASE || '',
  },
  verbose: true,
  strict: true,
});