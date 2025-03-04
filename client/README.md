# Royal Tree Services Client Tracker - Frontend

This is the frontend client for the Royal Tree Services Client Tracker application. It provides a user interface for managing clients, services, and documents.

## Features

- User authentication
- Client management
- Service history tracking
- Document management
- Offline support
- Responsive design

## Tech Stack

- HTML5
- CSS3
- JavaScript (ES6+)
- Fetch API for network requests
- LocalStorage for offline caching

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API running (see server directory)

### Installation

1. Clone the repository
2. Navigate to the client directory
3. Open the index.html file in a web browser

## Architecture

The client is built using a modular architecture with the following components:

### API Service

The `api.js` file provides a service for communicating with the backend API. It handles:

- Authentication
- Error handling
- Request/response formatting
- Offline operation queueing

### Authentication Service

The `auth.js` file provides a service for managing user authentication. It handles:

- User login/logout
- Session management
- Role-based access control

### Client Service

The `clientService.js` file provides a service for managing client data. It handles:

- Client CRUD operations
- Offline caching
- Data synchronization
- Event notifications

## Offline Support

The application supports offline operation through:

1. Caching of client data in localStorage
2. Queueing of operations when offline
3. Automatic synchronization when back online
4. Temporary client records for offline-created data

## Security

- JWT-based authentication
- Secure token storage
- Role-based access control
- Input validation

## License

This project is licensed under the MIT License. 