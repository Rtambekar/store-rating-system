const { verifyToken } = require('../config/jwt');
const { User } = require('../models');

const auth = (roles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = verifyToken(token);
            if (!decoded) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Fetch the user from database to ensure it still exists
            const user = await User.findByPk(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            // Attach the full user object to the request
            req.user = user;

            if (roles.length && !roles.includes(user.role)) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(500).json({ message: 'Authentication failed' });
        }
    };
};

module.exports = auth; 