const router = require('express').Router();
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/register', register);
router.post('/login',    login);
router.get( '/me',       protect, getMe);
router.put( '/profile',  protect, upload.single('profilePic'), updateProfile);
router.post('/change-password', protect, changePassword);

module.exports = router;
