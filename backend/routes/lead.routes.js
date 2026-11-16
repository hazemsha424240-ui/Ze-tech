// مسارات العملاء: endpoints الـ /api/leads (الـ POST عام، والباقي محتاج تسجيل دخول)
const router = require('express').Router();
const leads = require('../controllers/lead.controller');
const { requireAuth } = require('../middleware/auth');
const validateLead = require('../middleware/validateLead');

router.post('/', validateLead(false), leads.create);
router.get('/', requireAuth, leads.list);
router.get('/:id', requireAuth, leads.getOne);
router.put('/:id', requireAuth, validateLead(true), leads.update);
router.delete('/:id', requireAuth, leads.remove);

module.exports = router;
