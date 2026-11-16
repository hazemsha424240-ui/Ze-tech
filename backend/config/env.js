// إعدادات البيئة: بيحمّل ملف .env ويقدّم الإعدادات المتحقق منها للتطبيق
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || 'dev-only-secret-change-me';

if (nodeEnv === 'production' && jwtSecret === 'dev-only-secret-change-me') {
  throw new Error('JWT_SECRET must be set in production');
}

module.exports = {
  nodeEnv,
  port: Number(process.env.PORT) || 5000,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',
  dbPath: path.resolve(__dirname, '..', process.env.DB_PATH || './data/leads.db'),
  corsOrigin: process.env.CORS_ORIGIN || '',
  seedAdminEmail: process.env.SEED_ADMIN_EMAIL || 'admin@techcraft.com',
  seedAdminPassword: process.env.SEED_ADMIN_PASSWORD || 'admin123'
};
