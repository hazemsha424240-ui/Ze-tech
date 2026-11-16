// موديل العملاء: كل استعلامات قاعدة البيانات لجدول leads (من غير أي منطق HTTP)
const db = require('../config/db');

const FIELDS = ['name', 'email', 'phone', 'company', 'service', 'budget', 'message', 'status'];
const escapeLike = (s) => s.replace(/[\\%_]/g, '\\$&');

function findById(id) {
  return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
}

function create(d) {
  const now = new Date().toISOString();
  const info = db
    .prepare(
      `INSERT INTO leads (name, email, phone, company, service, budget, message, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New', ?, ?)`
    )
    .run(d.name, d.email, d.phone, d.company || '', d.service, d.budget || '', d.message, now, now);
  return findById(info.lastInsertRowid);
}

function list({ search, status, service, page = 1, limit = 10 }) {
  const where = [];
  const params = {};
  if (search) {
    where.push(
      "(name LIKE @s ESCAPE '\\' OR email LIKE @s ESCAPE '\\' OR phone LIKE @s ESCAPE '\\' OR company LIKE @s ESCAPE '\\')"
    );
    params.s = '%' + escapeLike(search) + '%';
  }
  if (status) { where.push('status = @status'); params.status = status; }
  if (service) { where.push('service = @service'); params.service = service; }
  const clause = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const total = db.prepare(`SELECT COUNT(*) AS c FROM leads ${clause}`).get(params).c;
  const rows = db
    .prepare(`SELECT * FROM leads ${clause} ORDER BY created_at DESC, id DESC LIMIT @limit OFFSET @offset`)
    .all({ ...params, limit, offset: (page - 1) * limit });
  return { rows, total };
}

function update(id, d) {
  const keys = FIELDS.filter((k) => d[k] !== undefined);
  if (!keys.length) return findById(id);
  const params = { id, now: new Date().toISOString() };
  keys.forEach((k) => (params[k] = d[k]));
  db.prepare(`UPDATE leads SET ${keys.map((k) => `${k} = @${k}`).join(', ')}, updated_at = @now WHERE id = @id`).run(params);
  return findById(id);
}

function remove(id) {
  return db.prepare('DELETE FROM leads WHERE id = ?').run(id).changes > 0;
}

function countByStatus() {
  return db.prepare('SELECT status, COUNT(*) AS c FROM leads GROUP BY status').all();
}

module.exports = { findById, create, list, update, remove, countByStatus };
