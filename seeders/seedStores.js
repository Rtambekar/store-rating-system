const { Store, User } = require('../models');

const stores = [
    {
        name: "Cafe Delight",
        email: "cafe@delight.com",
        address: "123 Main Street, City Center",
        image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Spice Garden",
        email: "spice@garden.com",
        address: "456 Food Street, Downtown",
        image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Sweet Dreams Bakery",
        email: "sweet@dreams.com",
        address: "789 Baker's Lane, West Side",
        image_url: "https://images.unsplash.com/photo-1552689486-67710928f1cc?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Book Haven",
        email: "book@haven.com",
        address: "321 Reading Road, East Side",
        image_url: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Tech World",
        email: "tech@world.com",
        address: "654 Gadget Street, Tech Park",
        image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Fashion Hub",
        email: "fashion@hub.com",
        address: "987 Style Avenue, Fashion District",
        image_url: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Fitness First",
        email: "fitness@first.com",
        address: "456 Health Street, Sports Complex",
        image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Art Gallery",
        email: "art@gallery.com",
        address: "789 Creative Lane, Arts District",
        image_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Music Store",
        email: "music@store.com",
        address: "321 Melody Road, Entertainment Zone",
        image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    },
    {
        name: "Pet Paradise",
        email: "pet@paradise.com",
        address: "654 Animal Street, Pet Care Center",
        image_url: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=800&auto=format&fit=crop&q=60",
        owner_id: 1
    }
];

const seedStores = async () => {
    try {
        // Check if admin user exists
        const admin = await User.findByPk(1);
        if (!admin) {
            console.error('Admin user not found. Please create an admin user first.');
            return;
        }

        // Clear existing stores
        await Store.destroy({ where: {} });

        // Create new stores
        for (const store of stores) {
            await Store.create(store);
        }

        console.log('Stores seeded successfully!');
    } catch (error) {
        console.error('Error seeding stores:', error);
    }
};

module.exports = seedStores; 