// كنترولر الداشبورد: بيجهّز الإحصائيات اللي بتظهر أعلى لوحة الأدمن
const Lead = require('../models/lead.model');
const { STATUSES } = require('../config/constants');

function stats(req, res) {
  const data = { total: 0 };
  STATUSES.forEach((s) => (data[s] = 0));
  Lead.countByStatus().forEach((row) => {
    data[row.status] = row.c;
    data.total += row.c;
  });
  res.json({ data });
}

module.exports = { stats };
