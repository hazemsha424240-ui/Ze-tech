-- مخطط قاعدة البيانات الكامل (نسخة مرجعية). الإعداد الفعلي بيتم من ملفات database/migrations/
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  company    TEXT NOT NULL DEFAULT '',
  service    TEXT NOT NULL CHECK (service IN ('Web Development','Mobile App','E-Commerce','UI/UX','Digital Marketing','Other')),
  budget     TEXT NOT NULL DEFAULT '' CHECK (budget IN ('','Less than 10k','10-25k','25-50k','50k+','Not Sure')),
  message    TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New','Contacted','Interested','In Progress','Won','Lost')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_status     ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_service    ON leads (service);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at);
