# Chat Server

This is a chat server built with Next.js and MySQL.

## Features

- User authentication (registration and login)
- Admin panel for managing users
- RESTful API for user operations
- Docker support for easy deployment

## Database Schema

The database consists of the following tables:

1. **users** - Stores user information
2. **user_relations** - Stores user relationships (friends)
3. **admins** - Stores admin user information

## API Endpoints

### Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login as a user

### User Operations

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get a specific user
- `PUT /api/users/{id}` - Update a user
- `DELETE /api/users/{id}` - Delete a user

### User Relations

- `POST /api/relations` - Add a friend
- `GET /api/relations` - Get user's friends
- `PUT /api/relations` - Accept a friend request
- `DELETE /api/relations` - Delete a friend relationship

### Admin Panel

- `POST /api/admin/login` - Admin login
- `GET /api/admin/users` - Get all users (admin only)
- `DELETE /api/admin/users/{id}` - Delete a user (admin only)
- `GET /api/admin/db-info` - Get database information (admin only)
- `POST /api/admin/reinitialize` - Reinitialize database (admin only)
- `POST /api/admin/change-password` - Change admin password (admin only)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see .env.example)
4. Run the development server: `npm run dev`

## Deployment

The application can be deployed using Docker. See the Dockerfile and docker-compose.yml for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.