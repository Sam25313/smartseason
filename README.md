# SmartSeason · Field Monitoring System

A comprehensive full-stack web application designed for agricultural field monitoring and management. Track crop progress, manage field agents, and coordinate field operations across multiple locations.

## 🌟 Features

- **Multi-Role Authentication**: Secure login system with Admin and Agent roles
- **Field Management**: Create, view, and monitor agricultural fields with real-time status updates
- **Agent Dashboard**: Field agents can view assigned fields and update progress
- **Admin Dashboard**: Coordinators can manage fields, agents, and oversee operations
- **Responsive Design**: Mobile-friendly interface built with modern CSS
- **RESTful API**: Well-structured backend API with JWT authentication
- **Database Integration**: MySQL database with efficient connection pooling

## 🏗️ Architecture

This project follows a monorepo structure with separate frontend and backend applications:

- **Frontend**: React 18 + Vite (Single Page Application)
- **Backend**: Node.js + Express.js (REST API with JWT authentication)
- **Database**: MySQL with mysql2 connection pooling
- **Styling**: CSS Modules for component-scoped styling

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-github-repo-url>
   cd smartseason
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up the database**
   - Create a MySQL database named `smartseason`
   - Run the SQL setup script (see Database Setup below)

4. **Configure environment variables**
   - Copy `backend/.env.example` to `backend/.env`
   - Update database credentials and JWT secret

5. **Start the application**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3002

## 🔧 Manual Setup

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env  # Configure your environment variables
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Database Setup

1. Create a MySQL database:
   ```sql
   CREATE DATABASE smartseason;
   ```

2. Run the following SQL to create tables:
   ```sql
   -- Users table
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     role ENUM('admin', 'agent') NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Fields table
   CREATE TABLE fields (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     location VARCHAR(255),
     crop_type VARCHAR(100),
     status ENUM('planted', 'growing', 'harvested', 'maintenance') DEFAULT 'planted',
     last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     agent_id INT,
     FOREIGN KEY (agent_id) REFERENCES users(id)
   );
   ```

3. Seed initial data:
   ```sql
   -- Insert admin user
   INSERT INTO users (email, password, role) VALUES
   ('admin@smartseason.com', '$2b$10$hashedpassword', 'admin');

   -- Insert sample fields
   INSERT INTO fields (name, location, crop_type, status) VALUES
   ('North Field', 'Sector A', 'Corn', 'growing'),
   ('South Field', 'Sector B', 'Wheat', 'planted');
   ```

## 🔐 Demo Login Credentials

**Admin (Coordinator):**
- Email: `admin@smartseason.com`
- Password: `admin123`

**Agent:**
- Email: `agent@smartseason.com`
- Password: `agent123`

## 📁 Project Structure

```
smartseason/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context providers
│   │   ├── data/           # Mock data and utilities
│   │   └── hooks/          # Custom React hooks
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Express.js backend API
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Express middleware
│   ├── routes/            # API routes
│   ├── config/            # Database and app configuration
│   ├── server.js          # Main server file
│   └── package.json
├── package.json            # Root package.json with scripts
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling
- **date-fns** - Date formatting utilities

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Database
- **MySQL** - Relational database
- **Connection Pooling** - Efficient database connections

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Fields
- `GET /api/fields` - Get all fields (admin) or assigned fields (agent)
- `GET /api/fields/:id` - Get field details
- `POST /api/fields` - Create new field (admin only)
- `PUT /api/fields/:id` - Update field (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/agents` - Get all agents (admin only)

### Health Check
- `GET /api/health` - API health status

