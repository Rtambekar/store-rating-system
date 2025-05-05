const { Store, User, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');

const createStore = async (req, res) => {
    try {
        const { name, email, address, image_url, owner_id } = req.body;

        // Validate owner exists
        const owner = await User.findByPk(owner_id);
        if (!owner) {
            return res.status(400).json({ message: 'Owner not found' });
        }

        const store = await Store.create({
            name,
            email,
            address,
            image_url,
            owner_id: parseInt(owner_id)
        });

        // Get created store with ratings (will be 0 initially)
        const storeWithRatings = {
            ...store.toJSON(),
            average_rating: 0,
            rating_count: 0
        };

        res.status(201).json(storeWithRatings);
    } catch (error) {
        console.error('Error creating store:', error);
        res.status(500).json({ message: 'Store creation failed', error: error.message });
    }
};

const getStores = async (req, res) => {
    try {
        const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
        
        const where = {};
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { address: { [Op.iLike]: `%${search}%` } }
            ];
        }

        // First get all stores
        const stores = await Store.findAll({
            where,
            order: [[sortBy, sortOrder]],
            attributes: ['id', 'name', 'email', 'address', 'image_url', 'owner_id']
        });

        // Then get ratings for all stores
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
                average_rating: storeRating ? parseFloat(storeRating.getDataValue('average_rating')) : 0,
                rating_count: storeRating ? parseInt(storeRating.getDataValue('rating_count')) : 0
            };
        });

        res.json(storesWithRatings);
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
    }
};

const getStoreById = async (req, res) => {
    try {
        // First get the store
        const store = await Store.findByPk(req.params.id, {
            attributes: ['id', 'name', 'email', 'address', 'image_url', 'owner_id']
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Then get the ratings separately
        const ratings = await Rating.findAll({
            where: { store_id: store.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'rating_count']
            ]
        });

        const storeWithRatings = {
            ...store.toJSON(),
            average_rating: ratings[0] ? parseFloat(ratings[0].getDataValue('average_rating')) : 0,
            rating_count: ratings[0] ? parseInt(ratings[0].getDataValue('rating_count')) : 0
        };

        res.json(storeWithRatings);
    } catch (error) {
        console.error('Error fetching store:', error);
        res.status(500).json({ message: 'Failed to fetch store', error: error.message });
    }
};

const updateStore = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, address, image_url, owner_id } = req.body;
        const user = req.user;

        // Find the store
        const store = await Store.findByPk(id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Check if user is authorized to update this store
        if (user.role === 'store_owner' && store.owner_id !== user.id) {
            return res.status(403).json({ message: 'Not authorized to update this store' });
        }

        // Update store
        await store.update({
            name,
            email,
            address,
            image_url,
            owner_id: user.role === 'admin' ? owner_id : store.owner_id // Only admin can change owner
        });

        // Get updated store with ratings
        const updatedStore = await Store.findByPk(store.id, {
            attributes: ['id', 'name', 'email', 'address', 'image_url', 'owner_id']
        });

        // Get store ratings
        const ratings = await Rating.findAll({
            where: { store_id: store.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'rating_count']
            ],
            group: ['store_id']
        });

        // Combine store with ratings
        const storeWithRatings = {
            ...updatedStore.toJSON(),
            average_rating: ratings[0]?.average_rating || 0,
            rating_count: ratings[0]?.rating_count || 0
        };

        res.json(storeWithRatings);
    } catch (error) {
        console.error('Error updating store:', error);
        res.status(500).json({ message: 'Store update failed', error: error.message });
    }
};

const deleteStore = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        await store.destroy();
        res.json({ message: 'Store deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Store deletion failed', error: error.message });
    }
};

const getStoreRatings = async (req, res) => {
    try {
        const store = await Store.findByPk(req.params.id, {
            include: [{
                model: Rating,
                include: [{
                    model: User,
                    attributes: ['id', 'name', 'email']
                }]
            }]
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        res.json(store.Ratings);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch store ratings', error: error.message });
    }
};

const getStoreByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        
        // Find store by owner ID
        let store = await Store.findOne({
            where: { owner_id: ownerId },
            include: [{
                model: Rating,
                attributes: []
            }]
        });

        // If no store exists, create one
        if (!store) {
            const owner = await User.findByPk(ownerId);
            if (!owner) {
                return res.status(404).json({ message: 'Owner not found' });
            }

            store = await Store.create({
                name: `${owner.name}'s Store`,
                email: owner.email,
                address: 'Please update your store address',
                owner_id: ownerId
            });
        }

        // Get average rating and count
        const ratings = await Rating.findAll({
            where: { store_id: store.id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'rating_count']
            ],
            raw: true
        });

        const storeData = store.toJSON();
        storeData.average_rating = parseFloat(ratings[0]?.average_rating || 0);
        storeData.rating_count = parseInt(ratings[0]?.rating_count || 0);

        res.json(storeData);
    } catch (error) {
        console.error('Error fetching store by owner:', error);
        res.status(500).json({ message: 'Error fetching store data' });
    }
};

module.exports = {
    createStore,
    getStores,
    getStoreById,
    updateStore,
    deleteStore,
    getStoreRatings,
    getStoreByOwner
}; 