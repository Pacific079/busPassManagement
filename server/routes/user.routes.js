const router = require('express').Router();
const { getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// GET /api/user/profile -> accessible to authenticated users (user or admin)
router.get('/profile', protect, getMe);

module.exports = router;
