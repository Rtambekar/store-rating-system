const sequelize = require('../config/database');
const User = require('./User');
const Store = require('./Store');
const Rating = require('./Rating');

// Define associations
User.hasMany(Store, { foreignKey: 'owner_id', as: 'ownedStores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Store.hasMany(Rating, { foreignKey: 'store_id' });
Rating.belongsTo(Store, { foreignKey: 'store_id' });

module.exports = {
    sequelize,
    User,
    Store,
    Rating
}; 