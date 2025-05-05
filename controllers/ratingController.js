const { Rating, Store, sequelize, User } = require('../models');

const submitRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;
        const user_id = req.user.id;

        // Convert rating to number
        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
        }

        // Validate store exists
        const store = await Store.findByPk(store_id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Check if user has already rated this store
        const [ratingObj, created] = await Rating.findOrCreate({
            where: { user_id, store_id },
            defaults: { rating: numericRating }
        });

        if (!created) {
            await ratingObj.update({ rating: numericRating });
        }

        // Get all ratings for the store
        const allRatings = await Rating.findAll({
            where: { store_id },
            attributes: ['rating']
        });

        // Calculate average and count manually
        const ratingCount = allRatings.length;
        const totalRating = allRatings.reduce((sum, r) => sum + Number(r.rating), 0);
        const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

        res.json({
            message: created ? 'Rating submitted successfully' : 'Rating updated successfully',
            rating: ratingObj,
            store: {
                ...store.toJSON(),
                average_rating: averageRating,
                rating_count: ratingCount
            }
        });
    } catch (error) {
        console.error('Error submitting rating:', error);
        res.status(500).json({ message: 'Rating submission failed', error: error.message });
    }
};

const getUserRating = async (req, res) => {
    try {
        const { store_id } = req.params;
        const user_id = req.user.id;

        const rating = await Rating.findOne({
            where: { user_id, store_id }
        });

        res.json(rating);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user rating', error: error.message });
    }
};

const deleteRating = async (req, res) => {
    try {
        const { store_id } = req.params;
        const user_id = req.user.id;

        const rating = await Rating.findOne({
            where: { user_id, store_id }
        });

        if (!rating) {
            return res.status(404).json({ message: 'Rating not found' });
        }

        await rating.destroy();
        res.json({ message: 'Rating deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Rating deletion failed', error: error.message });
    }
};

const createRating = async (req, res) => {
    try {
        const { store_id, rating, comment } = req.body;
        const user_id = req.user.id;

        // Validate store exists
        const store = await Store.findByPk(store_id);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // Check if user has already rated this store
        const existingRating = await Rating.findOne({
            where: { user_id, store_id }
        });

        if (existingRating) {
            return res.status(400).json({ message: 'You have already rated this store' });
        }

        // Create new rating
        const newRating = await Rating.create({
            user_id,
            store_id,
            rating,
            comment
        });

        // Get the created rating with user details
        const ratingWithUser = await Rating.findByPk(newRating.id, {
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }]
        });

        // Get updated store with average rating
        const storeRatings = await Rating.findAll({
            where: { store_id },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('rating')), 'average_rating'],
                [sequelize.fn('COUNT', sequelize.col('rating')), 'rating_count']
            ],
            group: ['store_id']
        });

        res.status(201).json({
            rating: ratingWithUser,
            store: {
                ...store.toJSON(),
                average_rating: storeRatings[0]?.average_rating || 0,
                rating_count: storeRatings[0]?.rating_count || 0
            }
        });
    } catch (error) {
        console.error('Error creating rating:', error);
        res.status(500).json({ message: 'Rating submission failed', error: error.message });
    }
};

const getStoreRatings = async (req, res) => {
    try {
        const { store_id } = req.params;
        const user_id = req.user.id;

        // Check if the user is the store owner
        const store = await Store.findOne({
            where: { id: store_id, owner_id: user_id }
        });

        if (!store && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these ratings' });
        }

        const ratings = await Rating.findAll({
            where: { store_id },
            include: [{
                model: User,
                attributes: ['id', 'name', 'email']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(ratings);
    } catch (error) {
        console.error('Error fetching store ratings:', error);
        res.status(500).json({ message: 'Failed to fetch store ratings', error: error.message });
    }
};

module.exports = {
    submitRating,
    getUserRating,
    deleteRating,
    createRating,
    getStoreRatings
}; 