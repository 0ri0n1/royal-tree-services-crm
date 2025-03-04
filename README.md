# Royal Tree Services Client Tracker

A comprehensive client relationship management system for Royal Tree Services, designed to track clients, services, and business operations.

## Overview

This application provides a complete solution for managing tree service clients, including contact information, service history, document management, and business analytics. It features a modern, responsive interface with offline capabilities for field use.

## Features

- **Client Management**: Store and manage client information, including contact details, service needs, and location information.
- **Service Tracking**: Record all services performed for clients, including dates, costs, and details.
- **Document Management**: Upload and store photos, estimates, and documents related to clients and services.
- **User Authentication**: Secure login with role-based permissions (Admin, Manager, Field Technician).
- **Offline Support**: Continue working without internet connectivity, with automatic synchronization when back online.
- **Responsive Design**: Works on desktop, tablet, and mobile devices for field use.
- **Priority-based client categorization**: Organize clients by priority levels.
- **Status tracking**: Monitor the status of client projects and services.
- **Reporting functionality**: Generate reports for business insights.
- **Data import/export**: Easily transfer data in and out of the system.
- **Theme customization**: Personalize the application appearance.

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- RESTful API

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- React (future implementation)
- Fetch API
- LocalStorage for offline caching

## Project Structure

- `/server` - Backend API code
- `/client` - Frontend client code
- `/docs` - Documentation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Modern web browser

### Installation

#### Backend

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_should_be_long_and_secure
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

4. Start the server:
```bash
npm run dev
```

#### Frontend

1. Navigate to the client directory:
```bash
cd client
```

2. Open `index.html` in a web browser.

## Usage

1. Register an admin user through the API.
2. Log in to the application.
3. Add clients and manage their information.
4. Record services, add notes, and upload documents.
5. View analytics and reports on the dashboard.

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- HTTPS recommended for production

## License

© Royal Tree Services. All rights reserved.

## Acknowledgements

- Royal Tree Services for the project requirements
- All contributors to the open-source libraries used in this project
