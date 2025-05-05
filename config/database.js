const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'storeDB',           // database name
    'postgres',          // username
    'starrugwed',        // password
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres',
        logging: console.log,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Test the connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

testConnection();

module.exports = sequelize; 