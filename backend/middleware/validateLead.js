// ميدلوير التحقق: بيفحص وينظّف بيانات العميل قبل ما توصل للكنترولر
const { STATUSES, SERVICES, BUDGETS } = require('../config/constants');

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9\s\-()]{7,18}$/;

// partial=false -> إضافة (الحقول المطلوبة لازم تتبعت). partial=true -> تعديل (بنفحص الحقول المبعوتة بس)
function validateLead(partial) {
  return (req, res, next) => {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const clean = {};
    const fields = {};
    const text = (k) => (body[k] == null ? '' : String(body[k]).trim());
    const check = (k) => !partial || body[k] !== undefined;

    if (check('name')) {
      clean.name = text('name');
      if (clean.name.length < 2 || clean.name.length > 100) fields.name = 'Enter your full name (2-100 characters).';
    }
    if (check('email')) {
      clean.email = text('email').toLowerCase();
      if (!EMAIL.test(clean.email) || clean.email.length > 150) fields.email = 'Enter a valid email address.';
    }
    if (check('phone')) {
      clean.phone = text('phone');
      if (!PHONE.test(clean.phone)) fields.phone = 'Enter a valid phone number (7-15 digits).';
    }
    if (check('service')) {
      clean.service = text('service');
      if (!SERVICES.includes(clean.service)) fields.service = 'Choose a service from the list.';
    }
    if (check('message')) {
      clean.message = text('message');
      if (clean.message.length < 10 || clean.message.length > 2000) fields.message = 'Message must be 10-2000 characters.';
    }
    if (body.company !== undefined) {
      clean.company = text('company');
      if (clean.company.length > 100) fields.company = 'Company name is too long.';
    }
    if (body.budget !== undefined) {
      clean.budget = text('budget');
      if (clean.budget && !BUDGETS.includes(clean.budget)) fields.budget = 'Choose a budget from the list.';
    }
    if (partial && body.status !== undefined) {
      clean.status = text('status');
      if (!STATUSES.includes(clean.status)) fields.status = 'Invalid status.';
    }

    if (Object.keys(fields).length) {
      return res.status(422).json({ error: 'Validation failed', fields });
    }
    req.body = clean;
    next();
  };
}

module.exports = validateLead;
