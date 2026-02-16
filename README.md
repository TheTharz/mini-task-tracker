# Mini Task Tracker

A full-stack task management application with user authentication, task CRUD operations, and filtering capabilities.

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Spring Boot + PostgreSQL + JWT Authentication
- **Deployment**: Docker + Docker Compose

## Features

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Create, read, update, delete tasks
- ✅ Filter tasks by status, priority, and search
- ✅ Pagination and sorting
- ✅ Responsive UI

## Quick Start

### Prerequisites

- Docker
- Docker Compose
- Git

### Clone the Repository

```bash
git clone git@github.com:TheTharz/mini-task-tracker.git
cd mini-task-tracker
```

### Run the Application

```bash
docker compose up
```

That's it! The application will:
1. Start PostgreSQL database
2. Start the backend API (Spring Boot)
3. Start the frontend (React + Nginx)

### Access the Application

Open your browser and navigate to:

**http://localhost:5173**

### Default Test User

The application includes sample data. You can login with:

- **Email**: `john@example.com`
- **Password**: `Password@123`

## Stopping the Application

```bash
docker compose down
```

To stop and remove all data:

```bash
docker compose down -v
```

## API Documentation

Once running, access the Swagger UI at:

**http://localhost:8080/swagger-ui.html**


## CI/CD

GitHub Actions workflows automatically build and push Docker images to Docker Hub

