require('dotenv').config();
const seedAdminAndStores = require('./seedAdminAndStores');

const runSeeder = async () => {
    try {
        await seedAdminAndStores();
        process.exit(0);
    } catch (error) {
        console.error('Error running seeder:', error);
        process.exit(1);
    }
};

runSeeder(); 