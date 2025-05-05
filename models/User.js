const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            len: [3, 100]
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [8, 255],
            is: /^(?=.*[A-Z])(?=.*[!@#$%^&*])/
        }
    },
    address: {
        type: DataTypes.STRING(400),
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user', 'store_owner'),
        allowNull: false,
        defaultValue: 'user'
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                if (user.password.length < 8 || user.password.length > 16) {
                    throw new Error('Password must be between 8 and 16 characters');
                }
                if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(user.password)) {
                    throw new Error('Password must contain at least one uppercase letter and one special character');
                }
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = User; 