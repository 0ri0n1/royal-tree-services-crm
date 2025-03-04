# Royal Tree Services API

This is the backend API for the Royal Tree Services Client Tracker application. It provides a RESTful API for managing clients, users, and authentication.

## Features

- User authentication with JWT
- Role-based access control
- Client management
- Service history tracking
- Document management
- Secure API with rate limiting and security headers

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file in the root directory with the following variables:

```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/royal-tree-services
JWT_SECRET=your_jwt_secret_key_should_be_long_and_secure
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

5. Start the server:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `PATCH /api/auth/updateMyPassword` - Update password

### Users

- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/updateMe` - Update current user profile
- `DELETE /api/users/deleteMe` - Delete current user (set inactive)
- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create new user (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `PATCH /api/users/:id` - Update user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Clients

- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client by ID
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client (admin/manager only)
- `POST /api/clients/:id/notes` - Add note to client
- `POST /api/clients/:id/services` - Add service to client
- `POST /api/clients/:id/documents` - Add document to client

## Security

- JWT authentication
- Password hashing with bcrypt
- Rate limiting to prevent brute force attacks
- Security headers with Helmet
- CORS protection
- Data validation and sanitization

## License

This project is licensed under the MIT License. 