# SmartSeason - MySQL Database Setup Guide

## Prerequisites

1. **MySQL Server** installed and running
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use XAMPP/WAMP for Windows
   - Or use Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=yourpassword -p 3306:3306 -d mysql:8.0`

2. **Node.js** (v16 or higher)

## Database Setup

### Step 1: Create Database
```sql
CREATE DATABASE smartseason;
```

### Step 2: Run Schema Script
Execute the `database_schema.sql` file in your MySQL client:
```bash
mysql -u root -p smartseason < database_schema.sql
```

Or copy and paste the contents into your MySQL client.

### Step 3: Configure Environment Variables
Edit the `.env` file in the `backend` directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=smartseason
JWT_SECRET=your-secret-key-change-this
PORT=3001
```

## Installation & Running

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Default Users

After setup, you can login with:

**Admin:**
- Email: `admin@smartseason.com`
- Password: `admin123`

**Agents:**
- Email: `kofi@smartseason.com` / Password: `agent123`
- Email: `nia@smartseason.com` / Password: `agent123`
- Email: `kwame@smartseason.com` / Password: `agent123`

## Troubleshooting

### Connection Issues
- Make sure MySQL server is running
- Check your `.env` file has correct credentials
- Verify database `smartseason` exists

### Port Issues
- Backend runs on port 3001
- Frontend runs on port 5173
- Make sure these ports are available

### Database Errors
- Run the schema script again
- Check MySQL user permissions
- Ensure database name matches in `.env`

## Production Deployment

For production:
1. Change the JWT_SECRET to a strong random string
2. Use a production MySQL user (not root)
3. Set up proper database backups
4. Use environment variables for all configuration