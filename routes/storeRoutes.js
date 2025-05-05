const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const storeController = require('../controllers/storeController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const storeValidation = [
    body('name').isLength({ min: 3, max: 100 }),
    body('email').isEmail(),
    body('address').isLength({ max: 400 }),
    body('image_url').optional().isURL(),
    body('owner_id').optional().isInt()
];

// Public routes
router.get('/', storeController.getStores);
router.get('/:id', storeController.getStoreById);

// Protected routes
router.post('/', auth(['admin']), storeValidation, validate, storeController.createStore);
router.put('/:id', auth(['admin', 'store_owner']), storeValidation, validate, storeController.updateStore);
router.delete('/:id', auth(['admin']), storeController.deleteStore);
router.get('/:id/ratings', auth(['admin', 'store_owner']), storeController.getStoreRatings);
router.get('/owner/:ownerId', auth(['admin', 'store_owner']), storeController.getStoreByOwner);

module.exports = router; 