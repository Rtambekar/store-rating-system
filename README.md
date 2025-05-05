# Store Rating System

A full-stack application for rating and reviewing stores, built with Node.js, Express, MySQL, and React.

## Features

- User authentication (Login/Register)
- Role-based access control (Admin, Store Owner, User)
- Store management (Create, Read, Update, Delete)
- Rating and review system
- Modern and responsive UI

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

```
store-rating/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── seeders/         # Database seeders
│   └── server.js        # Entry point
│
└── store-rating-frontend/  # React frontend
    ├── public/          # Static files
    ├── src/            # React source code
    │   ├── components/ # Reusable components
    │   ├── pages/      # Page components
    │   ├── theme.js    # Material-UI theme
    │   └── App.js      # Main App component
    └── package.json    # Frontend dependencies
```

## Setup and Installation

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database connection:
   - Open `backend/config/database.js`
   - Update the database credentials to match your MySQL setup:
   ```javascript
   module.exports = {
     development: {
       username: 'your_mysql_username',
       password: 'your_mysql_password',
       database: 'store_rating',
       host: 'localhost',
       dialect: 'mysql'
     }
   };
   ```

4. Create the database:
   ```bash
   mysql -u your_mysql_username -p
   CREATE DATABASE store_rating;
   ```

5. Run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

6. (Optional) Seed the database with sample data:
   ```bash
   npx sequelize-cli db:seed:all
   ```

7. Start the backend server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd store-rating-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`

## Available Scripts

### Backend

- `npm start` - Start the backend server
- `npm run dev` - Start the backend server in development mode with nodemon
- `npx sequelize-cli db:migrate` - Run database migrations
- `npx sequelize-cli db:seed:all` - Seed the database with sample data

### Frontend

- `npm start` - Start the development server
- `npm build` - Build the app for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Seed Data

The database can be seeded with sample data using the following command:
```bash
npx sequelize-cli db:seed:all
```

This will create:
- 1 admin user (email: admin@example.com, password: admin123)
- 2 store owners with their stores
- 5 regular users
- Sample ratings and reviews

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user info

### Stores
- GET `/api/stores` - Get all stores
- GET `/api/stores/:id` - Get store by ID
- POST `/api/stores` - Create a new store (Admin/Store Owner)
- PUT `/api/stores/:id` - Update a store (Admin/Store Owner)
- DELETE `/api/stores/:id` - Delete a store (Admin)

### Ratings
- GET `/api/ratings` - Get all ratings
- GET `/api/ratings/store/:storeId` - Get ratings for a store
- POST `/api/ratings` - Create a new rating (User)
- PUT `/api/ratings/:id` - Update a rating (User)
- DELETE `/api/ratings/:id` - Delete a rating (User/Admin)

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication
- Express Validator

### Frontend
- React
- Material-UI
- React Router
- Axios
- Context API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 