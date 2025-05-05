const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ratingController = require('../controllers/ratingController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const ratingValidation = [
    body('store_id').isInt(),
    body('rating').isInt({ min: 1, max: 5 })
];

// Protected routes
router.post('/', auth(['user']), ratingValidation, validate, ratingController.submitRating);
router.get('/store/:store_id', auth(['user', 'store_owner']), ratingController.getUserRating);
router.get('/store/:store_id/all', auth(['store_owner', 'admin']), ratingController.getStoreRatings);
router.delete('/store/:store_id', auth(['user']), ratingController.deleteRating);
router.put('/:rating_id', auth(['user']), ratingController.updateRating);

module.exports = router; 