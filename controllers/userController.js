const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

const getUsers = async (req, res) => {
    try {
        const { search, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
        
        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { email: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } }
            ];
        }
        if (role) {
            where.role = role;
        }

        const users = await User.findAll({
            where,
            order: [[sortBy, sortOrder]],
            attributes: ['id', 'name', 'email', 'address', 'role']
        });

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        // First get the user
        const user = await User.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'role', 'createdAt']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user's owned stores with their ratings
        const stores = await Store.findAll({
            where: { owner_id: user.id },
            attributes: ['id', 'name', 'email', 'address', 'image_url']
        });

        // Get ratings for all stores
        const storeIds = stores.map(store => store.id);
        const ratings = await Rating.findAll({
            where: { store_id: { [Op.in]: storeIds } },
            attributes: [
                'store_id',
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'rating_count']
            ],
            group: ['store_id']
        });

        // Combine stores with their ratings
        const storesWithRatings = stores.map(store => {
            const storeRating = ratings.find(r => r.store_id === store.id);
            return {
                ...store.toJSON(),
                average_rating: storeRating?.average_rating || 0,
                rating_count: storeRating?.rating_count || 0
            };
        });

        res.json({
            ...user.toJSON(),
            stores: storesWithRatings
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Failed to fetch user', error: error.message });
    }
};

const createUser = async (req, res) => {
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
            role
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'User creation failed', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update(req.body);
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'User update failed', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'User deletion failed', error: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalStores, totalRatings] = await Promise.all([
            User.count(),
            Store.count(),
            Rating.count()
        ]);

        res.json({
            totalUsers,
            totalStores,
            totalRatings
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getDashboardStats
}; 