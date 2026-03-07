const router = require('express').Router();
const {
  getDashboard, getAllApplications, approvePass, rejectPass,
  getAllPayments, getAllUsers,
} = require('../controllers/admin.controller');
const {
  getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory,
} = require('../controllers/category.controller');
const {
  getAllRoutesAdmin, createRoute, updateRoute, deleteRoute,
} = require('../controllers/route.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard',              getDashboard);
router.get('/users',                  getAllUsers);

// Applications
router.get('/applications',           getAllApplications);
router.put('/applications/:id/approve', approvePass);
router.put('/applications/:id/reject',  rejectPass);

// Payments
router.get('/payments',               getAllPayments);

// Categories
router.get('/categories',             getAllCategoriesAdmin);
router.post('/categories',            createCategory);
router.put('/categories/:id',         updateCategory);
router.delete('/categories/:id',      deleteCategory);

// Routes
router.get('/routes',                 getAllRoutesAdmin);
router.post('/routes',                createRoute);
router.put('/routes/:id',             updateRoute);
router.delete('/routes/:id',          deleteRoute);

module.exports = router;
