// مسارات الداشبورد: GET /api/dashboard/stats (للأدمن فقط)
const router = require('express').Router();
const dashboard = require('../controllers/dashboard.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/stats', requireAuth, dashboard.stats);

module.exports = router;
