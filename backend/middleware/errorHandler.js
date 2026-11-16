// ميدلوير الأخطاء: بيحوّل الأخطاء لردود JSON آمنة (من غير stack trace للعميل)
const HttpError = require('../utils/httpError');

function notFound(req, res, next) {
  next(new HttpError(404, 'Route not found.'));
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 ? 'Something went wrong. Please try again.' : err.message,
    ...(err.fields ? { fields: err.fields } : {})
  });
}

module.exports = { notFound, errorHandler };
