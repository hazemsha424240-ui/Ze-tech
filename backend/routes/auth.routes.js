// مسارات الدخول: POST /api/login و POST /api/logout
const router = require('express').Router();
const auth = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimit');

router.post('/login', loginLimiter, auth.login);
router.post('/logout', requireAuth, auth.logout);

module.exports = router;
