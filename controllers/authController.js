const { User } = require('../models');
const { generateToken } = require('../config/jwt');

const register = async (req, res) => {
    try {
        const { name, email, password, address, role } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            address,
            role: role || 'user'
        });

        const token = generateToken(user);
        res.status(201).json({ token, user: { id: user.id, name, email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate new password length
        if (newPassword.length < 8 || newPassword.length > 16) {
            return res.status(400).json({ 
                message: 'Password change failed', 
                error: 'Password must be between 8 and 16 characters' 
            });
        }

        // Validate new password format
        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(newPassword)) {
            return res.status(400).json({ 
                message: 'Password change failed', 
                error: 'Password must contain at least one uppercase letter and one special character' 
            });
        }

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ 
            message: 'Password change failed', 
            error: error.message 
        });
    }
};

module.exports = {
    register,
    login,
    changePassword
}; 