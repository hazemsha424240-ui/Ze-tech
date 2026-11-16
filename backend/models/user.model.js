// موديل المستخدمين: استعلامات قاعدة البيانات لجدول users (حسابات الأدمن)
const db = require('../config/db');

function findByEmail(email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase());
}

function create({ name, email, passwordHash }) {
  const now = new Date().toISOString();
  return db
    .prepare('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(name, String(email).toLowerCase(), passwordHash, now);
}

module.exports = { findByEmail, create };