## 🔒 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smartseason

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3002
NODE_ENV=development
```

## 🧪 Development

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for all packages
- `npm run build` - Build the frontend for production
- `npm run server` - Start only the backend server

### Code Quality

- Use ESLint for JavaScript/React linting
- Follow React best practices for component structure
- Use meaningful commit messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ for efficient agricultural field management

**Field Agents:**
- Email: kofi@smartseason.com, nia@smartseason.com, kwame@smartseason.com
- Password: agent123

## Features

### Admin (Coordinator)
- Dashboard with field stats (active / at-risk / completed)
- Agent overview with field health indicators
- Recent activity feed
- Full fields list with search, filter by status/agent, grid/list toggle
- Add new fields and assign to agents
- View and delete any field
- Agents page with per-agent breakdown

### Field Agent
- Personal dashboard with assigned fields only
- Log field updates (stage + observation notes)
- Full update history timeline per field

## Field Stages

Fields progress through a simple lifecycle:

1. **Planted** - Seeds or seedlings have been planted
2. **Growing** - Crop is actively growing
3. **Ready** - Crop is ready for harvest
4. **Harvested** - Harvest has been completed

## Status Logic

| Status    | Condition                              |
|-----------|----------------------------------------|
| Active    | Updated within the last 7 days         |
| At Risk   | No update in 7+ days                   |
| Completed | Stage = Harvested                      |

## Project Structure

```
smartseason/
├── frontend/           # React application
│   ├── public/         # Static assets
│   ├── src/           # React source code
│   │   ├── components/ # Reusable UI components
│   │   ├── context/   # React context providers
│   │   ├── data/      # Mock data (for reference)
│   │   ├── pages/     # Page components
│   │   └── ...
│   ├── package.json   # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── backend/           # Express API server
│   ├── server.js      # Main server file
│   ├── package.json   # Backend dependencies
│   ├── .env           # Environment configuration
│   └── utils/
│       └── database.js # MySQL database operations
├── package.json       # Root package.json with dev scripts
└── README.md
```

## Tech Stack

- **Backend**: Node.js + Express with JWT authentication
- **Database**: MySQL with connection pooling
- **Frontend**: React 18 + Vite (modern, fast development)
- **State Management**: React Context for auth and fields
- **Routing**: React Router with role-based guards
- **Styling**: CSS Modules for clean, maintainable styles
- **Security**: Password hashing with bcrypt, JWT tokens

## Database Setup

The application uses MySQL for data persistence. To set up:

1. **Install MySQL** and create a database called `smartseason`
2. **Run the schema** from `database_schema.sql` to create tables
3. **Configure environment** in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=smartseason
   ```
4. **Start the backend** - it will automatically initialize with sample data

📖 **Detailed Setup Guide**: See `MYSQL_SETUP.md` for complete MySQL installation and configuration instructions.

## User Seeding

To populate the database with initial users (admin and agents), run:

```bash
npm run seed:users
```

This will create:
- 1 Admin user (System Administrator)
- 3 Agent users (Kofi Mensah, Nia Adeyemi, Kwame Asante)

## API Endpoints

The backend provides RESTful endpoints:
- `POST /api/auth/login` → User authentication
- `GET /api/auth/me` → Get current user
- `GET /api/fields` → List fields (filtered by role)
- `POST /api/fields` → Create field (admin only)
- `PUT /api/fields/:id` → Update field
- `DELETE /api/fields/:id` → Delete field (admin only)
- `GET /api/fields/:id/updates` → Get field updates
- `POST /api/updates` → Create field update
- `GET /api/agents` → List agents (admin only)

## Design Decisions

### Authentication & Security
- **JWT-based auth** with secure password hashing (bcrypt)
- **Role-based access control** (admin vs agent permissions)
- **Token persistence** in localStorage with automatic verification
- **Admin credentials hidden** from public README for security

### Database Design
- **MySQL database** with proper relational structure
- **Foreign key relationships** between users, fields, and updates
- **Connection pooling** for optimal performance
- **Hashed passwords** stored securely with bcrypt
- **Automatic seeding** of admin and agent accounts
- **Production-ready** with proper indexing and constraints

### API Design
- **RESTful endpoints** with consistent error handling
- **JWT middleware** for protected routes
- **Role-based filtering** (agents only see their fields)
- **Real-time status computation** on field queries

### Frontend Architecture
- **Context-based state** for auth and data management
- **API integration** with error handling and loading states
- **Responsive design** with CSS Modules for maintainability
- **Optimistic updates** for better user experience

- **CSS Modules** over Tailwind — keeps styles scoped and portable without a build plugin
- **Context over Redux** — state is simple (2 collections); no need for a store
- **Mock data** — fully functional with realistic seed data so you can demo immediately
- **Role-based routing** — `RequireAdmin` wrapper prevents agents accessing admin routes
