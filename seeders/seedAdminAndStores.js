const { Store, User } = require('../models');
const bcrypt = require('bcryptjs');

const adminUser = {
    name: "Admin User",
    email: "admin@example.com",
    password: "Admin@123",
    role: "admin"
};

const stores = [
    {
        name: "Cafe Delight",
        email: "cafe@delight.com",
        address: "123 Main Street, City Center",
        image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60"
    },
    {
        name: "Spice Garden",
        email: "spice@garden.com",
        address: "456 Food Street, Downtown",
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60"
    },
    {
        name: "Sweet Dreams Bakery",
        email: "sweet@dreams.com",
        address: "789 Baker's Lane, West Side",
        image_url: "https://images.unsplash.com/photo-1552689486-67710928f1cc?w=800&auto=format&fit=crop&q=60"
    },
    {
        name: "Book Haven",
        email: "book@haven.com",
        address: "321 Reading Road, East Side",
        image_url: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&auto=format&fit=crop&q=60"
    },
    {
        name: "Tech World",
        email: "tech@world.com",
        address: "654 Gadget Street, Tech Park",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60"
    }
];

const seedAdminAndStores = async () => {
    try {
        // Check if admin user exists
        let admin = await User.findOne({ where: { email: adminUser.email } });
        
        if (!admin) {
            // Create admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(adminUser.password, salt);
            admin = await User.create({
                ...adminUser,
                password: hashedPassword
            });
            console.log('Admin user created successfully!');
        }

        // Clear existing stores
        await Store.destroy({ where: {} });

        // Create new stores with the admin's ID
        for (const store of stores) {
            await Store.create({
                ...store,
                owner_id: admin.id
            });
        }

        console.log('Stores seeded successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

module.exports = seedAdminAndStores; 