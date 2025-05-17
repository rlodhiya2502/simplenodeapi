# Simple Node.js Express CRUD API

This project is a basic demonstration of a CRUD (Create, Read, Update, Delete) API built with Node.js and Express. It provides endpoints to manage a collection of items, either in-memory or using a MySQL database.

## Features

- RESTful API for managing items
- API key authentication via `x-api-key` header
- In-memory or MySQL-backed data storage
- Endpoints for creating, reading, updating, and deleting items
- Health check endpoint

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- (Optional) [MySQL](https://www.mysql.com/) if using database-backed routes

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/simplenodeapi.git
    cd simplenodeapi
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. (Optional) Set up a `.env` file for MySQL configuration:
    ```env
    DB_HOST=localhost
    DB_USER=youruser
    DB_PASSWORD=yourpassword
    DB_NAME=yourdatabase
    ```

### Running the Server

#### In-Memory API

Start the server with in-memory storage:
```bash
node server.js
```
The API will be available at `http://localhost:3000`.

#### MySQL-Backed API

Make sure your MySQL database is running and configured. Then, use the routes in `routes.js` by mounting them in your main app file.

## API Usage

All requests require an API key in the header:
```
x-api-key: 123456
```

### Endpoints

- `GET /items` - List all items
- `GET /items/:id` - Get item by ID
- `POST /items` - Create a new item
- `PUT /items/:id` - Update an item
- `DELETE /items/:id` - Delete an item
- `GET /health` - Health check

### Example Request

```bash
curl -H "x-api-key: 123456" http://localhost:3000/items
```

## License

MIT