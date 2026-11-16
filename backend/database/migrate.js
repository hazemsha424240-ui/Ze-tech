// مشغّل الـ migrations: بيطبّق كل ملف .sql جوه database/migrations مرة واحدة بترتيب أسماء الملفات
const fs = require('fs');
const path = require('path');
const db = require('../config/db');

db.exec('CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)');

const dir = path.join(__dirname, 'migrations');
const done = new Set(db.prepare('SELECT name FROM migrations').all().map((r) => r.name));

fs.readdirSync(dir)
  .filter((f) => f.endsWith('.sql'))
  .sort()
  .forEach((file) => {
    if (done.has(file)) return;
    db.transaction(() => {
      db.exec(fs.readFileSync(path.join(dir, file), 'utf8'));
      db.prepare('INSERT INTO migrations (name, applied_at) VALUES (?, ?)').run(file, new Date().toISOString());
    })();
    console.log('Applied migration:', file);
  });

console.log('Database is up to date.');
