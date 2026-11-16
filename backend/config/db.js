// الاتصال بقاعدة البيانات: بيفتح ملف SQLite باستخدام node:sqlite المدمجة في Node (من غير بناء native)
const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const env = require('./env');

fs.mkdirSync(path.dirname(env.dbPath), { recursive: true });

const db = new DatabaseSync(env.dbPath);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

// دالة مساعدة: بتشغّل fn جوه transaction (commit لو نجحت، rollback لو حصل خطأ)
db.transaction = (fn) => (...args) => {
  db.exec('BEGIN');
  try {
    const result = fn(...args);
    db.exec('COMMIT');
    return result;
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }
};

module.exports = db;
