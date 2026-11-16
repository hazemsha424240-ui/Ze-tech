// فهرس المسارات: بيركّب كل ملفات المسارات تحت /api
const router = require('express').Router();

router.use('/', require('./auth.routes'));
router.use('/leads', require('./lead.routes'));
router.use('/dashboard', require('./dashboard.routes'));

module.exports = router;
