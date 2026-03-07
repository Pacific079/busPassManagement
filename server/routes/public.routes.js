const router = require('express').Router();
const { getAllCategories } = require('../controllers/category.controller');
const { getAllRoutes } = require('../controllers/route.controller');
const { verifyPass } = require('../controllers/pass.controller');

router.get('/categories',          getAllCategories);
router.get('/routes',              getAllRoutes);
router.get('/verify/:passNumber',  verifyPass);

module.exports = router;
