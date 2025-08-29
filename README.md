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

### Deploying with Docker

The application can be deployed using Docker. See the Dockerfile and docker-compose.yml for details.

### Deploying to Vercel

This application can be deployed to Vercel with the following steps:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Sign up for a Vercel account at [vercel.com](https://vercel.com)
3. Create a new project and import your repository
4. Configure the environment variables in the Vercel dashboard:
   - `DB_HOST` - Your database host
   - `DB_USER` - Your database username
   - `DB_PASSWORD` - Your database password
   - `DB_NAME` - Your database name
   - `DB_PORT` - Your database port (usually 3306)
   - `JWT_SECRET` - Your JWT secret key
   - `JWT_EXPIRES_IN` - JWT expiration time (e.g., 24h)
5. Deploy the project

The vercel.json configuration file is already included in this project for seamless deployment.

For detailed Vercel deployment instructions, see [docs/vercel-deployment.md](docs/vercel-deployment.md).

### Vercel Deployment Troubleshooting

If you encounter "Unexpected token '<'" errors, this typically means that static JavaScript files are being served as HTML. This can happen due to routing issues. To fix this:

1. Make sure your vercel.json file is properly configured without overly broad routing rules
2. Ensure your Next.js configuration doesn't have conflicting basePath or assetPrefix settings
3. Check that your API routes don't conflict with static file paths

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.