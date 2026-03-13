// backend/src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.patch('/settings', auth, userController.updateSettings);
router.get('/usage', auth, userController.getUsage);
router.get('/billing', auth, userController.getBilling);
router.post('/cancel-subscription', auth, userController.cancelSubscription);

module.exports = router;
