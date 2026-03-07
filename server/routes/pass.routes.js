const router = require('express').Router();
const {
  applyPass, getMyPasses, getPassById, renewPass, verifyPass,
} = require('../controllers/pass.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/apply',         protect, upload.fields([
  { name: 'idProof',       maxCount: 1 },
  { name: 'addressProof',  maxCount: 1 },
  { name: 'ageProof',      maxCount: 1 },
  { name: 'studentId',     maxCount: 1 },
  { name: 'disabilityProof', maxCount: 1 },
]), applyPass);

router.get('/my-passes',      protect, getMyPasses);
router.get('/:id',            protect, getPassById);
router.post('/:id/renew',     protect, renewPass);

// Public verification endpoint (for conductor mobile app)
router.get('/verify/:passNumber', verifyPass);

module.exports = router;
