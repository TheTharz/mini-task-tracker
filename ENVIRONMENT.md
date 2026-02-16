# Environment Variables Configuration

This document explains all environment variables used in the Task Tracker application.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the values in `.env` as needed

3. Run with docker-compose:
   ```bash
   docker compose up
   ```

## Environment Variables

### Database Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_USER` | `postgres` | PostgreSQL username |
| `POSTGRES_PASSWORD` | `password` | PostgreSQL password ⚠️ **Change in production!** |
| `POSTGRES_DB` | `taskdb` | Database name |

### Backend Configuration

#### JWT Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `JWT_SECRET` | `404E63...` | Secret key for JWT signing ⚠️ **Change in production!** |
| `JWT_EXPIRATION` | `86400000` | Access token expiration (24 hours in ms) |
| `JWT_REFRESH_EXPIRATION` | `604800000` | Refresh token expiration (7 days in ms) |

#### CORS Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost` | Comma-separated allowed origins |

#### Server Settings

| Variable | Default | Description |
|----------|---------|-------------|
| `SERVER_PORT` | `8080` | Backend server port |

### Frontend Configuration

The frontend uses **nginx as a reverse proxy** for API requests. No environment variables are needed in docker-compose for the frontend.

#### Build-time Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `/api` | API base URL for Docker deployment |

For local development, update `mini-task-tracker-frontend/.env`:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

For Docker deployment (default):
```env
VITE_API_BASE_URL=/api
```

## How It Works

### Docker Compose Architecture

```
┌─────────────────┐
│   Browser       │
│  localhost:5173 │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│   Frontend (Nginx)      │
│   - Serves React app    │
│   - Proxies /api to     │
│     backend:8080        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Backend (Spring Boot) │
│   - REST API            │
│   - Port 8080           │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Database (PostgreSQL) │
│   - Port 5432           │
└─────────────────────────┘
```

### Request Flow

1. **Frontend requests**: Browser → `http://localhost:5173`
2. **API requests**: Browser → `http://localhost:5173/api/*` → Nginx proxies to → `http://backend:8080/api/*`
3. **Backend**: Processes request and queries database at `db:5432`

### Why This Setup?

- ✅ **Single entry point**: Everything accessible through `localhost:5173`
- ✅ **No CORS issues**: API calls go through the same origin
- ✅ **Production-ready**: Same pattern works in production
- ✅ **Environment-agnostic**: Frontend doesn't need to know backend URL

## Security Notes

⚠️ **Before deploying to production:**

1. **Change `POSTGRES_PASSWORD`** to a strong, random password
2. **Change `JWT_SECRET`** to a secure random string (at least 256 bits)
3. **Update `ALLOWED_ORIGINS`** to your actual domain(s)
4. **Use HTTPS** in production
5. **Store secrets securely** (use Docker secrets or external secret management)

## Troubleshooting

### Frontend can't connect to backend

Check that:
1. Backend is healthy: `docker compose ps`
2. Nginx proxy config is correct in `nginx.docker.conf`
3. Backend is accessible: `curl http://localhost:8080/actuator/health`

### CORS errors

Update `ALLOWED_ORIGINS` in docker-compose.yaml to include your frontend origin.

### JWT token issues

Ensure `JWT_SECRET` is the same across all backend instances and hasn't changed.
