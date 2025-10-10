
# Filora 📁

This is a file management web app to store your files.

![Home Page Screenshot](./home.png)

## Tech Stack

**Client:** React, jotai, module.css ,TypeScript

**Server:** Node, Express,TypeScript

**Databases:** Redis,Postgresql,Mongodb

## Installation

1️⃣ Clone the project
```bash
  git clone https://github.com/abdullah-rust/filora.git
  cd filora
```
2️⃣ Then run the containers in Docker

```bash
  sudo docker compose up -d
```
Included services:

Redis Stack (6379 & 8001)

PostgreSQL (5432)

MinIO (9000 & 9001)


**3️⃣ Install dependencies**

Frontend
```bash
 cd filora 
 pnpm install 
```
Backend

```bash
 cd server 
 pnpm install 
```

4️⃣ Configure Caddy (if installed)

And put this in the caddy file

```bash
80: {
    # backend server
    handle_path /api/user/* {
        reverse_proxy localhost:5000
    }
   
    # Frontend ke liye (baqi sab requests)
    handle {
            reverse_proxy localhost:5173
    }
}

```


## Lessons Learned

First of all, create a .env file in our server and filora folder. Remember that the password we set in Docker should be the same as our username and password in the env file. The structure of our env file should also tell us something.

5️⃣ Environment Variables

```bash
# Backend .env (server folder)

PORT=5000
DATABASE_URL=postgresql://postgres:226622@localhost:5432/filoradb
JWT_SECRET=your jwt secret 
REFRESH_SECRET= your jwt refresh secret 
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=admin
MINIO_SECRET_KEY=Abdullah226622
MINIO_USE_SSL=false
REDIS_URL=redis://localhost:6379
EMAIL_USER=your email where you send otp Emails
EMAIL_PASS=your app password


```

```bash
# fronted .env (filora folder)

VITE_URL=localhost/api/user/public/files/
```

6️⃣ Run Development Servers   

Open two terminals:

Terminal 1 (Frontend)
```bash
 cd filora
 pnpm run dev
```
Terminal 2 (Backend)
```bash
 cd server
 pnpm run dev
```

And after that localhost par 

Open your browser and type

```bash
http://localhost
```

Notes & Tips

Make sure Docker containers are running and ports are not blocked by other services (like Caddy installed on host).

Use Docker service names (postgres-server, redis-stack-server, minio-server) in .env files for correct networking inside Docker.

For local Vite development, ensure host: true in vite.config.js if using custom domains or reverse proxy.

- Ports used:

- 5000 → backend

- 5173 → frontend (Vite dev server)

- 6379 → Redis

- 5432 → PostgreSQL

- 9000 → MinIO API

- 9001 → MinIO Web UI
## Features

- User authentication with OTP verification
- Upload, download, and manage files and folders
- MinIO object storage integration
- Redis use for OTP verification
- Frontend built with React, Jotai for state management
- Frontend use localForage for 
- Offline caching: Implemented using localForage for storing user files and folders locally.

## Lessons Learned / Key Takeaways
- Working with full-stack TypeScript
-  Docker & Docker Compose orchestration for multiple services
- Reverse proxy configuration using Caddy
- Local development vs production environment handling  
- Integrating multiple databases and caching layers 
- Handling file storage and secure access

