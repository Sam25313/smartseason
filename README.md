# SmartSeason · Field Monitoring System

A full-stack agricultural field monitoring system with role-based access for Admins and Agents. This repo contains a React + Vite frontend and an Express + MySQL backend.

## ?? What’s included

- Admin and Agent user roles
- JWT-based authentication
- Field creation, viewing, updating, and deletion
- Field update history tracking
- Agent assignment and agent-only field visibility
- React Context state management
- Environment-driven API configuration for local and production deployments

## ?? Setup Instructions

### Prerequisites

- Node.js 18+ (recommended)
- MySQL 8+ or compatible
- Git

### Install dependencies

From the repository root:

```bash
npm run install:all
```

This installs dependencies for the root workspace, the frontend, and the backend.

### Backend environment

Create or update `backend/.env` with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartseason
JWT_SECRET=your_jwt_secret_key
PORT=3002
```

### Frontend environment

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:3002
```

For production, set this to the deployed backend URL:

```env
VITE_API_URL=https://smartseason-3.onrender.com
```

### Database setup

1. Create the `smartseason` database in MySQL.
2. Run database initialization inside the backend application or using your own SQL client.

To seed users:

```bash
npm run seed:users
```

### Run locally

```bash
npm run dev
```

This starts:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3002`

## ??? Available scripts

From the root:

- `npm run dev` — run frontend and backend together
- `npm run install:all` — install dependencies for root, frontend, and backend
- `npm run build:frontend` — build React frontend
- `npm run seed:users` — seed backend users

Backend only (`backend/package.json`):
- `npm run dev` — start backend server
- `npm start` — start backend server

Frontend only (`frontend/package.json`):
- `npm run dev` — start Vite dev server
- `npm run build` — build frontend for production
- `npm run preview` — preview production build locally

## ?? Project structure

```
smartseason/
+-- backend/                 # Express backend API
¦   +-- middleware/         # Auth and request middleware
¦   +-- routes/             # API endpoints
¦   +-- utils/              # DB and helper logic
¦   +-- server.js           # Backend entrypoint
¦   +-- package.json
¦   +-- .env                # Local backend configuration
+-- frontend/                # React frontend app
¦   +-- public/
¦   +-- src/
¦   ¦   +-- components/
¦   ¦   +-- context/
¦   ¦   +-- hooks/
¦   ¦   +-- pages/
¦   ¦   +-- services/
¦   ¦   +-- utils/
¦   +-- package.json
¦   +-- vite.config.js
+-- package.json            # Root workspace scripts
+-- README.md
```

## ?? API Endpoints

### Authentication
- `POST /api/auth/login` — log in and receive JWT
- `GET /api/auth/me` — get current user profile

### Fields
- `GET /api/fields` — list fields (admin sees all; agent sees assigned fields)
- `GET /api/fields/:id/updates` — field updates
- `POST /api/fields` — create field
- `PUT /api/fields/:id` — update field
- `DELETE /api/fields/:id` — delete field

### Updates
- `POST /api/updates` — create field update

### Agents
- `GET /api/agents` — list agents

### Health
- `GET /api/health` — check server status

## ?? Design decisions

- **Monorepo layout**: separates frontend and backend while keeping root scripts for easy local development.
- **React + Vite**: fast development experience and optimized production builds.
- **Express + JWT**: lightweight backend with token-based auth and clean API routing.
- **MySQL via `mysql2`**: relational schema fits users, fields, and update history.
- **React Context**: handles auth and field state without a larger state library.
- **Env-driven API URL**: frontend is configured with `VITE_API_URL`, allowing different backend hosts for local vs production.
- **CORS support**: backend is configured to allow cross-origin requests from allowed frontend origins.
- **Safe response handling**: frontend includes JSON parsing safeguards for unexpected server responses.

## ?? Assumptions

- There are only two roles: `admin` and `agent`.
- Agents only access their assigned fields; admins manage all fields.
- JWT tokens last 24 hours; refresh tokens are not implemented.
- Passwords are stored hashed with `bcryptjs`.
- The app targets small to medium field tracking use cases.
- Local development uses `http://localhost:3002` for the API and `http://localhost:5173` for the frontend.
- Production deployments should set `VITE_API_URL` to the live backend hostname.

## ? Notes

- Keep secret values out of version control.
- Use a strong `JWT_SECRET` in production.
- If deploying to Render or Vercel, ensure frontend `VITE_API_URL` points to the backend URL.
- If backend routes change, update the frontend API builder accordingly.

---

If you want, I can also add a deployment section for Render and Vercel.
