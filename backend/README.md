# Mini-dashboard Backend

This is the backend API for the Mini-dashboard project. It's built with Strapi and handles all the data management for leads.

## What's this project about?

Mini-dashboard is a lead management system. This backend provides the API endpoints that the dashboard uses to create, read, update, and manage leads. We're using Strapi as our CMS which makes it pretty easy to manage content and data.

The API handles:
- Lead CRUD operations
- Lead status management (active/inactive)
- User authentication and permissions

## Prerequisites

Before you start, make sure you have these installed:
- Node.js (version 20 or higher)
- npm (version 6 or higher)

You can check your versions by running:
```bash
node --version
npm --version
```

## Installation

First, clone the repository (or download it if you haven't already):

```bash
git clone <your-repo-url>
cd mini-dashboard-backend
```

Then install all the dependencies:

```bash
npm install
```

This might take a minute or two depending on your internet connection.

## Setup

After installing, you'll need to set up the database. By default, we're using SQLite which is perfect for local development - no need to set up a separate database server.

The database file will be created automatically in `.tmp/data.db` when you first run the project.

If you want to use a different database (like PostgreSQL or MySQL), you'll need to:
1. Update the `config/database.ts` file
2. Set the `DATABASE_CLIENT` environment variable
3. Provide the connection details

For now, SQLite should work fine for local development.

## Running the project

### Development mode

To run the project in development mode (with auto-reload):

```bash
npm run develop
```

This will start the Strapi server on `http://localhost:1337`. You should see the admin panel at `http://localhost:1337/admin` where you can create your first admin user.

The first time you run it, you'll be asked to create an admin account. Just fill in the form and you're good to go.

### Production mode

If you want to run it in production mode:

```bash
npm run build
npm start
```

The build step compiles the admin panel, and then start runs the server.

## Project structure

Here's a quick overview of what's where:

- `src/api/lead/` - This is where all the lead-related API stuff lives (controllers, routes, services)
- `config/` - Configuration files for database, server, plugins, etc.
- `public/` - Static files that get served
- `.tmp/` - Temporary files and the SQLite database (don't commit this)

## API endpoints

Once the server is running, you can access the API at:
- API base: `http://localhost:1337/api`
- Leads: `http://localhost:1337/api/leads`
- Admin panel: `http://localhost:1337/admin`

## Environment variables

You might want to set these environment variables (create a `.env` file in the root):

```
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

## Design Decisions

Here are some key decisions we made and why:

### Why Strapi?

We chose Strapi because it provides rapid development with a built-in admin panel, automatically generates RESTful APIs, includes authentication/authorization out of the box, and allows flexible content type definitions through admin panel or code.

### Why SQLite for Development?

We used SQLite as the default database because it requires zero configuration, is perfect for local development (file-based, easy to reset/backup), and allows developers to get started immediately. Strapi makes it straightforward to switch to PostgreSQL or MySQL for production when needed.

## Future Improvements

Here's what we could do differently or improve with more time:

- **Production Database**: Migrate to PostgreSQL or MySQL for better performance and concurrent access
- **Pagination & Filtering**: Add pagination, search, and sorting to list endpoints
- **API Documentation**: Generate and maintain API documentation (Swagger/OpenAPI)
- **Enhanced Security**: JWT token refresh, role-based access control (RBAC), API key management, proper security headers
- **Monitoring & Logging**: Structured logging, error tracking (Sentry), performance monitoring, health check endpoints
- **CI/CD**: Set up continuous integration and deployment pipeline
- **Database Migrations**: Proper migration system for schema changes
