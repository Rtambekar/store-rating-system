# Store Rating System API Documentation

## Project Setup

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
```bash
git clone <repository-url>
cd store-rating-backend
```

2. Install dependencies
```bash
npm install
```

3. Create PostgreSQL database
```bash
createdb storeDB
```

4. Configure database connection
Update the database configuration in `config/database.js`:
```javascript
const sequelize = new Sequelize(
    'storeDB',           // database name
    'postgres',          // username
    'starrugwed',        // password
    {
        host: 'localhost',
        port: 5432,
        dialect: 'postgres'
    }
);
```

5. Start the server
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication Endpoints

#### Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Access**: Public
- **Body**:
```json
{
    "name": "string (3-100 chars)",
    "email": "valid email",
    "password": "string (8-16 chars, 1 uppercase, 1 special char)",
    "address": "string (optional, max 400 chars)",
    "role": "enum (admin|user|store_owner)"
}
```

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Access**: Public
- **Body**:
```json
{
    "email": "valid email",
    "password": "string"
}
```

#### Change Password
- **URL**: `/api/auth/change-password`
- **Method**: `POST`
- **Access**: Authenticated Users
- **Body**:
```json
{
    "currentPassword": "string",
    "newPassword": "string (8-16 chars, 1 uppercase, 1 special char)"
}
```

### User Management Endpoints (Admin Only)

#### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Access**: Admin

#### Get Dashboard Stats
- **URL**: `/api/users/dashboard`
- **Method**: `GET`
- **Access**: Admin

#### Get User by ID
- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Access**: Admin

#### Create User
- **URL**: `/api/users`
- **Method**: `POST`
- **Access**: Admin
- **Body**: Same as register

#### Update User
- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Access**: Admin
- **Body**: Same as register

#### Delete User
- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Access**: Admin

### Store Management Endpoints

#### Get All Stores
- **URL**: `/api/stores`
- **Method**: `GET`
- **Access**: Public

#### Get Store by ID
- **URL**: `/api/stores/:id`
- **Method**: `GET`
- **Access**: Public

#### Create Store
- **URL**: `/api/stores`
- **Method**: `POST`
- **Access**: Admin
- **Body**:
```json
{
    "name": "string (3-100 chars)",
    "email": "valid email",
    "address": "string (max 400 chars)",
    "image_url": "valid URL (optional)",
    "owner_id": "integer"
}
```

#### Update Store
- **URL**: `/api/stores/:id`
- **Method**: `PUT`
- **Access**: Admin
- **Body**: Same as create store

#### Delete Store
- **URL**: `/api/stores/:id`
- **Method**: `DELETE`
- **Access**: Admin

#### Get Store Ratings
- **URL**: `/api/stores/:id/ratings`
- **Method**: `GET`
- **Access**: Admin, Store Owner

### Rating Management Endpoints (User Only)

#### Submit Rating
- **URL**: `/api/ratings`
- **Method**: `POST`
- **Access**: Authenticated Users
- **Body**:
```json
{
    "store_id": "integer",
    "rating": "integer (1-5)"
}
```

#### Get User's Rating for Store
- **URL**: `/api/ratings/store/:store_id`
- **Method**: `GET`
- **Access**: Authenticated Users

#### Delete Rating
- **URL**: `/api/ratings/store/:store_id`
- **Method**: `DELETE`
- **Access**: Authenticated Users

## Role-Based Access Control

### Admin
- Full access to user management
- Full access to store management
- Can view all store ratings
- Can create other admin users

### Store Owner
- Can view ratings for their stores
- Can manage their store information
- Can view basic user information

### User
- Can submit ratings for stores
- Can view their own ratings
- Can update their profile
- Can change their password

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message and optional error details:
```json
{
    "message": "Error description",
    "error": "Detailed error information (if available)"
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens expire after 24 hours and must be refreshed by logging in again. 