// ميدلوير التوثيق: بيتحقق من الـ JWT في هيدر Authorization ويحمي مسارات الأدمن
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const HttpError = require('../utils/httpError');

// التوكنات اللي اتعمل لها تسجيل خروج بتتحفظ هنا لحد ما تنتهي (في الذاكرة؛ بتتمسح لما السيرفر يعيد التشغيل)
const revoked = new Map();

function revoke(token) {
  const decoded = jwt.decode(token);
  revoked.set(token, decoded && decoded.exp ? decoded.exp * 1000 : Date.now() + 864e5);
  const now = Date.now();
  for (const [t, exp] of revoked) if (exp < now) revoked.delete(t);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || revoked.has(token)) return next(new HttpError(401, 'Please sign in first.'));
  try {
    req.user = jwt.verify(token, env.jwtSecret);
    req.token = token;
    next();
  } catch (e) {
    next(new HttpError(401, 'Your session has expired. Please sign in again.'));
  }
}

module.exports = { requireAuth, revoke };
