// كنترولر الدخول: بيتعامل مع تسجيل دخول وخروج الأدمن
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user.model');
const { revoke } = require('../middleware/auth');
const HttpError = require('../utils/httpError');

const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

function login(req, res) {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    throw new HttpError(400, 'Email and password are required.');
  }
  const user = User.findByEmail(email.trim());
  // بنقارن حتى لو المستخدم مش موجود عشان وقت الرد ما يكشفش الإيميلات الصحيحة
  const ok = bcrypt.compareSync(password, user ? user.password_hash : DUMMY_HASH);
  if (!user || !ok) throw new HttpError(401, 'Wrong email or password.');

  const token = jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
}

function logout(req, res) {
  revoke(req.token);
  res.json({ message: 'Logged out.' });
}

module.exports = { login, logout };
