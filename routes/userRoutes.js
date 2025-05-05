const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const userValidation = [
    body('name').isLength({ min: 3, max: 100 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),
    body('address').optional().isLength({ max: 400 }),
    body('role').isIn(['admin', 'user', 'store_owner'])
];

// Protected routes
router.get('/', auth(['admin']), userController.getUsers);
router.get('/dashboard', auth(['admin']), userController.getDashboardStats);
router.get('/:id', auth(['admin']), userController.getUserById);
router.post('/', auth(['admin']), userValidation, validate, userController.createUser);
router.put('/:id', auth(['admin']), userValidation, validate, userController.updateUser);
router.delete('/:id', auth(['admin']), userController.deleteUser);

module.exports = router; 