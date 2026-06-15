# Webapp Backend

This backend provides authentication APIs for the frontend and stores client accounts in MongoDB.

## Setup

1. Copy the example env file:

```bash
cd server
copy .env.example .env
```

2. Install server dependencies if not already installed:

```bash
cd server
npm install
```

3. Start a local MongoDB server, or set `MONGO_URI` to a hosted MongoDB Atlas URI in `.env`.

Local MongoDB startup example:

```bash
mongod --dbpath "C:\data\db"
```

If you already have MongoDB running locally, the default URI is:

```bash
mongodb://127.0.0.1:27017
```

If you prefer Atlas, replace the value in `.env` with your connection string.

## Docker-based MongoDB

If Docker is installed, you can run MongoDB in a container without installing it locally.

```bash
cd server
docker compose up -d
```

This starts MongoDB on `localhost:27017` and uses the same default connection string from `.env`.

To stop the container:

```bash
docker compose down
```

## Development fallback

When `NODE_ENV` is not `production`, the backend can fall back to an in-memory MongoDB server if the configured `MONGO_URI` is not available.

This is useful for local development when MongoDB is not installed, but it does not persist data between restarts.

## Run

Start the backend server:

```bash
cd server
npm start
```

The API will listen on `http://localhost:4000` by default.

If the server fails to start with a MongoDB connection error, make sure your local MongoDB service is running or update `MONGO_URI` in `.env` to a valid MongoDB cluster.

## API Endpoints

- `POST /api/auth/register`
  - body: `{ name, email, password }`
  - returns: created user (without password)

- `POST /api/auth/login`
  - body: `{ email, password }`
  - returns: authenticated user (without password)

## Notes

- The frontend Vite app is configured to proxy `/api` requests to the backend.
- The backend stores users in the `users` collection inside the configured MongoDB database.
