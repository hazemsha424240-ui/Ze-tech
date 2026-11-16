// ميدلوير تحديد المعدل: بيبطّأ محاولات تسجيل الدخول المتكررة (حماية من التخمين)
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' }
});

module.exports = { loginLimiter };
