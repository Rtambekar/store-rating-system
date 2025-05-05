const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');

const registerValidation = [
    body('name').isLength({ min: 3, max: 100 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/),
    body('address').optional().isLength({ max: 400 }),
    body('role').optional().isIn(['admin', 'user', 'store_owner'])
];

const loginValidation = [
    body('email').isEmail(),
    body('password').notEmpty()
];

const changePasswordValidation = [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 8, max: 16 }).matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
];

router.post('/register', registerValidation, validate, authController.register);
router.post('/login', loginValidation, validate, authController.login);
router.post('/change-password', auth(), changePasswordValidation, validate, authController.changePassword);

module.exports = router; 