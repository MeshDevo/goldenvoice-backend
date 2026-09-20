
# Golden Voice Backend

Backend service for the **Golden Voice** platform.

The project provides the server-side foundation for managing the platform's content, users, authentication, media assets, dubbed and translated works, and written content through a structured API.

## Overview

Golden Voice Backend is designed as a modular backend that can grow with the platform while keeping content management, business logic, and data storage separated.

The system is built around:

* REST API
* PostgreSQL database
* Prisma ORM
* TypeScript
* Authentication and authorization
* Modular application structure
* Content and media asset management
* Audit and data tracking

## Architecture

The backend follows a layered structure:

```text
API
 ↓
Controllers
 ↓
Services
 ↓
Repositories
 ↓
Database
```

This keeps API handling, business logic, and database operations separated and easier to maintain.

## Main Areas

The backend currently covers the core areas required by Golden Voice, including:

* Users and authentication
* Works and content
* Dubbed versions
* Translated content
* Written content
* Media assets
* Audit records

## Database

PostgreSQL is used as the primary database, with Prisma handling database access, schema management, and migrations.

Media files are represented separately from application data, allowing the backend to work with external storage systems in the future.

## Development

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npm run prisma:generate
```

Validate the Prisma schema:

```bash
npm run prisma:validate
```

Build the project:

```bash
npm run build
```

## Project Status

Golden Voice Backend is under active development.

The architecture is intentionally designed to provide a solid foundation for the future Golden Voice platform while allowing new modules and services to be added without restructuring the entire application.

## License

License information will be added when the project is ready for public distribution.

