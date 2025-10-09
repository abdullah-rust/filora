📁 Filora: A Modern, Secure File Manager
Filora is a high-performance and secure File Management Application designed to simplify how you organize and access your documents, media, and data. It features a minimalist, Dark Theme interface and is built for exceptional responsiveness across all devices.

✨ Project Overview
Filora is engineered as a monorepo with a clear separation of concerns:

Frontend (filora/): A modern, responsive user interface built with React.

Backend (server/): A robust, secure API layer handling authentication, file operations, and database interactions.

🛠️ Tech Stack
This project leverages the following cutting-edge technologies:

Component

Technology

Description

Frontend

React / TypeScript

Dynamic UI using modern hooks and strong typing.

Package Manager

pnpm

Fast, efficient dependency management across the monorepo.

Backend

Node.js / Express

RESTful API for secure and scalable operations.

Database

PostgreSQL

Reliable and scalable relational data storage.

Reverse Proxy

Caddy

Simplified, auto-configuring reverse proxy for routing.

Containerization

Docker

Ensures consistent environment setup for all services.

🚀 Local Development Setup
Follow these steps to get Filora up and running on your local machine using Docker for dependency management. We use pnpm as the primary package manager.

1. Database Setup (Initial Run)
Before starting the application, you must initialize the PostgreSQL database schema.

Locate the database schema file at sql/schema.sql in the project root.

Run the SQL queries defined in schema.sql against your local PostgreSQL instance to create the necessary tables and structure.

2. Clone Repository
Clone the project repository and navigate into the root directory:

git clone [https://github.com/abdullah-rust/filora.git](https://github.com/abdullah-rust/filora.git)
cd filora



3. Start Infrastructure (Docker)
Use Docker Compose to launch necessary infrastructure services (e.g., PostgreSQL, Redis, etc., as defined in your docker-compose.yml):

# Bring up the required services in detached mode
docker-compose up -d



4. Install Dependencies & Run Frontend
Use pnpm to install dependencies and start the frontend development server:

# Install dependencies across the monorepo
pnpm install

# Navigate to the frontend directory
cd filora

# Start the React development server (runs on port 5173 by default)
pnpm run dev



5. Run Backend Server
In a new terminal window, navigate to the backend directory and start the API server:

# Navigate to the backend directory
cd server

# Start the Node.js API server (runs on port 5000 by default)
pnpm run dev



6. Set up Caddy Reverse Proxy
Filora uses Caddy to manage proxying requests between the frontend and the backend API, ensuring proper routing and path handling.

Install Caddy on your system (refer to the Caddy documentation for your OS).

Create a Caddyfile (or use the one in the project root) with the following configuration:

:80 {
    # 🎯 User API and Authentication Routing
    handle_path /api/user/* {
        reverse_proxy localhost:5000
    }

    # 🌐 Frontend Routing (All other requests)
    handle {
        reverse_proxy localhost:5173
    }
}



Run Caddy from the directory containing your Caddyfile:

caddy run



✅ Accessing the Application
Once all steps are complete:

Open your web browser and navigate to:

http://localhost:



Caddy is configured to listen on port 80, so simply accessing http://localhost will route traffic correctly to the application and the API.

🤝 Contributing
Contributions are welcome! Please refer to the guidelines in the CONTRIBUTING.md file.
